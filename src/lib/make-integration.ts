export interface SheetItem {
  BL: string;
  "Item Nr": string;
  Descrição?: string;
  Quantidade?: string;
  Unidade?: string;
  "Peso Bruto"?: string;
  Contêiner?: string;
  Status?: string;
  Motivo?: string;
  Quantidade_Ref?: string;
  Peso_Ref?: string;
  Contêiner_Ref?: string;
  Timestamp?: string;
}

export interface ConferenceResult {
  corretos: SheetItem[];
  divergentes: SheetItem[];
  incorretos: SheetItem[];
  faltantes: SheetItem[];
}

export interface BlHistoryEntry {
  bl: string;
  timestamp: string;
  corretos: number;
  divergentes: number;
  incorretos: number;
  faltantes: number;
  total: number;
}

const LAST_CONFERENCE_RESULT_KEY = "slam:last-conference-result";

export function saveLastConferenceResult(result: ConferenceResult): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_CONFERENCE_RESULT_KEY, JSON.stringify(result));
}

export function getLastConferenceResult(): ConferenceResult | null {
  if (typeof window === "undefined") return null;
  try {
    const storedResult = window.localStorage.getItem(LAST_CONFERENCE_RESULT_KEY);
    return storedResult ? (JSON.parse(storedResult) as ConferenceResult) : null;
  } catch {
    window.localStorage.removeItem(LAST_CONFERENCE_RESULT_KEY);
    return null;
  }
}

function normalizeBl(bl: string): string {
  return bl.trim().toUpperCase();
}

export async function uploadManifestToMake(file: File): Promise<void> {
  const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("VITE_MAKE_WEBHOOK_URL não configurado (veja o .env).");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(webhookUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar manifesto: ${response.status}`);
  }
}

function itemKey(item: SheetItem): string {
  return JSON.stringify({
    bl: (item.BL || "").trim().toUpperCase(),
    itemNr: (item["Item Nr"] || "").trim(),
    status: (item.Status || "").trim().toLowerCase(),
    qtd: (item.Quantidade || "").trim(),
    peso: (item["Peso Bruto"] || "").trim(),
    container: (item.Contêiner || "").trim(),
    motivo: (item.Motivo || "").trim(),
    timestamp: (item.Timestamp || "").trim(),
  });
}

export function collectItemKeys(result: ConferenceResult): Set<string> {
  const keys = new Set<string>();
  const add = (items: SheetItem[]) => items.forEach((i) => keys.add(itemKey(i)));
  add(result.corretos);
  add(result.divergentes);
  add(result.incorretos);
  add(result.faltantes);
  return keys;
}

function filterNewItems( current: ConferenceResult, baselineKeys: Set<string>,): ConferenceResult {
  const isNew = (item: SheetItem) => !baselineKeys.has(itemKey(item));
  return {
    corretos: current.corretos.filter(isNew),
    divergentes: current.divergentes.filter(isNew),
    incorretos: current.incorretos.filter(isNew),
    faltantes: current.faltantes.filter(isNew),
  };
}

export async function pollSheetForResult(
onProgress?: (message: string) => void,
): Promise<ConferenceResult> {
  const sheetId = import.meta.env.VITE_SHEET_ID;
  if (!sheetId) {
    throw new Error("VITE_SHEET_ID não configurado (veja o .env).");
  }

  const startTime = Date.now();
  const timeout = 60_000; // 60 segundos
  const interval = 3_000; // 3 segundos

  let baselineKeys = new Set<string>();
  try {
    onProgress?.("Capturando estado inicial da planilha...");
    const baseline = await fetchAllSheets(sheetId);
    baselineKeys = collectItemKeys(baseline);
    onProgress?.(
      `Baseline capturado (${baselineKeys.size} itens pré-existentes). Aguardando Make...`,
    );
  } catch (error) {
    console.warn("Não foi possível buscar o estado inicial da planilha:", error);
  }

  while (Date.now() - startTime < timeout) {
    try {
      const result = await fetchAllSheets(sheetId);

      // ✅ Filtra: só ficam os itens que NÃO estavam no baseline
      const newItems = filterNewItems(result, baselineKeys);
      const hasNewResults =
        newItems.corretos.length > 0 ||
        newItems.divergentes.length > 0 ||
        newItems.incorretos.length > 0 ||
        newItems.faltantes.length > 0;

      if (hasNewResults) {
        onProgress?.(
          `Análise concluída · ${newItems.corretos.length + newItems.divergentes.length + newItems.incorretos.length + newItems.faltantes.length} itens novos detectados.`,
        );
        return newItems; // ✅ Retorna apenas os itens desta análise
      }

      onProgress?.("Processando com IA e comparando com a base de referência...");
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(
    "O processamento está demorando mais que o esperado. Tente novamente em instantes.",
  );
}

export async function fetchAllSheets(sheetId: string): Promise<ConferenceResult> {
  const result: ConferenceResult = {
    corretos: [],
    divergentes: [],
    incorretos: [],
    faltantes: [],
  };

  const resultSheets = [
    { name: "Itens_Corretos", key: "corretos" as const },
    { name: "Itens_Divergentes", key: "divergentes" as const },
    { name: "Itens_Incorretos", key: "incorretos" as const },
    { name: "Itens_Faltantes", key: "faltantes" as const },
  ];

  for (const { name, key } of resultSheets) {
    try {
      result[key] = await fetchSheet(sheetId, name);
    } catch (error) {
      console.error(`Erro ao buscar aba ${name}:`, error);
    }
  }

  return result;
}

async function fetchSheet(sheetId: string, sheetName: string): Promise<SheetItem[]> {
  const encodedSheetName = encodeURIComponent(sheetName);
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodedSheetName}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao buscar aba ${sheetName}: ${response.status}`);
  }

  const csvText = await response.text();
  const items = parseCSV(csvText);

  return items;
}

function parseCSV(csvText: string): SheetItem[] {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const dataLines = lines.slice(1);

  return dataLines
    .map((line) => {
      const values = parseCSVLine(line);
      const item: Partial<SheetItem> = {};
      headers.forEach((header, index) => {
        item[header as keyof SheetItem] = values[index] || "";
      });
      return item as SheetItem;
    })
    .filter((item) => item.BL); // descarta linhas em branco no fim da aba
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function buildBlHistory(result: ConferenceResult): BlHistoryEntry[] {
  const map = new Map<string, BlHistoryEntry>();

  const bump = (item: SheetItem, key: "corretos" | "divergentes" | "incorretos" | "faltantes") => {
    const bl = normalizeBl(item.BL);
    if (!bl) return;
    const existing = map.get(bl) ?? {
      bl,
      timestamp: item.Timestamp ?? "",
      corretos: 0,
      divergentes: 0,
      incorretos: 0,
      faltantes: 0,
      total: 0,
    };
    existing[key] += 1;
    existing.total += 1;
    if (item.Timestamp && item.Timestamp > existing.timestamp) {
      existing.timestamp = item.Timestamp;
    }
    map.set(bl, existing);
  };

  result.corretos.forEach((item) => bump(item, "corretos"));
  result.divergentes.forEach((item) => bump(item, "divergentes"));
  result.incorretos.forEach((item) => bump(item, "incorretos"));
  result.faltantes.forEach((item) => bump(item, "faltantes"));

  return Array.from(map.values()).sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
}

export async function fetchDashboardData(): Promise<ConferenceResult> {
  const sheetId = import.meta.env.VITE_SHEET_ID;
  if (!sheetId) {
    throw new Error("VITE_SHEET_ID não configurado (veja o .env).");
  }
  const result = await fetchAllSheets(sheetId);
  saveLastConferenceResult(result);
  return result;
}
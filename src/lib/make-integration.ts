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

  while (Date.now() - startTime < timeout) {
    try {
      const result = await fetchAllSheets(sheetId);

      const hasResults =
        result.corretos.length > 0 ||
        result.divergentes.length > 0 ||
        result.incorretos.length > 0 ||
        result.faltantes.length > 0;

      if (hasResults) {
        return result;
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

async function fetchAllSheets(sheetId: string): Promise<ConferenceResult> {
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
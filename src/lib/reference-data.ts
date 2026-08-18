export type ReferenceItem = {
  bl: string;
  itemNr: number;
  descricao: string;
  quantidade: number;
  unidade: string;
  pesoKg: number;
  container: string;
  categoria: string;
};

export const REFERENCE_BASE: ReferenceItem[] = [
  { bl: "BL-2026-001", itemNr: 1, descricao: "Amortecedores dianteiros (kit)", quantidade: 200, unidade: "caixas", pesoKg: 3200, container: "WSCU1004521", categoria: "Autopeças e componentes industriais" },
  { bl: "BL-2026-001", itemNr: 2, descricao: "Correias de transmissão automotiva", quantidade: 350, unidade: "unidades", pesoKg: 1050, container: "WSCU1004521", categoria: "Autopeças e componentes industriais" },
  { bl: "BL-2026-001", itemNr: 3, descricao: "Kit de embreagem completo", quantidade: 480, unidade: "unidades", pesoKg: 2880, container: "WSCU1004521", categoria: "Autopeças e componentes industriais" },
  { bl: "BL-2026-001", itemNr: 4, descricao: "Filtros de óleo automotivo", quantidade: 1200, unidade: "unidades", pesoKg: 960, container: "WSCU1004522", categoria: "Autopeças e componentes industriais" },
  { bl: "BL-2026-001", itemNr: 5, descricao: "Discos de freio ventilados", quantidade: 300, unidade: "pares", pesoKg: 4500, container: "WSCU1004522", categoria: "Autopeças e componentes industriais" },
  { bl: "BL-2026-001", itemNr: 6, descricao: "Velas de ignição (caixa c/50)", quantidade: 150, unidade: "caixas", pesoKg: 375, container: "WSCU1004522", categoria: "Autopeças e componentes industriais" },
  { bl: "BL-2026-002", itemNr: 1, descricao: "Placas-mãe industriais", quantidade: 600, unidade: "unidades", pesoKg: 1800, container: "WSCU2117733", categoria: "Componentes eletrônicos" },
  { bl: "BL-2026-002", itemNr: 2, descricao: "Fontes de alimentação chaveadas", quantidade: 900, unidade: "unidades", pesoKg: 2700, container: "WSCU2117733", categoria: "Componentes eletrônicos" },
  { bl: "BL-2026-002", itemNr: 3, descricao: "Módulos de memória RAM (caixa c/20)", quantidade: 240, unidade: "caixas", pesoKg: 960, container: "WSCU2117733", categoria: "Componentes eletrônicos" },
  { bl: "BL-2026-002", itemNr: 4, descricao: "Cabos de rede Cat6 (rolo 300m)", quantidade: 500, unidade: "rolos", pesoKg: 3500, container: "WSCU2117734", categoria: "Componentes eletrônicos" },
  { bl: "BL-2026-002", itemNr: 5, descricao: "Roteadores industriais", quantidade: 320, unidade: "unidades", pesoKg: 1600, container: "WSCU2117734", categoria: "Componentes eletrônicos" },
  { bl: "BL-2026-002", itemNr: 6, descricao: "Baterias externas (power bank)", quantidade: 1500, unidade: "unidades", pesoKg: 2250, container: "WSCU2117734", categoria: "Componentes eletrônicos" },
  { bl: "BL-2026-003", itemNr: 1, descricao: "Tecido de algodão cru (rolo 100m)", quantidade: 400, unidade: "rolos", pesoKg: 6000, container: "WSCU3355210", categoria: "Têxteis e aviamentos" },
  { bl: "BL-2026-003", itemNr: 2, descricao: "Malha para camisetas (fardo)", quantidade: 260, unidade: "fardos", pesoKg: 5200, container: "WSCU3355210", categoria: "Têxteis e aviamentos" },
  { bl: "BL-2026-003", itemNr: 3, descricao: "Linhas de costura industrial (caixa)", quantidade: 500, unidade: "caixas", pesoKg: 1000, container: "WSCU3355210", categoria: "Têxteis e aviamentos" },
  { bl: "BL-2026-003", itemNr: 4, descricao: "Botões plásticos (saco 5.000un)", quantidade: 180, unidade: "sacos", pesoKg: 900, container: "WSCU3355211", categoria: "Têxteis e aviamentos" },
  { bl: "BL-2026-003", itemNr: 5, descricao: "Zíperes industriais (rolo 50m)", quantidade: 300, unidade: "rolos", pesoKg: 750, container: "WSCU3355211", categoria: "Têxteis e aviamentos" },
  { bl: "BL-2026-003", itemNr: 6, descricao: "Etiquetas têxteis (caixa 10.000un)", quantidade: 220, unidade: "caixas", pesoKg: 440, container: "WSCU3355211", categoria: "Têxteis e aviamentos" },
  { bl: "BL-2026-004", itemNr: 1, descricao: "Vinho tinto seco (caixa 12un 750ml)", quantidade: 800, unidade: "caixas", pesoKg: 9600, container: "WSCU4489902", categoria: "Bebidas" },
  { bl: "BL-2026-004", itemNr: 2, descricao: "Vinho branco suave (caixa 12un 750ml)", quantidade: 600, unidade: "caixas", pesoKg: 7200, container: "WSCU4489902", categoria: "Bebidas" },
  { bl: "BL-2026-004", itemNr: 3, descricao: "Espumante brut (caixa 6un 750ml)", quantidade: 400, unidade: "caixas", pesoKg: 2400, container: "WSCU4489902", categoria: "Bebidas" },
  { bl: "BL-2026-004", itemNr: 4, descricao: "Suco integral de uva (caixa 12un 1L)", quantidade: 500, unidade: "caixas", pesoKg: 6000, container: "WSCU4489903", categoria: "Bebidas" },
  { bl: "BL-2026-004", itemNr: 5, descricao: "Garrafas de vidro retornáveis (fardo 24un)", quantidade: 300, unidade: "fardos", pesoKg: 3600, container: "WSCU4489903", categoria: "Bebidas" },
  { bl: "BL-2026-004", itemNr: 6, descricao: "Rótulos e rolhas (caixa sortida)", quantidade: 150, unidade: "caixas", pesoKg: 450, container: "WSCU4489903", categoria: "Bebidas" },
  { bl: "BL-2026-005", itemNr: 1, descricao: "Cimento Portland CP-II (saco 50kg)", quantidade: 400, unidade: "sacos", pesoKg: 20000, container: "WSCU5567341", categoria: "Materiais de construção" },
  { bl: "BL-2026-005", itemNr: 2, descricao: "Argamassa industrializada (saco 20kg)", quantidade: 900, unidade: "sacos", pesoKg: 18000, container: "WSCU5567341", categoria: "Materiais de construção" },
  { bl: "BL-2026-005", itemNr: 3, descricao: "Tijolos cerâmicos (pallet c/200un)", quantidade: 60, unidade: "pallets", pesoKg: 24000, container: "WSCU5567341", categoria: "Materiais de construção" },
  { bl: "BL-2026-005", itemNr: 4, descricao: "Telhas de fibrocimento (pacote c/10un)", quantidade: 180, unidade: "pacotes", pesoKg: 10800, container: "WSCU5567342", categoria: "Materiais de construção" },
  { bl: "BL-2026-005", itemNr: 5, descricao: "Vergalhões de aço CA-50 (feixe 12m)", quantidade: 250, unidade: "feixes", pesoKg: 30000, container: "WSCU5567342", categoria: "Materiais de construção" },
  { bl: "BL-2026-005", itemNr: 6, descricao: "Tintas impermeabilizantes (balde 18L)", quantidade: 200, unidade: "baldes", pesoKg: 4800, container: "WSCU5567342", categoria: "Materiais de construção" },
];

export type ExtractedItem = {
  bl: string;
  itemNr: number;
  descricao: string;
  quantidade: number;
  unidade: string;
  pesoKg: number;
  container: string;
};

export const SAMPLE_EXTRACTED: ExtractedItem[] = [
  { bl: "BL-2026-001", itemNr: 1, descricao: "Amortecedores dianteiros (kit)", quantidade: 200, unidade: "caixas", pesoKg: 3200, container: "WSCU1004521" },
  { bl: "BL-2026-001", itemNr: 2, descricao: "Correias de transmissão automotiva", quantidade: 350, unidade: "unidades", pesoKg: 1050, container: "WSCU1004521" },
  { bl: "BL-2026-001", itemNr: 3, descricao: "Kit de embreagem completo", quantidade: 450, unidade: "unidades", pesoKg: 2700, container: "WSCU1004521" },
  { bl: "BL-2026-001", itemNr: 4, descricao: "Filtros de óleo automotivo", quantidade: 1200, unidade: "unidades", pesoKg: 960, container: "WSCU1004522" },
  { bl: "BL-2026-001", itemNr: 5, descricao: "Discos de freio ventilados", quantidade: 300, unidade: "pares", pesoKg: 4500, container: "WSCU1004522" },
  { bl: "BL-2026-001", itemNr: 6, descricao: "Velas de ignição (caixa c/50)", quantidade: 150, unidade: "caixas", pesoKg: 375, container: "WSCU1004522" },
];

export type DiagnosticStatus = "ok" | "faltante" | "incorreto" | "divergente";

export type DiagnosticRow = {
  bl: string;
  itemNr: number;
  container: string;
  descricao: string;
  status: DiagnosticStatus;
  diffs: string[];
  esperado?: ReferenceItem;
  encontrado?: ExtractedItem;
};

export type MakeDiagnosticItem = {
  item_nr: number;
  descricao: string;
  conteiner: string;
  quantidade_manifesto?: number;
  peso_manifesto_kg?: number;
  quantidade_referencia?: number;
  peso_referencia_kg?: number;
  conteiner_referencia?: string;
  status: DiagnosticStatus;
  motivo?: string;
};

export type MakeWebhookResponse = {
  bl: string;
  itens: MakeDiagnosticItem[];
};

export function mapMakeResponseToRows(res: MakeWebhookResponse): DiagnosticRow[] {
  return res.itens.map((it) => ({
    bl: res.bl,
    itemNr: it.item_nr,
    container: it.conteiner,
    descricao: it.descricao,
    status: it.status,
    diffs: it.motivo ? [it.motivo] : [],
  }));
}

export function runDiagnostic(
  reference: ReferenceItem[],
  extracted: ExtractedItem[],
): DiagnosticRow[] {
  const rows: DiagnosticRow[] = [];
  const seen = new Set<string>();
  const key = (bl: string, itemNr: number) => `${bl}::${itemNr}`;

  for (const ref of reference) {
    const found = extracted.find((e) => e.bl === ref.bl && e.itemNr === ref.itemNr);
    if (!found) {
      rows.push({ bl: ref.bl, itemNr: ref.itemNr, container: ref.container, descricao: ref.descricao, status: "faltante", diffs: ["Item da base de referência não encontrado no manifesto"], esperado: ref });
      continue;
    }
    seen.add(key(found.bl, found.itemNr));
    const diffs: string[] = [];
    if (found.quantidade !== ref.quantidade) diffs.push(`Quantidade ${found.quantidade} ≠ ${ref.quantidade}`);
    if (found.unidade !== ref.unidade) diffs.push(`Unidade ${found.unidade} ≠ ${ref.unidade}`);
    if (Math.abs(found.pesoKg - ref.pesoKg) > 1) diffs.push(`Peso ${found.pesoKg}kg ≠ ${ref.pesoKg}kg`);
    if (found.container !== ref.container) diffs.push(`Contêiner ${found.container} ≠ ${ref.container}`);
    rows.push({ bl: ref.bl, itemNr: ref.itemNr, container: ref.container, descricao: ref.descricao, status: diffs.length ? "divergente" : "ok", diffs, esperado: ref, encontrado: found });
  }

  for (const ex of extracted) {
    if (seen.has(key(ex.bl, ex.itemNr))) continue;
    rows.push({ bl: ex.bl, itemNr: ex.itemNr, container: ex.container, descricao: ex.descricao, status: "incorreto", diffs: ["Item extraído do manifesto sem correspondência na base de referência"], encontrado: ex });
  }

  return rows;
}

export const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;

const REFERENCE_SHEET_ID = import.meta.env.VITE_SHEET_ID;
const REFERENCE_SHEET_TAB = import.meta.env.VITE_SHEET_TAB;

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseReferenceCsv(csv: string): ReferenceItem[] {
  const lines = csv.trim().split("\n").filter(Boolean);
  return lines
    .slice(1) // drop header row
    .map((line) => {
      const c = splitCsvLine(line);
      return {
        bl: (c[0] ?? "").trim(),
        itemNr: Number(c[1]) || 0,
        descricao: (c[2] ?? "").trim(),
        quantidade: Number(c[3]) || 0,
        unidade: (c[4] ?? "").trim(),
        pesoKg: Number(c[5]) || 0,
        container: (c[6] ?? "").trim(),
        categoria: (c[7] ?? "").trim(),
      };
    })
    .filter((r) => r.bl);
}

export async function fetchReferenceData(): Promise<ReferenceItem[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${REFERENCE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(REFERENCE_SHEET_TAB)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    const parsed = parseReferenceCsv(csv);
    if (!parsed.length) throw new Error("Planilha retornou vazia ou não está pública");
    return parsed;
  } catch (error) {
    console.error("Falha ao sincronizar com o Google Sheets, usando base local:", error);
    return REFERENCE_BASE;
  }
}
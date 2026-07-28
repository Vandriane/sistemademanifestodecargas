// Simplified internal reference base ("Google Sheets" mirror).
export type ReferenceItem = {
  bl: string;
  container: string;
  descricao: string;
  ncm: string;
  quantidade: number;
  unidade: string;
  pesoKg: number;
};

export const REFERENCE_BASE: ReferenceItem[] = [
  { bl: "MSCUOX123456", container: "MSCU7788112", descricao: "Bobinas de aço laminado", ncm: "7208.39.90", quantidade: 240, unidade: "UN", pesoKg: 18400 },
  { bl: "MSCUOX123456", container: "MSCU7788113", descricao: "Peças automotivas - eixos", ncm: "8708.50.99", quantidade: 1200, unidade: "UN", pesoKg: 8600 },
  { bl: "MSCUOX123456", container: "MSCU7788114", descricao: "Compressores industriais", ncm: "8414.80.39", quantidade: 48, unidade: "UN", pesoKg: 12750 },
  { bl: "MAEU998877", container: "MRKU4451209", descricao: "Café verde em sacas", ncm: "0901.11.10", quantidade: 320, unidade: "SC", pesoKg: 19200 },
  { bl: "MAEU998877", container: "MRKU4451210", descricao: "Contêiner refrigerado - frutas", ncm: "0805.10.00", quantidade: 900, unidade: "CX", pesoKg: 15400 },
  { bl: "HLCU556677", container: "HLXU1122334", descricao: "Resina PET granulada", ncm: "3907.61.00", quantidade: 500, unidade: "SC", pesoKg: 12500 },
  { bl: "HLCU556677", container: "HLXU1122335", descricao: "Papel kraft em bobinas", ncm: "4804.11.00", quantidade: 60, unidade: "RL", pesoKg: 21800 },
];

// Simulated "extracted" items from the uploaded BL manifest.
// Contains intentional divergences to demonstrate the diagnostic engine.
export type ExtractedItem = Omit<ReferenceItem, "quantidade" | "pesoKg"> & {
  quantidade: number;
  pesoKg: number;
};

export const SAMPLE_EXTRACTED: ExtractedItem[] = [
  { bl: "MSCUOX123456", container: "MSCU7788112", descricao: "Bobinas de aço laminado", ncm: "7208.39.90", quantidade: 240, unidade: "UN", pesoKg: 18400 },
  { bl: "MSCUOX123456", container: "MSCU7788113", descricao: "Peças automotivas - eixos", ncm: "8708.50.99", quantidade: 1180, unidade: "UN", pesoKg: 8600 }, // qty diff
  // MSCU7788114 missing (faltante)
  { bl: "MAEU998877", container: "MRKU4451209", descricao: "Café verde em sacas", ncm: "0901.11.10", quantidade: 320, unidade: "SC", pesoKg: 19180 }, // small peso diff
  { bl: "MAEU998877", container: "MRKU4451210", descricao: "Contêiner refrigerado - frutas", ncm: "0805.10.00", quantidade: 900, unidade: "PL", pesoKg: 15400 }, // unidade diff
  { bl: "HLCU556677", container: "HLXU1122334", descricao: "Resina PET granulada", ncm: "3907.61.00", quantidade: 500, unidade: "SC", pesoKg: 12500 },
  { bl: "HLCU556677", container: "HLXU1122335", descricao: "Papel kraft em bobinas", ncm: "4804.11.00", quantidade: 60, unidade: "RL", pesoKg: 21800 },
  // Extra unexpected item (incorreto)
  { bl: "HLCU556677", container: "HLXU9999999", descricao: "Item não catalogado", ncm: "0000.00.00", quantidade: 12, unidade: "UN", pesoKg: 340 },
];

export type DiagnosticStatus = "ok" | "faltante" | "incorreto" | "divergente";

export type DiagnosticRow = {
  container: string;
  bl: string;
  descricao: string;
  status: DiagnosticStatus;
  diffs: string[];
  esperado?: ReferenceItem;
  encontrado?: ExtractedItem;
};

export function runDiagnostic(
  reference: ReferenceItem[],
  extracted: ExtractedItem[],
): DiagnosticRow[] {
  const rows: DiagnosticRow[] = [];
  const seen = new Set<string>();

  for (const ref of reference) {
    const found = extracted.find((e) => e.container === ref.container);
    if (!found) {
      rows.push({
        container: ref.container,
        bl: ref.bl,
        descricao: ref.descricao,
        status: "faltante",
        diffs: ["Contêiner não encontrado no manifesto enviado"],
        esperado: ref,
      });
      continue;
    }
    seen.add(found.container);
    const diffs: string[] = [];
    if (found.quantidade !== ref.quantidade)
      diffs.push(`Quantidade ${found.quantidade} ≠ ${ref.quantidade}`);
    if (found.unidade !== ref.unidade)
      diffs.push(`Unidade ${found.unidade} ≠ ${ref.unidade}`);
    if (Math.abs(found.pesoKg - ref.pesoKg) > 1)
      diffs.push(`Peso ${found.pesoKg}kg ≠ ${ref.pesoKg}kg`);
    if (found.ncm !== ref.ncm) diffs.push(`NCM ${found.ncm} ≠ ${ref.ncm}`);
    rows.push({
      container: ref.container,
      bl: ref.bl,
      descricao: ref.descricao,
      status: diffs.length ? "divergente" : "ok",
      diffs,
      esperado: ref,
      encontrado: found,
    });
  }

  for (const ex of extracted) {
    if (seen.has(ex.container)) continue;
    rows.push({
      container: ex.container,
      bl: ex.bl,
      descricao: ex.descricao,
      status: "incorreto",
      diffs: ["Item extraído do BL sem correspondência na base de referência"],
      encontrado: ex,
    });
  }

  return rows;
}

export const MAKE_WEBHOOK_URL =
  "https://hook.us2.make.com/wopg4wr34bvj4rrynhsdgzd7vkmkh4tr";

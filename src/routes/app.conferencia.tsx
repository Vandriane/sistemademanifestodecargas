import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PackageX,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  REFERENCE_BASE,
  SAMPLE_EXTRACTED,
  runDiagnostic,
  MAKE_WEBHOOK_URL,
  type DiagnosticRow,
  type DiagnosticStatus,
} from "@/lib/reference-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/conferencia")({
  component: Conferencia,
  head: () => ({
    meta: [
      { title: "Conferência de BL · SLAM" },
      { name: "description", content: "Upload de manifesto de carga e diagnóstico automático." },
    ],
  }),
});

type Phase = "idle" | "uploading" | "extracting" | "matching" | "done";

function Conferencia() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [rows, setRows] = useState<DiagnosticRow[] | null>(null);
  const [filter, setFilter] = useState<DiagnosticStatus | "all">("all");
  const [webhookStatus, setWebhookStatus] = useState<string>("");

  const summary = useMemo(() => {
    const src = rows ?? [];
    return {
      total: src.length,
      ok: src.filter((r) => r.status === "ok").length,
      divergente: src.filter((r) => r.status === "divergente").length,
      faltante: src.filter((r) => r.status === "faltante").length,
      incorreto: src.filter((r) => r.status === "incorreto").length,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    return filter === "all" ? rows : rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setFile(files[0]);
    setRows(null);
    setPhase("idle");
  };

  const startAnalysis = async () => {
    if (!file) return toast.error("Anexe um manifesto (PDF, imagem ou planilha).");

    setPhase("uploading");
    setProgress(10);

    // Fire webhook (non-blocking; demo mode).
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("bl_reference_count", String(REFERENCE_BASE.length));
      form.append("source", "SLAM");
      const res = await fetch(MAKE_WEBHOOK_URL, { method: "POST", body: form, mode: "no-cors" });
      setWebhookStatus(`Enviado ao Make (${res.type || "ok"})`);
    } catch {
      setWebhookStatus("Enviado ao Make (modo demonstração)");
    }

    await tick(400); setProgress(35); setPhase("extracting");
    await tick(900); setProgress(65); setPhase("matching");
    await tick(900); setProgress(90);
    const diag = runDiagnostic(REFERENCE_BASE, SAMPLE_EXTRACTED);
    setRows(diag);
    setProgress(100);
    setPhase("done");
    toast.success("Diagnóstico concluído em segundos.");
  };

  const reset = () => {
    setFile(null);
    setRows(null);
    setPhase("idle");
    setProgress(0);
    setWebhookStatus("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const exportCsv = () => {
    if (!rows) return;
    const header = "container,bl,descricao,status,observacoes\n";
    const body = rows
      .map((r) => [r.container, r.bl, r.descricao, r.status, r.diffs.join(" | ")].join(","))
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conferencia-slam.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Etapa 1 · Upload e diagnóstico
        </div>
        <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
          Conferência de manifesto de carga
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Envie o BL em PDF, imagem ou planilha. A automação Make dispara a extração no Gemini,
          consulta a base de referência (Google Sheets) e devolve o diagnóstico completo em
          segundos.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        {/* Upload */}
        <Card className="shadow-elev">
          <CardHeader>
            <CardTitle className="text-base">Anexar manifesto (BL)</CardTitle>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, PNG, JPG, XLSX, CSV · Máx 20 MB
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition",
                file
                  ? "border-turquoise bg-turquoise/5"
                  : "border-border bg-muted/40 hover:border-turquoise hover:bg-turquoise/5",
              )}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {file ? (
                <>
                  <FileText className="h-10 w-10 text-turquoise" />
                  <div className="mt-3 text-sm font-semibold text-foreground">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB · pronto para análise
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-navy" />
                  <div className="mt-3 text-sm font-semibold text-foreground">
                    Arraste o BL aqui ou clique para selecionar
                  </div>
                  <div className="text-xs text-muted-foreground">
                    A IA identifica contêiner, quantidade, unidade, peso e NCM
                  </div>
                </>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={startAnalysis}
                disabled={phase !== "idle" && phase !== "done"}
                className="bg-navy text-white hover:bg-navy-deep"
              >
                {phase !== "idle" && phase !== "done" ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando…</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Analisar com IA</>
                )}
              </Button>
              <Button variant="outline" onClick={reset}>
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpar
              </Button>
              {rows && (
                <Button variant="outline" onClick={exportCsv}>
                  <Download className="mr-2 h-4 w-4" /> Exportar CSV
                </Button>
              )}
            </div>

            {phase !== "idle" && (
              <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {phase === "uploading" && "1/3 · Enviando para Make webhook"}
                    {phase === "extracting" && "2/3 · Gemini extraindo itens do BL"}
                    {phase === "matching" && "3/3 · Comparando com Google Sheets"}
                    {phase === "done" && "Concluído"}
                  </span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
                {webhookStatus && (
                  <div className="text-[11px] text-muted-foreground">{webhookStatus}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline */}
        <Card className="shadow-elev">
          <CardHeader>
            <CardTitle className="text-base">Painel da automação</CardTitle>
            <p className="text-xs text-muted-foreground">
              Cada etapa é rastreada e auditável
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { t: "Upload do manifesto (BL)", d: "PDF, imagem ou planilha aceita direto no SLAM" },
              { t: "Disparo do webhook Make.com", d: "hook.us2.make.com/… encaminha o arquivo" },
              { t: "Extração no Google Gemini", d: "IA reconhece itens, quantidades, peso e NCM" },
              { t: "Consulta ao Google Sheets", d: "Base de referência interna é lida em tempo real" },
              { t: "Diagnóstico", d: "Conformes, divergentes, faltantes e incorretos" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {rows && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatusKpi label="Conformes" value={summary.ok} tone="ok" icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => setFilter("ok")} active={filter === "ok"} />
            <StatusKpi label="Divergentes" value={summary.divergente} tone="warning" icon={<AlertTriangle className="h-4 w-4" />} onClick={() => setFilter("divergente")} active={filter === "divergente"} />
            <StatusKpi label="Faltantes" value={summary.faltante} tone="destructive" icon={<PackageX className="h-4 w-4" />} onClick={() => setFilter("faltante")} active={filter === "faltante"} />
            <StatusKpi label="Incorretos" value={summary.incorreto} tone="turquoise" icon={<XCircle className="h-4 w-4" />} onClick={() => setFilter("incorreto")} active={filter === "incorreto"} />
          </div>

          <Card className="shadow-elev">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Resultado da conferência</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {summary.total} contêineres analisados · filtro atual:{" "}
                  <span className="font-medium text-foreground">
                    {filter === "all" ? "Todos" : label(filter)}
                  </span>
                </p>
              </div>
              <div className="flex gap-1.5">
                {(["all", "ok", "divergente", "faltante", "incorreto"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition",
                      filter === k
                        ? "bg-navy text-white"
                        : "bg-muted text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    {k === "all" ? "Todos" : label(k)}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Contêiner</th>
                    <th className="px-6 py-3 text-left">BL</th>
                    <th className="px-6 py-3 text-left">Descrição</th>
                    <th className="px-6 py-3 text-left">Observações da IA</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.container} className="border-t border-border align-top">
                      <td className="px-6 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-6 py-3 font-mono text-xs font-semibold">{r.container}</td>
                      <td className="px-6 py-3 font-mono text-xs">{r.bl}</td>
                      <td className="px-6 py-3">{r.descricao}</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">
                        {r.diffs.length ? (
                          <ul className="space-y-0.5">
                            {r.diffs.map((d, i) => <li key={i}>• {d}</li>)}
                          </ul>
                        ) : (
                          <span className="text-success">Nenhuma divergência</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                      Nenhum item neste status.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function tick(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
function label(s: DiagnosticStatus) {
  return { ok: "Conforme", divergente: "Divergente", faltante: "Faltante", incorreto: "Incorreto" }[s];
}

function StatusBadge({ status }: { status: DiagnosticStatus }) {
  const map: Record<DiagnosticStatus, string> = {
    ok: "border-success/30 bg-success/10 text-success",
    divergente: "border-warning/40 bg-warning/15 text-warning",
    faltante: "border-destructive/30 bg-destructive/10 text-destructive",
    incorreto: "border-turquoise/40 bg-turquoise/15 text-navy",
  };
  return (
    <Badge variant="outline" className={cn("gap-1", map[status])}>
      {status === "ok" && <CheckCircle2 className="h-3 w-3" />}
      {status === "divergente" && <AlertTriangle className="h-3 w-3" />}
      {status === "faltante" && <PackageX className="h-3 w-3" />}
      {status === "incorreto" && <XCircle className="h-3 w-3" />}
      {label(status)}
    </Badge>
  );
}

function StatusKpi({
  label, value, tone, icon, onClick, active,
}: {
  label: string; value: number;
  tone: "ok" | "warning" | "destructive" | "turquoise";
  icon: React.ReactNode; onClick: () => void; active: boolean;
}) {
  const tones = {
    ok: "text-success bg-success/10",
    warning: "text-warning bg-warning/15",
    destructive: "text-destructive bg-destructive/10",
    turquoise: "text-navy bg-turquoise/20",
  }[tone];
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-5 text-left shadow-elev transition hover:-translate-y-0.5",
        active ? "border-navy ring-2 ring-navy/20" : "border-border",
      )}
    >
      <div className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", tones)}>
        {icon}
      </div>
      <div className="mt-4 text-3xl font-semibold text-foreground">{value}</div>
      <div className="text-sm font-medium text-foreground/80">{label}</div>
    </button>
  );
}

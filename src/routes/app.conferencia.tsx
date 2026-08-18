import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { UploadCloud,  FileText,  Loader2,  CheckCircle2,  AlertTriangle,  XCircle,  PackageX,  Sparkles, ArrowRight, RefreshCcw, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  uploadManifestToMake,
  pollSheetForResult,
  saveLastConferenceResult,
  type ConferenceResult,
  type SheetItem,
} from "@/lib/make-integration";

export const Route = createFileRoute("/app/conferencia")({
  component: Conferencia,
  head: () => ({
    meta: [
      { title: "Conferência de BL · SLAM" },
      { name: "description", content: "Upload de manifesto de carga e diagnóstico automático." },
    ],
  }),
});

type Phase = "idle" | "uploading" | "processing" | "done" | "error";
type StatusFilter = "all" | "corretos" | "divergentes" | "incorretos" | "faltantes";
type ResultRow = SheetItem & { status: Exclude<StatusFilter, "all"> };

function Conferencia() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConferenceResult | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const summary = useMemo(() => {
    if (!result) return { total: 0, corretos: 0, divergentes: 0, incorretos: 0, faltantes: 0 };
    return {
      total: result.corretos.length + result.divergentes.length + result.incorretos.length + result.faltantes.length,
      corretos: result.corretos.length,
      divergentes: result.divergentes.length,
      incorretos: result.incorretos.length,
      faltantes: result.faltantes.length,
    };
  }, [result]);

  const filteredItems = useMemo<ResultRow[]>(() => {
    if (!result) return [];
    if (filter === "all") {
      return [
        ...result.corretos.map((item) => ({ ...item, status: "corretos" as const })),
        ...result.divergentes.map((item) => ({ ...item, status: "divergentes" as const })),
        ...result.incorretos.map((item) => ({ ...item, status: "incorretos" as const })),
        ...result.faltantes.map((item) => ({ ...item, status: "faltantes" as const })),
      ];
    }
    return result[filter].map((item) => ({ ...item, status: filter }));
  }, [result, filter]);

 const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const selectedFile = files[0];
    
    const validTypes = [
      "application/pdf", 
      "image/png", 
      "image/jpeg", 
      "image/jpg",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "text/csv" // CSV
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Formato inválido. Aceitamos PDF, PNG, JPG, XLSX ou CSV.");
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 20MB.");
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setPhase("idle");
    setErrorMessage("");
  };

const startAnalysis = async () => {
    if (!file) {
      toast.error("Anexe um manifesto.");
      return;
    }

    setPhase("uploading");
    setProgress(15);
    setStatusMessage("Enviando manifesto para a IA...");
    setErrorMessage("");

    try {
      await uploadManifestToMake(file);

      setPhase("processing");
      setProgress(30);
      setStatusMessage("Processando com IA e comparando com a base de referência...");

      const conferenceResult = await pollSheetForResult((message) => {
        setStatusMessage(message);
        setProgress((p) => Math.min(p + 8, 90));
      });

      setResult(conferenceResult);
      saveLastConferenceResult(conferenceResult);
      setProgress(100);
      setPhase("done");
      setStatusMessage("Conferência concluída com sucesso!");
      toast.success("Conferência concluída!");
    } catch (error) {
      console.error("Error during analysis:", error);
      setPhase("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro ao processar manifesto.");
      toast.error("Erro ao processar manifesto.");
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setPhase("idle");
    setProgress(0);
    setStatusMessage("");
    setErrorMessage("");
    setFilter("all");
    if (inputRef.current) inputRef.current.value = "";
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
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
                onChange={(e) => handleFiles(e.target.files)}
                disabled={phase !== "idle"}
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
                    PDF, imagem ou planilha · Máx 20MB
                  </div>
                </>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={startAnalysis}
                disabled={phase !== "idle" && phase !== "done" && phase !== "error"}
                className="bg-navy text-white hover:bg-navy-deep"
              >
                {phase !== "idle" && phase !== "done" && phase !== "error" ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando…</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Analisar com IA</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={reset}
                disabled={phase === "uploading" || phase === "processing"}
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Limpar
              </Button>
            </div>

            {phase !== "idle" && phase !== "done" && (
              <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {phase === "uploading" && "Enviando manifesto..."}
                    {phase === "processing" && statusMessage}
                    {phase === "error" && "Erro no processamento"}
                  </span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
                {errorMessage && <div className="text-[11px] text-destructive">{errorMessage}</div>}
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
              { t: "Extração no Google Gemini", d: "IA reconhece itens, quantidades, peso e contêiner" },
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
      {result && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatusKpi label="Corretos" value={summary.corretos} tone="ok" icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => setFilter("corretos")} active={filter === "corretos"} />
            <StatusKpi label="Divergentes" value={summary.divergentes} tone="warning" icon={<AlertTriangle className="h-4 w-4" />} onClick={() => setFilter("divergentes")} active={filter === "divergentes"} />
            <StatusKpi label="Incorretos" value={summary.incorretos} tone="turquoise" icon={<XCircle className="h-4 w-4" />} onClick={() => setFilter("incorretos")} active={filter === "incorretos"} />
            <StatusKpi label="Faltantes" value={summary.faltantes} tone="destructive" icon={<PackageX className="h-4 w-4" />} onClick={() => setFilter("faltantes")} active={filter === "faltantes"} />
          </div>

          <Card className="shadow-elev">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Resultado da conferência</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {summary.total} itens analisados · filtro atual:{" "}
                  <span className="font-medium text-foreground">
                    {filter === "all" ? "Todos" : getStatusLabel(filter)}
                  </span>
                </p>
              </div>
              <div className="flex gap-1.5">
                {(["all", "corretos", "divergentes", "incorretos", "faltantes"] as const).map((k) => (
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
                    {k === "all" ? "Todos" : getStatusLabel(k)}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Item Nr</th>
                    <th className="px-6 py-3 text-left">BL</th>
                    <th className="px-6 py-3 text-left">Descrição</th>
                    <th className="px-6 py-3 text-left">Quantidade</th>
                    <th className="px-6 py-3 text-left">Unidade</th>
                    <th className="px-6 py-3 text-left">Peso Bruto (kg)</th>
                    <th className="px-6 py-3 text-left">Contêiner</th>
                    <th className="px-6 py-3 text-left">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={`${item.status}-${index}`} className="border-t border-border align-top">
                      <td className="px-6 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-6 py-3 font-mono text-xs font-semibold">{item["Item Nr"]}</td>
                      <td className="px-6 py-3 font-mono text-xs">{item.BL}</td>
                      <td className="px-6 py-3">{item.Descrição || "-"}</td>
                      <td className="px-6 py-3 font-mono text-xs">{item.Quantidade || "-"}</td>
                      <td className="px-6 py-3 text-xs">{item.Unidade || "-"}</td>
                      <td className="px-6 py-3 font-mono text-xs">{item["Peso Bruto"] || "-"}</td>
                      <td className="px-6 py-3 font-mono text-xs">{item.Contêiner || "-"}</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">{buildMotivo(item)}</td>
                    </tr>
                  ))}
                  {!filteredItems.length && (
                    <tr><td colSpan={9} className="px-6 py-10 text-center text-sm text-muted-foreground">
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

function buildMotivo(item: ResultRow): string {
  if (item.status === "corretos") return "-";

  if (item.status === "faltantes") {
    return "Item consta na base de referência, mas não foi encontrado no manifesto";
  }

  const partes: string[] = [];
  const motivoBase = item.Motivo?.replace(/^"+|"+$/g, "").trim();
  if (motivoBase) partes.push(motivoBase);

  if (item.status === "divergentes") {
    if (item.Quantidade_Ref && item.Quantidade_Ref !== item.Quantidade) {
      partes.push(`Quantidade declarada: ${item.Quantidade} · base: ${item.Quantidade_Ref}`);
    }
    if (item.Peso_Ref && item.Peso_Ref !== item["Peso Bruto"]) {
      partes.push(`Peso declarado: ${item["Peso Bruto"]} kg · base: ${item.Peso_Ref} kg`);
    }
    if (item.Contêiner_Ref && item.Contêiner_Ref !== item.Contêiner) {
      partes.push(`Contêiner declarado: ${item.Contêiner} · base: ${item.Contêiner_Ref}`);
    }
  }

  if (item.status === "incorretos" && !motivoBase) {
    partes.push("Item do manifesto sem correspondência de BL + Nº na base de referência");
  }

  return partes.length ? partes.join(" — ") : "-";
}

function getStatusLabel(status: StatusFilter): string {
  return {
    all: "Todos",
    corretos: "Corretos",
    divergentes: "Divergentes",
    incorretos: "Incorretos",
    faltantes: "Faltantes",
  }[status];
}

function StatusBadge({ status }: { status: StatusFilter }) {
  const map: Record<StatusFilter, string> = {
    all: "border-border bg-muted text-muted-foreground",
    corretos: "border-success/30 bg-success/10 text-success",
    divergentes: "border-warning/40 bg-warning/15 text-warning",
    incorretos: "border-turquoise/40 bg-turquoise/15 text-navy",
    faltantes: "border-destructive/30 bg-destructive/10 text-destructive",
  };
  return (
    <Badge variant="outline" className={cn("gap-1", map[status])}>
      {status === "corretos" && <CheckCircle2 className="h-3 w-3" />}
      {status === "divergentes" && <AlertTriangle className="h-3 w-3" />}
      {status === "faltantes" && <PackageX className="h-3 w-3" />}
      {status === "incorretos" && <XCircle className="h-3 w-3" />}
      {getStatusLabel(status)}
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

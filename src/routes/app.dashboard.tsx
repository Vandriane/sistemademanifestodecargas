import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowUpRight, CheckCircle2, FileSearch, Loader2, PackageX, RefreshCw, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buildBlHistory, fetchDashboardData, getLastConferenceResult, type BlHistoryEntry, type ConferenceResult, type SheetItem } from "@/lib/make-integration";

export const Route = createFileRoute("/app/dashboard")({ component: Dashboard });

type Status = "corretos" | "divergentes" | "incorretos" | "faltantes";
type Filter = "all" | Status;
type Row = SheetItem & { status: Status };

const labels: Record<Filter, string> = {
  all: "Todos",
  corretos: "Corretos",
  divergentes: "Divergentes",
  incorretos: "Incorretos",
  faltantes: "Faltantes",
};

function Dashboard() {
  const [result, setResult] = useState<ConferenceResult | null>(() => getLastConferenceResult());
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const load = async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const fresh = await fetchDashboardData();
      setResult(fresh);
      setStatus("ready");
    } catch (error) {
      console.error("Falha ao carregar dados do dashboard:", error);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido ao consultar o Sheets.");
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(
    () => ({
      corretos: result?.corretos.length ?? 0,
      divergentes: result?.divergentes.length ?? 0,
      incorretos: result?.incorretos.length ?? 0,
      faltantes: result?.faltantes.length ?? 0,
    }),
    [result],
  );
  const total = summary.corretos + summary.divergentes + summary.incorretos + summary.faltantes;

  const rows = useMemo<Row[]>(() => {
    if (!result) return [];
    const makeRows = (s: Status) => result[s].map((item) => ({ ...item, status: s }));
    return filter === "all"
      ? [...makeRows("corretos"), ...makeRows("divergentes"), ...makeRows("incorretos"), ...makeRows("faltantes")]
      : makeRows(filter);
  }, [filter, result]);

  const donut = [
    { name: "Conforme", value: percent(summary.corretos, total), color: "var(--success)" },
    { name: "Divergente", value: percent(summary.divergentes, total), color: "var(--warning)" },
    { name: "Faltante", value: percent(summary.faltantes, total), color: "var(--destructive)" },
    { name: "Incorreto", value: percent(summary.incorretos, total), color: "var(--turquoise)" },
  ];

  const history = useMemo(() => (result ? buildBlHistory(result) : []), [result]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Visão geral</div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">Dashboard executivo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Indicadores consolidados de todas as conferências registradas no Google Sheets.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={status === "loading"}>
            {status === "loading" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Atualizar
          </Button>
          <Button variant="outline" asChild>
            <Link to="/app/base">
              <FileSearch className="mr-2 h-4 w-4" />
              Base de referência
            </Link>
          </Button>
          <Button className="bg-navy text-white hover:bg-navy-deep" asChild>
            <Link to="/app/conferencia">
              Nova conferência <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {status === "error" && (
        <Card className="border-destructive/40 bg-destructive/5 shadow-elev">
          <CardContent className="flex items-center justify-between gap-4 p-4 text-sm">
            <span className="text-destructive">
              Não foi possível sincronizar com o Google Sheets: {errorMessage}
              {result ? " Exibindo o último resultado salvo neste dispositivo." : ""}
            </span>
            <Button size="sm" variant="outline" onClick={load}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {status === "loading" && !result ? (
        <LoadingState />
      ) : !result || total === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Kpi label="Corretos" value={summary.corretos} status="corretos" active={filter === "corretos"} onClick={() => setFilter("corretos")} />
            <Kpi label="Divergentes" value={summary.divergentes} status="divergentes" active={filter === "divergentes"} onClick={() => setFilter("divergentes")} />
            <Kpi label="Incorretos" value={summary.incorretos} status="incorretos" active={filter === "incorretos"} onClick={() => setFilter("incorretos")} />
            <Kpi label="Faltantes" value={summary.faltantes} status="faltantes" active={filter === "faltantes"} onClick={() => setFilter("faltantes")} />
          </div>
          <ResultsCard rows={rows} total={total} filter={filter} setFilter={setFilter} />
          <AnalyticsPanels donut={donut} history={history} />
        </>
      )}
    </div>
  );
}

function ResultsCard({ rows, total, filter, setFilter }: { rows: Row[]; total: number; filter: Filter; setFilter: (f: Filter) => void }) {
  return (
    <Card className="shadow-elev">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Todos os itens conferidos</CardTitle>
          <p className="text-xs text-muted-foreground">
            {total} itens no total · filtro atual: <span className="font-medium text-foreground">{labels[filter]}</span>
          </p>
        </div>
        <div className="flex gap-1.5">
          {(Object.keys(labels) as Filter[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn("cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium", filter === s ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-navy/15")}
            >
              {labels[s]}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Status", "Item Nr", "BL", "Descrição", "Quantidade", "Unidade", "Peso Bruto (kg)", "Contêiner", "Motivo"].map((h) => (
                <th key={h} className="px-6 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={`${item.status}-${index}`} className="border-t border-border align-top">
                <td className="px-6 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-6 py-3 font-mono text-xs font-semibold">{item["Item Nr"]}</td>
                <td className="px-6 py-3 font-mono text-xs">{item.BL}</td>
                <td className="px-6 py-3">{item.Descrição || "-"}</td>
                <td className="px-6 py-3 font-mono text-xs">{item.Quantidade || "-"}</td>
                <td className="px-6 py-3 text-xs">{item.Unidade || "-"}</td>
                <td className="px-6 py-3 font-mono text-xs">{item["Peso Bruto"] || "-"}</td>
                <td className="px-6 py-3 font-mono text-xs">{item.Contêiner || "-"}</td>
                <td className="px-6 py-3 text-xs text-muted-foreground">{reason(item)}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={9} className="px-6 py-10 text-center text-muted-foreground">Nenhum item neste status.</td></tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function AnalyticsPanels({ donut, history }: { donut: { name: string; value: number; color: string }[]; history: BlHistoryEntry[] }) {
  const chartData = [...history]
    .sort((a, b) => (a.timestamp || "").localeCompare(b.timestamp || ""))
    .map((entry) => ({
      bl: entry.bl.replace("BL-", ""),
      divergencia: entry.total ? Math.round(((entry.divergentes + entry.incorretos + entry.faltantes) / entry.total) * 100) : 0,
    }));

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2 shadow-elev">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Taxa de divergência por manifesto</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">% de itens com divergência, incorreto ou faltante — por BL conferido</p>
          </div>
        </CardHeader>
        <CardContent className="h-72">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="bl" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} unit="%" />
                <Tooltip formatter={(value: number) => [`${value}%`, "Divergência"]} />
                <Bar dataKey="divergencia" fill="var(--warning)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Sem dados suficientes ainda.</div>
          )}
        </CardContent>
      </Card>
      <Card className="shadow-elev">
        <CardHeader>
          <CardTitle className="text-base">Distribuição de status</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Acumulado de todas as conferências</p>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={donut} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="var(--background)" strokeWidth={2}>
                {donut.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
            {donut.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="ml-auto mr-6 font-semibold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value, status, active, onClick }: { label: string; value: number; status: Status; active: boolean; onClick: () => void }) {
  const icons = {
    corretos: <CheckCircle2 className="h-4 w-4" />,
    divergentes: <AlertTriangle className="h-4 w-4" />,
    incorretos: <XCircle className="h-4 w-4" />,
    faltantes: <PackageX className="h-4 w-4" />,
  };
  const colors = {
    corretos: "text-success bg-success/10",
    divergentes: "text-warning bg-warning/15",
    incorretos: "text-navy bg-turquoise/20",
    faltantes: "text-destructive bg-destructive/10",
  };
  return (
    <button onClick={onClick} className={cn("rounded-xl border bg-card p-5 text-left shadow-elev cursor-pointer hover:bg-card/80", active ? "border-navy ring-2 ring-navy/20" : "border-border")}>
      <div className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", colors[status])}>{icons[status]}</div>
      <div className="mt-4 text-3xl font-semibold text-foreground">{value}</div>
      <div className="text-sm font-medium text-foreground/80">{label}</div>
    </button>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const colors = {
    corretos: "border-success/30 bg-success/10 text-success",
    divergentes: "border-warning/40 bg-warning/15 text-warning",
    incorretos: "border-turquoise/40 bg-turquoise/15 text-navy",
    faltantes: "border-destructive/30 bg-destructive/10 text-destructive",
  };
  return <Badge variant="outline" className={colors[status]}>{labels[status]}</Badge>;
}

function reason(item: Row) {
  if (item.status === "corretos") return "-";
  if (item.status === "faltantes") return "Item consta na base de referência, mas não foi encontrado no manifesto";
  return item.Motivo?.replace(/^"+|"+$/g, "").trim() || "-";
}

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

function LoadingState() {
  return (
    <Card className="shadow-elev">
      <CardContent className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Sincronizando com o Google Sheets...
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="shadow-elev">
      <CardContent className="p-8 text-center text-sm text-muted-foreground">
        Nenhuma conferência concluída ainda. Faça o upload de um manifesto para ver o resultado aqui.
      </CardContent>
    </Card>
  );
}

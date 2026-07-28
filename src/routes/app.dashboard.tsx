import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  ArrowUpRight,
  ClipboardCheck,
  Timer,
  AlertTriangle,
  PackageX,
  TrendingDown,
  FileSearch,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard · SLAM" },
      { name: "description", content: "Indicadores executivos de conferência de manifestos." },
    ],
  }),
});

const timeSeries = [
  { m: "Jan", manual: 42, slam: 12 },
  { m: "Fev", manual: 44, slam: 11 },
  { m: "Mar", manual: 41, slam: 9 },
  { m: "Abr", manual: 45, slam: 8 },
  { m: "Mai", manual: 43, slam: 6 },
  { m: "Jun", manual: 46, slam: 5 },
  { m: "Jul", manual: 44, slam: 4 },
];

const bars = [
  { d: "Seg", v: 128 },
  { d: "Ter", v: 156 },
  { d: "Qua", v: 141 },
  { d: "Qui", v: 172 },
  { d: "Sex", v: 189 },
  { d: "Sáb", v: 96 },
  { d: "Dom", v: 62 },
];

const donut = [
  { name: "Conforme", value: 78, color: "var(--success)" },
  { name: "Divergente", value: 14, color: "var(--warning)" },
  { name: "Faltante", value: 6, color: "var(--destructive)" },
  { name: "Incorreto", value: 2, color: "var(--turquoise)" },
];

const recent = [
  { bl: "MSCUOX123456", nav: "MSC BEATRICE", itens: 3, div: 1, falt: 1, status: "Concluído" },
  { bl: "MAEU998877", nav: "MAERSK KOWLOON", itens: 2, div: 1, falt: 0, status: "Concluído" },
  { bl: "HLCU556677", nav: "HAMBURG BAY", itens: 3, div: 0, falt: 0, status: "Concluído" },
  { bl: "COSU441122", nav: "COSCO PACIFIC", itens: 5, div: 2, falt: 1, status: "Em análise" },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Visão geral · Últimos 30 dias
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            Dashboard executivo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Redução do tempo de conferência manual e qualidade da automação Make + Gemini.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/app/base"><FileSearch className="mr-2 h-4 w-4" />Base de referência</Link>
          </Button>
          <Button className="bg-navy text-white hover:bg-navy-deep" asChild>
            <Link to="/app/conferencia">
              Nova conferência <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={<Timer className="h-4 w-4" />}
          label="Tempo médio de conferência"
          value="4m 12s"
          delta="-91%"
          trend="down"
          hint="vs. 46 min no processo manual"
          accent="turquoise"
        />
        <Kpi
          icon={<ClipboardCheck className="h-4 w-4" />}
          label="BLs conferidos no mês"
          value="1.284"
          delta="+18%"
          trend="up"
          hint="+196 vs. mês anterior"
          accent="navy"
        />
        <Kpi
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Divergências identificadas"
          value="207"
          delta="-12%"
          trend="down"
          hint="Automação corrige antes do embarque"
          accent="warning"
        />
        <Kpi
          icon={<PackageX className="h-4 w-4" />}
          label="Itens faltantes evitados"
          value="63"
          delta="-24%"
          trend="down"
          hint="Alertas antes da saída do pátio"
          accent="destructive"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 shadow-elev">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Redução do tempo de conferência</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Minutos por manifesto · Manual vs. SLAM (Make + Gemini)
              </p>
            </div>
            <Badge className="bg-success text-success-foreground">
              <TrendingDown className="mr-1 h-3 w-3" /> -89% no ano
            </Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gManual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSlam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--turquoise)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--turquoise)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="manual" stroke="var(--destructive)" fill="url(#gManual)" strokeWidth={2} name="Manual" />
                <Area type="monotone" dataKey="slam" stroke="var(--turquoise)" fill="url(#gSlam)" strokeWidth={2.5} name="SLAM" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-elev">
          <CardHeader>
            <CardTitle className="text-base">Distribuição de status</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Últimos 500 itens conferidos
            </p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donut}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  stroke="var(--background)"
                  strokeWidth={2}
                >
                  {donut.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {donut.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-semibold text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 shadow-elev">
          <CardHeader>
            <CardTitle className="text-base">Volume diário de manifestos</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              BLs processados por dia · semana corrente
            </p>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="var(--navy)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-elev">
          <CardHeader>
            <CardTitle className="text-base">Como o operador usa o SLAM</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Passo a passo dentro do sistema
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              "Envia o PDF do manifesto (BL) na tela de Conferência",
              "IA extrai itens automaticamente via Make + Gemini",
              "SLAM compara com a base de referência (Google Sheets)",
              "Dashboard sinaliza conformes, divergentes e faltantes",
              "Relatório final é gerado para o conferente e a operação",
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white">
                  {i + 1}
                </div>
                <div className="text-foreground/90">{s}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent */}
      <Card className="shadow-elev">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Conferências recentes</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Últimos manifestos processados pela automação
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/conferencia">Abrir nova <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left">BL</th>
                <th className="px-6 py-3 text-left">Navio</th>
                <th className="px-6 py-3 text-right">Itens</th>
                <th className="px-6 py-3 text-right">Divergentes</th>
                <th className="px-6 py-3 text-right">Faltantes</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.bl} className="border-t border-border">
                  <td className="px-6 py-3 font-mono text-xs font-semibold">{r.bl}</td>
                  <td className="px-6 py-3">{r.nav}</td>
                  <td className="px-6 py-3 text-right">{r.itens}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={r.div ? "font-semibold text-warning" : ""}>{r.div}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className={r.falt ? "font-semibold text-destructive" : ""}>{r.falt}</span>
                  </td>
                  <td className="px-6 py-3">
                    <Badge
                      variant="outline"
                      className={
                        r.status === "Concluído"
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-warning/30 bg-warning/10 text-warning"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  delta,
  trend,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  hint: string;
  accent: "navy" | "turquoise" | "warning" | "destructive";
}) {
  const bg = {
    navy: "bg-navy/10 text-navy",
    turquoise: "bg-turquoise/20 text-navy",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }[accent];
  const badge =
    trend === "down"
      ? "bg-success/10 text-success border-success/20"
      : "bg-turquoise/15 text-navy border-turquoise/30";
  return (
    <Card className="shadow-elev">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
            {icon}
          </div>
          <Badge variant="outline" className={badge}>{delta}</Badge>
        </div>
        <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        <div className="mt-1 text-sm font-medium text-foreground/80">{label}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}

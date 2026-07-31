import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, ExternalLink, RefreshCcw, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { REFERENCE_BASE, fetchReferenceData, type ReferenceItem } from "@/lib/reference-data";

export const Route = createFileRoute("/app/base")({
  component: Base,
  head: () => ({
    meta: [
      { title: "Base de referência · SLAM" },
      { name: "description", content: "Base de referência interna espelhada do Google Sheets." },
    ],
  }),
});

function Base() {
  const [q, setQ] = useState("");
  const [referenceData, setReferenceData] = useState<ReferenceItem[]>(REFERENCE_BASE);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced");

  const rows = useMemo(
    () =>
      referenceData.filter((r) =>
        [r.bl, r.container, r.descricao, r.categoria].some((v) =>
          v.toLowerCase().includes(q.toLowerCase()),
        ),
      ),
    [q, referenceData],
  );

  const handleSync = async () => {
    setLoading(true);
    setSyncStatus("syncing");
    try {
      const data = await fetchReferenceData();
      setReferenceData(data);
      setSyncStatus("synced");
    } catch (error) {
      console.error("Error syncing reference data:", error);
      setSyncStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSync();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Etapa 2 · Base de referência
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            Sistema interno · Google Sheets
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Representação simplificada da base de referência usada pela comparação automática.
            Cada linha é a "verdade" que o SLAM confronta com o BL extraído pela IA.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className={
              syncStatus === "synced" ? "border-success/30 bg-success/10 text-success" : syncStatus === "syncing" ? "border-warning/30 bg-warning/10 text-warning" : "border-destructive/30 bg-destructive/10 text-destructive"
            }
          >
            {syncStatus === "syncing" && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
            {syncStatus === "syncing" && <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />}
            {syncStatus === "synced" && <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-success" />}
            {syncStatus === "synced" && "Sincronizado"}
            {syncStatus === "syncing" && "Sincronizando..."}
            {syncStatus === "error" && "Erro na sincronização"}
          </Badge>
          <Button variant="outline" onClick={handleSync} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            Sincronizar
          </Button>
          <Button className="bg-navy text-white hover:bg-navy-deep" asChild>
            <a
              href="https://docs.google.com/spreadsheets/d/1MNrzFpldTGaYYn31XnbH_-2YGddmqIgenwZDD6oj3dE/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Abrir no Sheets
            </a>
          </Button>
        </div>
      </div>

      <Card className="shadow-elev">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4 text-turquoise" />
            {referenceData.length} itens catalogados
          </CardTitle>
          <div className="relative w-72 max-w-full">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por BL, contêiner, categoria…"
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left">BL</th>
                <th className="px-6 py-3 text-left">Item</th>
                <th className="px-6 py-3 text-left">Contêiner</th>
                <th className="px-6 py-3 text-left">Descrição</th>
                <th className="px-6 py-3 text-left">Categoria</th>
                <th className="px-6 py-3 text-right">Qtd</th>
                <th className="px-6 py-3 text-left">Un</th>
                <th className="px-6 py-3 text-right">Peso (kg)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.bl}-${r.itemNr}`} className="border-t border-border">
                  <td className="px-6 py-3 font-mono text-xs font-semibold">{r.bl}</td>
                  <td className="px-6 py-3 text-xs">{r.itemNr}</td>
                  <td className="px-6 py-3 font-mono text-xs">{r.container}</td>
                  <td className="px-6 py-3">{r.descricao}</td>
                  <td className="px-6 py-3 text-xs text-muted-foreground">{r.categoria}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{r.quantidade.toLocaleString("pt-BR")}</td>
                  <td className="px-6 py-3">{r.unidade}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{r.pesoKg.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    Nenhum item encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
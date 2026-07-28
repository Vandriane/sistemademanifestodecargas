import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/app/relatorios")({
  component: Relatorios,
  head: () => ({
    meta: [
      { title: "Relatórios · SLAM" },
      { name: "description", content: "Relatórios executivos de conferência." },
    ],
  }),
});

const reports = [
  { id: "R-2026-0728", nav: "WS BAHIA", bls: 12, div: 4, falt: 1, gerado: "28/07 08:12", status: "Assinado" },
  { id: "R-2026-0727", nav: "WS ATLÂNTICO", bls: 9, div: 2, falt: 0, gerado: "27/07 19:44", status: "Assinado" },
  { id: "R-2026-0727", nav: "WS SALVADOR", bls: 6, div: 1, falt: 0, gerado: "27/07 14:03", status: "Pendente" },
  { id: "R-2026-0726", nav: "WS RECÔNCAVO", bls: 15, div: 6, falt: 2, gerado: "26/07 22:31", status: "Assinado" },
];

function Relatorios() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Etapa 3 · Relatórios executivos
        </div>
        <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
          Relatórios de conferência
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Documentos gerados automaticamente após cada análise. Prontos para auditoria interna,
          armadores e receita.
        </p>
      </div>

      <Card className="shadow-elev">
        <CardHeader>
          <CardTitle className="text-base">Últimos relatórios</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left">Relatório</th>
                <th className="px-6 py-3 text-left">Navio</th>
                <th className="px-6 py-3 text-right">BLs</th>
                <th className="px-6 py-3 text-right">Divergências</th>
                <th className="px-6 py-3 text-right">Faltantes</th>
                <th className="px-6 py-3 text-left">Gerado</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-6 py-3 font-mono text-xs font-semibold flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-turquoise" /> {r.id}
                  </td>
                  <td className="px-6 py-3">{r.nav}</td>
                  <td className="px-6 py-3 text-right">{r.bls}</td>
                  <td className="px-6 py-3 text-right text-warning font-semibold">{r.div}</td>
                  <td className="px-6 py-3 text-right text-destructive font-semibold">{r.falt}</td>
                  <td className="px-6 py-3 text-muted-foreground">{r.gerado}</td>
                  <td className="px-6 py-3">
                    <Badge
                      variant="outline"
                      className={
                        r.status === "Assinado"
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-warning/40 bg-warning/15 text-warning"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button size="sm" variant="outline">
                      <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
                    </Button>
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

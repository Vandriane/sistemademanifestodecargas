import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Anchor,
  LayoutDashboard,
  FileSearch,
  Database,
  BarChart3,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { getSession, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { title: "SLAM · Console de Conferência" },
      { name: "description", content: "Console operacional para conferência de manifestos de carga." },
    ],
  }),
});

const NAV = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/conferencia", label: "Conferência de BL", icon: FileSearch },
  { to: "/app/base", label: "Base de referência", icon: Database },
  { to: "/app/relatorios", label: "Relatórios", icon: BarChart3 },
] as const;

function AppShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) navigate({ to: "/" });
    else setEmail(s.email);
  }, [navigate]);

  const handleLogout = () => {
    signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-turquoise/20 ring-1 ring-turquoise/40">
            <Anchor className="h-4 w-4 text-turquoise" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">SLAM</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50">Port Ops</div>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-sidebar-accent text-white shadow-inner"
                    : "text-white/70 hover:bg-sidebar-accent/60 hover:text-white",
                )}
              >
                <n.icon className={cn("h-4 w-4", active && "text-turquoise")} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-sidebar-accent/60 p-3 text-xs text-white/70">
          <div className="font-semibold text-white">Integração ativa</div>
          <div className="mt-0.5">Make.com · Gemini · Google Sheets</div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-turquoise" />
            Webhook conectado
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Sistema de Leitura Automática de Manifesto de Cargas
            </div>
            <div className="truncate text-sm font-semibold text-foreground">
              Console operacional · Terminal Rio Grande
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
            </Button>
            <div className="hidden text-right text-xs md:block">
              <div className="font-semibold text-foreground">{email || "Operador"}</div>
              <div className="text-muted-foreground">Conferente sênior</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
              {(email || "OP").slice(0, 2).toUpperCase()}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>

        <footer className="border-t border-border bg-background/70 px-4 py-4 text-center text-xs text-muted-foreground lg:px-8">
          Projeto desenvolvido para fins educativos na KODIE Academy.
        </footer>
      </div>
    </div>
  );
}

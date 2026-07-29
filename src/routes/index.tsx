import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Anchor,
  ShieldCheck,
  Sparkles,
  FileText,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getSession, signIn } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "SLAM · Leitura Automática de Manifestos" },
      {
        name: "description",
        content:
          "Envie o BL, deixe a IA extrair os itens e veja na hora o que está conforme, divergente ou faltante.",
      },
    ],
  }),
});

function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("operador@wilsonsons.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) navigate({ to: "/app/dashboard" });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Informe um e-mail válido.");
    if (password.length !== 8)
      return toast.error("A senha deve conter exatamente 8 dígitos.");
    setLoading(true);
    setTimeout(() => {
      signIn(email);
      toast.success("Acesso liberado. Bem-vindo ao SLAM.");
      navigate({ to: "/app/dashboard" });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero text-white">
      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-turquoise/20 ring-1 ring-turquoise/40">
            <Anchor className="h-5 w-5 text-turquoise" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">SLAM</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
              Wilson Sons · Port Ops
            </div>
          </div>
        </div>
        <Link
          to="#login"
          hash="login"
          className="rounded-md bg-turquoise px-4 py-2 text-sm font-semibold text-navy-deep transition hover:bg-turquoise-soft"
        >
          Fazer Login
        </Link>
      </header>

      {/* Hero + Login */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pt-6 pb-20 lg:grid-cols-[1.15fr_1fr] lg:pt-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-turquoise-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Da leitura ao diagnóstico em segundos
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Sistema de Leitura Automática de
            <span className="text-gradient-brand"> Manifesto de Cargas</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Envie o BL, deixe a IA extrair os itens e veja na hora o que está{" "}
            <span className="font-semibold text-white">conforme</span>, o que{" "}
            <span className="font-semibold text-white">divergiu</span> e o que{" "}
            <span className="font-semibold text-white">ficou faltando</span> em relação ao
            sistema interno.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: FileText, title: "Upload BL", desc: "PDF, imagem ou planilha" },
              { icon: Sparkles, title: "IA Gemini", desc: "Extração automática de itens" },
              { icon: ShieldCheck, title: "Diagnóstico", desc: "Divergências em tempo real" },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur transition hover:border-turquoise/40 hover:bg-white/[0.07]"
              >
                <f.icon className="h-5 w-5 text-turquoise" />
                <div className="mt-3 text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-white/60">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Login card */}
        <div id="login" className="lg:pt-4">
          <div className="rounded-2xl border border-white/10 bg-white p-8 text-foreground shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Acesso restrito
            </div>
            <h2 className="mt-2 font-display text-2xl font-semibold">Acesso ao sistema</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operador@wilsonsons.com"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Senha (8 dígitos)</Label>
                <Input
                  id="password"
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <div className="flex items-center text-[11px] text-muted-foreground">
                  <span>{password.length}/8 dígitos</span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-navy text-white hover:bg-navy-deep"
              >
                {loading ? "Autenticando…" : "Entrar no sistema"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5 text-xs text-secondary-foreground">
              <ShieldCheck className="h-4 w-4 text-turquoise" />
              Ambiente de homologação · dados fictícios para hackathon
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-navy-deep/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/60 md:flex-row">
          <span>© {new Date().getFullYear()} SLAM · Wilson Sons Port Ops</span>
          <span>Projeto desenvolvido para fins educativos na KODIE Academy.</span>
        </div>
      </footer>
    </div>
  );
}

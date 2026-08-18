import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Linkedin, Users, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/linus-torvalds")({
  component: GrupoLinusTorvalds,
  head: () => ({
    meta: [
      { title: "Equipe Linus Torvalds · SLAM" },
      { name: "description", content: "Membros do grupo Linus Torvalds - KODIE Academy" },
    ],
  }),
});

type Membro = {
  nome: string;
  profissao: string;
  foto: string;
  linkedin: string;
  github?: string;
  email?: string;
};

const MEMBROS: Membro[] = [
  {
    nome: "Douglas Araujo",
    profissao: "Desenvolvedor Full Stack",
    foto: "https://github.com/dgarauj04.png",
    linkedin: "https://www.linkedin.com/in/douglasaraujo-daraujodb-dev",
    github: "https://github.com/dgarauj04",
  },
  {
    nome: "Thiago Simas",
    profissao: "Desenvolvedor Full Stack",
    foto: "https://github.com/thiagosimaswebdev.png",
    linkedin: "https://www.linkedin.com/in/thiago-simas-4726b166/",
    github: "https://github.com/thiagosimaswebdev",
  },
  {
    nome: "Vandriane Alves",
    profissao: "Desenvolvedora Full Stack",
    foto: "https://github.com/Vandriane.png",
    linkedin: "https://www.linkedin.com/in/vandriane-alves/",
    github: "https://github.com/Vandriane",
  },
];

function GrupoLinusTorvalds() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/app/dashboard"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao console
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Equipe Linus Torvalds
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Grupo responsável pelo desenvolvimento do SLAM · KODIE Academy
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5 self-start">
          <Users className="h-3.5 w-3.5" />
          {MEMBROS.length} membros
        </Badge>
      </div>

      <div className="bg-gradient-hero relative overflow-hidden rounded-2xl p-6 text-white shadow-elev">
        <div className="relative z-10 max-w-2xl">
          <div className="text-[11px] font-medium uppercase tracking-widest text-turquoise">
            KODIE Academy · Projeto educativo
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Linus Torvalds
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Equipe multidisciplinar responsável pela concepção, desenvolvimento
            e integração do Sistema de Leitura Automática de Manifesto de Cargas
            (SLAM), operando no Tecon Salvador com webhooks via Make.com e IA Gemini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MEMBROS.map((m) => (
          <Card
            key={m.nome}
            className="group overflow-hidden border-border/60 transition-shadow hover:shadow-elev"
          >
            <div className="bg-gradient-navy h-24 w-full" />

            <CardContent className="-mt-12 flex flex-col items-center px-6 pb-6 text-center">
              <img
                src={m.foto}
                alt={m.nome}
                className="h-24 w-24 rounded-full border-4 border-background object-cover shadow-elev"
              />
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                {m.nome}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{m.profissao}</p>

              <div className="mt-4 flex items-center gap-2">
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0A66C2] px-3 text-xs font-medium text-white transition hover:opacity-90"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>

                {m.github && (
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-muted"
                    title="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}

                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-muted"
                    title="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button asChild variant="outline">
          <Link to="/app/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
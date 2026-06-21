import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

export function HomeLanding() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Link href="/" className="font-heading text-lg font-bold tracking-tight">
            Cidade das Plásticas
          </Link>

          <Link
            href="/premium"
            className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            <span aria-hidden="true">♛</span>
            Premium
          </Link>
        </div>
      </header>

      <section className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-6xl px-4 pb-24 pt-8 lg:px-6 lg:pb-10 lg:pt-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
          <div className="space-y-8">
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-primary text-primary-foreground shadow-sm">
                  <span className="font-heading text-lg font-bold">UBÁ</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  Plataforma premium
                </p>

                <h1 className="font-heading text-4xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl">
                  Cidade das Plásticas
                </h1>

                <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground lg:mx-0 lg:text-[0.98rem]">
                  Uma plataforma centralizando informações, conteúdos e perfis de
                  profissionais da área de cirurgia plástica e estética em Ubá —
                  com navegação mais limpa, moderna e organizada.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Conteúdos
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/80">
                  Informações selecionadas para orientar a jornada do paciente.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Profissionais
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/80">
                  Perfis organizados, com acesso rápido ao contato.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Premium
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/80">
                  Áreas exclusivas e experiência aprimorada para assinantes.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 sm:flex-1"
                style={{ color: "#fff" }}
              >
                Criar conta grátis
              </Link>

              <Link
                href="/feed"
                className="flex h-12 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-bold shadow-sm transition hover:bg-muted sm:flex-1"
              >
                Ver conteúdos do feed
              </Link>

              <Link
                href="/premium"
                className="flex h-12 items-center justify-center rounded-xl bg-accent px-4 text-sm font-bold text-accent-foreground shadow-sm transition hover:opacity-90 sm:flex-1"
              >
                Conhecer Premium
              </Link>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    O que você encontra aqui?
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">
                    Uma vitrine mais organizada
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                  Novo
                </span>
              </div>

              <div className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>• Conteúdos organizados sobre procedimentos.</p>
                <p>• Perfis de profissionais cadastrados.</p>
                <p>• Acesso premium para áreas exclusivas.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Feed
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/80">
                  Publicações e destaques em uma leitura mais confortável.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Guia
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/80">
                  Conteúdo educativo para orientar decisões com mais clareza.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Segurança
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground/80">
                  Acesso protegido e navegação consistente entre as telas.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

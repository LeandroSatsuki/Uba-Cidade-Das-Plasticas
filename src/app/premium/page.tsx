import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQeVf2TiglybZqaHXak000";
const PREMIUM_PRICE = "R$ 29,90";
const PREMIUM_PERIOD = "/mês";

const benefits = [
  "Acesso completo aos conteúdos premium",
  "Informações organizadas sobre procedimentos",
  "Contato facilitado com profissionais cadastrados",
  "Experiência sem bloqueios nas áreas exclusivas",
];

const steps = [
  "Clique em Assinar Premium.",
  "Finalize o pagamento na página segura da Stripe.",
  "O acesso premium será liberado no seu cadastro.",
];

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 lg:px-6">
          <Link href="/feed" className="font-heading text-lg font-bold tracking-tight">
            Cidade das Plásticas
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/feed"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
            >
              Voltar
            </Link>
            <Link
              href="/premium"
              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
            >
              <span aria-hidden="true">♛</span>
              Premium
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-8 lg:px-6 lg:pb-12 lg:pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-4">
                  <span className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                    Plano Premium
                  </span>

                  <div className="space-y-3">
                    <h1 className="font-heading text-4xl font-bold leading-tight text-balance sm:text-5xl">
                      Desbloqueie o acesso completo.
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                      Tenha acesso às áreas exclusivas da plataforma Cidade das Plásticas
                      com uma experiência mais organizada, limpa e focada no conteúdo.
                    </p>
                  </div>
                </div>

                <div className="w-full rounded-2xl border border-border bg-accent/30 p-4 shadow-sm sm:w-44 sm:text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Investimento
                  </p>
                  <div className="mt-2 flex items-end gap-1 sm:justify-center">
                    <span className="font-heading text-3xl font-bold">{PREMIUM_PRICE}</span>
                    <span className="pb-1 text-sm font-medium text-muted-foreground">
                      {PREMIUM_PERIOD}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Cobrança recorrente mensal.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Conteúdo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/80">
                    Áreas exclusivas e selecionadas.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Navegação
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/80">
                    Acesso mais rápido e sem ruído visual.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Profissionais
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/80">
                    Contato facilitado com perfis cadastrados.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={STRIPE_PAYMENT_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold !text-white shadow-sm transition hover:opacity-90 sm:flex-1"
                >
                  Assinar por {PREMIUM_PRICE}
                  {PREMIUM_PERIOD}
                </a>

                <Link
                  href="/feed"
                  className="flex h-12 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-bold shadow-sm transition hover:bg-muted sm:flex-1"
                >
                  Voltar ao feed
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      ✓
                    </span>
                    <p className="text-sm leading-6 text-foreground/85">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Como funciona?
              </p>

              <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-foreground">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[2rem] border border-border bg-accent/20 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Experiência premium
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground/80">
                A assinatura foi apresentada em um bloco mais editorial para combinar
                com o restante da plataforma, sem perder destaque para a ação principal.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Destaques
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>• Conteúdos premium em um layout mais limpo.</p>
                <p>• Navegação consistente com feed, perfil e admin.</p>
                <p>• CTA principal sempre visível e fácil de concluir.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

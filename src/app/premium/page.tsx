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

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Link href="/feed" className="font-heading text-lg font-bold tracking-tight">
            Cidade das Plásticas
          </Link>

          <Link
            href="/premium"
            className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
          >
            <span aria-hidden="true">♛</span>
            Premium
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-8 lg:px-6 lg:pb-12 lg:pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-primary text-primary-foreground shadow-sm">
                    <span className="text-2xl" aria-hidden="true">
                      ♛
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                      Plano Premium
                    </p>
                    <h1 className="mt-2 font-heading text-4xl font-bold leading-tight text-balance">
                      Desbloqueie o acesso completo
                    </h1>
                  </div>
                </div>

                <div className="rounded-2xl bg-accent/40 px-4 py-3 text-center sm:min-w-40">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Investimento
                  </p>
                  <div className="mt-2 flex items-end justify-center gap-1">
                    <span className="font-heading text-3xl font-bold">
                      {PREMIUM_PRICE}
                    </span>
                    <span className="pb-1 text-sm font-medium text-muted-foreground">
                      {PREMIUM_PERIOD}
                    </span>
                  </div>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Tenha acesso às áreas exclusivas da plataforma Cidade das Plásticas
                e acompanhe conteúdos selecionados em um ambiente organizado.
              </p>

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
                    <p className="text-sm leading-6">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="font-heading text-2xl font-semibold">
                Como funciona?
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
                <p>
                  1. Clique em <strong className="text-foreground">Assinar Premium</strong>.
                </p>
                <p>
                  2. Finalize o pagamento na página segura da Stripe.
                </p>
                <p>
                  3. O acesso premium será liberado no seu cadastro.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-accent/20 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Experiência premium
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground/80">
                A assinatura foi apresentada de forma mais limpa para combinar com
                a navegação do resto da plataforma, sem perder destaque para a ação
                principal.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

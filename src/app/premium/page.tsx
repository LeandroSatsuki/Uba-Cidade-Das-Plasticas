import Link from "next/link";

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
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
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

      <section className="mx-auto max-w-lg px-6 pb-24 pt-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-primary text-primary-foreground shadow-sm">
            <span className="text-2xl" aria-hidden="true">
              ♛
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Plano Premium
          </p>

          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight">
            Desbloqueie o acesso completo
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Tenha acesso às áreas exclusivas da plataforma Cidade das Plásticas
            e acompanhe conteúdos selecionados em um ambiente organizado.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="rounded-2xl bg-accent/40 p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Assinatura Premium
            </p>

            <div className="mt-3 flex items-end justify-center gap-1">
              <span className="font-heading text-4xl font-bold">
                {PREMIUM_PRICE}
              </span>
              <span className="pb-1 text-sm font-medium text-muted-foreground">
                {PREMIUM_PERIOD}
              </span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Pagamento seguro via Stripe.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  ✓
                </span>
                <p className="text-sm leading-6">{benefit}</p>
              </div>
            ))}
          </div>

          <a
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          >
            Assinar por {PREMIUM_PRICE}
            {PREMIUM_PERIOD}
          </a>

          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            Após o pagamento, seu acesso será vinculado ao cadastro usado na
            plataforma.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-semibold">
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
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3 text-xs text-muted-foreground">
          <Link href="/" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">⌂</span>
            Início
          </Link>
          <Link href="/feed" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">□</span>
            Guia
          </Link>
          <Link href="/login" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">♙</span>
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  );
}

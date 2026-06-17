import Link from "next/link";

const premiumHighlights = [
  "Conteúdos exclusivos e mais completos",
  "Acesso facilitado aos profissionais",
  "Experiência sem bloqueios no feed",
];

type PremiumPromoBannerProps = {
  href?: string;
};

export function PremiumPromoBanner({ href = "/premium" }: PremiumPromoBannerProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/30 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            Plano Premium
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold leading-tight sm:text-[2rem]">
              Desbloqueie a experiência completa da plataforma
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              Acesse conteúdos premium, navegue com mais profundidade e destaque-se com uma experiência mais organizada.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {premiumHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-primary/15 bg-background/80 p-4 sm:min-w-[220px] sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Oferta especial
          </p>
          <p className="font-heading text-3xl font-bold leading-none text-foreground">
            Premium
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Clique para ver o plano e seguir para a contratação.
          </p>
          <span className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition group-hover:opacity-90">
            Ver plano premium
          </span>
        </div>
      </div>
    </Link>
  );
}

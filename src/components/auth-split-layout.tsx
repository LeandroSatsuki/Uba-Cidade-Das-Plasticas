import type { ReactNode } from "react";

type AuthSplitLayoutProps = {
  children: ReactNode;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroImageAlt: string;
};

export function AuthSplitLayout({
  children,
  heroEyebrow,
  heroTitle,
  heroDescription,
  heroImageUrl,
  heroImageAlt,
}: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f6f1ea] text-foreground lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <aside
        className="relative hidden min-h-screen overflow-hidden lg:block"
        aria-label={heroImageAlt}
        role="img"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/18 to-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent_26%)]" />

        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <div className="max-w-lg space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-white/75">
              {heroEyebrow}
            </p>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-white drop-shadow-sm">
              {heroTitle}
            </h1>
            <p className="max-w-md text-sm leading-6 text-white/80">
              {heroDescription}
            </p>
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-8 lg:px-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}

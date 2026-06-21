import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { AppShell } from "@/components/app-shell";
import { ProfilePanel } from "@/components/profile-panel";
import { loadProfilePageData } from "@/lib/content-feed";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const { viewer, profile } = await loadProfilePageData();

  if (!viewer.authUserId) {
    redirect("/entrar?next=/perfil");
  }

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Minha conta
          </p>
          <h1 className="font-heading text-3xl font-bold leading-tight">
            Seu perfil
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Complete seus dados para personalizar sua experiência e melhorar as recomendações.
          </p>

          {profile?.role === "admin" ? (
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-muted"
            >
              Área administrativa
            </Link>
          ) : null}

          <div className="pt-4">
            <ProfilePanel profile={profile} authEmail={viewer.authEmail} />
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Conta
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>• Atualize seus dados para ter uma navegação mais personalizada.</p>
              <p>• Seu perfil influencia recomendações e áreas destacadas.</p>
              <p>• Se for admin, você também acessa o painel administrativo.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Navegação
            </p>
            <div className="mt-4 grid gap-2">
              <Link
                href="/feed"
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
              >
                Ir para o feed
              </Link>
              <Link
                href="/premium"
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-muted"
              >
                Ver premium
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <BottomNav />
    </AppShell>
  );
}

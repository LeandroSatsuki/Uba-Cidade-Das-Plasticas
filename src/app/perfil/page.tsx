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

  const premiumStatusLabels: Record<NonNullable<typeof profile>['premium_status'], string> = {
    none: "Sem assinatura",
    active: "Ativo",
    expired: "Expirado",
    canceled: "Cancelado",
    past_due: "Pagamento pendente",
  };

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Minha conta
            </p>
            <div className="max-w-3xl space-y-3">
              <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
                Seu perfil
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Complete seus dados para personalizar sua experiência, organizar seu acesso e deixar a navegação mais útil.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                E-mail
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                {profile?.email ?? viewer.authEmail ?? "Não disponível"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Acesso
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                {premiumStatusLabels[profile?.premium_status ?? "none"]}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Papel
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                {profile?.role === "admin" ? "Administrador" : "Usuário"}
              </p>
            </div>
          </div>

          {profile?.role === "admin" ? (
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-muted"
            >
              Área administrativa
            </Link>
          ) : null}

          <div className="pt-2">
            <ProfilePanel profile={profile} authEmail={viewer.authEmail} />
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Conta
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>• Atualize seus dados para deixar o perfil mais completo.</p>
              <p>• Sua foto e localização ajudam a personalizar a experiência.</p>
              <p>• Interesses cadastrados melhoram as recomendações do app.</p>
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

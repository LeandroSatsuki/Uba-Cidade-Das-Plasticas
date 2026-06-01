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
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Minha conta
        </p>
        <h1 className="font-heading text-3xl font-bold leading-tight">
          Seu perfil
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Complete seus dados para personalizar sua experiência e melhorar as recomendações.
        </p>
      </section>

      <section className="mt-8">
        {profile?.role === "admin" ? (
          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-muted"
          >
            Área administrativa
          </Link>
        ) : null}

        <ProfilePanel
          profile={profile}
          authEmail={viewer.authEmail}
        />
      </section>

      <BottomNav />
    </AppShell>
  );
}

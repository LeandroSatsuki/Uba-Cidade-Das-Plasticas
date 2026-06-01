import Link from "next/link";
import { redirect } from "next/navigation";
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
        <ProfilePanel
          profile={profile}
          authEmail={viewer.authEmail}
        />
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3 text-xs text-muted-foreground">
          <Link href="/" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">⌂</span>
            Início
          </Link>
          <Link href="/feed" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">□</span>
            Feed
          </Link>
          <Link href="/perfil" className="flex flex-col items-center justify-center gap-1 text-foreground">
            <span className="text-xl">♙</span>
            Perfil
          </Link>
        </div>
      </nav>
    </AppShell>
  );
}

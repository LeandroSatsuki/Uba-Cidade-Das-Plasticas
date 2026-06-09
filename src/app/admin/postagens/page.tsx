import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { AppShell } from "@/components/app-shell";
import { AdminSectionTabs } from "@/components/admin-section-tabs";
import { AdminPostagensPanel } from "@/components/admin-postagens-panel";
import { loadAdminPostagensData } from "@/lib/content-feed";

export const dynamic = "force-dynamic";

export default async function AdminPostagensPage() {
  const { viewer, professionals, contents } = await loadAdminPostagensData();
  const panelKey = contents.map((content) => `${content.id}:${content.updated_at}`).join("|");

  if (!viewer.profile) {
    redirect("/entrar?next=/admin/postagens");
  }

  if (viewer.profile.role !== "admin") {
    redirect("/feed");
  }

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Administração
          </p>
          <h1 className="font-heading text-3xl font-bold leading-tight">
            Conteúdos
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Publique, edite e organize o feed com um fluxo visual, limpo e sem sair da tela.
          </p>
        </div>

        <AdminSectionTabs currentPath="/admin/postagens" />
      </section>

      <section className="mt-8">
        <AdminPostagensPanel
          key={panelKey}
          professionals={professionals}
          contents={contents}
        />
      </section>

      <BottomNav />
    </AppShell>
  );
}

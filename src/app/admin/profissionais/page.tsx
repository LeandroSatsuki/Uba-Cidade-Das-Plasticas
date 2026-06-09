import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { AppShell } from "@/components/app-shell";
import { AdminSectionTabs } from "@/components/admin-section-tabs";
import { AdminProfessionalsPanel } from "@/components/admin-profissionais-panel";
import { loadAdminProfessionalsData } from "@/lib/content-feed";

export const dynamic = "force-dynamic";

export default async function AdminProfissionaisPage() {
  const { viewer, professionals } = await loadAdminProfessionalsData();

  if (!viewer.profile) {
    redirect("/entrar?next=/admin/profissionais");
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
            Profissionais
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Cadastre, edite e organize os perfis que aparecem no feed e nas páginas públicas.
          </p>
        </div>

        <AdminSectionTabs currentPath="/admin/profissionais" />
      </section>

      <section className="mt-8">
        <AdminProfessionalsPanel professionals={professionals} />
      </section>

      <BottomNav />
    </AppShell>
  );
}

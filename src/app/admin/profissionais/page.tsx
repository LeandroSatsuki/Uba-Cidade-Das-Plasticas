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

  const totalProfessionals = professionals.length;
  const activeProfessionals = professionals.filter((professional) => professional.ativo).length;
  const withPhotoProfessionals = professionals.filter((professional) => professional.foto_perfil_url).length;

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_320px]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Administração
            </p>
            <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
              Profissionais
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Cadastre, edite e organize os perfis que aparecem no feed e nas páginas públicas.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Total
              </p>
              <p className="mt-2 font-heading text-2xl font-bold">{totalProfessionals}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Ativos
              </p>
              <p className="mt-2 font-heading text-2xl font-bold">{activeProfessionals}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Com foto
              </p>
              <p className="mt-2 font-heading text-2xl font-bold">{withPhotoProfessionals}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <AdminSectionTabs currentPath="/admin/profissionais" />

          <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Dicas rápidas
            </p>
            <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>• O identificador da URL abre a página pública do perfil.</p>
              <p>• Se deixar vazio, o sistema tenta gerar automaticamente.</p>
              <p>• A prévia abaixo ajuda a validar foto e descrição antes de salvar.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-8">
        <AdminProfessionalsPanel professionals={professionals} />
      </section>

      <BottomNav />
    </AppShell>
  );
}

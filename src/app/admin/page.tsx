import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AdminSectionTabs } from "@/components/admin-section-tabs";
import { getCurrentViewerProfile } from "@/lib/current-profile";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const viewer = await getCurrentViewerProfile();

  if (!viewer.authUserId) {
    redirect("/entrar?next=/admin");
  }

  if (viewer.profile?.role !== "admin") {
    redirect("/feed");
  }

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Administração
            </p>
            <h1 className="font-heading text-3xl font-bold leading-tight">Painel admin</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Escolha o módulo que você quer usar. A ideia aqui é manter tudo simples e direto.
            </p>
          </div>

          <AdminSectionTabs currentPath="/admin" />

          <div className="grid gap-4 lg:grid-cols-2">
            <Link
              href="/admin/postagens"
              className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Conteúdo
              </p>
              <h2 className="mt-2 text-xl font-semibold">Postagens</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Criar, editar, desativar e excluir publicações do feed e stories.
              </p>
            </Link>

            <Link
              href="/admin/profissionais"
              className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Cadastro
              </p>
              <h2 className="mt-2 text-xl font-semibold">Profissionais</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Cadastrar, editar e organizar os perfis que alimentam o app.
              </p>
            </Link>
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Visão geral
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>• Mantenha os conteúdos limpos e objetivos.</p>
              <p>• Use profissionais como fonte principal do feed.</p>
              <p>• Ajuste postagens antes de publicar no app.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Atalho
            </p>
            <Link
              href="/feed"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-border px-4 text-sm font-semibold transition hover:bg-muted"
            >
              Ver feed público
            </Link>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

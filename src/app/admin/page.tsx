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
      <section className="space-y-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Administração
          </p>
          <h1 className="font-heading text-3xl font-bold leading-tight">Painel admin</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Escolha o módulo que você quer usar. A ideia aqui é manter tudo simples e direto.
          </p>
        </div>

        <AdminSectionTabs currentPath="/admin" />
      </section>

      <section className="mt-8 grid gap-4">
        <Link
          href="/admin/postagens"
          className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:bg-muted"
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
          className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:bg-muted"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Cadastro
          </p>
          <h2 className="mt-2 text-xl font-semibold">Profissionais</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Cadastrar, editar e organizar os perfis que alimentam o app.
          </p>
        </Link>
      </section>
    </AppShell>
  );
}

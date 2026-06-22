import { AppShell } from "@/components/app-shell";
import {
  base44Contents,
  base44MigrationSummary,
  base44Professionals,
  base44Users,
} from "@/lib/base44-data";

const migrationSummaryCards = Object.entries(base44MigrationSummary);

export default function MigrationPreviewPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_320px]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Migração Base44
            </p>
            <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
              Prévia dos dados exportados
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Esta página é temporária e serve para validar se os arquivos JSON exportados da Base44 estão sendo lidos corretamente pelo novo projeto Next.js.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Status
            </p>
            <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>• Estrutura de dados importada com sucesso.</p>
              <p>• Conteúdos, profissionais e usuários estão disponíveis abaixo.</p>
              <p>• Página útil para checar consistência antes de remover a migração.</p>
            </div>
          </div>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {migrationSummaryCards.map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{key}</p>
              <p className="mt-2 font-heading text-3xl font-bold">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Profissionais</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {base44Professionals.map((professional) => (
                  <article
                    key={professional.base44_id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-xl font-semibold">
                          {professional.nome}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {professional.especialidades}
                        </p>
                      </div>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {professional.crm ? "CRM" : "Sem CRM"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                      <p>{professional.crm}</p>
                      <p>WhatsApp: {professional.whatsapp || "Não informado"}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-semibold">Conteúdos</h2>
              <div className="mt-4 space-y-4">
                {base44Contents.map((content) => (
                  <article
                    key={content.base44_id}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  >
                    <div className="p-5">
                      <p className="text-sm font-semibold text-muted-foreground">
                        {content.profissional_nome}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6">
                        {content.legenda}
                      </p>
                      <p className="mt-4 break-all text-xs text-muted-foreground">
                        Imagem: {content.imagem_url}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-heading text-xl font-semibold">
                Usuários exportados
              </h2>

              <div className="mt-4 space-y-3">
                {base44Users.map((user) => (
                  <div
                    key={user.base44_id}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Role: {user.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-sm leading-6 text-muted-foreground">
              Esta rota é apenas de apoio técnico. Quando a migração deixar de ser útil,
              ela pode ser removida sem afetar o fluxo principal.
            </div>
          </aside>
        </section>
      </section>
    </AppShell>
  );
}

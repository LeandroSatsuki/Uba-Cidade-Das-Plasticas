import { AppShell } from "@/components/app-shell";
import {
  base44Contents,
  base44MigrationSummary,
  base44Professionals,
  base44Users,
} from "@/lib/base44-data";

export default function MigrationPreviewPage() {
  return (
    <AppShell>
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Migração Base44
        </p>
        <h1 className="font-heading text-3xl font-bold leading-tight">
          Prévia dos dados exportados
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Esta página é temporária e serve apenas para validar se os arquivos
          JSON exportados da Base44 estão sendo lidos corretamente pelo novo
          projeto Next.js.
        </p>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3">
        {Object.entries(base44MigrationSummary).map(([key, value]) => (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-xs text-muted-foreground">{key}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">Profissionais</h2>

        <div className="mt-4 space-y-3">
          {base44Professionals.map((professional) => (
            <article
              key={professional.base44_id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <h3 className="font-heading text-xl font-semibold">
                {professional.nome}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {professional.especialidades}
              </p>
              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <p>{professional.crm}</p>
                <p>WhatsApp: {professional.whatsapp || "Não informado"}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
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
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-semibold">
          Usuários exportados
        </h2>

        <div className="mt-4 space-y-3">
          {base44Users.map((user) => (
            <div
              key={user.base44_id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <p className="font-semibold">{user.full_name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {user.email}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Role: {user.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

import {
  base44Contents,
  base44MigrationSummary,
  base44Professionals,
  base44Users,
} from "@/lib/base44-data";

export default function MigrationPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-10">
        <section>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Migração Base44
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Prévia dos dados exportados
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Esta página é temporária e serve apenas para validar se os arquivos
            JSON exportados da Base44 estão sendo lidos corretamente pelo novo
            projeto Next.js.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Object.entries(base44MigrationSummary).map(([key, value]) => (
            <div
              key={key}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <p className="text-sm text-slate-400">{key}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Profissionais</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {base44Professionals.map((professional) => (
              <article
                key={professional.base44_id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-xl font-semibold">{professional.nome}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  {professional.especialidades}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  {professional.crm}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  WhatsApp: {professional.whatsapp || "Não informado"}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Conteúdos</h2>
          <div className="mt-4 space-y-4">
            {base44Contents.map((content) => (
              <article
                key={content.base44_id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <p className="text-sm font-medium text-slate-400">
                  {content.profissional_nome}
                </p>
                <p className="mt-2 whitespace-pre-line text-slate-200">
                  {content.legenda}
                </p>
                <p className="mt-3 break-all text-xs text-slate-500">
                  Imagem: {content.imagem_url}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Usuários exportados</h2>
          <div className="mt-4 space-y-3">
            {base44Users.map((user) => (
              <div
                key={user.base44_id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
                <p className="mt-1 text-sm text-slate-400">Role: {user.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

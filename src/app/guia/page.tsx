import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

const guideSections = [
  {
    title: "Antes de decidir",
    description:
      "Entenda o que avaliar antes de buscar um procedimento estético ou cirúrgico.",
    items: [
      "Pesquise a formação do profissional",
      "Verifique CRM e registros informados",
      "Evite decisões baseadas apenas em preço",
    ],
  },
  {
    title: "Durante a consulta",
    description:
      "Use a consulta para tirar dúvidas, alinhar expectativas e entender riscos.",
    items: [
      "Pergunte sobre indicação real do procedimento",
      "Converse sobre riscos e recuperação",
      "Peça explicações claras sobre o plano proposto",
    ],
  },
  {
    title: "Segurança",
    description:
      "Procedimentos devem ser avaliados com responsabilidade, individualidade e critério técnico.",
    items: [
      "Confirme o local onde será realizado",
      "Informe histórico de saúde e medicamentos",
      "Desconfie de promessa de resultado garantido",
    ],
  },
  {
    title: "Pós-operatório",
    description:
      "A recuperação faz parte do resultado e precisa seguir orientação profissional.",
    items: [
      "Siga as recomendações recebidas",
      "Respeite o tempo de repouso",
      "Procure atendimento se houver sinais inesperados",
    ],
  },
];

export default function GuiaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link href="/" className="font-heading text-lg font-bold tracking-tight">
            Cidade das Plásticas
          </Link>

          <Link
            href="/premium"
            className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            <span aria-hidden="true">♛</span>
            Premium
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-lg px-6 pb-24 pt-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Guia educativo
          </p>

          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight">
            Informação antes da decisão
          </h1>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Um guia introdutório para ajudar pacientes a entenderem pontos
            importantes antes de buscar procedimentos estéticos ou cirúrgicos.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-heading text-xl font-semibold">
            Aviso importante
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Este guia tem caráter educativo e não substitui consulta médica,
            avaliação individual ou orientação profissional.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {guideSections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 className="font-heading text-2xl font-semibold">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {section.description}
              </p>

              <div className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      ✓
                    </span>
                    <p className="text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-3">
          <Link
            href="/feed"
            className="flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          >
            Ver conteúdos do feed
          </Link>

          <Link
            href="/premium"
            className="flex h-12 items-center justify-center rounded-xl bg-accent px-4 text-sm font-bold text-accent-foreground shadow-sm transition hover:opacity-90"
          >
            Conhecer Premium
          </Link>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

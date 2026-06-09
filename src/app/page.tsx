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
      "Pergunte sobre a indicação real do procedimento",
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

export default function HomePage() {
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

      <section className="mx-auto max-w-lg px-6 pb-24 pt-10">
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-primary text-primary-foreground shadow-sm">
              <span className="font-heading text-lg font-bold">UBÁ</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Plataforma Premium
            </p>

            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight">
              Cidade das Plásticas
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Uma plataforma centralizando informações, conteúdos e perfis de
              profissionais da área de cirurgia plástica e estética em Ubá.
            </p>
          </div>

          <div className="mt-9 space-y-3">
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
              style={{ color: "#fff" }}
            >
              Criar conta grátis
            </Link>

            <Link
              href="/feed"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-bold shadow-sm transition hover:bg-muted"
            >
              Ver conteúdos do feed
            </Link>

            <Link
              href="/premium"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-accent px-4 text-sm font-bold text-accent-foreground shadow-sm transition hover:opacity-90"
            >
              Conhecer Premium
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-xl font-semibold">
              O que você encontra aqui?
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>• Conteúdos organizados sobre procedimentos.</p>
              <p>• Perfis de profissionais cadastrados.</p>
              <p>• Acesso premium para áreas exclusivas.</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Guia educativo
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight">
              Orientações essenciais antes de qualquer decisão
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Um resumo prático para consultar na própria home, sem sair da tela
              inicial.
            </p>

            <div className="mt-5 space-y-4">
              {guideSections.map((section) => (
                <article key={section.title} className="rounded-2xl border border-border bg-background p-4">
                  <h3 className="font-heading text-lg font-semibold">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground">
                    {section.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

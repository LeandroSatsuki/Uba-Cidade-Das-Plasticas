import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

const sections = [
  {
    title: "Introdução",
    open: true,
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          Se você já pensou em fazer um procedimento estético e ficou com
          dúvidas, inseguranças ou até um frio na barriga, saiba que esse
          sentimento é completamente normal.
        </p>
        <p>
          A boa notícia é que você está em um dos melhores países do mundo para
          tomar essa decisão com segurança e confiança. O Brasil realiza
          milhões de procedimentos estéticos por ano e concentra uma rede ampla
          de especialistas qualificados.
        </p>
        <p>
          Isso significa que estrutura, tecnologia e conhecimento existem — mas
          a segurança começa antes de qualquer cirurgia: na escolha do
          profissional certo, na clareza das informações e na expectativa
          alinhada com a realidade.
        </p>
        <p>
          Este guia foi pensado para ajudar você a entender melhor cada etapa,
          do primeiro contato ao pós-operatório.
        </p>
      </div>
    ),
  },
  {
    title: "Ubá — Cidade das Cirurgias Plásticas",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          Ubá reúne uma rede crescente de profissionais, consultórios e
          clínicas, o que ajuda pacientes a encontrarem mais opções de
          avaliação e acompanhamento.
        </p>
        <p>
          A proposta deste guia é organizar o caminho com linguagem simples,
          destacando o que vale observar antes de escolher onde e com quem se
          cuidar.
        </p>
      </div>
    ),
  },
  {
    title: "Como verificar se um cirurgião é certificado",
    content: (
      <ul className="space-y-3 text-sm leading-7 text-[#47474f]">
        <li>• Confirme a formação e a especialização do profissional.</li>
        <li>• Verifique se ele atua em área compatível com o procedimento.</li>
        <li>• Pesquise histórico profissional, clínica e avaliações.</li>
        <li>• Desconfie de promessas rápidas, garantias absolutas e pressão.</li>
      </ul>
    ),
  },
  {
    title: "As 10 perguntas essenciais para o seu cirurgião",
    content: (
      <ol className="space-y-3 text-sm leading-7 text-[#47474f]">
        <li>1. Sou mesmo candidata a esse procedimento?</li>
        <li>2. Quais são os riscos mais importantes?</li>
        <li>3. Como é a recuperação real?</li>
        <li>4. Onde a cirurgia será realizada?</li>
        <li>5. Que exames são necessários?</li>
        <li>6. Qual o tempo de afastamento?</li>
        <li>7. O que pode comprometer o resultado?</li>
        <li>8. Como funciona o pós-operatório?</li>
        <li>9. Em quais casos devo procurar ajuda?</li>
        <li>10. O que faz sentido para o meu objetivo hoje?</li>
      </ol>
    ),
  },
  {
    title: "Consulta médica e preparo pré-operatório",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          A consulta é o momento de alinhar expectativa, entender limitações e
          organizar toda a preparação com segurança.
        </p>
        <p>
          Exames, histórico de saúde, medicações em uso e hábitos de vida podem
          influenciar diretamente a indicação e a recuperação.
        </p>
      </div>
    ),
  },
  {
    title: "Cirurgias e Procedimentos Faciais",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          Rinoplastia, blefaroplastia, lifting facial e harmonizações mais
          discretas exigem planejamento preciso para manter naturalidade.
        </p>
        <p>
          Cada rosto tem proporções próprias; por isso a avaliação individual é
          decisiva para um bom resultado.
        </p>
      </div>
    ),
  },
  {
    title: "Cirurgias de Mama — Mastopexia",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          A mastopexia pode reposicionar e remodelar as mamas, mas a técnica
          adequada depende do volume, da queda e da qualidade da pele.
        </p>
        <p>
          Conversar sobre cicatriz, tempo de recuperação e expectativa de
          projeção ajuda a evitar frustrações.
        </p>
      </div>
    ),
  },
  {
    title: "Lipo HD — Lipoaspiração de Alta Definição",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          A Lipo HD busca desenhar contornos, mas não substitui hábitos, peso
          estável e critérios técnicos bem definidos.
        </p>
        <p>
          O mais importante é entender até onde o procedimento pode ir sem
          comprometer segurança e naturalidade.
        </p>
      </div>
    ),
  },
  {
    title: "Abdominoplastia",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          Indicada para casos com excesso de pele e flacidez, a abdominoplastia
          costuma exigir cuidados rigorosos no pós-operatório.
        </p>
        <p>
          Postura, repouso e acompanhamento médico fazem parte do resultado
          final tanto quanto a cirurgia em si.
        </p>
      </div>
    ),
  },
  {
    title: "Rinoplastia Estética",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          A rinoplastia combina estética e função, e pequenas mudanças podem
          alterar bastante a harmonia do rosto.
        </p>
        <p>
          O objetivo é melhorar sem perder identidade facial.
        </p>
      </div>
    ),
  },
  {
    title: "Anestesia — Tudo o que você precisa saber",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          A escolha da anestesia depende do procedimento, do perfil clínico e
          da avaliação da equipe responsável.
        </p>
        <p>
          Entender riscos, tempo de jejum e monitoramento reduz ansiedade e
          melhora a experiência no dia da cirurgia.
        </p>
      </div>
    ),
  },
  {
    title: "Alimentação no Pós-Operatório",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          Alimentação adequada ajuda na recuperação, na cicatrização e no bem-
          estar nos primeiros dias.
        </p>
        <p>
          Hidratação, proteína suficiente e alimentação leve costumam ser
          pontos-chave no pós-operatório.
        </p>
      </div>
    ),
  },
  {
    title: "Plano Alimentar Anti-inflamatório — 7 Dias",
    content: (
      <div className="space-y-4 text-sm leading-7 text-[#47474f]">
        <p>
          Um plano alimentar simples pode ajudar a organizar a rotina alimentar
          antes e depois de um procedimento.
        </p>
        <p>
          O foco deve ser praticidade, regularidade e escolhas que respeitem a
          orientação da equipe de saúde.
        </p>
      </div>
    ),
  },
];

export function EducationalGuidePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-[#ece7de] bg-[#fbfaf7]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Link href="/" className="font-heading text-[1.05rem] font-bold tracking-tight text-[#16161a]">
            Cidade das Plásticas
          </Link>

          <Link
            href="/premium"
            className="inline-flex items-center gap-1 rounded-lg border border-[#d6b77a] bg-[#ead7ab] px-3 py-1.5 text-sm font-medium text-[#2a2417] shadow-sm transition hover:bg-[#e3cb91]"
          >
            <span aria-hidden="true">♛</span>
            Premium
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-6 lg:px-6 lg:pb-12 lg:pt-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-[#e1ddd5] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8b8b97]">
                Guia educativo
              </p>
              <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.05] text-[#17171c]">
                Conteúdo claro para decidir com segurança.
              </h1>
              <p className="mt-4 text-[1.02rem] leading-7 text-[#767683]">
                Tudo o que você precisa saber sobre cirurgia plástica, do preparo à
                recuperação.
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-[#fbfaf7] px-4 py-3 text-sm leading-6 text-[#47474f]">
                  Revisão simples de dúvidas frequentes e orientações práticas.
                </div>
                <div className="rounded-2xl bg-[#fbfaf7] px-4 py-3 text-sm leading-6 text-[#47474f]">
                  Estrutura pensada para leitura rápida no mobile e mais rica no desktop.
                </div>
                <div className="rounded-2xl bg-[#fbfaf7] px-4 py-3 text-sm leading-6 text-[#47474f]">
                  Acesso premium destacado para quem quer navegar com mais profundidade.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e1ddd5] bg-[#f8f4ed] p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8b8b97]">
                Destaques rápidos
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#47474f]">
                <p>• Certificação e critérios básicos de escolha.</p>
                <p>• Perguntas essenciais antes da cirurgia.</p>
                <p>• Preparo, recuperação e pós-operatório.</p>
              </div>
            </div>
          </aside>

          <div className="space-y-3">
            {sections.map((section) => (
              <details
                key={section.title}
                className="group rounded-2xl border border-[#e1ddd5] bg-white shadow-[0_1px_0_rgba(17,17,17,0.02)]"
                open={section.open}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-4 py-4 text-[1.02rem] font-semibold text-[#202026] marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{section.title}</span>
                  <span className="text-[#9a9aa4] transition-transform duration-200 group-open:rotate-180">
                    ⌄
                  </span>
                </summary>

                <div className="px-4 pb-4 pt-0.5">{section.content}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

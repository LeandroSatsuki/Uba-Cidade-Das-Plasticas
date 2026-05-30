import Image from "next/image";
import Link from "next/link";
import { base44Contents, base44Professionals } from "@/lib/base44-data";

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("55")) {
    return digits;
  }

  return `55${digits}`;
}

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link href="/feed" className="font-heading text-lg font-bold tracking-tight">
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

      <section className="mx-auto max-w-lg px-4 pb-24 pt-5">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold leading-tight">
            Guia de conteúdo
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Informações, orientações e publicações dos profissionais cadastrados.
          </p>
        </div>

        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {base44Professionals.map((professional) => (
            <Link
              key={professional.base44_id}
              href={`/profissionais/${professional.base44_id}`}
              className="flex min-w-[88px] flex-col items-center gap-2"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-muted">
                <Image
                  src={professional.foto_perfil_url}
                  alt={professional.nome}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
                {professional.nome}
              </span>
            </Link>
          ))}
        </div>

        <div className="space-y-5">
          {base44Contents.map((content) => {
            const professional = base44Professionals.find(
              (item) => item.base44_id === content.profissional_id,
            );

            const whatsapp = normalizeWhatsapp(professional?.whatsapp ?? "");
            const whatsappMessage = encodeURIComponent(
              `Olá, vim pelo Cidade das Plásticas e gostaria de saber mais sobre ${professional?.nome ?? "o atendimento"}.`,
            );

            return (
              <article
                key={content.base44_id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="h-11 w-11 overflow-hidden rounded-full border border-border bg-muted">
                    <Image
                      src={content.profissional_foto}
                      alt={content.profissional_nome}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {content.profissional_nome}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {professional?.especialidades ?? "Profissional cadastrado"}
                    </p>
                  </div>
                </div>

                <div className="aspect-square w-full bg-muted">
                  <Image
                    src={content.imagem_url}
                    alt={`Conteúdo de ${content.profissional_nome}`}
                    width={800}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <p className="whitespace-pre-line text-sm leading-6">
                    {content.legenda}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-full border border-border px-4 py-2 text-sm font-medium"
                    >
                      ♡ Curtir
                    </button>

                    {whatsapp ? (
                      <a
                        href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                      >
                        WhatsApp
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3 text-xs text-muted-foreground">
          <Link href="/" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">⌂</span>
            Início
          </Link>
          <Link href="/feed" className="flex flex-col items-center justify-center gap-1 text-foreground">
            <span className="text-xl">□</span>
            Guia
          </Link>
          <Link href="/login" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">♙</span>
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  );
}

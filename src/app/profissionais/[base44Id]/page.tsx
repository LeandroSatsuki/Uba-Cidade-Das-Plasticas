import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { FeedPostCard } from "@/components/feed-post-card";
import { loadProfessionalPageData } from "@/lib/content-feed";

export const dynamic = "force-dynamic";

type ProfessionalPageProps = {
  params: Promise<{
    base44Id: string;
  }>;
};

function normalizeWhatsapp(value: string | null) {
  const digits = (value ?? "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("55")) {
    return digits;
  }

  return `55${digits}`;
}

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { base44Id } = await params;
  const { viewer, professional, posts } = await loadProfessionalPageData(base44Id);

  if (!professional) {
    notFound();
  }

  const whatsapp = normalizeWhatsapp(professional.whatsapp);
  const whatsappMessage = encodeURIComponent(
    `Olá, vim pelo Cidade das Plásticas e gostaria de saber mais sobre ${professional.nome}.`,
  );

  return (
    <AppShell>
      <section className="space-y-4">
        <Link
          href="/feed"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Voltar para o feed
        </Link>

        <article className="overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-border bg-muted">
              {professional.foto_perfil_url ? (
                <Image
                  src={professional.foto_perfil_url}
                  alt={professional.nome}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Profissional cadastrado
              </p>
              <h1 className="mt-2 font-heading text-3xl font-bold leading-tight">
                {professional.nome}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {professional.especialidades}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
            {professional.descricao_curta ? <p>{professional.descricao_curta}</p> : null}
            {professional.formacao ? <p>{professional.formacao}</p> : null}
            {professional.crm ? <p>{professional.crm}</p> : null}
            {professional.registro_sbcp ? <p>{professional.registro_sbcp}</p> : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                style={{ color: "#fff" }}
              >
                WhatsApp
              </a>
            ) : null}

            {professional.telefone ? (
              <span className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                {professional.telefone}
              </span>
            ) : null}
          </div>
        </article>
      </section>

      <section className="mt-8 space-y-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Publicações</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Conteúdos publicados por este profissional na plataforma.
          </p>
        </div>

        {posts.length > 0 ? (
          posts.map((post) => (
            <FeedPostCard
              key={post.content.id}
              post={post}
              viewer={viewer.profile}
              viewerAuthUserId={viewer.authUserId}
              currentPath={`/profissionais/${base44Id}`}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 text-sm leading-6 text-muted-foreground shadow-sm">
            Ainda não há publicações para este profissional.
          </div>
        )}
      </section>
    </AppShell>
  );
}

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

function splitItems(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { base44Id } = await params;
  const { viewer, professional, posts } = await loadProfessionalPageData(base44Id);

  if (!professional) {
    notFound();
  }

  const profile = professional;
  const whatsapp = normalizeWhatsapp(profile.whatsapp);
  const whatsappMessage = encodeURIComponent(
    `Olá, vim pelo Cidade das Plásticas e gostaria de saber mais sobre ${profile.nome}.`,
  );
  const specialties = splitItems(profile.especialidades);

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="space-y-4">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            Voltar para o feed
          </Link>

          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <article className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {profile.foto_perfil_url ? (
                    <Image
                      src={profile.foto_perfil_url}
                      alt={profile.nome}
                      fill
                      className="object-cover object-center"
                      sizes="(min-width: 1280px) 400px, (min-width: 1024px) 360px, 100vw"
                      priority
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-white/75">
                      Profissional cadastrado
                    </p>
                    <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight drop-shadow-sm">
                      {profile.nome}
                    </h1>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {specialties.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
                    {profile.crm ? (
                      <div className="rounded-2xl border border-border bg-background p-4">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                          CRM
                        </p>
                        <p className="mt-2 font-medium leading-6 text-foreground">{profile.crm}</p>
                      </div>
                    ) : null}

                    {profile.registro_sbcp ? (
                      <div className="rounded-2xl border border-border bg-background p-4">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                          SBCP
                        </p>
                        <p className="mt-2 font-medium leading-6 text-foreground">
                          {profile.registro_sbcp}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {profile.descricao_curta ? (
                    <p className="text-sm leading-7 text-muted-foreground">
                      {profile.descricao_curta}
                    </p>
                  ) : null}

                  {profile.formacao ? (
                    <div className="rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        Formação
                      </p>
                      <p className="mt-2">{profile.formacao}</p>
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {whatsapp ? (
                      <a
                        href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                        style={{ color: "#fff" }}
                      >
                        WhatsApp
                      </a>
                    ) : null}

                    {profile.telefone ? (
                      <span className="inline-flex h-12 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground">
                        {profile.telefone}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            </aside>

            <section className="space-y-4">
              <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Conteúdo do profissional
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">
                    Publicações
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Conteúdos publicados por este profissional na plataforma.
                  </p>
                </div>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-5">
                  {posts.map((post) => (
                    <FeedPostCard
                      key={post.content.id}
                      post={post}
                      viewerAuthUserId={viewer.authUserId}
                      currentPath={`/profissionais/${base44Id}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-border bg-card p-6 text-sm leading-6 text-muted-foreground shadow-sm">
                  Ainda não há publicações para este profissional.
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

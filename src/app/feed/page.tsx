import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FeedPostCard } from "@/components/feed-post-card";
import { StoriesRail } from "@/components/stories-rail";
import { loadFeedPageData } from "@/lib/content-feed";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const { viewer, professionals, posts } = await loadFeedPageData();
  if (!viewer.authUserId) {
    redirect("/entrar?next=/feed");
  }

  const isAdmin = viewer.profile?.role === "admin";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-3 px-4">
          <div className="min-w-0">
            <Link href="/feed" className="block font-heading text-lg font-bold tracking-tight">
              Cidade das Plásticas
            </Link>
            <p className="truncate text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Conteúdos, profissionais e acesso premium
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Link
                href="/admin/postagens"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
              >
                Admin
              </Link>
            ) : null}

            <Link
              href="/premium"
              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              <span aria-hidden="true">♛</span>
              Premium
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-lg px-4 pb-24 pt-5">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Feed principal
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold leading-tight">
            Novidades da comunidade
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Publicações, orientações e conteúdos compartilhados pelos profissionais da plataforma.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">Profissionais</h2>
            <span className="text-xs text-muted-foreground">
              {professionals.length} cadastrados
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {professionals.map((professional) => {
              const href = professional.base44_id
                ? `/profissionais/${professional.base44_id}`
                : "/feed";

              return (
                <Link
                  key={professional.id}
                  href={href}
                  className="flex min-w-[92px] flex-col items-center gap-2"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-muted">
                    {professional.foto_perfil_url ? (
                      <Image
                        src={professional.foto_perfil_url}
                        alt={professional.nome}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
                    {professional.nome}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <StoriesRail professionals={professionals} showSelfStory />
        </div>

        <div className="space-y-5">
          {posts.length > 0 ? (
            posts.map((post) => (
              <FeedPostCard
                key={post.content.id}
                post={post}
                viewer={viewer.profile}
                viewerAuthUserId={viewer.authUserId}
                currentPath="/feed"
              />
            ))
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm leading-6 text-muted-foreground shadow-sm">
              Ainda não há publicações ativas.
            </div>
          )}
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
            Feed
          </Link>
          <Link href="/perfil" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">♙</span>
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { FeedPostCard } from "@/components/feed-post-card";
import { StoriesRail } from "@/components/stories-rail";
import { loadFeedPageData } from "@/lib/content-feed";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const { viewer, professionals, stories, posts } = await loadFeedPageData();
  if (!viewer.authUserId) {
    redirect("/entrar?next=/");
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

        <section className="mb-6 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Stories
              </p>
              <h2 className="mt-1 text-sm font-semibold">Atualizações recentes</h2>
            </div>

            <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
              Ao vivo
            </span>
          </div>

          <StoriesRail professionals={professionals} stories={stories} />
        </section>

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

      <BottomNav />
    </main>
  );
}

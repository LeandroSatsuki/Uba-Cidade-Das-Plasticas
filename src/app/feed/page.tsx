import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { FeedPostCard } from "@/components/feed-post-card";
import { PremiumPromoBanner } from "@/components/premium-promo-banner";
import { loadFeedPageData } from "@/lib/content-feed";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const { viewer, professionals, posts } = await loadFeedPageData();
  if (!viewer.authUserId) {
    redirect("/entrar?next=/");
  }

  const isAdmin = viewer.profile?.role === "admin";
  const feedCount = posts.length;
  const premiumCount = posts.filter((post) => post.content.is_premium).length;
  const professionalCount = professionals.length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-3 px-4">
          <div className="min-w-0">
            <Link href="/feed" className="block font-heading text-lg font-bold tracking-tight">
              Cidade das Plásticas
            </Link>
            <p className="truncate text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Feed, profissionais e acesso premium
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
        <div className="mb-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Dashboard da comunidade
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold leading-tight">
              Novidades em destaque
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Acompanhe publicações, encontre profissionais e desbloqueie a experiência premium.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Conteúdos
              </p>
              <p className="mt-2 font-heading text-2xl font-bold">{feedCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Profissionais
              </p>
              <p className="mt-2 font-heading text-2xl font-bold">{professionalCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Premium
              </p>
              <p className="mt-2 font-heading text-2xl font-bold">{premiumCount}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <PremiumPromoBanner href="/premium" />
        </div>

        <div className="space-y-5">
          {posts.length > 0 ? (
            posts.map((post) => (
              <FeedPostCard
                key={post.content.id}
                post={post}
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

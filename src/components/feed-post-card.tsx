"use client";

import Image from "next/image";
import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import type { FeedPostWithStats } from "@/types/content";

type FeedPostCardProps = {
  post: FeedPostWithStats;
  viewerAuthUserId: string | null;
  currentPath?: string;
};

export function FeedPostCard({
  post,
  viewerAuthUserId,
  currentPath = "/feed",
}: FeedPostCardProps) {
  const professional = post.professional;
  const profileHref = professional?.base44_id ? `/profissionais/${professional.base44_id}` : "/feed";

  return (
    <article className="overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <Link href={profileHref} className="h-11 w-11 overflow-hidden rounded-full border border-border bg-muted">
          {professional?.foto_perfil_url ? (
            <Image
              src={professional.foto_perfil_url}
              alt={professional.nome}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : null}
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={profileHref} className="truncate text-[15px] font-semibold leading-5">
            {professional?.nome ?? "Profissional cadastrado"}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {professional?.especialidades ?? "Profissional cadastrado"}
          </p>
        </div>

        {post.content.is_premium ? (
          <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            Premium
          </span>
        ) : null}
      </div>

      <div className="px-3 pb-3">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-[26px] bg-muted sm:aspect-square">
          {post.content.imagem_url ? (
            <Image
              src={post.content.imagem_url}
              alt={`Conteúdo de ${professional?.nome ?? "profissional"}`}
              width={800}
              height={800}
              className="h-full w-full object-cover object-center"
            />
          ) : null}
        </div>
      </div>

      <div className="px-4 pb-4">
        <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-foreground/92">
          {post.content.legenda}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <LikeButton
            contentId={post.content.id}
            initialLikeCount={post.likeCount}
            initialViewerHasLiked={post.viewerHasLiked}
            isAuthenticated={Boolean(viewerAuthUserId)}
            currentPath={currentPath}
          />

          <Link
            href={profileHref}
            className="flex h-11 items-center justify-center rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted"
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </article>
  );
}

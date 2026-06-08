"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import { CommentForm } from "@/components/comment-form";
import { CommentsList } from "@/components/comments-list";
import type { FeedPostWithStats, Profile } from "@/types/content";

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

type FeedPostCardProps = {
  post: FeedPostWithStats;
  viewer: Profile | null;
  viewerAuthUserId: string | null;
  currentPath?: string;
};

export function FeedPostCard({
  post,
  viewer,
  viewerAuthUserId,
  currentPath = "/feed",
}: FeedPostCardProps) {
  const professional = post.professional;
  const [commentsOpen, setCommentsOpen] = useState(false);
  const whatsapp = normalizeWhatsapp(professional?.whatsapp ?? "");
  const whatsappMessage = encodeURIComponent(
    `Olá, vim pelo Cidade das Plásticas e gostaria de saber mais sobre ${professional?.nome ?? "o atendimento"}.`,
  );

  const commentsCountLabel = useMemo(() => {
    const count = post.comments.length;

    return count === 1 ? "1 comentário" : `${count} comentários`;
  }, [post.comments.length]);

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <Link
            href={professional?.base44_id ? `/profissionais/${professional.base44_id}` : "/feed"}
            className="h-11 w-11 overflow-hidden rounded-full border border-border bg-muted"
          >
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
            <Link
              href={professional?.base44_id ? `/profissionais/${professional.base44_id}` : "/feed"}
              className="truncate font-semibold"
            >
              {professional?.nome ?? "Profissional cadastrado"}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              {professional?.especialidades ?? "Profissional cadastrado"}
            </p>
          </div>
        </div>

        <div className="aspect-square w-full bg-muted">
          {post.content.imagem_url ? (
            <Image
              src={post.content.imagem_url}
              alt={`Conteúdo de ${professional?.nome ?? "profissional"}`}
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="p-4">
          <p className="whitespace-pre-line text-sm leading-6">{post.content.legenda}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LikeButton
              contentId={post.content.id}
              initialLikeCount={post.likeCount}
              initialViewerHasLiked={post.viewerHasLiked}
              isAuthenticated={Boolean(viewerAuthUserId)}
              currentPath={currentPath}
            />

            <button
              type="button"
              onClick={() => setCommentsOpen(true)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              💬 Comentar · {commentsCountLabel}
            </button>

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
          </div>
        </div>
      </article>

      {commentsOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-3 sm:items-center"
          role="presentation"
          onClick={() => setCommentsOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Comentários da postagem"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Comentários
                </p>
                <h3 className="mt-1 text-sm font-semibold">{commentsCountLabel}</h3>
              </div>

              <button
                type="button"
                onClick={() => setCommentsOpen(false)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
              >
                Fechar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <CommentsList
                contentId={post.content.id}
                comments={post.comments}
                viewerId={viewerAuthUserId}
                viewerIsAdmin={viewer?.role === "admin"}
                collapsedLimit={10}
              />

              <div className="mt-5 border-t border-border pt-4">
                <CommentForm
                  contentId={post.content.id}
                  isAuthenticated={Boolean(viewerAuthUserId)}
                  currentPath={currentPath}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

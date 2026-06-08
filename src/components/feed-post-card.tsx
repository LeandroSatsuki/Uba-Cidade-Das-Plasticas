"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [, setCommentsOpen] = useState(false);
  const [commentsModalMounted, setCommentsModalMounted] = useState(false);
  const [commentsModalActive, setCommentsModalActive] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const whatsapp = normalizeWhatsapp(professional?.whatsapp ?? "");
  const whatsappMessage = encodeURIComponent(
    `Olá, vim pelo Cidade das Plásticas e gostaria de saber mais sobre ${professional?.nome ?? "o atendimento"}.`,
  );

  const commentsCountLabel = useMemo(() => {
    const count = post.comments.length;

    return count === 1 ? "1 comentário" : `${count} comentários`;
  }, [post.comments.length]);

  const relevantCommentsCount = useMemo(
    () => post.comments.filter((comment) => comment.author?.role === "admin").length,
    [post.comments],
  );

  const relevantCommentsLabel = useMemo(() => {
    return relevantCommentsCount === 1
      ? "1 relevante"
      : `${relevantCommentsCount} relevantes`;
  }, [relevantCommentsCount]);

  function openComments() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setCommentsOpen(true);
    setCommentsModalMounted(true);
    requestAnimationFrame(() => setCommentsModalActive(true));
  }

  function closeComments() {
    setCommentsOpen(false);
    setCommentsModalActive(false);

    closeTimerRef.current = window.setTimeout(() => {
      setCommentsModalMounted(false);
      closeTimerRef.current = null;
    }, 180);
  }

  useEffect(() => {
    if (!commentsModalMounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeComments();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [commentsModalMounted]);

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
              onClick={openComments}
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

      {commentsModalMounted ? (
        <div
          className={`fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-2 backdrop-blur-sm transition-opacity duration-300 ease-out sm:items-center sm:p-3 ${commentsModalActive ? "opacity-100" : "opacity-0"}`}
          role="presentation"
          onClick={closeComments}
        >
          <div
            className={`flex h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl transition-all duration-300 ease-out sm:h-auto sm:max-h-[85vh] sm:rounded-3xl ${commentsModalActive ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
            role="dialog"
            aria-modal="true"
            aria-label="Comentários da postagem"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Comentários
                </p>
                <h3 className="mt-1 text-sm font-semibold">{commentsCountLabel}</h3>
              </div>

              <div className="flex items-center gap-2">
                {relevantCommentsCount > 0 ? (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {relevantCommentsLabel}
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={closeComments}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg leading-none transition hover:bg-muted"
                  aria-label="Fechar comentários"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="border-b border-border bg-gradient-to-b from-background to-background/95 px-4 py-4">
              <div className="flex items-center gap-3">
                <Link
                  href={professional?.base44_id ? `/profissionais/${professional.base44_id}` : "/feed"}
                  className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary/20 bg-muted shadow-sm"
                >
                  {professional?.foto_perfil_url ? (
                    <Image
                      src={professional.foto_perfil_url}
                      alt={professional.nome}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={professional?.base44_id ? `/profissionais/${professional.base44_id}` : "/feed"}
                    className="truncate text-sm font-semibold"
                  >
                    {professional?.nome ?? "Profissional cadastrado"}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {professional?.especialidades ?? "Profissional cadastrado"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <span className="h-px flex-1 bg-border/70" />
                <span>Legenda</span>
                <span className="h-px flex-1 bg-border/70" />
              </div>

              <p className="mt-3 line-clamp-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {post.content.legenda}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain">
              <CommentsList
                contentId={post.content.id}
                comments={post.comments}
                viewerId={viewerAuthUserId}
                viewerIsAdmin={viewer?.role === "admin"}
                collapsedLimit={10}
              />
            </div>

            <div className="border-t border-border bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 backdrop-blur">
              <CommentForm
                contentId={post.content.id}
                isAuthenticated={Boolean(viewerAuthUserId)}
                currentPath={currentPath}
                compact
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ContentCommentWithAuthor } from "@/types/content";

type CommentsListProps = {
  contentId: string;
  comments: ContentCommentWithAuthor[];
  viewerId: string | null;
  viewerIsAdmin: boolean;
  collapsedLimit?: number;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCommentPriority(comment: ContentCommentWithAuthor) {
  return comment.author?.role === "admin" ? 0 : 1;
}

export function CommentsList({
  contentId,
  comments,
  viewerId,
  viewerIsAdmin,
  collapsedLimit = 10,
}: CommentsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const orderedComments = useMemo(
    () =>
      [...comments].sort(
        (left, right) =>
          getCommentPriority(left) - getCommentPriority(right) ||
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
      ),
    [comments],
  );

  const visibleComments = showAll
    ? orderedComments
    : orderedComments.slice(0, collapsedLimit);

  async function removeComment(commentId: string) {
    setDeletingId(commentId);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { error } = await supabase
        .from("content_comments")
        .delete()
        .eq("id", commentId)
        .eq("content_id", contentId);

      if (error) {
        throw error;
      }

      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">Ainda não há comentários.</p>;
  }

  return (
    <div className="space-y-3">
      {visibleComments.map((comment) => {
        const commentAuthorName =
          comment.author?.full_name?.trim() || comment.author?.email || "Usuário";
        const canDelete = viewerIsAdmin || (viewerId !== null && comment.user_id === viewerId);

        return (
          <article key={comment.id} className="rounded-2xl border border-border bg-background p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{commentAuthorName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
              </div>

              {canDelete ? (
                <button
                  type="button"
                  onClick={() => void removeComment(comment.id)}
                  disabled={deletingId === comment.id}
                  className="text-xs font-semibold text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed"
                >
                  Remover
                </button>
              ) : null}
            </div>

            <p className="mt-2 whitespace-pre-line text-sm leading-6">{comment.body}</p>
          </article>
        );
      })}

      {!showAll && comments.length > collapsedLimit ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full rounded-2xl border border-dashed border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
        >
          Ver mais comentários
        </button>
      ) : null}

      {showAll && comments.length > collapsedLimit ? (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="w-full rounded-2xl border border-dashed border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
        >
          Mostrar apenas os 10 primeiros
        </button>
      ) : null}
    </div>
  );
}

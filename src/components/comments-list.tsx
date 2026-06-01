"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ContentCommentWithAuthor } from "@/types/content";

type CommentsListProps = {
  contentId: string;
  comments: ContentCommentWithAuthor[];
  viewerId: string | null;
  viewerIsAdmin: boolean;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentsList({ contentId, comments, viewerId, viewerIsAdmin }: CommentsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      {comments.map((comment) => {
        const commentAuthorName =
          comment.author?.full_name?.trim() ||
          comment.author?.email ||
          "Usuário";
        const canDelete =
          viewerIsAdmin || (viewerId !== null && comment.user_id === viewerId);

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
    </div>
  );
}

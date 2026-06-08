"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CommentFormProps = {
  contentId: string;
  isAuthenticated: boolean;
  currentPath?: string;
  compact?: boolean;
};

export function CommentForm({
  contentId,
  isAuthenticated,
  currentPath = "/feed",
  compact = false,
}: CommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitComment() {
    const trimmedBody = body.trim();

    if (!trimmedBody) {
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/entrar?next=${encodeURIComponent(currentPath)}`);
        return;
      }

      const { error } = await supabase.from("content_comments").insert({
        content_id: contentId,
        user_id: user.id,
        body: trimmedBody,
      });

      if (error) {
        throw error;
      }

      setBody("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={`/entrar?next=${encodeURIComponent(currentPath)}`}
        className={`${compact ? "mt-0" : "mt-4"} flex h-12 items-center justify-center rounded-xl border border-dashed border-border px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted`}
      >
        Entrar para comentar
      </Link>
    );
  }

  return (
    <div className={`${compact ? "mt-0 space-y-2 rounded-2xl border border-border bg-muted/30 p-3" : "mt-4 space-y-3"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Seu comentário
        </p>
        <p className="text-[11px] text-muted-foreground">
          {compact ? "Mais rápido no modal" : "Seja gentil e objetivo"}
        </p>
      </div>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.ctrlKey) {
            event.preventDefault();
            void submitComment();
          }
        }}
        rows={compact ? 2 : 3}
        placeholder="Escreva um comentário..."
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-ring"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Dica: use Ctrl + Enter para enviar depois de escrever.
        </p>

        <button
          type="button"
          onClick={() => void submitComment()}
          disabled={loading || !body.trim()}
          className="h-11 w-full rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Enviando..." : "Comentar"}
        </button>
      </div>
    </div>
  );
}

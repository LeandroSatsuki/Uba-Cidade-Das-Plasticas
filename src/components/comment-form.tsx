"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CommentFormProps = {
  contentId: string;
  isAuthenticated: boolean;
  currentPath?: string;
};

export function CommentForm({
  contentId,
  isAuthenticated,
  currentPath = "/feed",
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
        className="mt-4 flex h-12 items-center justify-center rounded-xl border border-dashed border-border px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted"
      >
        Entrar para comentar
      </Link>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        placeholder="Escreva um comentário..."
        className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm outline-none transition focus:border-ring"
      />

      <button
        type="button"
        onClick={() => void submitComment()}
        disabled={loading || !body.trim()}
        className="h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Comentar"}
      </button>
    </div>
  );
}

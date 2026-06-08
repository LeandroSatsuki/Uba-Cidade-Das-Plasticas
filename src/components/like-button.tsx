"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LikeButtonProps = {
  contentId: string;
  initialLikeCount: number;
  initialViewerHasLiked: boolean;
  isAuthenticated: boolean;
  currentPath?: string;
};

export function LikeButton({
  contentId,
  initialLikeCount,
  initialViewerHasLiked,
  isAuthenticated,
  currentPath = "/feed",
}: LikeButtonProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialViewerHasLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  const authHref = `/entrar?next=${encodeURIComponent(currentPath)}`;

  async function toggleLike() {
    if (!isAuthenticated) {
      router.push(authHref);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(authHref);
        return;
      }

      if (isLiked) {
        const { error } = await supabase
          .from("content_likes")
          .delete()
          .eq("content_id", contentId)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        setIsLiked(false);
        setLikeCount((current) => Math.max(0, current - 1));
      } else {
        const { error } = await supabase.from("content_likes").insert({
          content_id: contentId,
          user_id: user.id,
        });

        if (error) {
          throw error;
        }

        setIsLiked(true);
        setLikeCount((current) => current + 1);
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={authHref}
        className="flex h-12 w-full items-center justify-center rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted sm:w-auto"
      >
        ♡ Curtir
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void toggleLike()}
      disabled={loading}
      className="flex h-12 w-full items-center justify-center rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {isLiked ? "♥" : "♡"} Curtir · {likeCount}
    </button>
  );
}

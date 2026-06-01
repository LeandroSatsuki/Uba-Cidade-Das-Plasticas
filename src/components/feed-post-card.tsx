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
  const whatsapp = normalizeWhatsapp(professional?.whatsapp ?? "");
  const whatsappMessage = encodeURIComponent(
    `Olá, vim pelo Cidade das Plásticas e gostaria de saber mais sobre ${professional?.nome ?? "o atendimento"}.`,
  );

  return (
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

          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              WhatsApp
            </a>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Comentários · {post.comments.length}</h3>
            <div className="mt-3">
              <CommentsList
                contentId={post.content.id}
                comments={post.comments}
                viewerId={viewerAuthUserId}
                viewerIsAdmin={viewer?.role === "admin"}
              />
            </div>
          </div>

          <CommentForm
            contentId={post.content.id}
            isAuthenticated={Boolean(viewerAuthUserId)}
            currentPath={currentPath}
          />
        </div>
      </div>
    </article>
  );
}

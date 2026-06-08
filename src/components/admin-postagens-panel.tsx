"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Content, Professional } from "@/types/content";

type AdminPostagensPanelProps = {
  professionals: Professional[];
  contents: Content[];
};

export function AdminPostagensPanel({ professionals, contents }: AdminPostagensPanelProps) {
  const router = useRouter();
  const supabase = createClient();
  const [newPost, setNewPost] = useState({
    professional_id: professionals[0]?.id ?? "",
    content_type: "feed" as "feed" | "story",
    imagem_url: "",
    legenda: "",
    is_premium: false,
    ativo: true,
  });
  const [loadingId, setLoadingId] = useState<string | "create" | null>(null);
  const [contentFilter, setContentFilter] = useState<"all" | "feed" | "story" | "active" | "inactive">("all");
  const selectedProfessional =
    professionals.find((professional) => professional.id === newPost.professional_id) ??
    professionals[0] ??
    null;

  const visibleContents = useMemo(() => {
    const sorted = [...contents].sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );

    return sorted.filter((content) => {
      if (contentFilter === "feed") return content.content_type === "feed";
      if (contentFilter === "story") return content.content_type === "story";
      if (contentFilter === "active") return content.ativo;
      if (contentFilter === "inactive") return !content.ativo;
      return true;
    });
  }, [contentFilter, contents]);
  function duplicatePost(content: Content) {
    setNewPost({
      professional_id: content.professional_id ?? professionals[0]?.id ?? "",
      content_type: content.content_type ?? "feed",
      imagem_url: content.imagem_url ?? "",
      legenda: content.legenda ?? "",
      is_premium: content.is_premium,
      ativo: true,
    });
  }

  async function getViewerId() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user?.id ?? null;
  }

  async function handleCreate() {
    if (!newPost.professional_id || !newPost.imagem_url.trim() || !newPost.legenda.trim()) {
      return;
    }

    setLoadingId("create");

    try {
      const viewerId = await getViewerId();
      const { error } = await supabase.from("contents").insert({
        professional_id: newPost.professional_id,
        content_type: newPost.content_type,
        author_id: viewerId,
        imagem_url: newPost.imagem_url.trim(),
        legenda: newPost.legenda.trim(),
        is_premium: newPost.is_premium,
        ativo: newPost.ativo,
      });

      if (error) {
        throw error;
      }

      setNewPost({
        professional_id: professionals[0]?.id ?? "",
        content_type: "feed",
        imagem_url: "",
        legenda: "",
        is_premium: false,
        ativo: true,
      });
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDeactivate(id: string) {
    setLoadingId(id);

    try {
      const { error } = await supabase.from("contents").update({ ativo: false }).eq("id", id);

      if (error) {
        throw error;
      }

      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    setLoadingId(id);

    try {
      const { error } = await supabase.from("contents").delete().eq("id", id);

      if (error) {
        throw error;
      }

      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Nova postagem</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Fluxo simples: escolha quem posta, adicione a imagem e escreva a legenda.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            1 pessoa · 1 fluxo
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                1. Quem está postando?
              </p>

              <label className="mt-4 block text-sm font-semibold">Profissional</label>
              <select
                value={newPost.professional_id}
                onChange={(event) =>
                  setNewPost((current) => ({ ...current, professional_id: event.target.value }))
                }
                className="mt-2 h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
              >
                {professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.nome}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Esse perfil aparece no feed e nas páginas do conteúdo.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                2. Formato
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewPost((current) => ({ ...current, content_type: "feed" }))}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                    newPost.content_type === "feed"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent hover:bg-muted"
                  }`}
                  style={newPost.content_type === "feed" ? { color: "#fff" } : undefined}
                >
                  Feed
                </button>
                <button
                  type="button"
                  onClick={() => setNewPost((current) => ({ ...current, content_type: "story" }))}
                  className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                    newPost.content_type === "story"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent hover:bg-muted"
                  }`}
                  style={newPost.content_type === "story" ? { color: "#fff" } : undefined}
                >
                  Story
                </button>
              </div>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Feed vai para o card principal. Story entra no topo do app.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                3. Imagem
              </p>

              <label className="mt-4 block text-sm font-semibold">URL da imagem</label>
              <input
                value={newPost.imagem_url}
                onChange={(event) =>
                  setNewPost((current) => ({ ...current, imagem_url: event.target.value }))
                }
                placeholder="Cole o link da foto"
                className="mt-2 h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
              />

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Dica: use uma imagem vertical ou quadrada, bem limpa e com boa leitura.
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted">
                {newPost.imagem_url.trim() ? (
                  <div className="relative h-56 w-full">
                    <Image
                      src={newPost.imagem_url.trim()}
                      alt="Prévia da imagem da postagem"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center px-6 text-center text-sm text-muted-foreground">
                    A prévia da imagem aparece aqui.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                4. Legenda
              </p>

              <textarea
                value={newPost.legenda}
                onChange={(event) =>
                  setNewPost((current) => ({ ...current, legenda: event.target.value }))
                }
                rows={6}
                placeholder="Escreva como se fosse um post do Instagram..."
                className="mt-4 w-full rounded-xl border border-input bg-transparent px-4 py-3 outline-none"
              />

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{newPost.legenda.trim().length} caracteres</span>
                <span>Texto curto e direto costuma performar melhor no feed.</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 min-w-0">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Prévia
              </p>

              <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-3 p-4">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border bg-muted">
                    {selectedProfessional?.foto_perfil_url ? (
                      <Image
                        src={selectedProfessional.foto_perfil_url}
                        alt={selectedProfessional.nome}
                        fill
                        sizes="44px"
                        className="object-cover object-center"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {selectedProfessional?.nome ?? "Profissional cadastrado"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {selectedProfessional?.especialidades ?? "Profissional cadastrado"}
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {newPost.content_type}
                  </span>
                </div>

                <div className="aspect-[4/5] w-full bg-muted">
                  {newPost.imagem_url.trim() ? (
                    <div className="relative h-full min-h-[320px] w-full">
                      <Image
                        src={newPost.imagem_url.trim()}
                        alt="Prévia da publicação"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[320px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                      A imagem escolhida aparece aqui.
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <p className="line-clamp-4 whitespace-pre-line text-sm leading-6 text-foreground">
                    {newPost.legenda.trim() || "Sua legenda vai aparecer aqui."}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border px-3 py-1">
                      {newPost.content_type === "feed" ? "Vai para o feed" : "Vai para stories"}
                    </span>
                    <span className="rounded-full border border-border px-3 py-1">
                      {newPost.is_premium ? "Premium ligado" : "Premium desligado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                5. Publicação
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <label className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newPost.is_premium}
                    onChange={(event) =>
                      setNewPost((current) => ({ ...current, is_premium: event.target.checked }))
                    }
                  />
                  Premium
                </label>

                <label className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newPost.ativo}
                    onChange={(event) =>
                      setNewPost((current) => ({ ...current, ativo: event.target.checked }))
                    }
                  />
                  Ativo
                </label>
              </div>

              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={loadingId === "create"}
                className="mt-4 h-12 w-full rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
                style={{ color: "#fff" }}
              >
                {loadingId === "create" ? "Criando..." : "Publicar postagem"}
              </button>
            </div>
          </div>
        </div>
      </section>


      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Postagens recentes</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ordenadas por data, com filtros rápidos para achar o que importa.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {visibleContents.length} {visibleContents.length === 1 ? "postagem" : "postagens"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {([
            ["all", "Todas"],
            ["feed", "Feed"],
            ["story", "Story"],
            ["active", "Ativas"],
            ["inactive", "Inativas"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setContentFilter(value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                contentFilter === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent hover:bg-muted"
              }`}
              style={contentFilter === value ? { color: "#fff" } : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        {visibleContents.length ? (
          visibleContents.map((content) => {
            const professionalName =
              professionals.find((professional) => professional.id === content.professional_id)?.nome ??
              "Profissional";
            const typeLabel = content.content_type === "story" ? "Story" : "Feed";

            return (
              <article key={content.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                      {professionalName}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold">{typeLabel}</h3>
                  </div>

                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
                    {content.ativo ? "Ativa" : "Inativa"}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
                  <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                    {content.imagem_url ? (
                      <div className="relative aspect-[4/5] w-full">
                        <Image
                          src={content.imagem_url}
                          alt={`Conteúdo de ${professionalName}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 220px"
                          className="object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        Conteúdo sem imagem
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 min-w-0">
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        Legenda
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground">
                        {content.legenda}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-border px-3 py-1">
                        {typeLabel}
                      </span>
                      <span className="rounded-full border border-border px-3 py-1">
                        {content.is_premium ? "Premium" : "Padrão"}
                      </span>
                      <span className="rounded-full border border-border px-3 py-1">
                        {content.imagem_url ? "Imagem vinculada" : "Sem imagem"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => duplicatePost(content)}
                        className="h-11 rounded-xl border border-border px-4 text-sm font-bold transition hover:bg-muted"
                      >
                        Duplicar para novo
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDeactivate(content.id)}
                        disabled={loadingId === content.id || !content.ativo}
                        className="h-11 rounded-xl border border-border px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {content.ativo ? "Desativar" : "Já desativada"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(content.id)}
                        disabled={loadingId === content.id}
                        className="h-11 rounded-xl border border-destructive/30 px-4 text-sm font-bold text-destructive disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhuma postagem encontrada com este filtro.
          </div>
        )}
      </section>
    </div>
  );
}

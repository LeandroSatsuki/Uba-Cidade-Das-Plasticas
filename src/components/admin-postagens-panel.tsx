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

type ContentDraft = {
  id: string;
  professional_id: string;
  content_type: "feed" | "story";
  imagem_url: string;
  legenda: string;
  is_premium: boolean;
  ativo: boolean;
};

function getInitialDrafts(contents: Content[]) {
  return contents.map<ContentDraft>((content) => ({
    id: content.id,
    professional_id: content.professional_id ?? "",
    content_type: content.content_type ?? "feed",
    imagem_url: content.imagem_url ?? "",
    legenda: content.legenda,
    is_premium: content.is_premium,
    ativo: content.ativo,
  }));
}

export function AdminPostagensPanel({ professionals, contents }: AdminPostagensPanelProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [drafts, setDrafts] = useState<ContentDraft[]>(() => getInitialDrafts(contents));
  const [newPost, setNewPost] = useState({
    professional_id: professionals[0]?.id ?? "",
    content_type: "feed" as "feed" | "story",
    imagem_url: "",
    legenda: "",
    is_premium: false,
    ativo: true,
  });
  const [loadingId, setLoadingId] = useState<string | "create" | null>(null);
  const selectedProfessional =
    professionals.find((professional) => professional.id === newPost.professional_id) ??
    professionals[0] ??
    null;

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

  async function handleSave(draft: ContentDraft) {
    setLoadingId(draft.id);

    try {
      const { error } = await supabase
        .from("contents")
        .update({
          professional_id: draft.professional_id || null,
          content_type: draft.content_type,
          imagem_url: draft.imagem_url.trim(),
          legenda: draft.legenda.trim(),
          is_premium: draft.is_premium,
          ativo: draft.ativo,
        })
        .eq("id", draft.id);

      if (error) {
        throw error;
      }

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
    <div className="space-y-6">
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
          <div className="space-y-4">
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

          <div className="space-y-4">
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
        {drafts.map((draft) => {
          const professionalName =
            professionals.find((professional) => professional.id === draft.professional_id)?.nome ??
            "Profissional";

          return (
            <article key={draft.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    {professionalName}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold">Editar postagem</h3>
                </div>

                <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
                  {draft.ativo ? "Ativa" : "Inativa"}
                </span>
              </div>

              <div className="mt-4 grid gap-4">
                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Profissional</span>
                  <select
                    value={draft.professional_id}
                    onChange={(event) =>
                      setDrafts((current) =>
                        current.map((item) =>
                          item.id === draft.id ? { ...item, professional_id: event.target.value } : item,
                        ),
                      )
                    }
                    className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
                  >
                    {professionals.map((professional) => (
                      <option key={professional.id} value={professional.id}>
                        {professional.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Tipo</span>
                  <select
                    value={draft.content_type}
                    onChange={(event) =>
                      setDrafts((current) =>
                        current.map((item) =>
                          item.id === draft.id
                            ? {
                                ...item,
                                content_type:
                                  event.target.value === "story" ? "story" : "feed",
                              }
                            : item,
                        ),
                      )
                    }
                    className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
                  >
                    <option value="feed">Feed</option>
                    <option value="story">Stories</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Imagem URL</span>
                  <input
                    value={draft.imagem_url}
                    onChange={(event) =>
                      setDrafts((current) =>
                        current.map((item) =>
                          item.id === draft.id ? { ...item, imagem_url: event.target.value } : item,
                        ),
                      )
                    }
                    className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Legenda</span>
                  <textarea
                    value={draft.legenda}
                    onChange={(event) =>
                      setDrafts((current) =>
                        current.map((item) =>
                          item.id === draft.id ? { ...item, legenda: event.target.value } : item,
                        ),
                      )
                    }
                    rows={5}
                    className="rounded-xl border border-input bg-transparent px-4 py-3 outline-none"
                  />
                </label>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.is_premium}
                      onChange={(event) =>
                        setDrafts((current) =>
                          current.map((item) =>
                            item.id === draft.id
                              ? { ...item, is_premium: event.target.checked }
                              : item,
                          ),
                        )
                      }
                    />
                    Premium
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.ativo}
                      onChange={(event) =>
                        setDrafts((current) =>
                          current.map((item) =>
                            item.id === draft.id ? { ...item, ativo: event.target.checked } : item,
                          ),
                        )
                      }
                    />
                    Ativo
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleSave(draft)}
                    disabled={loadingId === draft.id}
                    className="h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loadingId === draft.id ? "Salvando..." : "Salvar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDeactivate(draft.id)}
                    disabled={loadingId === draft.id}
                    className="h-11 rounded-xl border border-border px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Desativar
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(draft.id)}
                    disabled={loadingId === draft.id}
                    className="h-11 rounded-xl border border-destructive/30 px-4 text-sm font-bold text-destructive disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

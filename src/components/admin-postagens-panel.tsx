"use client";

import { useMemo, useState } from "react";
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
  imagem_url: string;
  legenda: string;
  is_premium: boolean;
  ativo: boolean;
};

function getInitialDrafts(contents: Content[]) {
  return contents.map<ContentDraft>((content) => ({
    id: content.id,
    professional_id: content.professional_id ?? "",
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
    imagem_url: "",
    legenda: "",
    is_premium: false,
    ativo: true,
  });
  const [loadingId, setLoadingId] = useState<string | "create" | null>(null);

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
        <h2 className="font-heading text-2xl font-semibold">Nova postagem</h2>

        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-semibold">Profissional</span>
            <select
              value={newPost.professional_id}
              onChange={(event) =>
                setNewPost((current) => ({ ...current, professional_id: event.target.value }))
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
            <span className="font-semibold">Imagem URL</span>
            <input
              value={newPost.imagem_url}
              onChange={(event) =>
                setNewPost((current) => ({ ...current, imagem_url: event.target.value }))
              }
              className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold">Legenda</span>
            <textarea
              value={newPost.legenda}
              onChange={(event) =>
                setNewPost((current) => ({ ...current, legenda: event.target.value }))
              }
              rows={4}
              className="rounded-xl border border-input bg-transparent px-4 py-3 outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={newPost.is_premium}
                onChange={(event) =>
                  setNewPost((current) => ({ ...current, is_premium: event.target.checked }))
                }
              />
              Premium
            </label>

            <label className="flex items-center gap-2 text-sm">
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
            className="h-12 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingId === "create" ? "Criando..." : "Criar postagem"}
          </button>
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

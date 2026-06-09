"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Content, Professional } from "@/types/content";

type AdminPostagensPanelProps = {
  professionals: Professional[];
  contents: Content[];
};

type ContentForm = {
  professional_id: string;
  content_type: "feed" | "story";
  imagem_url: string;
  legenda: string;
  is_premium: boolean;
  ativo: boolean;
};

type EditorMode = "create" | "edit";

const FILTERS = [
  ["all", "Todas"],
  ["feed", "Feed"],
  ["story", "Story"],
  ["active", "Ativas"],
  ["inactive", "Inativas"],
] as const;

function getBlankForm(professionals: Professional[]): ContentForm {
  return {
    professional_id: professionals[0]?.id ?? "",
    content_type: "feed",
    imagem_url: "",
    legenda: "",
    is_premium: false,
    ativo: true,
  };
}

function formFromContent(content: Content, professionals: Professional[]): ContentForm {
  return {
    professional_id: content.professional_id ?? professionals[0]?.id ?? "",
    content_type: content.content_type ?? "feed",
    imagem_url: content.imagem_url ?? "",
    legenda: content.legenda ?? "",
    is_premium: content.is_premium,
    ativo: content.ativo,
  };
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0 0-3l-.9-.9a2.1 2.1 0 0 0-3 0L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M4 7h16" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M8 7l1 13h6l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

export function AdminPostagensPanel({ professionals, contents }: AdminPostagensPanelProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [contentFilter, setContentFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const [loadingId, setLoadingId] = useState<string | "create" | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [form, setForm] = useState<ContentForm>(() => getBlankForm(professionals));
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMounted, setEditorMounted] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const visibleContents = useMemo(() => {
    const sorted = [...contents].sort(
      (left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
    );

    return sorted.filter((content) => {
      if (contentFilter === "feed") return (content.content_type ?? "feed") === "feed";
      if (contentFilter === "story") return (content.content_type ?? "feed") === "story";
      if (contentFilter === "active") return content.ativo;
      if (contentFilter === "inactive") return !content.ativo;
      return true;
    });
  }, [contentFilter, contents]);

  const selectedProfessional = useMemo(
    () => professionals.find((professional) => professional.id === form.professional_id) ?? null,
    [form.professional_id, professionals],
  );

  const selectedTypeLabel = form.content_type === "story" ? "Story" : "Feed";

  function openCreateModal() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setEditorMode("create");
    setEditingContentId(null);
    setForm(getBlankForm(professionals));
    setEditorMounted(true);
    requestAnimationFrame(() => setEditorOpen(true));
  }

  function openEditModal(content: Content) {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setEditorMode("edit");
    setEditingContentId(content.id);
    setForm(formFromContent(content, professionals));
    setEditorMounted(true);
    requestAnimationFrame(() => setEditorOpen(true));
  }

  function closeModal() {
    setEditorOpen(false);
    setEditorMode(null);
    setEditingContentId(null);
    closeTimerRef.current = window.setTimeout(() => setEditorMounted(false), 180);
  }

  useEffect(() => {
    if (!editorMounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = editorOpen ? "hidden" : "";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [editorMounted, editorOpen]);

  async function getViewerId() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user?.id ?? null;
  }

  async function handleSave() {
    if (!form.professional_id || !form.imagem_url.trim() || !form.legenda.trim()) {
      return;
    }

    setLoadingId(editorMode === "edit" ? editingContentId : "create");

    try {
      const viewerId = await getViewerId();
      const payload = {
        professional_id: form.professional_id,
        content_type: form.content_type,
        author_id: viewerId,
        imagem_url: form.imagem_url.trim(),
        legenda: form.legenda.trim(),
        is_premium: form.is_premium,
        ativo: form.ativo,
      };

      const operation =
        editorMode === "edit" && editingContentId
          ? supabase.from("contents").update(payload).eq("id", editingContentId)
          : supabase.from("contents").insert(payload);

      const { error } = await operation;

      if (error) {
        throw error;
      }

      closeModal();
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Excluir esta postagem? Essa ação não pode ser desfeita.");

    if (!confirmed) {
      return;
    }

    setLoadingId(id);

    try {
      const { error } = await supabase.from("contents").delete().eq("id", id);

      if (error) {
        throw error;
      }

      if (editingContentId === id) {
        closeModal();
      }

      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  function duplicateToNew() {
    setEditorMode("create");
    setEditingContentId(null);
    setForm((current) => ({
      ...current,
      ativo: true,
    }));
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Conteúdos
            </p>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Gerenciar postagens</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Visual mais limpo, com edição em popup para ajustar foto, legenda, tipo e status sem sair da tela.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            style={{ color: "#fff" }}
          >
            + Publicar
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map(([value, label]) => {
            const active = contentFilter === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setContentFilter(value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-transparent hover:bg-muted"
                }`}
                style={active ? { color: "#fff" } : undefined}
              >
                {label}
              </button>
            );
          })}

          <span className="ml-auto hidden items-center rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground sm:inline-flex">
            {visibleContents.length} {visibleContents.length === 1 ? "postagem" : "postagens"}
          </span>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 sm:hidden">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {visibleContents.length} {visibleContents.length === 1 ? "postagem" : "postagens"}
          </span>
        </div>

        {visibleContents.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleContents.map((content) => {
              const professional =
                professionals.find((item) => item.id === content.professional_id) ?? null;
              const professionalName = professional?.nome ?? "Profissional";
              const typeLabel = (content.content_type ?? "feed") === "story" ? "Story" : "Feed";

              return (
                <article key={content.id} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <div className="relative aspect-[4/5] bg-muted">
                    {content.imagem_url ? (
                      <Image
                        src={content.imagem_url}
                        alt={`Conteúdo de ${professionalName}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        Conteúdo sem imagem
                      </div>
                    )}

                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                      <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground backdrop-blur">
                        {typeLabel}
                      </span>
                      <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground backdrop-blur">
                        {content.ativo ? "Ativa" : "Inativa"}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition group-hover:bg-black/10 group-hover:opacity-100 group-focus-within:bg-black/10 group-focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => openEditModal(content)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                        aria-label="Editar postagem"
                      >
                        <PencilIcon />
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(content.id)}
                        disabled={loadingId === content.id}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-black/50 text-white backdrop-blur transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-70"
                        aria-label="Excluir postagem"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border bg-muted">
                        {professional?.foto_perfil_url ? (
                          <Image
                            src={professional.foto_perfil_url}
                            alt={professional.nome}
                            fill
                            sizes="44px"
                            className="object-cover object-center"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{professionalName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {professional?.especialidades ?? "Profissional cadastrado"}
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-foreground">
                      {content.legenda}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-border px-3 py-1">
                        {content.is_premium ? "Premium" : "Padrão"}
                      </span>
                      <span className="rounded-full border border-border px-3 py-1">
                        {content.imagem_url ? "Imagem vinculada" : "Sem imagem"}
                      </span>
                      <span className="rounded-full border border-border px-3 py-1">
                        Atualizada em {new Date(content.updated_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhuma postagem encontrada com este filtro.
          </div>
        )}
      </section>

      {editorMounted ? (
        <div
          className={`fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-2 backdrop-blur-sm transition-opacity duration-300 ease-out sm:items-center sm:p-4 ${editorOpen ? "opacity-100" : "opacity-0"}`}
          role="presentation"
          onClick={closeModal}
        >
          <div
            className={`flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl transition-all duration-300 ease-out sm:rounded-3xl ${editorOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
            role="dialog"
            aria-modal="true"
            aria-label={editorMode === "edit" ? "Editar postagem" : "Nova postagem"}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {editorMode === "edit" ? "Editar conteúdo" : "Novo conteúdo"}
                </p>
                <h3 className="font-heading text-2xl font-semibold">
                  {editorMode === "edit" ? "Ajustar postagem" : "Publicar postagem"}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Faça os ajustes diretamente no popup, sem navegar para outra página.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition hover:bg-muted"
                aria-label="Fechar editor"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="grid min-h-0 gap-4 overflow-y-auto p-4 sm:p-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    1. Quem está postando?
                  </p>

                  <label className="mt-4 block text-sm font-semibold">Profissional</label>
                  <select
                    value={form.professional_id}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, professional_id: event.target.value }))
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
                    Esse perfil aparece no feed e nas páginas públicas.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    2. Formato
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, content_type: "feed" }))}
                      className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                        form.content_type === "feed"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-transparent hover:bg-muted"
                      }`}
                      style={form.content_type === "feed" ? { color: "#fff" } : undefined}
                    >
                      Feed
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, content_type: "story" }))}
                      className={`h-12 rounded-xl border px-4 text-sm font-semibold transition ${
                        form.content_type === "story"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-transparent hover:bg-muted"
                      }`}
                      style={form.content_type === "story" ? { color: "#fff" } : undefined}
                    >
                      Story
                    </button>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Feed vai para o card principal. Story entra no topo do app.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    3. Imagem
                  </p>

                  <label className="mt-4 block text-sm font-semibold">URL da imagem</label>
                  <input
                    value={form.imagem_url}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, imagem_url: event.target.value }))
                    }
                    placeholder="Cole o link da foto"
                    className="mt-2 h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                  />

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Dica: use uma imagem vertical ou quadrada, com boa leitura e pouco ruído visual.
                  </p>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted">
                    {form.imagem_url.trim() ? (
                      <div className="relative aspect-[4/5] w-full">
                        <Image
                          src={form.imagem_url.trim()}
                          alt="Prévia da imagem da postagem"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        A prévia da imagem aparece aqui.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    4. Legenda
                  </p>

                  <textarea
                    value={form.legenda}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, legenda: event.target.value }))
                    }
                    rows={6}
                    placeholder="Escreva como se fosse um post do Instagram..."
                    className="mt-4 w-full rounded-xl border border-input bg-transparent px-4 py-3 outline-none"
                  />

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{form.legenda.trim().length} caracteres</span>
                    <span>Texto curto e direto costuma performar melhor no feed.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 min-w-0">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    Prévia
                  </p>

                  <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
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
                        {selectedTypeLabel}
                      </span>
                    </div>

                    <div className="aspect-[4/5] w-full bg-muted">
                      {form.imagem_url.trim() ? (
                        <div className="relative h-full min-h-[320px] w-full">
                          <Image
                            src={form.imagem_url.trim()}
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
                        {form.legenda.trim() || "Sua legenda vai aparecer aqui."}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border px-3 py-1">
                          {form.content_type === "feed" ? "Vai para o feed" : "Vai para stories"}
                        </span>
                        <span className="rounded-full border border-border px-3 py-1">
                          {form.is_premium ? "Premium ligado" : "Premium desligado"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    5. Publicação
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.is_premium}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, is_premium: event.target.checked }))
                        }
                      />
                      Premium
                    </label>

                    <label className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.ativo}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, ativo: event.target.checked }))
                        }
                      />
                      Ativo
                    </label>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => void handleSave()}
                      disabled={loadingId === "create" || loadingId === editingContentId}
                      className="h-12 flex-1 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
                      style={{ color: "#fff" }}
                    >
                      {editorMode === "edit"
                        ? loadingId === editingContentId
                          ? "Salvando..."
                          : "Salvar ajustes"
                        : loadingId === "create"
                          ? "Publicando..."
                          : "Publicar postagem"}
                    </button>

                    {editorMode === "edit" ? (
                      <button
                        type="button"
                        onClick={duplicateToNew}
                        className="h-12 rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-muted"
                      >
                        Duplicar
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

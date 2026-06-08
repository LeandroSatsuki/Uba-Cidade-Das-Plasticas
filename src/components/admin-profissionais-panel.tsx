"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Professional } from "@/types/content";

type AdminProfessionalsPanelProps = {
  professionals: Professional[];
};

type ProfessionalForm = {
  base44_id: string;
  nome: string;
  foto_perfil_url: string;
  especialidades: string;
  descricao_curta: string;
  formacao: string;
  crm: string;
  registro_sbcp: string;
  telefone: string;
  whatsapp: string;
  ativo: boolean;
};

const blankProfessionalForm: ProfessionalForm = {
  base44_id: "",
  nome: "",
  foto_perfil_url: "",
  especialidades: "",
  descricao_curta: "",
  formacao: "",
  crm: "",
  registro_sbcp: "",
  telefone: "",
  whatsapp: "",
  ativo: true,
};

function normalizeOptional(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function slugifyBase44Id(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fromProfessional(professional: Professional): ProfessionalForm {
  return {
    base44_id: professional.base44_id ?? "",
    nome: professional.nome ?? "",
    foto_perfil_url: professional.foto_perfil_url ?? "",
    especialidades: professional.especialidades ?? "",
    descricao_curta: professional.descricao_curta ?? "",
    formacao: professional.formacao ?? "",
    crm: professional.crm ?? "",
    registro_sbcp: professional.registro_sbcp ?? "",
    telefone: professional.telefone ?? "",
    whatsapp: professional.whatsapp ?? "",
    ativo: professional.ativo,
  };
}

export function AdminProfessionalsPanel({ professionals }: AdminProfessionalsPanelProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<ProfessionalForm>(blankProfessionalForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const selectedProfessional = useMemo(() => {
    if (!form.foto_perfil_url.trim()) {
      return null;
    }

    return {
      id: "preview",
      base44_id: normalizeOptional(form.base44_id),
      nome: form.nome.trim() || "Profissional cadastrado",
      foto_perfil_url: form.foto_perfil_url.trim(),
      especialidades: normalizeOptional(form.especialidades),
      descricao_curta: normalizeOptional(form.descricao_curta),
      formacao: normalizeOptional(form.formacao),
      crm: normalizeOptional(form.crm),
      registro_sbcp: normalizeOptional(form.registro_sbcp),
      telefone: normalizeOptional(form.telefone),
      whatsapp: normalizeOptional(form.whatsapp),
      ativo: form.ativo,
      created_at: "",
      updated_at: "",
    } as Professional;
  }, [form]);

  async function handleSave() {
    if (!form.nome.trim()) {
      return;
    }

    const payload = {
      base44_id: normalizeOptional(form.base44_id) ?? slugifyBase44Id(form.nome),
      nome: form.nome.trim(),
      foto_perfil_url: normalizeOptional(form.foto_perfil_url),
      especialidades: normalizeOptional(form.especialidades),
      descricao_curta: normalizeOptional(form.descricao_curta),
      formacao: normalizeOptional(form.formacao),
      crm: normalizeOptional(form.crm),
      registro_sbcp: normalizeOptional(form.registro_sbcp),
      telefone: normalizeOptional(form.telefone),
      whatsapp: normalizeOptional(form.whatsapp),
      ativo: form.ativo,
    };

    setLoadingId(editingId ?? "create");

    try {
      const operation = editingId
        ? supabase.from("professionals").update(payload).eq("id", editingId)
        : supabase.from("professionals").insert(payload);

      const { error } = await operation;

      if (error) {
        throw error;
      }

      setEditingId(null);
      setForm(blankProfessionalForm);
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function toggleActive(id: string, ativo: boolean) {
    setLoadingId(id);

    try {
      const { error } = await supabase.from("professionals").update({ ativo: !ativo }).eq("id", id);

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
      const { error } = await supabase.from("professionals").delete().eq("id", id);

      if (error) {
        throw error;
      }

      if (editingId === id) {
        setEditingId(null);
        setForm(blankProfessionalForm);
      }

      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  function startEditing(professional: Professional) {
    setEditingId(professional.id);
    setForm(fromProfessional(professional));
  }

  function resetForm() {
    setEditingId(null);
    setForm(blankProfessionalForm);
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              {editingId ? "Editar profissional" : "Novo profissional"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Cadastre o perfil que vai aparecer no feed, no card e na página do profissional.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {editingId ? "Modo edição" : "Cadastro rápido"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                1. Identificação
              </p>

              <div className="mt-4 grid gap-4">
                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Nome</span>
                  <input
                    value={form.nome}
                    onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                    placeholder="Nome do profissional"
                    className="h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Identificador da URL</span>
                  <input
                    value={form.base44_id}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, base44_id: event.target.value }))
                    }
                    placeholder="ex: dra-joana-souza"
                    className="h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                  />
                </label>

                <p className="text-xs leading-5 text-muted-foreground">
                  Esse identificador abre a página pública do profissional. Se deixar vazio, o sistema tenta gerar um automaticamente.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                2. Aparência
              </p>

              <div className="mt-4 grid gap-4">
                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Foto URL</span>
                  <input
                    value={form.foto_perfil_url}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, foto_perfil_url: event.target.value }))
                    }
                    placeholder="Cole o link da foto"
                    className="h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Especialidades</span>
                  <input
                    value={form.especialidades}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, especialidades: event.target.value }))
                    }
                    placeholder="ex: Lipo, Mommy Makeover, Rinoplastia"
                    className="h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-semibold">Descrição curta</span>
                  <textarea
                    value={form.descricao_curta}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, descricao_curta: event.target.value }))
                    }
                    rows={4}
                    placeholder="Resumo curto para a vitrine e perfil"
                    className="w-full rounded-xl border border-input bg-transparent px-4 py-3 outline-none"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                3. Credenciais e contato
              </p>

              <div className="mt-4 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm">
                    <span className="font-semibold">CRM</span>
                    <input
                      value={form.crm}
                      onChange={(event) => setForm((current) => ({ ...current, crm: event.target.value }))}
                      placeholder="número do CRM"
                      className="h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                    />
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="font-semibold">Registro SBCP</span>
                    <input
                      value={form.registro_sbcp}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, registro_sbcp: event.target.value }))
                      }
                      placeholder="registro, se houver"
                      className="h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm">
                    <span className="font-semibold">Telefone</span>
                    <input
                      value={form.telefone}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, telefone: event.target.value }))
                      }
                      placeholder="(xx) xxxx-xxxx"
                      className="h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                    />
                  </label>

                  <label className="grid gap-2 text-sm">
                    <span className="font-semibold">WhatsApp</span>
                    <input
                      value={form.whatsapp}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, whatsapp: event.target.value }))
                      }
                      placeholder="(xx) 9xxxx-xxxx"
                      className="h-12 w-full rounded-xl border border-input bg-transparent px-4 outline-none"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                4. Status
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
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
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={loadingId === "create" || loadingId === editingId}
                className="h-12 flex-1 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
                style={{ color: "#fff" }}
              >
                {loadingId === (editingId ?? "create")
                  ? editingId
                    ? "Salvando..."
                    : "Cadastrando..."
                  : editingId
                    ? "Salvar alterações"
                    : "Cadastrar profissional"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="h-12 rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-muted"
              >
                Limpar formulário
              </button>
            </div>
          </div>

          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Prévia
              </p>

              <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-3 p-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-muted">
                    {selectedProfessional?.foto_perfil_url ? (
                      <Image
                        src={selectedProfessional.foto_perfil_url}
                        alt={selectedProfessional.nome}
                        fill
                        sizes="56px"
                        className="object-cover object-center"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {form.nome.trim() || "Profissional cadastrado"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {form.especialidades.trim() || "Especialidades aqui"}
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {form.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="aspect-[4/5] w-full bg-muted">
                  {form.foto_perfil_url.trim() ? (
                    <div className="relative h-full min-h-[320px] w-full">
                      <Image
                        src={form.foto_perfil_url.trim()}
                        alt="Prévia da foto do profissional"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[320px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                      A foto do profissional aparece aqui.
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-foreground">
                    {form.descricao_curta.trim() || "Uma descrição curta vai aparecer aqui."}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border px-3 py-1">
                      {form.base44_id.trim() || "base44_id pendente"}
                    </span>
                    <span className="rounded-full border border-border px-3 py-1">
                      {form.whatsapp.trim() ? "WhatsApp preenchido" : "WhatsApp vazio"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Profissionais cadastrados
              </p>

              <div className="mt-4 grid gap-3">
                {professionals.length > 0 ? (
                  professionals.map((professional) => (
                    <article
                      key={professional.id}
                      className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                          {professional.foto_perfil_url ? (
                            <Image
                              src={professional.foto_perfil_url}
                              alt={professional.nome}
                              fill
                              sizes="48px"
                              className="object-cover object-center"
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{professional.nome}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {professional.base44_id ?? "sem identificador"}
                              </p>
                            </div>

                            <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              {professional.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {professional.especialidades ?? professional.descricao_curta ?? "Sem descrição"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => startEditing(professional)}
                          className="h-10 rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-muted"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => void toggleActive(professional.id, professional.ativo)}
                          disabled={loadingId === professional.id}
                          className="h-10 rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {professional.ativo ? "Desativar" : "Ativar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(professional.id)}
                          disabled={loadingId === professional.id}
                          className="h-10 rounded-xl border border-destructive/30 px-4 text-sm font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          Excluir
                        </button>

                        {professional.base44_id ? (
                          <Link
                            href={`/profissionais/${professional.base44_id}`}
                            className="flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold transition hover:bg-muted"
                          >
                            Ver perfil
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                    Nenhum profissional cadastrado ainda.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

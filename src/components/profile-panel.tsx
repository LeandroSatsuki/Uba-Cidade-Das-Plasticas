"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  PLASTIC_SURGERY_INTEREST_OPTIONS,
  calculateProfileCompleteness,
} from "@/lib/profile-completeness";
import type { Profile } from "@/types/content";

type ProfilePanelProps = {
  profile: Profile | null;
  authEmail: string | null;
};

function formatBirthDate(value: string | null) {
  if (!value) {
    return "";
  }

  return value;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível salvar seu perfil.";
}

export function ProfilePanel({ profile, authEmail }: ProfilePanelProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [birthDate, setBirthDate] = useState(formatBirthDate(profile?.birth_date ?? null));
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [interests, setInterests] = useState<string[]>(
    profile?.plastic_surgery_interests ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const completeness = calculateProfileCompleteness({
    full_name: fullName,
    email: profile?.email ?? authEmail,
    phone,
    city,
    avatar_url: avatarUrl,
    plastic_surgery_interests: interests,
  });

  async function handleSave() {
    if (!profile) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          city: city.trim() || null,
          birth_date: birthDate || null,
          avatar_url: avatarUrl.trim() || null,
          plastic_surgery_interests: interests,
        })
        .eq("id", profile.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess("Perfil atualizado com sucesso.");
      router.refresh();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      router.replace("/entrar");
      router.refresh();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  }

  function toggleInterest(value: string) {
    setInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  return (
    <div className="space-y-5">
      <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted">
            {avatarUrl.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl.trim()}
                alt={fullName || "Foto de perfil"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-heading text-xl font-bold text-muted-foreground">
                {(fullName || profile?.email || "UB").slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Perfil do usuário
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold leading-tight">
              {fullName || "Complete seu perfil"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {profile?.email ?? authEmail ?? "E-mail não disponível"}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Perfil {completeness.percentage}% completo</p>
              <p className="text-xs text-muted-foreground">
                {completeness.filledCount} de {completeness.totalCount} itens preenchidos
              </p>
            </div>
            {profile?.role === "admin" ? (
              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
                Admin
              </span>
            ) : null}
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completeness.percentage}%` }}
            />
          </div>
        </div>

        {completeness.suggestions.length > 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-4">
            <p className="text-sm font-semibold">Para completar seu perfil, falta:</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {completeness.suggestions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>

      <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-heading text-2xl font-semibold">Editar perfil</h2>

        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="font-semibold">Nome completo</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold">E-mail</span>
            <input
              value={profile?.email ?? authEmail ?? ""}
              disabled
              className="h-12 rounded-xl border border-input bg-muted px-4 text-muted-foreground outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold">Telefone</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(32) 99999-9999"
              className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold">Cidade</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ubá - MG"
              className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold">Data de nascimento</span>
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold">Avatar URL</span>
            <input
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://..."
              className="h-12 rounded-xl border border-input bg-transparent px-4 outline-none"
            />
          </label>

          <div className="grid gap-3">
            <p className="text-sm font-semibold">Cirurgias plásticas de interesse</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PLASTIC_SURGERY_INTEREST_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(option)}
                    onChange={() => toggleInterest(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {profile?.role ? (
            <div className="grid gap-2 text-sm">
              <span className="font-semibold">Status</span>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
                  Papel: {profile.role}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
                  Premium: {profile.premium_status}
                </span>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
              {success}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={loading || !profile}
              className="h-12 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>

            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loading}
              className="h-12 rounded-xl border border-border px-4 text-sm font-bold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
            >
              Sair
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

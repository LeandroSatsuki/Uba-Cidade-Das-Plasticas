"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthSplitLayout } from "@/components/auth-split-layout";
import { createClient } from "@/lib/supabase/client";
import { getSafeNextPath } from "@/lib/safe-next";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível entrar. Verifique seus dados e tente novamente.";
}

type EntrarFormProps = {
  callbackErrorMessage?: string;
  nextPath?: string;
};

export function EntrarForm({
  callbackErrorMessage,
  nextPath = "/",
}: EntrarFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Informe seu e-mail.");
      return;
    }

    if (!password) {
      setError("Informe sua senha.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        setError(getErrorMessage(signInError));
        return;
      }

      window.location.replace(getSafeNextPath(nextPath, "/"));
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleLogin();
  }

  return (
    <AuthSplitLayout
      heroEyebrow="Cidade das Plásticas"
      heroTitle="Descubra os melhores cirurgiões de Ubá."
      heroDescription="Acesse conteúdos premium, acompanhe novidades e entre na sua conta em uma experiência mais limpa e elegante."
      heroImageUrl="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd9d?auto=format&fit=crop&w=1600&q=80"
      heroImageAlt="Recepção minimalista com iluminação suave"
    >
      <div className="flex flex-col justify-center">
        <div className="mb-10 flex justify-center lg:mb-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-white/95 text-sm font-semibold tracking-[0.24em] text-foreground shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            UBÁ
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Acesse sua conta
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance text-foreground sm:text-5xl lg:text-[3.25rem]">
              Entrar na sua conta
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
              Entre para ver conteúdos premium e continuar sua navegação.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-foreground/70"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-14 w-full rounded-2xl border border-black/10 bg-white/90 px-4 text-[0.95rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-muted-foreground/70 focus:border-black/20 focus:ring-4 focus:ring-black/5"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-foreground/70"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-14 w-full rounded-2xl border border-black/10 bg-white/90 px-4 pr-11 text-[0.95rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-muted-foreground/70 focus:border-black/20 focus:ring-4 focus:ring-black/5"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ◉
                </span>
              </div>
            </div>

            {error ? (
              <p className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {!error && callbackErrorMessage ? (
              <p className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {callbackErrorMessage}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => void handleLogin()}
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-[#101010] px-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(16,16,16,0.2)] transition hover:translate-y-[-1px] hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-4 text-right">
            <button
              type="button"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Esqueci minha senha
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-muted-foreground lg:text-left">
            Ainda não tem conta?{" "}
            <Link href="/login" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

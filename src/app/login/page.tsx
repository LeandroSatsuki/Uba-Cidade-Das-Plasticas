"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthSplitLayout } from "@/components/auth-split-layout";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir o cadastro. Tente novamente.";
}

export default function LoginPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Informe seu nome completo.");
      return;
    }

    if (!trimmedEmail) {
      setError("Informe seu e-mail.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const siteUrl = getSiteUrl();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?next=/`,
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (signUpError) {
        setError(getErrorMessage(signUpError));
        return;
      }

      if (data.session) {
        window.location.replace("/");
        return;
      }

      setSuccess(
        "Conta criada. Enviamos um link de confirmação para seu e-mail. Confirme para acessar.",
      );
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitLayout
      heroEyebrow="Cadastro gratuito"
      heroTitle="Crie sua conta e acompanhe tudo em um só lugar."
      heroDescription="Entre para acessar a plataforma, acompanhar conteúdos premium e receber novidades com uma experiência visual mais limpa."
      heroImageUrl="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
      heroImageAlt="Espaço elegante com iluminação suave e recepção minimalista"
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
              Comece por aqui
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance text-foreground sm:text-5xl lg:text-[3.25rem]">
              Criar sua conta
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
              Gratuito. Sem cartão de crédito. Faça seu cadastro em poucos passos.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-foreground/70"
              >
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-14 w-full rounded-2xl border border-black/10 bg-white/90 px-4 text-[0.95rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-muted-foreground/70 focus:border-black/20 focus:ring-4 focus:ring-black/5"
              />
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-14 w-full rounded-2xl border border-black/10 bg-white/90 px-4 pr-11 text-[0.95rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-muted-foreground/70 focus:border-black/20 focus:ring-4 focus:ring-black/5"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ◉
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-foreground/70"
              >
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
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

            {success ? (
              <p className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-[#101010] px-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(16,16,16,0.2)] transition hover:translate-y-[-1px] hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Criando conta..." : "Criar conta grátis"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground lg:text-left">
            Já tem uma conta?{" "}
            <Link href="/entrar" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

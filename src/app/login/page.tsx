"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir o cadastro. Tente novamente.";
}

export default function LoginPage() {
  const router = useRouter();
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
        router.replace("/");
        router.refresh();
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
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-6">
          <Link href="/" className="font-heading text-xl font-bold tracking-tight">
            Cidade das Plásticas
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xl text-muted-foreground" aria-hidden="true">
              ♢
            </span>

            <Link
              href="/premium"
              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
            >
              <span aria-hidden="true">♛</span>
              Premium
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-lg flex-col px-6 pb-24 pt-9">
        <div className="mb-9 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-primary text-primary-foreground shadow-sm">
            <span className="font-heading text-sm font-bold">UBÁ</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold leading-tight">
              Criar sua conta
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gratuito. Sem cartão de crédito.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-[0.2em]"
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
                className="h-12 w-full rounded-xl border border-input bg-transparent px-4 text-sm shadow-sm outline-none transition focus:border-ring"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-[0.2em]"
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
                className="h-12 w-full rounded-xl border border-input bg-transparent px-4 text-sm shadow-sm outline-none transition focus:border-ring"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-[0.2em]"
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
                  className="h-12 w-full rounded-xl border border-input bg-transparent px-4 pr-11 text-sm shadow-sm outline-none transition focus:border-ring"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ◉
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-bold uppercase tracking-[0.2em]"
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
                  className="h-12 w-full rounded-xl border border-input bg-transparent px-4 pr-11 text-sm shadow-sm outline-none transition focus:border-ring"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ◉
                </span>
              </div>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Criando conta..." : "Criar conta grátis"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/entrar" className="font-semibold text-foreground">
              Entrar
            </Link>
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

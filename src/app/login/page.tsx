import Link from "next/link";

export default function LoginPage() {
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

          <form className="space-y-6">
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
                  className="h-12 w-full rounded-xl border border-input bg-transparent px-4 pr-11 text-sm shadow-sm outline-none transition focus:border-ring"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ◉
                </span>
              </div>
            </div>

            <button
              type="button"
              className="h-12 w-full rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Criar conta grátis
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

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3 text-xs text-muted-foreground">
          <Link href="/" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">⌂</span>
            Início
          </Link>
          <Link href="/feed" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">□</span>
            Guia
          </Link>
          <Link href="/login" className="flex flex-col items-center justify-center gap-1 text-foreground">
            <span className="text-xl">♙</span>
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  );
}

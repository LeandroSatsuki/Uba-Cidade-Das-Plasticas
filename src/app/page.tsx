import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link href="/" className="font-heading text-lg font-bold tracking-tight">
            Cidade das Plásticas
          </Link>

          <Link
            href="/premium"
            className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            <span aria-hidden="true">♛</span>
            Premium
          </Link>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-lg flex-col px-6 pb-24 pt-10">
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-primary text-primary-foreground shadow-sm">
              <span className="font-heading text-lg font-bold">UBÁ</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Plataforma Premium
            </p>

            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight">
              Cidade das Plásticas
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Uma plataforma centralizando informações, conteúdos e perfis de
              profissionais da área de cirurgia plástica e estética em Ubá.
            </p>
          </div>

          <div className="mt-9 space-y-3">
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
            >
              Criar conta grátis
            </Link>

            <Link
              href="/guia"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-bold shadow-sm transition hover:bg-muted"
            >
              Ver guia de conteúdos
            </Link>

            <Link
              href="/premium"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-accent px-4 text-sm font-bold text-accent-foreground shadow-sm transition hover:opacity-90"
            >
              Conhecer Premium
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-xl font-semibold">
              O que você encontra aqui?
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>• Conteúdos organizados sobre procedimentos.</p>
              <p>• Perfis de profissionais cadastrados.</p>
              <p>• Acesso premium para áreas exclusivas.</p>
            </div>
          </div>
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3 text-xs text-muted-foreground">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 text-foreground">
            <span className="text-xl">⌂</span>
            Início
          </Link>
          <Link href="/guia" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">□</span>
            Guia
          </Link>
          <Link href="/login" className="flex flex-col items-center justify-center gap-1">
            <span className="text-xl">♙</span>
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  );
}

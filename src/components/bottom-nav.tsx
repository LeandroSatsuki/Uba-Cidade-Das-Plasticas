"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavProps = {
  className?: string;
};

function resolveActivePath(pathname: string) {
  if (pathname === "/login" || pathname === "/entrar" || pathname.startsWith("/perfil")) {
    return "/perfil";
  }

  if (pathname.startsWith("/feed")) {
    return "/feed";
  }

  if (pathname.startsWith("/guia")) {
    return "/guia";
  }

  if (pathname.startsWith("/premium")) {
    return "/premium";
  }

  if (pathname === "/") {
    return "/";
  }

  return "";
}

function isActive(pathname: string, href: string) {
  const activePath = resolveActivePath(pathname);

  if (href === "/") {
    return activePath === "/";
  }

  return activePath === href || activePath.startsWith(`${href}/`);
}

function NavItems({ pathname, desktop = false }: { pathname: string; desktop?: boolean }) {
  const items = desktop
    ? [
        { href: "/", label: "Início", icon: "⌂" },
        { href: "/feed", label: "Feed", icon: "□" },
        { href: "/guia", label: "Guia", icon: "✎" },
        { href: "/premium", label: "Premium", icon: "♛" },
        { href: "/perfil", label: "Perfil", icon: "♙" },
      ]
    : [
        { href: "/", label: "Início", icon: "⌂" },
        { href: "/feed", label: "Feed", icon: "□" },
        { href: "/perfil", label: "Perfil", icon: "♙" },
      ];

  return (
    <>
      {items.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              desktop
                ? "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition"
                : "relative flex flex-col items-center justify-center gap-1 transition",
              active
                ? desktop
                  ? "bg-muted font-semibold text-foreground"
                  : "font-semibold text-foreground"
                : desktop
                  ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                  : "text-muted-foreground",
            ].join(" ")}
          >
            {desktop ? null : active ? (
              <span className="absolute top-1 h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
            ) : null}
            <span className={desktop ? "text-lg" : "text-xl"}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <>
      <nav
        className={[
          "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3 text-xs">
          <NavItems pathname={pathname} />
        </div>
      </nav>

      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-border lg:bg-background/95 lg:backdrop-blur-xl">
        <div className="flex h-14 items-center border-b border-border px-6">
          <Link href="/" className="font-heading text-lg font-bold tracking-tight">
            Cidade das Plásticas
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 px-4 py-5">
          <nav className="space-y-1">
            <NavItems pathname={pathname} desktop />
          </nav>

          <div className="mt-auto space-y-3 rounded-[1.5rem] border border-border bg-card p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Acesso rápido
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Navegue pelas áreas principais com a experiência desktop.
            </p>
            <div className="grid gap-2">
              <Link
                href="/premium"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
              >
                Ver Premium
              </Link>
              <Link
                href="/guia"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold transition hover:bg-muted"
              >
                Abrir guia
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

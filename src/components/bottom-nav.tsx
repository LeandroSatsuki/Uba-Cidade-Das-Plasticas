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

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Início", icon: "⌂" },
    { href: "/feed", label: "Feed", icon: "□" },
    { href: "/perfil", label: "Perfil", icon: "♙" },
  ];

  return (
    <nav
      className={[
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-3 text-xs">
        {items.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "relative flex flex-col items-center justify-center gap-1 transition",
                active ? "text-foreground font-semibold" : "text-muted-foreground",
              ].join(" ")}
            >
              {active ? (
                <span className="absolute top-1 h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
              ) : null}
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

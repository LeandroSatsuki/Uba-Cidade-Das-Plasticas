import Link from "next/link";

const tabs = [
  { href: "/admin", label: "Início" },
  { href: "/admin/postagens", label: "Conteúdos" },
  { href: "/admin/profissionais", label: "Profissionais" },
] as const;

type AdminSectionTabsProps = {
  currentPath: (typeof tabs)[number]["href"];
};

export function AdminSectionTabs({ currentPath }: AdminSectionTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const active = tab.href === currentPath;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
            style={active ? { color: "#fff" } : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

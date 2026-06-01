import Image from "next/image";
import Link from "next/link";
import type { Professional } from "@/types/content";

type StoriesRailProps = {
  professionals: Professional[];
  showSelfStory?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function StoriesRail({ professionals, showSelfStory = true }: StoriesRailProps) {
  const storyItems = professionals.slice(0, 6);

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Stories</h2>
        <span className="text-xs text-muted-foreground">Atualizações rápidas</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {showSelfStory ? (
          <Link href="/perfil" className="flex min-w-[76px] flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-sm font-bold text-primary">
              Você
            </div>
            <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
              Seu perfil
            </span>
          </Link>
        ) : null}

        {storyItems.map((professional) => {
          const href = professional.base44_id
            ? `/profissionais/${professional.base44_id}`
            : "/feed";

          return (
            <Link
              key={professional.id}
              href={href}
              className="flex min-w-[76px] flex-col items-center gap-2"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-accent bg-muted p-0.5">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-background">
                  {professional.foto_perfil_url ? (
                    <Image
                      src={professional.foto_perfil_url}
                      alt={professional.nome}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-heading text-sm font-bold text-muted-foreground">
                      {getInitials(professional.nome)}
                    </span>
                  )}
                </div>
              </div>
              <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
                {professional.nome}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

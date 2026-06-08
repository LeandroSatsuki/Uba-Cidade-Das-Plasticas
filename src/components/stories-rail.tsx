import Image from "next/image";
import Link from "next/link";
import type { Content, Professional } from "@/types/content";

type StoriesRailProps = {
  stories: Content[];
  professionals: Professional[];
};

function getProfessionalForStory(story: Content, professionals: Professional[]) {
  return professionals.find((professional) => professional.id === story.professional_id) ?? null;
}

function getFallbackStories(professionals: Professional[]) {
  return professionals.slice(0, 6).map((professional) => ({
    id: professional.id,
    base44_id: professional.base44_id,
    professional_id: professional.id,
    author_id: null,
    content_type: "story" as const,
    imagem_url: professional.foto_perfil_url,
    legenda: professional.especialidades ?? professional.nome,
    is_premium: false,
    ativo: true,
    created_at: professional.created_at,
    updated_at: professional.updated_at,
  }));
}

export function StoriesRail({ stories, professionals }: StoriesRailProps) {
  const storyItems = stories.length > 0 ? stories : getFallbackStories(professionals);

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
      {storyItems.map((story) => {
        const professional = getProfessionalForStory(story, professionals);
        const href =
          professional?.base44_id ? `/profissionais/${professional.base44_id}` : "/feed";

        return (
          <Link
            key={story.id}
            href={href}
            className="flex min-w-[84px] flex-col items-center gap-2"
          >
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-accent bg-muted p-0.5">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-background">
                {story.imagem_url ? (
                  <Image
                    src={story.imagem_url}
                    alt={professional?.nome ?? "Story"}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : professional?.foto_perfil_url ? (
                  <Image
                    src={professional.foto_perfil_url}
                    alt={professional.nome}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-heading text-sm font-bold text-muted-foreground">
                    {professional?.nome?.slice(0, 2).toUpperCase() ?? "CP"}
                  </span>
                )}
              </div>
            </div>

            <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
              {professional?.nome ?? "Conteúdo"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

import "server-only";

import { base44Contents, base44Professionals } from "@/lib/base44-data";
import { getCurrentViewerProfile } from "@/lib/current-profile";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Content,
  ContentComment,
  ContentCommentAuthor,
  ContentLike,
  FeedPostWithStats,
  Professional,
  Profile,
} from "@/types/content";

type ViewerProfile = Awaited<ReturnType<typeof getCurrentViewerProfile>>;

type FeedGraphData = {
  viewer: ViewerProfile;
  professionals: Professional[];
  contents: Content[];
  stories: Content[];
  likes: ContentLike[];
  comments: ContentComment[];
  commentAuthors: ContentCommentAuthor[];
};

type ProfessionalPageData = {
  viewer: ViewerProfile;
  professional: Professional | null;
  professionals: Professional[];
  posts: FeedPostWithStats[];
};

type AdminPostagensData = {
  viewer: ViewerProfile;
  professionals: Professional[];
  contents: Content[];
};

type AdminProfessionalsData = {
  viewer: ViewerProfile;
  professionals: Professional[];
};

type ProfilePageData = {
  viewer: ViewerProfile;
  profile: Profile | null;
};

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function mapProfilesById(profiles: ContentCommentAuthor[]) {
  return new Map(profiles.map((profile) => [profile.id, profile]));
}

function mapFallbackProfessionals(): Professional[] {
  return base44Professionals.map((professional) => ({
    id: professional.base44_id,
    base44_id: professional.base44_id,
    nome: professional.nome,
    foto_perfil_url: professional.foto_perfil_url,
    especialidades: professional.especialidades,
    descricao_curta: professional.descricao_curta,
    formacao: professional.formacao,
    crm: professional.crm,
    registro_sbcp: professional.registro_sbcp,
    telefone: professional.telefone,
    whatsapp: professional.whatsapp,
    ativo: true,
    created_at: professional.created_date,
    updated_at: professional.updated_date,
  }));
}

function mapFallbackContents(): Content[] {
  return base44Contents.map((content) => ({
    id: content.base44_id,
    base44_id: content.base44_id,
    professional_id: content.profissional_id,
    author_id: null,
    content_type: "feed",
    imagem_url: content.imagem_url,
    legenda: content.legenda,
    is_premium: false,
    ativo: true,
    created_at: content.created_date,
    updated_at: content.updated_date,
  }));
}

function buildPosts(params: {
  viewerId: string | null;
  professionals: Professional[];
  contents: Content[];
  likes: ContentLike[];
  comments: ContentComment[];
  commentAuthors: ContentCommentAuthor[];
}) {
  const professionalById = new Map(
    params.professionals.map((professional) => [professional.id, professional]),
  );
  const likesByContentId = new Map<string, ContentLike[]>();
  const commentsByContentId = new Map<string, ContentComment[]>();
  const commentsAuthorsById = mapProfilesById(params.commentAuthors);

  for (const like of params.likes) {
    const current = likesByContentId.get(like.content_id) ?? [];
    current.push(like);
    likesByContentId.set(like.content_id, current);
  }

  for (const comment of params.comments) {
    const current = commentsByContentId.get(comment.content_id) ?? [];
    current.push(comment);
    commentsByContentId.set(comment.content_id, current);
  }

  return params.contents.map<FeedPostWithStats>((content) => {
    const contentLikes = likesByContentId.get(content.id) ?? [];
    const contentComments = commentsByContentId.get(content.id) ?? [];

    return {
      content,
      professional: content.professional_id
        ? professionalById.get(content.professional_id) ?? null
        : null,
      likeCount: contentLikes.length,
      viewerHasLiked:
        params.viewerId !== null &&
        contentLikes.some((like) => like.user_id === params.viewerId),
      comments: contentComments.map((comment) => ({
        ...comment,
        author: commentsAuthorsById.get(comment.user_id) ?? null,
      })),
    };
  });
}

async function getFeedGraphData(): Promise<FeedGraphData> {
  const adminClient = createAdminClient();
  const viewer = await getCurrentViewerProfile();

  const [{ data: professionals }, { data: contents }, { data: likes }, { data: comments }] =
    await Promise.all([
      adminClient
        .from("professionals")
        .select("*")
        .eq("ativo", true)
        .order("created_at", { ascending: false }),
      adminClient
        .from("contents")
        .select("*")
        .eq("ativo", true)
        .order("created_at", { ascending: false }),
      adminClient.from("content_likes").select("*"),
      adminClient.from("content_comments").select("*").order("created_at", { ascending: true }),
    ]);

  const commentRecords = (comments ?? []) as ContentComment[];
  const commentAuthorIds = uniqueStrings(commentRecords.map((comment) => comment.user_id));
  const { data: commentAuthors } = commentAuthorIds.length
    ? await adminClient
        .from("profiles")
        .select("id, email, full_name, role")
        .in("id", commentAuthorIds)
    : { data: [] };

  const dbProfessionals = (professionals ?? []) as Professional[];
  const dbContents = (contents ?? []) as Content[];
  const useFallback = dbContents.length === 0;

  return {
    viewer,
    professionals: useFallback ? mapFallbackProfessionals() : dbProfessionals,
    contents: useFallback ? mapFallbackContents() : dbContents,
    stories: useFallback
      ? []
      : dbContents.filter((content) => (content.content_type ?? "feed") === "story"),
    likes: (likes ?? []) as ContentLike[],
    comments: (comments ?? []) as ContentComment[],
    commentAuthors: (commentAuthors ?? []) as ContentCommentAuthor[],
  };
}

export async function loadFeedPageData() {
  const graph = await getFeedGraphData();
  const feedContents = graph.contents.filter((content) => (content.content_type ?? "feed") === "feed");

  return {
    viewer: graph.viewer,
    professionals: graph.professionals,
    stories: graph.stories,
    posts: buildPosts({
      viewerId: graph.viewer.authUserId,
      professionals: graph.professionals,
      contents: feedContents,
      likes: graph.likes,
      comments: graph.comments,
      commentAuthors: graph.commentAuthors,
    }),
  };
}

export async function loadProfessionalPageData(base44Id: string): Promise<ProfessionalPageData> {
  const graph = await getFeedGraphData();
  const professional =
    graph.professionals.find((item) => item.base44_id === base44Id) ?? null;

  const posts = buildPosts({
    viewerId: graph.viewer.authUserId,
    professionals: graph.professionals,
    contents: graph.contents.filter(
      (content) =>
        (content.content_type ?? "feed") === "feed" &&
        content.professional_id === professional?.id,
    ),
    likes: graph.likes,
    comments: graph.comments,
    commentAuthors: graph.commentAuthors,
  });

  return {
    viewer: graph.viewer,
    professional,
    professionals: graph.professionals,
    posts,
  };
}

export async function loadAdminPostagensData(): Promise<AdminPostagensData> {
  const graph = await getFeedGraphData();

  return {
    viewer: graph.viewer,
    professionals: graph.professionals,
    contents: graph.contents,
  };
}

export async function loadAdminProfessionalsData(): Promise<AdminProfessionalsData> {
  const graph = await getFeedGraphData();

  return {
    viewer: graph.viewer,
    professionals: graph.professionals,
  };
}

export async function loadProfilePageData(): Promise<ProfilePageData> {
  const viewer = await getCurrentViewerProfile();

  if (!viewer.authUserId) {
    return {
      viewer,
      profile: null,
    };
  }

  const adminClient = createAdminClient();
  const selectColumns =
    "id, email, full_name, phone, city, birth_date, avatar_url, plastic_surgery_interests, role, premium_status, premium_since, premium_until, stripe_customer_id, created_at, updated_at";

  let { data: profile } = await adminClient
    .from("profiles")
    .select(selectColumns)
    .eq("id", viewer.authUserId)
    .maybeSingle();

  if (!profile && viewer.authEmail) {
    const profileUpsertPayload = {
      id: viewer.authUserId,
      email: viewer.authEmail,
      full_name: viewer.authFullName ?? "",
    };

    const { error: upsertError } = await adminClient.from("profiles").upsert(
      profileUpsertPayload as never,
      {
        onConflict: "id",
      },
    );

    if (!upsertError) {
      const { data: createdProfile } = await adminClient
        .from("profiles")
        .select(selectColumns)
        .eq("id", viewer.authUserId)
        .maybeSingle();

      profile = createdProfile ?? null;
    }
  }

  return {
    viewer,
    profile: (profile as Profile | null) ?? null,
  };
}

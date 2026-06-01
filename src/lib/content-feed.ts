import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Content,
  ContentComment,
  ContentCommentAuthor,
  ContentLike,
  FeedPostWithStats,
  Professional,
  Profile,
} from "@/types/content";

type ViewerProfile = {
  authUserId: string | null;
  profile: Profile | null;
};

type FeedGraphData = {
  viewer: ViewerProfile;
  professionals: Professional[];
  contents: Content[];
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

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function mapProfilesById(profiles: ContentCommentAuthor[]) {
  return new Map(profiles.map((profile) => [profile.id, profile]));
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

async function getViewerProfile(): Promise<ViewerProfile> {
  const serverClient = await createSupabaseServerClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await serverClient.auth.getUser();

  if (!user) {
    return { authUserId: null, profile: null };
  }

  const { data: profile } = await adminClient
    .from("profiles")
    .select("id, email, full_name, role, premium_status, premium_since, premium_until, stripe_customer_id, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  return {
    authUserId: user.id,
    profile: (profile as Profile | null) ?? null,
  };
}

async function getFeedGraphData(): Promise<FeedGraphData> {
  const adminClient = createAdminClient();
  const viewer = await getViewerProfile();

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

  return {
    viewer,
    professionals: (professionals ?? []) as Professional[],
    contents: (contents ?? []) as Content[],
    likes: (likes ?? []) as ContentLike[],
    comments: (comments ?? []) as ContentComment[],
    commentAuthors: (commentAuthors ?? []) as ContentCommentAuthor[],
  };
}

export async function loadFeedPageData() {
  const graph = await getFeedGraphData();

  return {
    viewer: graph.viewer,
    professionals: graph.professionals,
    posts: buildPosts({
      viewerId: graph.viewer.authUserId,
      professionals: graph.professionals,
      contents: graph.contents,
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
    contents: graph.contents.filter((content) => content.professional_id === professional?.id),
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

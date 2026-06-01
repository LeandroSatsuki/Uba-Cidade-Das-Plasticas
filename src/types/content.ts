export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  birth_date: string | null;
  avatar_url: string | null;
  plastic_surgery_interests: string[];
  role: "admin" | "user";
  premium_status: "none" | "active" | "expired" | "canceled" | "past_due";
  premium_since: string | null;
  premium_until: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Professional = {
  id: string;
  base44_id: string | null;
  nome: string;
  foto_perfil_url: string | null;
  especialidades: string | null;
  descricao_curta: string | null;
  formacao: string | null;
  crm: string | null;
  registro_sbcp: string | null;
  telefone: string | null;
  whatsapp: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type Content = {
  id: string;
  base44_id: string | null;
  professional_id: string | null;
  author_id: string | null;
  content_type: "feed" | "story" | null;
  imagem_url: string | null;
  legenda: string;
  is_premium: boolean;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type ContentLike = {
  id: string;
  content_id: string;
  user_id: string;
  created_at: string;
};

export type ContentComment = {
  id: string;
  content_id: string;
  user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type ContentCommentAuthor = Pick<Profile, "id" | "email" | "full_name" | "role">;

export type ContentCommentWithAuthor = ContentComment & {
  author: ContentCommentAuthor | null;
};

export type FeedPostWithStats = {
  content: Content;
  professional: Professional | null;
  likeCount: number;
  viewerHasLiked: boolean;
  comments: ContentCommentWithAuthor[];
};

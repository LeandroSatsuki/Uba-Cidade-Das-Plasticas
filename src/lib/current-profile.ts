import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/content";

export type ViewerProfile = {
  authUserId: string | null;
  authEmail: string | null;
  authFullName: string | null;
  profile: Profile | null;
};

const PROFILE_SELECT_COLUMNS =
  "id, email, full_name, phone, city, birth_date, avatar_url, plastic_surgery_interests, role, premium_status, premium_since, premium_until, stripe_customer_id, created_at, updated_at";

export async function getCurrentViewerProfile(): Promise<ViewerProfile> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { authUserId: null, authEmail: null, authFullName: null, profile: null };
  }

  const serverClient = await createSupabaseServerClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await serverClient.auth.getUser();

  if (!user) {
    return { authUserId: null, authEmail: null, authFullName: null, profile: null };
  }

  const { data: profile } = await adminClient
    .from("profiles")
    .select(PROFILE_SELECT_COLUMNS)
    .eq("id", user.id)
    .maybeSingle();

  return {
    authUserId: user.id,
    authEmail: user.email ?? null,
    authFullName:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : typeof user.user_metadata?.name === "string"
          ? user.user_metadata.name
          : null,
    profile: (profile as Profile | null) ?? null,
  };
}

import { EducationalGuidePage } from "@/components/educational-guide";
import { HomeLanding } from "@/components/home-landing";
import { getCurrentViewerProfile } from "@/lib/current-profile";

export const dynamic = "force-dynamic";

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function HomePage() {
  if (!hasSupabaseEnv) {
    return <HomeLanding />;
  }

  const viewer = await getCurrentViewerProfile();

  if (viewer.authUserId) {
    return <EducationalGuidePage />;
  }

  return <HomeLanding />;
}

import { redirect } from "next/navigation";
import { getCurrentViewerProfile } from "@/lib/current-profile";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const viewer = await getCurrentViewerProfile();

  if (!viewer.authUserId) {
    redirect("/entrar?next=/admin");
  }

  if (viewer.profile?.role !== "admin") {
    redirect("/feed");
  }

  redirect("/admin/postagens");
}

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type SupabaseCookie = {
  name: string;
  value: string;
  options?: Parameters<ReadonlyRequestCookies["set"]>[2];
};

export async function createClient() {
  const cookieStore = (await cookies()) as ReadonlyRequestCookies;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: SupabaseCookie[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components may expose a read-only cookie store.
          }
        },
      },
    },
  );
}

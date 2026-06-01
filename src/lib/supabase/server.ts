import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const SUPABASE_PUBLIC_ENV_ERROR =
  "As variáveis públicas do Supabase não estão configuradas. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.";

type SupabaseCookie = {
  name: string;
  value: string;
  options?: Parameters<ReadonlyRequestCookies["set"]>[2];
};

export async function createClient() {
  const cookieStore = (await cookies()) as ReadonlyRequestCookies;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(SUPABASE_PUBLIC_ENV_ERROR);
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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

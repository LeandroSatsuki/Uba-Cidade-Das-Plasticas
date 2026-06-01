import { createBrowserClient } from "@supabase/ssr";

export const SUPABASE_PUBLIC_ENV_ERROR =
  "As variáveis públicas do Supabase não estão configuradas. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(SUPABASE_PUBLIC_ENV_ERROR);
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  );
}

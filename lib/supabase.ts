import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}`);
  }

  return value;
}

export function createSupabaseBrowserClient(): SupabaseClient {
  return createClient(assertEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"), assertEnv(supabaseAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}

export function createSupabaseServerClient(): SupabaseClient {
  return createClient(assertEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"), assertEnv(supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

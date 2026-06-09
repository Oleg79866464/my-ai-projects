import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          url: string;
          affiliate_url: string | null;
          description: string;
          category: string;
          pricing: string;
          domain: string;
          tags: string[];
          commission_rate: number;
          click_count: number;
          featured: boolean;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string;
          url: string;
          affiliate_url?: string | null;
          description: string;
          category: string;
          pricing: string;
          domain: string;
          tags?: string[];
          commission_rate?: number;
          click_count?: number;
          featured?: boolean;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tools"]["Insert"]>;
      };
      clicks: {
        Row: {
          id: string;
          tool_id: string;
          ip: string | null;
          user_agent: string | null;
          country: string | null;
          device_type: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          clicked_at: string;
        };
        Insert: {
          id?: string;
          tool_id: string;
          ip?: string | null;
          user_agent?: string | null;
          country?: string | null;
          device_type?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          clicked_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clicks"]["Insert"]>;
      };
    };
  };
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}`);
  }
  return value;
}

export function createSupabasePublicClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(getEnv("NEXT_PUBLIC_SUPABASE_URL"), getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}

export function createSupabaseAdminClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(getEnv("NEXT_PUBLIC_SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

export function createSupabaseServerClient(): SupabaseClient<Database> {
  const cookieStore = cookies();

  return createServerClient<Database>(getEnv("NEXT_PUBLIC_SUPABASE_URL"), getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}

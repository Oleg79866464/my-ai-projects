import type { MetadataRoute } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("tools").select("slug, updated_at");

  const base = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  const toolPages = (data ?? []).map((tool) => ({
    url: `${siteUrl}/go/${tool.slug}`,
    lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...base, ...toolPages];
}

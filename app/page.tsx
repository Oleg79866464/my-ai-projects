export const revalidate = 3600;

import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase";
import ToolCard from "@/components/ToolCard";

type SearchParams = Record<string, string | string[] | undefined>;

const siteName = "AI Catalog RU";

function normalizeParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function toTitleSegment(value: string): string {
  return value ? value : "AI для маркетологов и создателей контента";
}

async function loadTools(searchParams: SearchParams) {
  const supabase = createSupabaseServerClient();
  const q = normalizeParam(searchParams.q).trim();
  const category = normalizeParam(searchParams.category).trim();
  const pricing = normalizeParam(searchParams.pricing).trim();

  let query = supabase
    .from("tools")
    .select("id, name, slug, url, affiliate_url, description, category, pricing, domain, tags, commission_rate, click_count, featured, verified, created_at, updated_at")
    .order("featured", { ascending: false })
    .order("click_count", { ascending: false })
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (pricing) {
    query = query.eq("pricing", pricing);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Ошибка Supabase tools query:", error.message);
    return [];
  }

  return data ?? [];
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const category = normalizeParam(searchParams.category).trim();
  const pricing = normalizeParam(searchParams.pricing).trim();
  const query = normalizeParam(searchParams.q).trim();
  const title = `${toTitleSegment(category || query)} | AI Catalog — нейросети для маркетинга`;
  const description = "Проверенные ИИ-инструменты для создания контента: текст, видео, изображения. Бесплатно и с партнёрскими скидками.";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title,
    description,
    alternates: {
      canonical: "/",
      languages: {
        "ru-RU": "/",
      },
    },
    openGraph: {
      title,
      description,
      locale: "ru_RU",
      siteName,
      type: "website",
    },
  };
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const tools = await loadTools(searchParams);
  const category = normalizeParam(searchParams.category).trim();
  const pricing = normalizeParam(searchParams.pricing).trim();
  const query = normalizeParam(searchParams.q).trim();
  const hasFilters = Boolean(category || pricing || query);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/go/${tool.id}`,
      name: tool.name,
    })),
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(109,40,217,0.25),transparent_35%),linear-gradient(180deg,#0b1020_0%,#050816_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-violet-300">AI для маркетологов и создателей контента</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Найти ИИ-инструмент для текста, видео, изображений и SEO
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Подборка проверенных инструментов для маркетологов, SMM, блогеров и копирайтеров. Оплата, подписки и партнёрские предложения без лишнего шума.
            </p>
          </div>

          <form className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur md:grid-cols-3">
            <input
              name="q"
              defaultValue={query}
              placeholder="Найти ИИ-инструмент"
              className="rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-violet-400"
            />
            <input
              name="category"
              defaultValue={category}
              placeholder="Категории"
              className="rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-violet-400"
            />
            <select name="pricing" defaultValue={pricing} className="rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none focus:border-violet-400">
              <option value="">Цена</option>
              <option value="free">Бесплатно</option>
              <option value="freemium">Фримиум</option>
              <option value="paid">Платно</option>
              <option value="trial">Пробный период</option>
            </select>
            <div className="md:col-span-3">
              <button type="submit" className="inline-flex rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
                Применить фильтры
              </button>
            </div>
          </form>

          {hasFilters ? (
            <p className="mt-5 text-sm text-slate-400">Показаны результаты по фильтрам.</p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {tools.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
            Ничего не найдено — попробуйте изменить фильтры
          </div>
        )}
      </section>
    </main>
  );
}

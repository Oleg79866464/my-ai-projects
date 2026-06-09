export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Каталог AI-инструментов — премиальный русскоязычный SaaS-каталог",
  description:
    "Русскоязычный каталог AI-инструментов с поиском, фильтрами, SEO, партнерскими переходами и аналитикой кликов на Supabase.",
  alternates: {
    canonical: "/",
  },
};

const revShareRate = 0.15;
const clickBenchmark = 0.05;

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function buildSiteUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(slug, baseUrl).toString();
}

function moneyUsd(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function HomePage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const supabase = createSupabaseServerClient();
  const query = normalizeText(typeof searchParams?.q === "string" ? searchParams.q : undefined);
  const category = normalizeText(typeof searchParams?.category === "string" ? searchParams.category : undefined);
  const pricing = normalizeText(typeof searchParams?.pricing === "string" ? searchParams.pricing : undefined);

  let toolsQuery = supabase
    .from("tools")
    .select("id, name, slug, description, domain, logo_url, category, pricing_model, partner_slug, partner_id, seo_title, seo_description, clicks_count, created_at, featured")
    .eq("is_active", true)
    .order("featured", { ascending: false })
    .order("clicks_count", { ascending: false })
    .order("created_at", { ascending: false });

  if (query) {
    toolsQuery = toolsQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,tags.cs.{${query}}`);
  }

  if (category) {
    toolsQuery = toolsQuery.eq("category", category);
  }

  if (pricing) {
    toolsQuery = toolsQuery.eq("pricing_model", pricing);
  }

  const { data: tools, error } = await toolsQuery;

  if (error) {
    throw new Error(`Не удалось загрузить каталог: ${error.message}`);
  }

  const categories = Array.from(new Set((tools ?? []).map((tool) => tool.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, "ru"));
  const totalClicks = (tools ?? []).reduce((sum, tool) => sum + (tool.clicks_count ?? 0), 0);
  const projectedRevShare = totalClicks * revShareRate * 29;
  const benchmarkRevenue = totalClicks * clickBenchmark;

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Каталог AI-инструментов",
    itemListElement: (tools ?? []).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: buildSiteUrl(`/go/${tool.slug}`),
      name: tool.name,
    })),
  };

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(109,40,217,0.28),transparent_34%),linear-gradient(180deg,#0b1020_0%,#050816_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-300">Русскоязычный SaaS-каталог</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Каталог AI-инструментов для команд, агентств и создателей продуктов
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              SSR-поиск, фильтры по категориям, SEO-структура, партнерские переходы и аналитика кликов — всё на одной премиальной платформе.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Инструментов: {tools?.length ?? 0}</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Кликов: {totalClicks}</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">RevShare: {moneyUsd(projectedRevShare)}</div>
            </div>
          </div>

          <form className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:grid-cols-3">
            <input
              name="q"
              defaultValue={query}
              placeholder="Поиск по названию, описанию и тегам"
              className="rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white placeholder:text-slate-400"
            />
            <select name="category" defaultValue={category} className="rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white">
              <option value="">Все категории</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select name="pricing" defaultValue={pricing} className="rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white">
              <option value="">Любая модель оплаты</option>
              <option value="free">Бесплатно</option>
              <option value="freemium">Freemium</option>
              <option value="subscription">Подписка</option>
              <option value="one_time">Разовый платеж</option>
            </select>
            <div className="sm:col-span-3">
              <button type="submit" className="inline-flex rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
                Применить фильтры
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(tools ?? []).map((tool) => (
            <article key={tool.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-violet-300">{tool.category}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{tool.name}</h2>
                </div>
                {tool.featured ? <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">Рекомендуем</span> : null}
              </div>
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-300">{tool.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-300">
                <div>
                  <dt className="text-slate-400">Модель</dt>
                  <dd className="mt-1 text-white">{tool.pricing_model}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Кликов</dt>
                  <dd className="mt-1 text-white">{tool.clicks_count ?? 0}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/go/${tool.slug}`} className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
                  Открыть инструмент
                </Link>
                <a href={`https://${tool.domain}`} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5">
                  {tool.domain}
                </a>
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-400">
                {benchmarkRevenue > projectedRevShare
                  ? "Порог $0.05/click проигрывает RevShare: при росте трафика фиксированная ставка не масштабируется, а партнёрская доля сохраняет upside проекта."
                  : "RevShare сохраняет мотивацию к росту дохода и лучше фиксированной ставки при масштабировании каталога."}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

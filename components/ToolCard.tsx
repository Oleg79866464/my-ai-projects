import Link from "next/link";
import type { Database } from "@/lib/supabase";

type Tool = Database["public"]["Tables"]["tools"]["Row"];

function currencyLabel(pricing: string): string {
  switch (pricing) {
    case "free":
      return "Бесплатно";
    case "freemium":
      return "Фримиум";
    case "trial":
      return "Пробный период";
    default:
      return "Платно";
  }
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    operatingSystem: "Web",
    url: tool.url,
    offers: {
      "@type": "Offer",
      price: tool.pricing === "free" ? "0" : "29",
      priceCurrency: "USD",
    },
  };

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-violet-400/40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300">{tool.category}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{tool.name}</h2>
        </div>
        {tool.verified ? <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">Проверен</span> : null}
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{tool.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{currencyLabel(tool.pricing)}</span>
        {tool.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <Link href={`/go/${tool.id}`} className="inline-flex rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
          Перейти
        </Link>
        <a href={tool.url} target="_blank" rel="noreferrer" className="text-sm text-slate-400 underline decoration-white/20 underline-offset-4 transition hover:text-white">
          Открыть сайт
        </a>
      </div>
    </article>
  );
}

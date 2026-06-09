import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Админ-панель",
  description: "Закрытая панель управления каталогом AI-инструментов.",
};

function formatUsd(value: number): string {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

export default async function AdminPage({ searchParams }: { searchParams: { key?: string } }) {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret || searchParams.key !== secret) {
    redirect("/");
  }

  const supabase = createSupabaseServerClient();
  const [{ data: tools, error: toolsError }, { data: clicks, error: clicksError }] = await Promise.all([
    supabase.from("tools").select("id, name, category, click_count, commission_rate, updated_at, domain").order("click_count", { ascending: false }),
    supabase.from("clicks").select("device_type, country, tool_id"),
  ]);

  if (toolsError) {
    console.error("Ошибка загрузки инструментов:", toolsError.message);
  }
  if (clicksError) {
    console.error("Ошибка загрузки кликов:", clicksError.message);
  }

  const safeTools = tools ?? [];
  const safeClicks = clicks ?? [];
  const totalTools = safeTools.length;
  const totalClicks = safeTools.reduce((sum, tool) => sum + (tool.click_count ?? 0), 0);
  const estimatedRevenue = safeTools.reduce((sum, tool) => sum + ((tool.click_count ?? 0) * 0.15 * 29 * (tool.commission_rate ?? 0.2)), 0);
  const revenuePerClick = totalClicks > 0 ? estimatedRevenue / totalClicks : 0;

  const deviceCounts = safeClicks.reduce(
    (acc, click) => {
      const type = click.device_type ?? "unknown";
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const countryCounts = safeClicks.reduce(
    (acc, click) => {
      const country = click.country ?? "unknown";
      acc[country] = (acc[country] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topTools = safeTools.slice(0, 10);
  const exportUrl = `/api/export?key=${encodeURIComponent(secret)}`;
  const formula = "estimated_revenue = clicks × 0.15 × $29 × commission_rate";

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.32em] text-violet-300">Админ-панель</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Метрики каталога</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Metric title="Всего инструментов" value={String(totalTools)} />
            <Metric title="Всего кликов" value={String(totalClicks)} />
            <Metric title="Ожидаемый доход" value={formatUsd(estimatedRevenue)} />
            <Metric title="Доход на клик" value={formatUsd(revenuePerClick)} />
          </div>
          <a href={exportUrl} className="mt-6 inline-flex rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
            Экспорт CSV
          </a>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Топ инструментов</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Название</th>
                    <th className="px-4 py-3 text-left font-medium">Категория</th>
                    <th className="px-4 py-3 text-left font-medium">Клики</th>
                    <th className="px-4 py-3 text-left font-medium">RevShare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {topTools.map((tool) => {
                    const estimated = (tool.click_count ?? 0) * 0.15 * 29 * (tool.commission_rate ?? 0.2);
                    return (
                      <tr key={tool.id} className="text-slate-200">
                        <td className="px-4 py-3">{tool.name}</td>
                        <td className="px-4 py-3">{tool.category}</td>
                        <td className="px-4 py-3">{tool.click_count ?? 0}</td>
                        <td className="px-4 py-3">{formatUsd(estimated)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold text-white">Распределение по устройствам</h2>
              <div className="mt-6 grid gap-3">
                {Object.entries(deviceCounts).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3">
                    <span>{device}</span>
                    <span className="font-semibold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold text-white">Страны</h2>
              <div className="mt-6 grid gap-3">
                {Object.entries(countryCounts).map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3">
                    <span>{country}</span>
                    <span className="font-semibold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Почему $0.05/клик — мёртвая модель</h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            {formula}. При 1000 кликах и конверсии 15% платный продукт за $29 с комиссией 20% даёт значительно выше доход, чем фиксированный CPC.
          </p>
          <p className="mt-3 leading-7 text-slate-300">
            RevShare оставляет upside на росте трафика, не обесценивает качественные источники и лучше подходит для премиального каталога с дорогой аудиторией.
          </p>
        </section>
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

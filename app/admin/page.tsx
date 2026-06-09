import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ-панель каталога AI-инструментов",
  description: "Защищённая админ-панель для управления каталогом, SEO-полями, партнёрскими идентификаторами и аналитикой кликов.",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Admin Access</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Защищённая админ-панель</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          Здесь подключается серверная авторизация Supabase, управление инструментами, экспорт CSV, SEO-поля и партнёрские идентификаторы.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
            <p className="text-sm text-slate-400">Показатели</p>
            <p className="mt-2 text-lg font-semibold text-white">Только серверные данные</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
            <p className="text-sm text-slate-400">Экспорт</p>
            <p className="mt-2 text-lg font-semibold text-white">CSV для анализа партнёров</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-5">
            <p className="text-sm text-slate-400">Доступ</p>
            <p className="mt-2 text-lg font-semibold text-white">RLS и роль администратора</p>
          </div>
        </div>
      </div>
    </main>
  );
}

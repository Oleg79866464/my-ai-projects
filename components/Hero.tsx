import Button from "./Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50/60 via-white to-white" />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-400/30 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
              Новое · AI-аналитика v2.0 уже доступна
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Умные финансы{" "}
              <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-pan">
                на автопилоте
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              AI Money Master подключает ваши счета, отслеживает каждый актив и
              превращает транзакции в понятные и полезные выводы — чтобы вы всегда
              знали, куда уходят ваши деньги.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#contact" size="lg">
                Начать бесплатно
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Button>
              <Button href="#features" variant="secondary" size="lg">
                Посмотреть возможности
              </Button>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                { value: "$2.4млрд+", label: "Под контролем" },
                { value: "150тыс+", label: "Активных пользователей" },
                { value: "4.9★", label: "Рейтинг приложения" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-bold text-slate-900">{stat.value}</dt>
                  <dd className="mt-1 text-xs text-slate-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-500/20 to-purple-500/20 blur-2xl" />
            <div className="relative animate-float rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-brand-600/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Общий баланс</p>
                  <p className="text-3xl font-bold text-slate-900">$48,920.50</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  +12.4%
                </span>
              </div>

              <div className="mt-6 flex h-32 items-end gap-2">
                {[40, 65, 50, 80, 60, 95, 72, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-brand-200 to-brand-500"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { name: "Продукты", amount: "-$84.20", color: "bg-amber-400" },
                  { name: "Зарплата", amount: "+$5,200.00", color: "bg-emerald-400" },
                  { name: "Подписки", amount: "-$42.99", color: "bg-rose-400" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <span className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                      {row.name}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

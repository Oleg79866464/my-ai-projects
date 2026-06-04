import Hero from "@/components/Hero";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ContactForm from "@/components/ContactForm";

const features = [
  {
    title: "Автоматический бюджет",
    description:
      "Задайте цели один раз — AI каждый месяц пересчитывает бюджет на основе реальных трат.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    title: "AI-категоризация",
    description:
      "Каждая транзакция помечается автоматически с точностью 99% — больше никакого ручного учёта.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
        <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Учёт активов",
    description:
      "Банковские счета, крипта, акции и недвижимость — весь капитал на одной панели.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: "Банковская безопасность",
    description:
      "256-битное шифрование, подключения только для чтения и соответствие SOC 2 надёжно защищают ваши данные.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
  },
  {
    title: "Умные уведомления",
    description:
      "Получайте уведомления о подозрительных списаниях, предстоящих платежах и возможностях для экономии в реальном времени.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    title: "Прогнозирование",
    description:
      "Предиктивные модели прогнозируют ваш денежный поток на недели вперёд, чтобы вы планировали уверенно.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: "01",
    title: "Подключите счета",
    description: "Безопасно привяжите банки, карты и инвестиционные счета менее чем за две минуты.",
  },
  {
    step: "02",
    title: "Доверьтесь AI",
    description: "Транзакции категоризируются, бюджеты формируются, а выводы начинают поступать.",
  },
  {
    step: "03",
    title: "Управляйте деньгами",
    description: "Следуйте понятным рекомендациям и наблюдайте, как растёт ваш капитал месяц за месяцем.",
  },
];

const plans = [
  {
    name: "Старт",
    price: "$0",
    period: "/мес",
    features: ["1 подключённый счёт", "Базовый бюджет", "Ежемесячные отчёты"],
    cta: "Начать",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/мес",
    features: ["Безлимит счетов", "AI-категоризация", "Умные уведомления", "Прогнозирование"],
    cta: "Начать пробный период",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$39",
    period: "/мес",
    features: ["Всё из Pro", "Командные рабочие пространства", "Доступ к API", "Приоритетная поддержка"],
    cta: "Связаться с отделом продаж",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Всё необходимое, чтобы управлять деньгами
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Одна умная платформа, которая заменяет десятки таблиц и приложений, которыми вы пользуетесь сейчас.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} title={f.title} description={f.description} icon={f.icon} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Готово к работе за несколько минут
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Никаких таблиц и ручного ввода. Три простых шага к ясности в финансах.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-2xl bg-white p-8 shadow-sm">
                <span className="text-5xl font-extrabold text-brand-100">{s.step}</span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Простые и прозрачные тарифы
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Начните бесплатно. Переходите на платный, когда будете готовы. Отмена в любой момент.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-brand-500 bg-white shadow-2xl shadow-brand-600/20 ring-1 ring-brand-500"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                  Популярный
                </span>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-slate-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-brand-600"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Button
                href="#contact"
                variant={plan.highlighted ? "primary" : "secondary"}
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Готовы поставить финансы на автопилот?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Присоединяйтесь к списку ожидания и узнавайте первыми о новых AI-функциях. Никакого спама.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Бесплатный 14-дневный пробный период Pro",
                "Без привязки карты",
                "Отмена в любой момент",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}

# AI Catalog RU

Русскоязычный каталог AI-инструментов для маркетологов, копирайтеров, SMM-специалистов и блогеров.

## Стек
- Next.js 14 App Router
- React Server Components
- Tailwind CSS
- Supabase PostgreSQL
- Python 3.11 parser
- Pydantic v2

## Что входит
- SSR-каталог с поиском и фильтрами
- SEO-метаданные, OpenGraph, schema.org, sitemap.xml и robots.txt
- Серверный трекинг кликов с UTM
- Закрытая админка с KPI и CSV-экспортом
- Python-парсер `taaft.json` в чистый JSON для импорта в Supabase

## Переменные окружения
Скопируйте `.env.example` в `.env.local` и заполните значения.

## Установка
```bash
npm install
```

## Запуск
```bash
npm run dev
```

## Парсер
```bash
cd parser && python3.11 -m venv venv && source venv/bin/activate
pip install pydantic==2.5.3 requests==2.31.0 beautifulsoup4==4.12.3
python parser.py
```

## Supabase
1. Создайте проект на supabase.com.
2. Выполните `db/schema.sql` в SQL Editor.
3. Импортируйте `tools_clean.json` в таблицу `tools`.

## Деплой на Vercel
```bash
vercel login
vercel
vercel --prod
```

## Партнёрские программы
- Jasper — PartnerStack, 30%
- SurferSEO — Impact, 25%
- Copy.ai — партнёрская программа, 20%
- Writesonic — партнёрская программа, 20%
- Semrush — партнёрская программа, до 40%

## Формула монетизации
`estimated_revenue = clicks × 0.15 × $29 × commission_rate`

Модель `$0.05/клик` проигрывает RevShare, потому что она не растёт вместе с качеством трафика и не учитывает ценность платной подписки. RevShare лучше масштабируется и выгоднее для премиального каталога.

## Чеклист после деплоя
- [ ] Добавить env vars в Vercel
- [ ] Проверить `/go/[id]` редирект и запись кликов
- [ ] Отправить sitemap в Google Search Console
- [ ] Настроить `affiliate_url` для топ-инструментов
- [ ] Проверить CSV-экспорт в админке

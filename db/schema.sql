create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists unaccent;

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  url text not null,
  affiliate_url text,
  description text not null,
  category text not null,
  pricing text not null check (pricing in ('Бесплатно', 'Фримиум', 'Платно', 'Пробный период')),
  domain text not null,
  tags text[] not null default '{}',
  commission_rate numeric(5,4) not null default 0.2000,
  click_count integer not null default 0,
  featured boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.tools(id) on delete cascade,
  ip inet,
  user_agent text,
  country text,
  device_type text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  clicked_at timestamptz not null default now()
);

create index if not exists tools_slug_idx on public.tools (slug);
create index if not exists tools_category_idx on public.tools (category);
create index if not exists tools_pricing_idx on public.tools (pricing);
create index if not exists tools_featured_clicks_idx on public.tools (featured desc, click_count desc);
create index if not exists tools_created_at_idx on public.tools (created_at desc);
create index if not exists clicks_tool_id_idx on public.clicks (tool_id);
create index if not exists clicks_clicked_at_idx on public.clicks (clicked_at desc);
create index if not exists tools_name_trgm_idx on public.tools using gin (name gin_trgm_ops);
create index if not exists tools_domain_trgm_idx on public.tools using gin (domain gin_trgm_ops);
create index if not exists tools_search_idx on public.tools using gin (to_tsvector('russian', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, '') || ' ' || coalesce(array_to_string(tags, ' '), '')));
create index if not exists clicks_analytics_idx on public.clicks (tool_id, clicked_at desc, device_type, country);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.generate_tool_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or length(trim(new.slug)) = 0 then
    new.slug := lower(regexp_replace(unaccent(new.name), '[^a-zA-Z0-9а-яА-Я]+', '-', 'g'));
    new.slug := regexp_replace(new.slug, '-+', '-', 'g');
    new.slug := trim(both '-' from new.slug);
  end if;
  return new;
end;
$$;

create or replace function public.increment_click_count()
returns trigger
language plpgsql
as $$
begin
  update public.tools
  set click_count = click_count + 1,
      updated_at = now()
  where id = new.tool_id;
  return new;
end;
$$;

create trigger tools_set_updated_at
before update on public.tools
for each row execute function public.set_updated_at();

create trigger tools_generate_slug
before insert on public.tools
for each row execute function public.generate_tool_slug();

create trigger clicks_increment_tool_count
after insert on public.clicks
for each row execute function public.increment_click_count();

alter table public.tools enable row level security;
alter table public.clicks enable row level security;

create policy "public read tools"
on public.tools
for select
using (true);

create policy "service role write tools"
on public.tools
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "authenticated insert clicks"
on public.clicks
for insert
to authenticated
with check (true);

create policy "service role read clicks"
on public.clicks
for select
using (auth.role() = 'service_role');

create materialized view if not exists public.tools_analytics as
select
  t.id,
  t.name,
  t.category,
  t.click_count as clicks,
  count(distinct c.ip) filter (where c.ip is not null) as unique_visitors,
  t.commission_rate,
  sum(case when c.device_type = 'mobile' then 1 else 0 end) as mobile_clicks,
  sum(case when c.device_type = 'desktop' then 1 else 0 end) as desktop_clicks,
  (t.click_count * 0.15 * 29 * t.commission_rate) as estimated_revenue,
  max(t.updated_at) as updated_at
from public.tools t
left join public.clicks c on c.tool_id = t.id
group by t.id, t.name, t.category, t.click_count, t.commission_rate;

create unique index if not exists tools_analytics_id_idx on public.tools_analytics (id);

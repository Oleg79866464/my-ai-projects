import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function safeRedirectUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return request.headers.get("x-real-ip");
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase не настроен" }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: tool, error } = await admin
    .from("tools")
    .select("id, slug, redirect_url, domain, partner_id, partner_slug, is_active")
    .eq("slug", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !tool) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const redirectUrl = safeRedirectUrl(tool.redirect_url ?? (tool.domain ? `https://${tool.domain}` : null));

  if (!redirectUrl) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const clickPayload = {
    tool_id: tool.id,
    ip_address: getClientIp(request),
    user_agent: request.headers.get("user-agent"),
    referer: request.headers.get("referer"),
    utm_source: request.nextUrl.searchParams.get("utm_source"),
    utm_medium: request.nextUrl.searchParams.get("utm_medium"),
    utm_campaign: request.nextUrl.searchParams.get("utm_campaign"),
    utm_term: request.nextUrl.searchParams.get("utm_term"),
    utm_content: request.nextUrl.searchParams.get("utm_content"),
  };

  await admin.from("clicks").insert(clickPayload);
  await admin.from("tools").update({ clicks_count: admin.rpc ? undefined : undefined }).eq("id", tool.id);

  return NextResponse.redirect(redirectUrl, 302);
}

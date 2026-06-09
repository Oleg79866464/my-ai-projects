import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

function detectDeviceType(userAgent: string | null): string {
  if (!userAgent) {
    return "unknown";
  }

  const ua = userAgent.toLowerCase();
  if (ua.includes("tablet")) {
    return "tablet";
  }
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return "mobile";
  }
  return "desktop";
}

function safeUrl(requestUrl: string, destination: string | null): string {
  if (!destination) {
    return requestUrl;
  }

  try {
    const parsed = new URL(destination);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return requestUrl;
  }

  return requestUrl;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = createSupabaseAdminClient();
  const { data: tool, error } = await admin
    .from("tools")
    .select("id, url, affiliate_url, click_count")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !tool) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const userAgent = request.headers.get("user-agent");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
  const referer = request.headers.get("referer");
  const deviceType = detectDeviceType(userAgent);
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");

  const utm_source = request.nextUrl.searchParams.get("utm_source");
  const utm_medium = request.nextUrl.searchParams.get("utm_medium");
  const utm_campaign = request.nextUrl.searchParams.get("utm_campaign");

  void admin
    .from("clicks")
    .insert({
      tool_id: tool.id,
      ip,
      user_agent: userAgent,
      country,
      device_type: deviceType,
      utm_source,
      utm_medium,
      utm_campaign,
    })
    .then(({ error: insertError }) => {
      if (insertError) {
        console.error("Ошибка логирования клика:", insertError.message);
      }
    });

  void admin
    .from("tools")
    .update({ click_count: (tool.click_count ?? 0) + 1 })
    .eq("id", tool.id)
    .then(({ error: updateError }) => {
      if (updateError) {
        console.error("Ошибка обновления click_count:", updateError.message);
      }
    });

  const target = safeUrl(request.url, tool.affiliate_url ?? tool.url);
  const response = NextResponse.redirect(target, 302);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  if (referer) {
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return response;
}

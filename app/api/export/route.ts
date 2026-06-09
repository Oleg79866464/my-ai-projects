import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret || request.nextUrl.searchParams.get("key") !== secret) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("tools").select("name, category, click_count, commission_rate, domain").order("click_count", { ascending: false });
  if (error) {
    console.error("Ошибка экспорта CSV:", error.message);
    return NextResponse.json({ error: "Не удалось экспортировать данные" }, { status: 500 });
  }

  const rows = (data ?? []).map((tool) => {
    const estimatedRevenue = (tool.click_count ?? 0) * 0.15 * 29 * (tool.commission_rate ?? 0.2);
    return [tool.name, tool.category, tool.click_count ?? 0, 0, tool.commission_rate ?? 0, estimatedRevenue.toFixed(2), 0, 0].join(",");
  });

  const csv = [
    "name,category,clicks,unique_visitors,commission_rate,estimated_revenue,mobile_clicks,desktop_clicks",
    ...rows,
  ].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="tools_analytics.csv"',
      "Cache-Control": "no-store",
    },
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * 会員専用ページの保護
 */
export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // 🔐 /app 以下は会員専用
  if (!path.startsWith("/app")) {
    return NextResponse.next();
  }

  // Cookie から line_uid を取得
  const lineUid = req.cookies.get("line_uid")?.value;

  if (!lineUid) {
    // Cookie がない → ログインへ
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Supabase で members テーブルをチェック
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("line_uid", lineUid)
    .single();

  if (error || !data) {
    // 会員じゃない → ログインへ
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 👍 会員 → 通過
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"], // /app 配下すべてを保護
};
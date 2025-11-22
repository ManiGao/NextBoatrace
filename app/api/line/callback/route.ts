import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "code missing" }, { status: 400 });
  }

  // LINEのOAuthエンドポイント
  const tokenUrl = "https://api.line.me/oauth2/v2.1/token";

  const bodyParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.NEXT_PUBLIC_LINE_CALLBACK_URL!,
    client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID!,
    client_secret: process.env.LINE_CHANNEL_SECRET!,
  });

  // アクセストークン取得
  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: bodyParams.toString(),
  });

  const tokenJson = await tokenRes.json();

  if (!tokenJson.id_token) {
    return NextResponse.json({ error: "token error", detail: tokenJson }, { status: 400 });
  }

  // JWTデコード（LINE ID & DisplayName などを取り出す）
  const userInfo = JSON.parse(
    Buffer.from(tokenJson.id_token.split(".")[1], "base64").toString("utf-8")
  );

  const lineUid = userInfo.sub;
  const displayName = userInfo.name;
  const picture = userInfo.picture;

  // Cookie に保存（ログイン状態）
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = NextResponse.redirect(`${baseUrl}/subscribe`);

  res.cookies.set("line_uid", lineUid, { path: "/", httpOnly: false });
  res.cookies.set("displayName", displayName, { path: "/", httpOnly: false });
  res.cookies.set("picture", picture, { path: "/", httpOnly: false });

  return res;
}
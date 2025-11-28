import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // cookies() は非同期 → await が必要
    const cookieStore = await cookies();
    const lineUid = cookieStore.get("line_uid")?.value;

    if (!lineUid) {
      return NextResponse.json({ error: "line_uid not found in cookie" }, { status: 400 });
    }

    const params = new URLSearchParams({
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscribe`,
      client_reference_id: lineUid,
    });

    params.append("line_items[0][price]", process.env.STRIPE_PRICE_ID!);
    params.append("line_items[0][quantity]", "1");

    const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await sessionRes.json();
    console.log("Stripe create session response:", data);

    if (!data.url) {
      return NextResponse.json({ error: "Stripe URL missing", detail: data }, { status: 400 });
    }

    return NextResponse.json({ url: data.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const uid = "from-cookie-later";

    const params = new URLSearchParams({
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscribe`,
      client_reference_id: uid,
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
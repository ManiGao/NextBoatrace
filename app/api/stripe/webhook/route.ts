import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← ここを修正
);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      await supabase.from("members").insert({
        line_uid: session.client_reference_id,
        stripe_customer_id: session.customer as string,
        subscription_status: "active",
      });

      console.log("🟢 Insert success:", session.client_reference_id);
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new NextResponse("fail", { status: 400 });
  }
}

export const config = {
  api: { bodyParser: false },
};
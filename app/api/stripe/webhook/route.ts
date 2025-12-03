import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Stripe クライアント
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Supabase (service_role)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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

        // -------------------------
        // 1) checkout.session.completed（初回課金成功）
        // -------------------------
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            const lineUid = session.client_reference_id;
            const customerId = session.customer as string;
            const subId = session.subscription as string;

            const { data, error } = await supabase.from("members").insert({
                line_uid: lineUid,
                stripe_customer_id: customerId,
                subscription_id: subId,
                subscription_status: "active",
                current_period_end: null,
                is_member: true,
            });
            console.log("INSERT result:", { data, error });

            console.log("🟢 members に初回登録:", lineUid);
        }

        // -------------------------
        // 2) customer.subscription.updated（更新/支払い成功/カード変更など）
        // -------------------------
        if (event.type === "customer.subscription.updated") {
            const sub = event.data.object as any;  // ← 型エラー回避

            const customerId = sub.customer as string;
            const status = sub.status;
            const currentPeriodEnd = sub.current_period_end
                ? new Date(sub.current_period_end * 1000)
                : null;

            const isMember =
                status === "active" ||
                status === "trialing" ||
                (currentPeriodEnd && currentPeriodEnd > new Date());

            const { data, error } = await supabase
                .from("members")
                .update({
                    subscription_status: status,
                    current_period_end: currentPeriodEnd,
                    is_member: isMember,
                    subscription_id: sub.id,
                })
                .eq("stripe_customer_id", customerId);
            console.log("UPDATE result:", { data, error });

            console.log("🟡 サブスク更新:", customerId, status);
        }

        // -------------------------
        // 3) customer.subscription.deleted（解約）
        // -------------------------
        if (event.type === "customer.subscription.deleted") {
            const sub = event.data.object as any;  // ← 修正

            const customerId = sub.customer as string;

            const { data, error } = await supabase
                .from("members")
                .update({
                    subscription_status: "canceled",
                    is_member: false,
                })
                .eq("stripe_customer_id", customerId);
            console.log("DELETE result:", { data, error });

            console.log("🔴 サブスク解約:", customerId);
        }

        // -------------------------
        // 4) invoice.payment_failed（支払い失敗→停止リスク）
        // -------------------------
        if (event.type === "invoice.payment_failed") {
            const invoice = event.data.object as Stripe.Invoice;

            console.log("⚠️ invoice.payment_failed event received:", invoice);

            const customerId = invoice.customer as string;

            const { data, error } = await supabase
                .from("members")
                .update({
                    subscription_status: "past_due",
                    is_member: false,
                })
                .eq("stripe_customer_id", customerId);
            console.log("PAST_DUE result:", { data, error });

            console.log("⚠️ 支払い失敗:", customerId);
        }

        return new NextResponse("ok", { status: 200 });
    } catch (err) {
        console.error("❌ Webhook Error:", err);
        return new NextResponse("fail", { status: 400 });
    }
}

export const config = {
    api: { bodyParser: false },
};
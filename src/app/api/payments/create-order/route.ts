import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/auth-server";
import { PRICING_PLANS } from "../../../../lib/payments/plans";
import { createRazorpayOrder } from "../../../../lib/payments/razorpay";
import { createStripeSession } from "../../../../lib/payments/stripe";
import { createPaypalOrder } from "../../../../lib/payments/paypal";
import { ACTIVE_PROVIDER } from "../../../../lib/payments/providers";

export async function POST(request: Request) {
  try {
    await getAuthenticatedUser();
    const body = await request.json();
    const { planId, billingPeriod } = body as {
      planId: string;
      billingPeriod: "monthly" | "yearly";
    };

    if (!planId || !billingPeriod) {
      return NextResponse.json(
        { error: "Plan ID and billing period are required" },
        { status: 400 }
      );
    }

    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const price = billingPeriod === "yearly" ? plan.priceYearly : plan.priceMonthly;
    const amount = price * 100; // paise / cents

    if (ACTIVE_PROVIDER === "razorpay") {
      const order = await createRazorpayOrder({
        amount,
        currency: "USD",
        receipt: `receipt_${crypto.randomUUID().slice(0, 8)}`,
      });

      return NextResponse.json({
        success: true,
        provider: "razorpay",
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } else if (ACTIVE_PROVIDER === "stripe") {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const session = await createStripeSession({
        amount,
        currency: "USD",
        planName: plan.name,
        successUrl: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${appUrl}/checkout/cancel`,
      });

      return NextResponse.json({
        success: true,
        provider: "stripe",
        sessionId: session.id,
        approvalUrl: session.url,
        amount,
        currency: "USD",
      });
    } else {
      const order = await createPaypalOrder({
        amount,
        currency: "USD",
        planName: plan.name,
      });

      return NextResponse.json({
        success: true,
        provider: "paypal",
        orderId: order.id,
        approvalUrl: order.approvalUrl,
        amount,
        currency: "USD",
      });
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Create Order Error:", error);
    return NextResponse.json(
      { error: "Failed to create order token", details: error.message },
      { status: 500 }
    );
  }
}

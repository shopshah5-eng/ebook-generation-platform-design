import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import { PRICING_PLANS } from "../../../lib/payments/plans";
import { createRazorpayOrder } from "../../../lib/payments/razorpay";
import { PaymentProvider } from "../../../lib/payments/types";

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

    const activeProvider = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "razorpay") as PaymentProvider;
    const price = billingPeriod === "yearly" ? plan.priceYearly : plan.priceMonthly;
    const amount = price * 100; // in minor units (cents / paise)

    if (activeProvider === "razorpay") {
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
    } else if (activeProvider === "stripe") {
      // Future Stripe integration structure:
      // const session = await stripe.checkout.sessions.create({ ... })
      return NextResponse.json({
        success: true,
        provider: "stripe",
        sessionId: `mock_stripe_session_${crypto.randomUUID().slice(0, 8)}`,
        approvalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id=mock`,
        amount,
        currency: "USD",
      });
    } else {
      // Future PayPal integration structure:
      return NextResponse.json({
        success: true,
        provider: "paypal",
        approvalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?paypal_id=mock`,
        amount,
        currency: "USD",
      });
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Checkout route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

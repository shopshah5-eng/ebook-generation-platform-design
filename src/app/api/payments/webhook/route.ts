import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateSubscription } from "../../../../lib/payments/subscription";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-razorpay-signature") || "";
    const bodyText = await request.text();
    
    // Perform webhook signature verification if secret is set
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(bodyText)
        .digest("hex");
        
      if (expectedSignature !== signature) {
        console.warn("Invalid webhook signature received");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;

    // Handle payment capture webhooks
    if (event === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      const notes = paymentEntity.notes || {};
      const userId = notes.userId;
      const planId = notes.planId || "plan_pro";
      const billingPeriod = notes.billingPeriod || "monthly";

      if (userId) {
        // Calculate period end
        const durationDays = billingPeriod === "yearly" ? 365 : 30;
        const periodEnd = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

        // Update user subscription state
        const success = await updateSubscription(userId, planId, "active", periodEnd);
        if (!success) {
          console.error(`Failed to update subscription via webhook for user: ${userId}`);
          return NextResponse.json({ error: "Update failed" }, { status: 500 });
        }
      }
    } else if (event === "subscription.cancelled" || event === "subscription.halted") {
      const subscriptionEntity = payload.payload.subscription.entity;
      const notes = subscriptionEntity.notes || {};
      const userId = notes.userId;

      if (userId) {
        // Mark subscription status as cancelled / expired
        const success = await updateSubscription(
          userId,
          "plan_free",
          "expired",
          new Date().toISOString()
        );
        if (!success) {
          console.error(`Failed to expire subscription via webhook for user: ${userId}`);
          return NextResponse.json({ error: "Update failed" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook processing crash:", error);
    return NextResponse.json(
      { error: "Webhook event processing failed", details: error.message },
      { status: 500 }
    );
  }
}

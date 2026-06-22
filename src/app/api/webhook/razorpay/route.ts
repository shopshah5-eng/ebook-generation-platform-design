import { NextResponse } from "next/server";
import { updateSubscription } from "../../../../lib/payments/subscription";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-razorpay-signature") || "";
    const bodyText = await request.text();
    
    const payload = JSON.parse(bodyText);
    const event = payload.event;

    if (event === "payment.captured") {
      const orderId = payload.payload.payment.entity.order_id;
      const amount = payload.payload.payment.entity.amount;
      const notes = payload.payload.payment.entity.notes || {};
      const userId = notes.userId || payload.payload.payment.entity.email; // Fallback mapping

      console.log(`Razorpay legacy webhook signature: ${signature}, order: ${orderId}`);

      if (userId) {
        // Map amount in cents/paise to plans
        // Pro is $9 (900 cents), Agency is $19 (1900 cents)
        const planId = amount >= 1900 ? "plan_agency" : "plan_pro";
        
        // Calculate period end
        const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Update user subscription state
        const success = await updateSubscription(userId, planId, "active", periodEnd);
        if (!success) {
          console.error("Failed to update profile subscription on webhook:", userId);
          return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook event processing failed", details: error.message },
      { status: 500 }
    );
  }
}

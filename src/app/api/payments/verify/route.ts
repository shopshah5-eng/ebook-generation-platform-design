import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/auth-server";
import { verifyRazorpaySignature } from "../../../../lib/payments/razorpay";
import { updateSubscription } from "../../../../lib/payments/subscription";
import { ACTIVE_PROVIDER } from "../../../../lib/payments/providers";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const { orderId, paymentId, signature, planId = "plan_pro", billingPeriod = "monthly" } = body as {
      orderId: string;
      paymentId: string;
      signature: string;
      planId?: string;
      billingPeriod?: "monthly" | "yearly";
    };

    if (ACTIVE_PROVIDER === "razorpay") {
      if (!orderId || !paymentId || !signature) {
        return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
      }

      // Verify the Razorpay signature
      const verified = verifyRazorpaySignature(orderId, paymentId, signature);
      if (!verified) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }

      // Calculate period end
      const durationDays = billingPeriod === "yearly" ? 365 : 30;
      const periodEnd = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      // Update user subscription state
      const success = await updateSubscription(user.id, planId, "active", periodEnd);
      if (!success) {
        return NextResponse.json({ error: "Failed to apply subscription" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Verification Error:", error);
    return NextResponse.json(
      { error: "Verification processing failed", details: error.message },
      { status: 500 }
    );
  }
}

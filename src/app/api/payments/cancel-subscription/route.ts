import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/auth-server";
import { cancelSubscription } from "../../../../lib/payments/subscription";

export async function POST() {
  try {
    const user = await getAuthenticatedUser();
    
    const success = await cancelSubscription(user.id);
    if (!success) {
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Cancel Subscription API Error:", error);
    return NextResponse.json(
      { error: "Failed to process cancellation", details: error.message },
      { status: 500 }
    );
  }
}

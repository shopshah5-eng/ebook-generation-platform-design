import { createAdminClient } from "../supabase/server";

export type SubscriptionStatus =
  | "active"
  | "trial"
  | "cancelled"
  | "expired"
  | "past_due"
  | "grace_period";

export interface SubscriptionInfo {
  planId: string;
  status: SubscriptionStatus;
  periodEnd: string; // ISO string
}

const DEFAULT_SUBSCRIPTION: SubscriptionInfo = {
  planId: "plan_free",
  status: "active",
  periodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // far future
};

/**
 * Fetches user subscription metadata from Supabase Auth User Metadata.
 */
export async function getSubscription(userId: string): Promise<SubscriptionInfo> {
  const supabase = createAdminClient();
  try {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !user) {
      return DEFAULT_SUBSCRIPTION;
    }

    const metadata = user.user_metadata || {};
    return {
      planId: metadata.plan_id || "plan_free",
      status: (metadata.subscription_status as SubscriptionStatus) || "active",
      periodEnd: metadata.subscription_period_end || DEFAULT_SUBSCRIPTION.periodEnd,
    };
  } catch (err) {
    console.error("Failed to get subscription info:", err);
    return DEFAULT_SUBSCRIPTION;
  }
}

/**
 * Updates user subscription metadata and legacy database profile parameters.
 */
export async function updateSubscription(
  userId: string,
  planId: string,
  status: SubscriptionStatus,
  periodEnd: string
): Promise<boolean> {
  const supabase = createAdminClient();
  try {
    // 1. Update Supabase Auth User Metadata
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        plan_id: planId,
        subscription_status: status,
        subscription_period_end: periodEnd,
      },
    });

    if (authError) throw authError;

    // 2. Synchronize legacy database credits_remaining profile column to keep legacy routes functional
    let legacyCredits = 1;
    if (planId === "plan_pro") legacyCredits = 50;
    else if (planId === "plan_agency") legacyCredits = 9999;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        credits_remaining: legacyCredits,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.warn("Legacy profile credits synchronization failed:", profileError);
    }

    return true;
  } catch (err) {
    console.error("Failed to update subscription:", err);
    return false;
  }
}

/**
 * Cancels subscription (sets status to "cancelled" but keeps active until periodEnd).
 */
export async function cancelSubscription(userId: string): Promise<boolean> {
  try {
    const sub = await getSubscription(userId);
    return await updateSubscription(userId, sub.planId, "cancelled", sub.periodEnd);
  } catch (err) {
    console.error("Subscription cancellation error:", err);
    return false;
  }
}

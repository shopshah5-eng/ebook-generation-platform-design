// import { createAdminClient } from "./supabase/server";
// import { getSubscription } from "./payments/subscription";

export async function checkAndDecrementCredits(
  _userId: string
): Promise<{
  allowed: boolean;
  creditsRemaining: number;
}> {
  /*
  const supabase = createAdminClient();
  */

  try {
    // 1. Fetch user's subscription metadata
    /*
    const subscription = await getSubscription(userId);
    */
    
    // TODO: Restore subscription gating check here later
    /*
    // Pro and Agency plans have unlimited exports/downloads within their tiers
    if (subscription.planId === "plan_pro" || subscription.planId === "plan_agency") {
      return {
        allowed: true,
        creditsRemaining: 9999,
      };
    }

    // 2. Free tier check: verify ebook count limit
    const { data: ebooks, error: fetchError } = await supabase
      .from("ebooks")
      .select("id")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("Failed to query ebooks count in checkAndDecrementCredits:", fetchError);
      return { allowed: false, creditsRemaining: 0 };
    }

    // Free tier users can create/export 1 ebook
    const ebookCount = ebooks?.length || 0;
    if (ebookCount <= 1) {
      return {
        allowed: true,
        creditsRemaining: Math.max(0, 1 - ebookCount),
      };
    }

    return {
      allowed: false,
      creditsRemaining: 0,
    };
    */
    return {
      allowed: true,
      creditsRemaining: 9999,
    };
  } catch (error) {
    console.error("Subscription validation failure in download hook:", error);
    return {
      allowed: false,
      creditsRemaining: 0,
    };
  }
}
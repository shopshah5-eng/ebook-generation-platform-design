import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

export interface SubscriptionData {
  planId: string;
  status: string;
  periodEnd: string;
  loading: boolean;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    planId: "plan_free",
    status: "active",
    periodEnd: "",
    loading: true,
  });

  const refreshSubscription = async () => {
    const supabase = createClient();
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setSubscription({
          planId: "plan_free",
          status: "active",
          periodEnd: "",
          loading: false,
        });
        return;
      }

      const meta = user.user_metadata || {};
      setSubscription({
        planId: meta.plan_id || "plan_free",
        status: meta.subscription_status || "active",
        periodEnd: meta.subscription_period_end || "",
        loading: false,
      });
    } catch (err) {
      console.error("Failed to fetch subscription client-side:", err);
      setSubscription({
        planId: "plan_free",
        status: "active",
        periodEnd: "",
        loading: false,
      });
    }
  };

  useEffect(() => {
    refreshSubscription();
    
    // Set up polling to catch database/payment callbacks
    const interval = setInterval(refreshSubscription, 3000);
    return () => clearInterval(interval);
  }, []);

  return { ...subscription, refreshSubscription };
}

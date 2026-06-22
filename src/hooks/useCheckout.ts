import { useState } from "react";
import { PaymentProvider } from "../lib/payments/types";

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerCheckout = async (planId: string, billingPeriod: "monthly" | "yearly") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingPeriod }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to trigger checkout");
      }

      const provider = data.provider as PaymentProvider;

      if (provider === "razorpay") {
        // Razorpay web checkout modal trigger
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock",
          amount: data.amount,
          currency: data.currency,
          name: "PageNest",
          description: `Subscription plan: ${planId}`,
          order_id: data.orderId,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch("/api/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId,
                billingPeriod
              }),
            });
            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              alert("Payment successful! Your subscription is active.");
              window.location.reload();
            } else {
              alert("Payment signature verification failed.");
            }
          },
          prefill: {
            name: "Creator",
            email: "creator@pagenest.com",
          },
          theme: {
            color: "#C9A86A",
          },
        };
        
        // In browser context:
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (provider === "stripe" || provider === "paypal") {
        // Stripe/PayPal checkout redirect
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl;
        }
      }
      return data;
    } catch (err: any) {
      console.error("Checkout Trigger Error:", err);
      setError(err.message || "Failed to initiate payment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { triggerCheckout, loading, error };
}

export type PaymentProvider = "razorpay" | "stripe" | "paypal";

export interface CheckoutSessionInput {
  planId: string;
  billingPeriod: "monthly" | "yearly";
  email: string;
  userId: string;
}

export interface CheckoutSessionResult {
  success: boolean;
  provider: PaymentProvider;
  orderId?: string; // Razorpay order ID
  sessionId?: string; // Stripe checkout session ID
  approvalUrl?: string; // PayPal/Stripe redirect URL
  amount: number;
  currency: string;
}

export interface WebhookResult {
  success: boolean;
  userId?: string;
  planId?: string;
  billingPeriod?: "monthly" | "yearly";
  error?: string;
}

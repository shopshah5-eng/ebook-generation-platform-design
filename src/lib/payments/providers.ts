import { PaymentProvider } from "./types";

export interface ProviderConfig {
  name: string;
  enabled: boolean;
  keyId: string;
  secret: string;
}

export const PAYMENT_PROVIDERS: Record<PaymentProvider, ProviderConfig> = {
  razorpay: {
    name: "Razorpay",
    enabled: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "razorpay",
    keyId: process.env.RAZORPAY_KEY_ID || "",
    secret: process.env.RAZORPAY_SECRET || "",
  },
  stripe: {
    name: "Stripe",
    enabled: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "stripe",
    keyId: process.env.STRIPE_PUBLISHABLE_KEY || "",
    secret: process.env.STRIPE_SECRET_KEY || "",
  },
  paypal: {
    name: "PayPal",
    enabled: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "paypal",
    keyId: process.env.PAYPAL_CLIENT_ID || "",
    secret: process.env.PAYPAL_CLIENT_SECRET || "",
  },
};

export const ACTIVE_PROVIDER = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "razorpay") as PaymentProvider;

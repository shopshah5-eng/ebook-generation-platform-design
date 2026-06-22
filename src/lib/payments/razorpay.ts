import crypto from "crypto";

export interface RazorpayOrderConfig {
  amount: number; // in paise (e.g. 900 for $9.00 or equivalent Rs.)
  currency: string;
  receipt: string;
}

export async function createRazorpayOrder(config: RazorpayOrderConfig) {
  // Production integration structure (using native fetch or Razorpay npm SDK if available):
  // const keyId = process.env.RAZORPAY_KEY_ID;
  // const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  // Return mocked order details for client integration demo
  const mockOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;
  return {
    id: mockOrderId,
    amount: config.amount,
    currency: config.currency,
    receipt: config.receipt,
    status: "created",
    created_at: Date.now(),
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";
  
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}

export interface Invoice {
  id: string;
  date: string;
  planName: string;
  amount: number;
  currency: string;
  status: "paid" | "failed" | "pending";
}

export const MOCK_INVOICES: Record<string, Invoice[]> = {
  // Can index by user_id. We'll return dummy invoice histories for subscriptions.
};

export function getInvoiceHistory(userId: string, planId: string): Invoice[] {
  if (planId === "plan_free") return [];

  const amount = planId === "plan_pro" ? 9.0 : 19.0;
  const planLabel = planId === "plan_pro" ? "Pro Subscription" : "Agency Subscription";

  // Simulate a few months of active payment records
  return [
    {
      id: `INV-2026-003-${userId.slice(0, 4).toUpperCase()}`,
      date: "2026-06-01",
      planName: planLabel,
      amount,
      currency: "USD",
      status: "paid",
    },
    {
      id: `INV-2026-002-${userId.slice(0, 4).toUpperCase()}`,
      date: "2026-05-01",
      planName: planLabel,
      amount,
      currency: "USD",
      status: "paid",
    },
    {
      id: `INV-2026-001-${userId.slice(0, 4).toUpperCase()}`,
      date: "2026-04-01",
      planName: planLabel,
      amount,
      currency: "USD",
      status: "paid",
    },
  ];
}

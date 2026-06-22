export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  isPopular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "plan_free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "1 Ebook creation",
      "Core templates gallery",
      "Standard PDF export",
      "Basic AI editing actions",
      "Community support access",
    ],
  },
  {
    id: "plan_pro",
    name: "Pro",
    priceMonthly: 9,
    priceYearly: 81, // 25% savings: $9 * 12 = $108 -> $81/yr
    isPopular: true,
    features: [
      "Up to 50 Ebooks limit",
      "Full premium templates gallery",
      "AI Writing Enhancements tool",
      "EPUB & DOCX exports compilation",
      "Priority AI generation queue",
      "Advanced page canvas editing",
      "Commercial usage authorization",
    ],
  },
  {
    id: "plan_agency",
    name: "Agency",
    priceMonthly: 19,
    priceYearly: 171, // 25% savings: $19 * 12 = $228 -> $171/yr
    features: [
      "Everything included in Pro",
      "Collaborative team workspaces",
      "Multiple brand kits profiles",
      "Shared layouts libraries",
      "Priority 24/7 dedicated support",
      "Client projects licensing",
      "Advanced export format options",
      "Specialized agency features",
    ],
  },
];

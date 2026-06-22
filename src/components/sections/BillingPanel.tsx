"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSubscription } from "../../hooks/useSubscription";
import { useCheckout } from "../../hooks/useCheckout";
import { PRICING_PLANS } from "../../lib/payments/plans";
import { getInvoiceHistory } from "../../lib/payments/billing";
import { createClient } from "../../lib/supabase/client";

interface BillingPanelProps {
  ebookCount?: number;
}

export function BillingPanel({ ebookCount = 0 }: BillingPanelProps) {
  const { planId, status, periodEnd, refreshSubscription } = useSubscription();
  const { triggerCheckout, loading: checkoutLoading } = useCheckout();
  const [userId, setUserId] = useState("");
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const handleSubscribe = async (targetPlanId: string) => {
    await triggerCheckout(targetPlanId, billingPeriod);
    refreshSubscription();
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your premium subscription? You will retain access until the end of your billing period.")) return;
    
    setCancellationLoading(true);
    try {
      const res = await fetch("/api/payments/cancel-subscription", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Subscription cancelled successfully.");
        refreshSubscription();
      } else {
        alert(data.error || "Failed to cancel subscription");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during cancellation processing.");
    } finally {
      setCancellationLoading(false);
    }
  };

  // Determine active plan limits
  const activePlan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[0];
  const maxLimit = planId === "plan_free" ? 1 : planId === "plan_pro" ? 50 : Infinity;
  const progressPercent = maxLimit === Infinity ? 100 : Math.min(100, (ebookCount / maxLimit) * 100);

  // Friendly date conversion
  const renewalDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "N/A";

  // Invoices list
  const invoices = getInvoiceHistory(userId || "user", planId);

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl font-sans text-white px-1 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">Billing & Subscription</h1>
        <p className="text-[11px] sm:text-xs text-brand-muted mt-2 font-medium">
          Manage your subscription plans, invoice history, and active creation volumes.
        </p>
      </div>

      {/* Current plan details */}
      <div className="glass p-5 sm:p-6 rounded-[20px] flex flex-col md:flex-row justify-between gap-6 items-stretch shadow-2xl relative overflow-hidden bg-white/[0.02] border border-white/5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col justify-between flex-1 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-widest font-black text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-3 py-1.5 rounded-full">
                Active Tier
              </span>
              {status === "cancelled" && (
                <span className="text-[9px] uppercase tracking-widest font-black text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
                  Cancelled
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-4 tracking-tight">
              PageNest {activePlan.name} Subscription
            </h3>
            <p className="text-[10px] sm:text-[11px] text-brand-muted mt-1.5 font-medium leading-relaxed">
              {status === "cancelled" ? (
                <span>Access terminates on: {renewalDate} &bull; Subscription Cancelled</span>
              ) : (
                <span>Next renewal date: {renewalDate} &bull; Automatic billing active</span>
              )}
            </p>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
            {planId !== "plan_free" && status !== "cancelled" && (
              <button
                onClick={handleCancelSubscription}
                disabled={cancellationLoading}
                className="w-full sm:w-auto min-h-[44px] px-5 rounded-full border border-red-500/20 hover:border-red-500 text-[10px] uppercase font-bold tracking-wider hover:bg-red-500/5 transition-all cursor-pointer text-red-400 flex items-center justify-center"
              >
                {cancellationLoading ? "Cancelling..." : "Cancel Subscription"}
              </button>
            )}
            <button
              onClick={() => alert("Redirecting to Customer Invoicing Portal...")}
              className="w-full sm:w-auto min-h-[44px] px-5 rounded-full border border-white/10 hover:border-brand-purple/50 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center"
            >
              Update Payment Methods
            </button>
          </div>
        </div>

        {/* Ebook Limit progress container */}
        <div className="w-full md:w-80 bg-white/[0.01] border border-white/5 p-5 rounded-[20px] flex flex-col justify-between relative z-10">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Ebook Volume</span>
            <span className="text-[10px] font-mono text-white font-black bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {maxLimit === Infinity ? `${ebookCount} Created` : `${ebookCount} / ${maxLimit} Ebooks`}
            </span>
          </div>

          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 mb-3.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-brand-purple to-[#a78bfa] rounded-full"
            />
          </div>

          <p className="text-[10px] text-brand-muted leading-relaxed font-medium">
            {maxLimit === Infinity 
              ? "You have unlimited ebook generations on the Agency plan."
              : `You have used ${ebookCount} of your ${maxLimit} allowed creations.`
            }
          </p>
        </div>
      </div>

      {/* Available Plans Selector */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <h3 className="font-black text-xs text-brand-muted uppercase tracking-widest">
            Available Subscription Plans
          </h3>

          <div className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full p-0.5 w-full sm:w-auto">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
                billingPeriod === "monthly" ? "bg-brand-purple text-white" : "text-brand-muted hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
                billingPeriod === "yearly" ? "bg-brand-purple text-white" : "text-brand-muted hover:text-white"
              }`}
            >
              Yearly (-25%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((p) => {
            const isCurrent = planId === p.id;
            const price = billingPeriod === "yearly" ? p.priceYearly / 12 : p.priceMonthly;
            const isPopular = p.isPopular;

            return (
              <div
                key={p.id}
                className={`glass p-6 rounded-[20px] flex flex-col justify-between min-h-[380px] transition-all relative shadow-2xl bg-white/[0.02] border ${
                  isPopular 
                    ? "border-brand-purple/50 ring-1 ring-brand-purple/20 shadow-[0_0_35px_rgba(124,58,237,0.15)]" 
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {isPopular && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-brand-purple text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full leading-none shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                    Most Popular
                  </span>
                )}
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">{p.name}</h4>
                  </div>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-3xl font-black text-white leading-none tracking-tight">${price}</span>
                    {p.priceMonthly !== 0 && <span className="text-[10px] text-brand-muted font-medium">/month</span>}
                  </div>
                  
                  <div className="h-[1px] bg-white/5 my-4" />
                  <ul className="flex flex-col gap-2.5">
                    {p.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[10px] text-brand-muted">
                        <svg className="w-3.5 h-3.5 text-brand-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="leading-tight font-medium text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isCurrent || p.priceMonthly === 0 || checkoutLoading}
                  onClick={() => handleSubscribe(p.id)}
                  className={`w-full min-h-[44px] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer mt-6 active:scale-95 duration-200 flex items-center justify-center ${
                    isCurrent
                      ? "bg-white/5 text-brand-muted cursor-not-allowed border border-white/5"
                      : p.priceMonthly === 0
                      ? "bg-white/5 border border-white/10 text-white cursor-not-allowed"
                      : isPopular
                      ? "bg-brand-purple hover:bg-brand-purple/95 text-white shadow-md shadow-brand-purple/25"
                      : "border border-white/10 hover:border-brand-purple/50 text-white hover:bg-white/5"
                  }`}
                >
                  {isCurrent ? "Active Plan" : p.priceMonthly === 0 ? "Default Tier" : checkoutLoading ? "Initiating..." : "Subscribe"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice & Payment History */}
      {invoices.length > 0 && (
        <div className="glass p-5 sm:p-6 rounded-[20px] bg-white/[0.02] border border-white/5 shadow-xl mt-4">
          <h3 className="font-black text-xs text-brand-muted uppercase tracking-widest mb-4">
            Payment History & Invoices
          </h3>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-brand-muted">
              <thead>
                <tr className="border-b border-white/5 pb-2 uppercase text-[9px] font-bold tracking-wider">
                  <th className="py-2.5">Invoice ID</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Plan</th>
                  <th className="py-2.5 text-right">Amount</th>
                  <th className="py-2.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/90">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.01]">
                    <td className="py-3 font-mono text-[10.5px] text-[#a78bfa]">{inv.id}</td>
                    <td className="py-3">{inv.date}</td>
                    <td className="py-3">{inv.planName}</td>
                    <td className="py-3 text-right font-bold">${inv.amount.toFixed(2)} {inv.currency}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          alert(`Simulating invoice PDF download for ${inv.id}...`);
                        }}
                        className="text-[9px] font-bold uppercase tracking-wider text-brand-purple hover:text-white border border-brand-purple/20 bg-brand-purple/5 px-2.5 py-1 rounded transition-all cursor-pointer"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Block View */}
          <div className="md:hidden flex flex-col gap-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 rounded-[16px] bg-white/[0.01] border border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase font-black text-brand-muted tracking-wider block mb-0.5">Invoice ID</span>
                    <span className="font-mono text-xs text-[#a78bfa]">{inv.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-black text-brand-muted tracking-wider block mb-0.5">Amount</span>
                    <span className="text-xs font-bold text-white">${inv.amount.toFixed(2)} {inv.currency}</span>
                  </div>
                </div>

                <div className="h-[1px] bg-white/5" />

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-white font-bold block">{inv.planName}</span>
                    <span className="text-[10px] text-brand-muted font-medium mt-0.5 block">{inv.date}</span>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Simulating invoice PDF download for ${inv.id}...`);
                    }}
                    className="min-h-[44px] px-4 rounded-xl text-[9px] font-bold uppercase tracking-wider text-brand-purple hover:text-white border border-brand-purple/20 bg-brand-purple/5 hover:bg-brand-purple/10 flex items-center justify-center transition-all cursor-pointer"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

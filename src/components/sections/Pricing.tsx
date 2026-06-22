"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PRICING_PLANS } from "../../lib/payments/plans";
import { useCheckout } from "../../hooks/useCheckout";

interface PricingProps {
  billing: "monthly" | "yearly";
  setBilling: (value: "monthly" | "yearly") => void;
  onStart: () => void;
}

export function Pricing({ billing, setBilling, onStart }: PricingProps) {
  const { triggerCheckout, loading } = useCheckout();
  const [activePlanIndex, setActivePlanIndex] = useState(1); // Default to Pro (index 1)

  const handlePriceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth;
    if (cardWidth > 0) {
      const index = Math.round(scrollPosition / cardWidth);
      setActivePlanIndex(index);
    }
  };

  const handleCheckout = async (planId: string) => {
    await triggerCheckout(planId, billing);
  };

  return (
    <section id="pricing" className="py-24 bg-[#070B14] px-6 lg:px-16 border-b border-brand-border/60 font-sans relative">
      <div className="max-w-7xl mx-auto pb-12 md:pb-0">
        <div className="flex flex-col items-center text-center mb-16 gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">
            Fair Pricing
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Simple, Transparent Plans
          </h2>
          <p className="text-brand-muted text-sm max-w-lg mt-2">
            Choose the workspace capability that matches your publishing output. Zero credit limits.
          </p>
          
          <div className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-full p-1 shadow-sm mt-4">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                billing === "monthly" ? "bg-brand-purple text-white shadow-sm" : "text-brand-muted hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                billing === "yearly" ? "bg-brand-purple text-white shadow-sm" : "text-brand-muted hover:text-white"
              }`}
            >
              Yearly (Save 25%)
            </button>
          </div>
        </div>

        {/* Mobile Swipeable Pricing Cards */}
        <div className="md:hidden flex flex-col items-center gap-6">
          <div
            onScroll={handlePriceScroll}
            className="w-full flex overflow-x-auto flex-nowrap gap-6 snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
          >
            {PRICING_PLANS.map((plan) => {
              const price = billing === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly;
              const isHighlight = plan.id === "plan_pro";
              
              return (
                <div
                  key={plan.id}
                  className={`shrink-0 snap-center rounded-[24px] border p-6 flex flex-col justify-between transition-all duration-300 relative ${
                    isHighlight
                      ? "bg-white/[0.04] border-brand-purple shadow-[0_0_40px_rgba(124,58,237,0.15)]"
                      : "bg-white/[0.02] border-white/5"
                  }`}
                  style={{ width: "calc(100vw - 48px)" }}
                >
                  {isHighlight && (
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-brand-purple text-white text-[8px] font-bold uppercase tracking-widest shadow-lg">
                      Most Popular
                    </span>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    
                    <div className="flex flex-col border-b border-white/5 pb-6 mb-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-white">
                          ${price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">
                          / month
                        </span>
                      </div>
                      {billing === "yearly" && plan.priceYearly > 0 && (
                        <span className="text-[9px] text-[#a78bfa] font-semibold mt-1">
                          Billed ${plan.priceYearly} annually
                        </span>
                      )}
                    </div>
                    
                    <ul className="flex flex-col gap-3.5 mb-8">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start text-xs text-white/80 font-sans">
                          <svg className="w-4 h-4 text-brand-purple mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={loading}
                    onClick={() => {
                      if (plan.priceMonthly === 0) {
                        onStart();
                      } else {
                        handleCheckout(plan.id);
                      }
                    }}
                    className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isHighlight
                        ? "bg-brand-purple text-white shadow-lg"
                        : "bg-white/5 border border-white/10 text-white"
                    }`}
                  >
                    {plan.priceMonthly === 0 ? "Start Free" : loading ? "Processing..." : `Subscribe ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 mb-4">
            {PRICING_PLANS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  activePlanIndex === idx ? "w-4 bg-brand-purple" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Pricing Cards Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const price = billing === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly;
            const isHighlight = plan.id === "plan_pro";
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-[20px] border p-6 lg:p-8 flex flex-col justify-between transition-all relative ${
                  isHighlight
                    ? "bg-white/[0.04] border-brand-purple shadow-[0_0_40px_rgba(124,58,237,0.1)] scale-102 z-10"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.03]"
                }`}
              >
                {isHighlight && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-brand-purple text-white text-[8px] font-bold uppercase tracking-widest shadow-lg">
                    Most Popular
                  </span>
                )}
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="flex flex-col border-b border-white/5 pb-6 mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl lg:text-4xl font-extrabold text-white">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">
                        / month
                      </span>
                    </div>
                    {billing === "yearly" && plan.priceYearly > 0 && (
                      <span className="text-[9px] text-[#a78bfa] font-semibold mt-1">
                        Billed ${plan.priceYearly} annually
                      </span>
                    )}
                  </div>
                  
                  <ul className="flex flex-col gap-3.5 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs text-white/80 font-sans">
                        <svg className="w-4 h-4 text-brand-purple mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={loading}
                  onClick={() => {
                    if (plan.priceMonthly === 0) {
                      onStart();
                    } else {
                      handleCheckout(plan.id);
                    }
                  }}
                  className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isHighlight
                      ? "bg-brand-purple text-white hover:bg-brand-purple/90 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.priceMonthly === 0 ? "Start Free" : loading ? "Processing..." : `Subscribe ${plan.name}`}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Sticky Pro CTA Bar */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-40 bg-brand-purple/95 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(124,58,237,0.5)] border border-brand-purple/40 overflow-hidden">
        <button
          onClick={() => handleCheckout("plan_pro")}
          disabled={loading}
          className="w-full py-4 text-white text-xs font-black uppercase tracking-widest text-center cursor-pointer active:bg-brand-purple/90 transition-colors"
        >
          {loading ? "Processing..." : "Get Pro Plan • $9/mo"}
        </button>
      </div>
    </section>
  );
}

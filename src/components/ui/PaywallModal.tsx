"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckout } from "../../hooks/useCheckout";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export default function PaywallModal({ isOpen, onClose, reason }: PaywallModalProps) {
  const { triggerCheckout, loading } = useCheckout();
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const explanation = reason || "This premium option is locked on the Free tier. Upgrade to Pro to customize spreads and export vector files.";


  const handleSubscribe = async (planId: string) => {
    await triggerCheckout(planId, billing);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#070B14]/85 backdrop-blur-md"
          />

          {/* Paywall Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-[#0E131F]/90 border border-brand-purple/25 p-7 md:p-8 rounded-[24px] shadow-2xl flex flex-col gap-6 text-left text-white backdrop-blur-lg overflow-hidden z-10 font-sans"
          >
            {/* Glowing Accent Layer */}
            <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-brand-purple/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#10B981]/5 blur-2xl pointer-events-none" />

            {/* Header info */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-[#a78bfa] font-black uppercase tracking-widest bg-brand-purple/10 border border-[#a78bfa]/20 px-2.5 py-0.5 rounded-full self-start">
                  👑 Premium Feature Locked
                </span>
                <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white mt-1.5">
                  Unlock PageNest Workspace
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-brand-muted hover:text-white text-xs border border-white/5 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Reason block */}
            <p className="text-xs text-brand-muted leading-relaxed italic bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
              💡 {explanation}
            </p>

            {/* Billing Toggle Selector */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Select Billing Cycle</span>
              <div className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full p-0.5">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`px-3 py-1 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    billing === "monthly" ? "bg-brand-purple text-white shadow-sm" : "text-brand-muted hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling("yearly")}
                  className={`px-3 py-1 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    billing === "yearly" ? "bg-brand-purple text-white shadow-sm" : "text-brand-muted hover:text-white"
                  }`}
                >
                  Yearly (-25%)
                </button>
              </div>
            </div>

            {/* Visual Plan Card Comparison */}
            <div className="flex flex-col md:flex-row gap-3 mt-1.5">
              
              {/* Pro Plan Card */}
              <div className="flex-1 bg-white/[0.02] border border-brand-purple/40 rounded-2xl p-4 flex flex-col justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-purple text-white text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-bl-lg">
                  Popular
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-white tracking-wide">Pro Tier</h4>
                  <p className="text-[9px] text-brand-muted leading-none mt-1">Creator Workspace</p>
                  <h5 className="text-2xl font-black text-white tracking-tight mt-2.5">
                    ${billing === "yearly" ? "6.75" : "9.00"}
                    <span className="text-[8px] text-brand-muted font-normal uppercase tracking-widest pl-1">/ mo</span>
                  </h5>
                  <span className="text-[7.5px] text-[#a78bfa] block mt-0.5 leading-none">
                    {billing === "yearly" ? "Billed $81 annually" : "Billed monthly"}
                  </span>
                  
                  <ul className="flex flex-col gap-2 mt-4 text-[9px] text-white/80">
                    <li className="flex items-center gap-1.5">✓ 50 Ebooks Limit</li>
                    <li className="flex items-center gap-1.5">✓ Premium Layouts</li>
                    <li className="flex items-center gap-1.5">✓ EPUB & DOCX Compilers</li>
                    <li className="flex items-center gap-1.5">✓ Priority Queue</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe("plan_pro")}
                  disabled={loading}
                  className="w-full py-2 bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-xl cursor-pointer transition-all disabled:opacity-40"
                >
                  {loading ? "Processing..." : "Select Pro"}
                </button>
              </div>

              {/* Agency Plan Card */}
              <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-white tracking-wide">Agency Tier</h4>
                  <p className="text-[9px] text-brand-muted leading-none mt-1">Studio Workspaces</p>
                  <h5 className="text-2xl font-black text-white tracking-tight mt-2.5">
                    ${billing === "yearly" ? "14.25" : "19.00"}
                    <span className="text-[8px] text-brand-muted font-normal uppercase tracking-widest pl-1">/ mo</span>
                  </h5>
                  <span className="text-[7.5px] text-emerald-400 block mt-0.5 leading-none">
                    {billing === "yearly" ? "Billed $171 annually" : "Billed monthly"}
                  </span>
                  
                  <ul className="flex flex-col gap-2 mt-4 text-[9px] text-white/80">
                    <li className="flex items-center gap-1.5">✓ Unlimited Creations</li>
                    <li className="flex items-center gap-1.5">✓ Brand Kits Profiles</li>
                    <li className="flex items-center gap-1.5">✓ Shared Team Canvas</li>
                    <li className="flex items-center gap-1.5">✓ Priority 24/7 Support</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe("plan_agency")}
                  disabled={loading}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-xl cursor-pointer transition-all disabled:opacity-40 border border-white/10"
                >
                  {loading ? "Processing..." : "Select Agency"}
                </button>
              </div>

            </div>

            {/* Footer warning */}
            <span className="text-[8px] text-brand-muted text-center leading-normal">
              💳 Payment processing conducted securely via SSL encryption. Cancel anytime with a single click in your Billing settings.
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

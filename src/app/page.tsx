"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

// Import layout components
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

// Import landing sections
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Showcase } from "@/components/sections/Showcase";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Features } from "@/components/sections/Features";
import { Templates } from "@/components/sections/Templates";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import PaywallModal from "@/components/ui/PaywallModal";

export default function Home() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallReason] = useState("");

  // Check session on load and redirect if authenticated
  useEffect(() => {
    const supabase = createClient();
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard");
      } else {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  const handleSignUpRedirect = () => {
    router.push("/signup");
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center font-sans">
        <p className="text-xs text-brand-muted animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  // Render standard Landing Page
  return (
    <main className="pn-app-shell bg-brand-bg min-h-screen">
      <Navbar
        authMode={null}
        userName=""
      />
      <Hero
        onCreate={handleSignUpRedirect}
      />
      <SocialProof />
      <HowItWorks />
      <Showcase />
      <BeforeAfter />
      <Features />
      <Templates onSelectTemplate={handleSignUpRedirect} />
      <Testimonials />
      <Pricing
        billing={billingPeriod}
        setBilling={setBillingPeriod}
        onStart={handleSignUpRedirect}
      />
      <FAQ />

      {/* SECTION 10 — FINAL CTA */}
      <section className="py-24 bg-[#070B14] px-6 lg:px-16 border-t border-b border-white/5 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />
        <Container className="!px-0 relative z-10 flex flex-col items-center gap-6 max-w-xl">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
            Ready To Publish Your First Ebook?
          </h2>
          <p className="text-brand-muted text-sm max-w-md leading-relaxed">
            Generate, edit and export professional ebooks in minutes. Start creating and scaling your digital audience today.
          </p>
          <button
            onClick={handleSignUpRedirect}
            className="px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-sm font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 group cursor-pointer mt-4"
          >
            <span>Start Creating Free</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </Container>
      </section>

      <Footer />
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        reason={paywallReason}
      />
    </main>
  );
}

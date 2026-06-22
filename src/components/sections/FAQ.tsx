"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";

export function FAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqItems = [
    {
      q: "How does the AI generate ebook chapters?",
      a: "PageNest utilizes Google Gemini models to outline, structure, and draft cohesive chapters based on your prompt, uploaded notes, or rough outline. It automatically formats the output into clean, structured editorial copy."
    },
    {
      q: "Can I download PDF files directly?",
      a: "Yes. With the Pro and Ultra plans, you can export high-resolution, print-ready PDFs without any watermarks. The Free tier allows up to 30-page preview exports with a light PageNest brand tag."
    },
    {
      q: "Can I upload custom images and cover art?",
      a: "Absolutely. You can upload custom PNG, JPEG, and WEBP files directly inside our preview editor canvas, or use the layout generator to automatically compose book covers matching your style."
    },
    {
      q: "What is the difference between Pro and Ultra plans?",
      a: "Pro includes 60 ebook generations per month, priority processing, and premium templates. Ultra offers unlimited ebook generations, a larger 120-page limit per book, team workspaces for collaboration, and advanced brand kits."
    },
    {
      q: "How easy is it to change payment providers?",
      a: "Extremely simple. PageNest's architecture features a payment provider abstraction system. You can switch between Stripe, PayPal, and Razorpay seamlessly by updating backend environment config settings."
    },
    {
      q: "Does PageNest support team workspaces?",
      a: "Yes, team workspaces are supported on the Ultra tier. You can invite team members to collaborate on identical ebook manuscripts, share templates, and manage branding kits collectively."
    },
    {
      q: "Are the generated ebooks copyright-free?",
      a: "Yes, you own 100% of the intellectual property and copyright of the books you generate. You are free to sell, distribute, or print them as digital products."
    },
    {
      q: "Can I modify the layout margins and fonts?",
      a: "Yes. Our visual studio lets you choose alternative typography packages, swap theme colors on the fly, adjust text block size, and tweak alignments directly in the preview."
    },
    {
      q: "What formatting guidelines does the PDF follow?",
      a: "PageNest exports follow professional editorial standards: strict margin boundaries, readable font heights, balanced heading scales, proper page breaks, and high-fidelity embedded image resolutions."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes, you can cancel your monthly or yearly plan at any time from your account settings. You will retain access to your plan benefits until the end of your billing cycle."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#070B14] px-6 lg:px-16 border-b border-brand-border/60 font-sans">
      <Container className="!px-0">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="flex flex-col gap-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border-b border-white/5 pb-4">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left py-4 text-base lg:text-lg text-white font-bold hover:text-brand-purple transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className="text-brand-purple font-light text-2xl ml-4">
                    {activeFaq === idx ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-brand-muted leading-relaxed font-sans pt-2 pb-4">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

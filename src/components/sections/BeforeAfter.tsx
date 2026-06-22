"use client";

import { motion } from "framer-motion";
import { Container } from "../ui/Container";

export function BeforeAfter() {
  return (
    <section className="py-24 bg-[#070B14] px-6 lg:px-16 border-b border-brand-border/60">
      <Container className="!px-0">
        <div className="flex flex-col items-center text-center mb-16 gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">
            Visual Transformation
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            From Raw Notes to Published Ebook
          </h2>
          <p className="text-brand-muted text-sm max-w-lg mt-2">
            See the dramatic difference. Stop struggling with alignment margins and custom styles. Let AI compile your content instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Left Column - BEFORE: Raw Notes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col bg-white/[0.02] border border-white/5 rounded-[20px] p-6 lg:p-8"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                Before: Raw Notes
              </span>
              <span className="text-[9px] bg-white/5 text-white/50 px-2 py-0.5 rounded font-mono">
                draft_notes.txt
              </span>
            </div>

            <div className="flex-grow font-mono text-xs text-white/60 leading-relaxed bg-[#0b0f19] p-5 rounded-xl border border-white/5 flex flex-col gap-4 min-h-[300px]">
              <div>
                <span className="text-brand-purple font-bold"># Startup Pitch Outline</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/40">## Introduction</span>
                <span>* Problem: Pitching takes too much time.</span>
                <span>* Solution: Auto-typeset ebooks instantly.</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/40">## Key Audiences</span>
                <span>- Founders who need seed capital lead magnets.</span>
                <span>- Coaches creating signature playbooks.</span>
                <span>- Marketers scaling digital product lists.</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/40">## Core Value</span>
                <span>No formatting. No pixel-pushing. Upload brief. Download PDF.</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - AFTER: Beautiful Ebook Spread */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col bg-gradient-to-b from-brand-purple/[0.03] to-transparent border border-brand-purple/20 rounded-[20px] p-6 lg:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">
                After: PageNest Ebook
              </span>
              <span className="text-[9px] bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Publishing-Grade PDF
              </span>
            </div>

            {/* Simulated Ebook Spread Card */}
            <div className="flex-grow bg-[#0c1221] border border-brand-purple/30 p-6 rounded-xl flex flex-col justify-between min-h-[300px] shadow-2xl shadow-brand-purple/10">
              <div className="border-b border-white/10 pb-2 flex justify-between items-center">
                <span className="text-[6px] tracking-wider text-brand-purple font-bold">STARTUP PITCH OUTLINE</span>
                <span className="text-[6px] text-white/40">SECTION 01</span>
              </div>

              <div className="my-auto py-4 flex flex-col gap-3">
                <h3 className="font-extrabold text-white text-base leading-tight tracking-tight uppercase">
                  Securing Capital
                </h3>
                <p className="text-[9px] text-white/80 leading-relaxed">
                  <span className="text-base font-black text-brand-purple float-left mr-1.5 leading-none">P</span>
                  itching to venture funds requires meticulous framing. To capture partner interest, founders must transform raw, unformatted operational lists into beautiful, authoritative lead-generation assets that prove domain expertise immediately.
                </p>
                <div className="border-l-2 border-brand-purple pl-3 py-1 bg-white/[0.02] rounded-r">
                  <p className="text-[8px] text-brand-muted italic leading-relaxed">
                    "PageNest automates layout formatting, making documents instantly investor-ready."
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[5px] text-white/30 border-t border-white/5 pt-2">
                <span>PAGENEST STUDIO</span>
                <span>PAGE 3 OF 12</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

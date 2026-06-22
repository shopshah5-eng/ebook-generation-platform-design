"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "../ui/Container";

interface TemplatesProps {
  onSelectTemplate: (template: { theme: string; title: string }) => void;
}

export function Templates({ onSelectTemplate }: TemplatesProps) {
  const [activeTplIndex, setActiveTplIndex] = useState(0);

  const handleTplScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth;
    if (cardWidth > 0) {
      const index = Math.round(scrollPosition / cardWidth);
      setActiveTplIndex(index);
    }
  };

  const library = [
    {
      title: "Startup Playbook",
      theme: "Startup",
      tag: "SAAS",
      badge: "Popular",
      accent: "#7C3AED",
      // Beautiful HTML/CSS cover renderer details
      render: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#0c0d19] to-[#1e1436] flex flex-col justify-between p-5 relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/20 rounded-full blur-2xl" />
          
          <div className="flex justify-between items-center z-10">
            <span className="text-[6px] tracking-widest text-[#a78bfa] font-bold uppercase">BUILD & SCALE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
          </div>
          
          <div className="my-auto z-10 flex flex-col gap-1.5">
            <h3 className="font-extrabold text-white text-base leading-tight tracking-tight uppercase">
              Startup Playbook
            </h3>
            <div className="h-0.5 w-8 bg-brand-purple" />
            <p className="text-[7px] text-brand-muted font-medium">A founder's roadmap to product-market fit.</p>
          </div>

          <div className="flex justify-between items-center text-[5px] text-white/30 tracking-widest border-t border-white/5 pt-3 z-10">
            <span>PAGENEST PRESS</span>
            <span>VOL. I</span>
          </div>
        </div>
      ),
    },
    {
      title: "Financial Freedom",
      theme: "Finance",
      tag: "INVESTING",
      badge: "Premium",
      accent: "#10B981",
      render: () => (
        <div className="w-full h-full bg-[#051c14] flex flex-col justify-between p-5 relative overflow-hidden border border-[#0f3b2a]">
          {/* Elegant gold margins */}
          <div className="absolute inset-2 border border-dashed border-[#1e5c43] opacity-60 pointer-events-none" />
          
          <div className="flex justify-center z-10 mt-1">
            <span className="text-[6px] tracking-wider text-[#10B981] font-bold uppercase">ASSET ACCUMULATION</span>
          </div>
          
          <div className="my-auto z-10 flex flex-col items-center text-center gap-2 px-1">
            <h3 className="font-serif font-light text-white text-base leading-tight tracking-wide">
              FINANCIAL FREEDOM
            </h3>
            <svg className="w-6 h-6 text-[#10b981]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[6px] text-brand-muted leading-tight">Strategies for independent wealth creation.</p>
          </div>

          <div className="flex justify-between items-center text-[5px] text-[#10B981]/60 tracking-wider z-10 px-2">
            <span>EDITION 2026</span>
            <span>EST. NET</span>
          </div>
        </div>
      ),
    },
    {
      title: "Mindful Focus",
      theme: "Wellness",
      tag: "WELLNESS",
      badge: "Free",
      accent: "#94A3B8",
      render: () => (
        <div className="w-full h-full bg-[#1b1c22] flex flex-col justify-between p-5 relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <span className="text-[6px] tracking-widest text-brand-muted font-bold uppercase">ZEN LABS</span>
            <span className="text-[6px] text-brand-muted">03</span>
          </div>

          <div className="my-auto z-10 flex flex-col items-center gap-4">
            {/* Minimalist focus circle */}
            <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center relative">
              <div className="h-4 w-4 rounded-full bg-brand-purple/20 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-white text-base leading-tight uppercase tracking-wider">
                Mindful Focus
              </h3>
              <p className="text-[6px] text-brand-muted mt-1 max-w-[100px] mx-auto">Tactical guidelines for distraction-free deep work.</p>
            </div>
          </div>

          <div className="text-center text-[5px] text-white/30 tracking-widest z-10">
            <span>HUMAN PERFORMANCE STUDIO</span>
          </div>
        </div>
      ),
    },
    {
      title: "Marketing Mastery",
      theme: "Marketing",
      tag: "GROWTH",
      badge: "Premium",
      accent: "#F97316",
      render: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#1c0d06] to-[#3b1c0a] flex flex-col justify-between p-5 relative overflow-hidden border border-[#52250d]">
          <div className="absolute top-[-20%] left-[-20%] w-36 h-36 bg-[#F97316]/10 rounded-full blur-2xl" />
          
          <div className="flex justify-between items-center z-10">
            <span className="text-[6px] tracking-widest text-[#fdba74] font-bold uppercase">TRAFFIC ENGINE</span>
            <span className="text-[6px] text-[#fdba74] font-bold">X90</span>
          </div>

          <div className="my-auto z-10 flex flex-col gap-2">
            <h3 className="font-black text-white text-base leading-none tracking-tighter uppercase italic">
              MARKETING<br />MASTERY
            </h3>
            <div className="h-[2px] w-full bg-[#F97316]" />
            <p className="text-[7px] text-brand-muted font-medium">Acquisition channels that convert visitors into buyers.</p>
          </div>

          <div className="flex justify-between items-center text-[5px] text-[#fdba74]/50 tracking-wider z-10">
            <span>PAGENEST GROW</span>
            <span>VOL. 3</span>
          </div>
        </div>
      ),
    },
    {
      title: "Leadership Blueprint",
      theme: "Business",
      tag: "STRATEGY",
      badge: "Popular",
      accent: "#3B82F6",
      render: () => (
        <div className="w-full h-full bg-[#0a0e1a] flex flex-col justify-between p-5 relative overflow-hidden border border-[#16274d]">
          {/* Blueprint style grid lines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3B82F6_0.5px,transparent_0.5px)] bg-[size:10px_10px]" />
          
          <div className="flex justify-between items-center z-10">
            <span className="text-[6px] tracking-widest text-[#60a5fa] font-bold uppercase">MANAGEMENT SHEETS</span>
            <span className="h-1.5 w-6 bg-[#3B82F6]/30 rounded-full" />
          </div>

          <div className="my-auto z-10 flex flex-col gap-1.5">
            <span className="text-[7px] text-[#60a5fa] font-bold font-mono">CODE: LDR_02</span>
            <h3 className="font-extrabold text-white text-base leading-tight uppercase tracking-tight">
              Leadership Blueprint
            </h3>
            <p className="text-[7px] text-brand-muted leading-tight">Building high-agency teams in distributed ecosystems.</p>
          </div>

          <div className="flex justify-between items-center text-[5px] text-[#60a5fa]/50 tracking-wider z-10 font-mono">
            <span>SHEET_REF: 04B</span>
            <span>PAGENEST HQ</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="templates" className="py-24 bg-[#070B14] border-b border-brand-border/60">
      <Container className="!px-0">
        <div className="flex flex-col items-center text-center mb-16 gap-3 px-6 lg:px-0">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">
            Aesthetic Presets
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Premium Ebook Layouts
          </h2>
          <p className="text-brand-muted text-sm max-w-lg mt-2">
            Explore our curated gallery of publishing-grade covers. Click any template to start creation.
          </p>
        </div>

        {/* Mobile Swipeable Carousel */}
        <div className="md:hidden flex flex-col items-center gap-6 px-6">
          <div
            onScroll={handleTplScroll}
            className="w-full flex overflow-x-auto flex-nowrap gap-6 snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
          >
            {library.map((t, idx) => (
              <div
                key={idx}
                className="shrink-0 snap-center flex flex-col group cursor-pointer"
                onClick={() => onSelectTemplate({ theme: t.theme, title: t.title })}
                style={{ width: "calc(100vw - 48px)" }}
              >
                {/* Visual Cover mockup */}
                <div className="w-full aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl border border-white/5 relative">
                  {t.render()}
                  {/* Overlay hover prompt */}
                  <div className="absolute inset-0 bg-[#070B14]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <span className="text-xs font-bold text-white uppercase tracking-widest bg-brand-purple px-4 py-2 rounded-full shadow-lg">
                      Use Template
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between px-2">
                  <span className="text-sm font-bold text-white group-hover:text-brand-purple transition-colors">
                    {t.title}
                  </span>
                  <span
                    className="text-[9px] font-bold font-sans uppercase px-2 py-0.5 rounded border"
                    style={{
                      borderColor: `${t.accent}20`,
                      color: t.accent,
                      backgroundColor: `${t.accent}08`,
                    }}
                  >
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel indicators dots */}
          <div className="flex gap-2">
            {library.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  activeTplIndex === idx ? "w-4 bg-brand-purple" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6 px-6 lg:px-0">
          {library.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="flex flex-col group cursor-pointer"
              onClick={() => onSelectTemplate({ theme: t.theme, title: t.title })}
            >
              {/* Virtual Mockup Container */}
              <div className="w-full aspect-[3/4] rounded-[20px] overflow-hidden shadow-2xl border border-white/5 group-hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-all duration-300 group-hover:-translate-y-2 relative">
                {t.render()}
                {/* Overlay hover prompt */}
                <div className="absolute inset-0 bg-[#070B14]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-brand-purple px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                    Use Template
                  </span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between px-1.5">
                <span className="text-xs font-bold text-white group-hover:text-brand-purple transition-colors">
                  {t.title}
                </span>
                <span
                  className="text-[8px] font-bold font-sans uppercase px-1.5 py-0.5 rounded border"
                  style={{
                    borderColor: `${t.accent}20`,
                    color: t.accent,
                    backgroundColor: `${t.accent}08`,
                  }}
                >
                  {t.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

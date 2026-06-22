"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const stepsList = [
    {
      num: "01",
      title: "Describe Idea",
      desc: "Provide a simple concept prompt, paste raw outlines, or upload existing notes. Our pipeline extracts your core message.",
    },
    {
      num: "02",
      title: "AI Creates Ebook",
      desc: "Our engine outlines the structure, drafts professional copy, pairs typography, and designs a matching cover layout.",
    },
    {
      num: "03",
      title: "Edit & Customize",
      desc: "Refine chapter text, swap color schemes, change fonts, and regenerate illustrations directly in the live editor.",
    },
    {
      num: "04",
      title: "Export & Publish",
      desc: "Instantly download a production-ready, watermark-free PDF or EPUB document optimized for lead magnets and printing.",
    },
  ];

  // Auto transition steps every 5 seconds to keep the simulation alive
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepsList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-[#070B14] px-6 lg:px-16 border-b border-brand-border/60">
      <Container className="!px-0">
        <div className="flex flex-col items-center text-center mb-16 gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">
            Seamless Workflow
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How PageNest Works
          </h2>
          <p className="text-brand-muted text-sm max-w-lg mt-2">
            Transform raw outlines into professional digital books in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 lg:px-0">
          {/* Left Checklist Cards Column with vertical timeline line */}
          <div className="lg:col-span-5 flex flex-col gap-4 relative pl-4 md:pl-6">
            {/* Timeline connector line */}
            <div className="absolute left-7 md:left-9 top-6 bottom-6 w-[2px] bg-white/5 pointer-events-none" />

            {stepsList.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-[20px] border transition-all duration-300 cursor-pointer flex gap-4 items-start relative z-10 ${
                    isActive
                      ? "bg-white/[0.04] border-brand-purple/40 shadow-[0_0_30px_rgba(124,58,237,0.06)]"
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Glowing step node */}
                  <span
                    className={`h-6 w-6 md:h-8 md:w-8 rounded-full border text-[9px] md:text-xs font-bold flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive
                        ? "bg-brand-purple border-brand-purple text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                        : "bg-[#070B14] border-white/10 text-brand-muted"
                    }`}
                  >
                    {step.num}
                  </span>

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${
                          isActive ? "text-brand-purple" : "text-brand-muted"
                        }`}
                      >
                        Step {step.num}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-brand-muted text-xs leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Live Simulation Visual */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[480px] aspect-[4/3] rounded-[20px] bg-white/[0.02] border border-white/5 shadow-2xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/[0.01] to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-[9px] font-bold text-brand-purple uppercase tracking-widest">
                  Live Process Simulator
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-success animate-pulse" />
                  <span className="text-[9px] font-medium text-brand-muted uppercase">Interactive Mode</span>
                </div>
              </div>

              <div className="my-auto py-6 flex items-center justify-center min-h-[160px]">
                <AnimatePresence mode="wait">
                  {activeStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="w-full flex flex-col gap-3"
                    >
                      <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">
                        Concept Ingestion
                      </span>
                      <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-2 font-mono text-[10px] text-white/70">
                        <p className="text-white font-sans font-semibold text-xs mb-1">Brief Description:</p>
                        <span className="text-white/95">"Create a 12-page guide on seed funding strategies for tech startups, highlighting pitch deck layouts."</span>
                        <div className="flex items-center gap-1.5 mt-2 text-brand-muted font-sans">
                          <span className="h-2 w-2 rounded-full bg-brand-purple animate-pulse" />
                          <span>Outline Parser Ready</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="w-full flex flex-col gap-3"
                    >
                      <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">
                        Formatting Layout System
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="h-20 bg-white/[0.03] rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1.5">
                          <span className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest">Grid</span>
                          <span className="text-[9px] font-bold text-brand-purple">Swiss-Mini</span>
                        </div>
                        <div className="h-20 bg-white/[0.03] rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1.5">
                          <span className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest">Type</span>
                          <span className="text-[9px] font-bold text-brand-purple">Inter / Sans</span>
                        </div>
                        <div className="h-20 bg-white/[0.03] rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1.5">
                          <span className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest">Colors</span>
                          <span className="text-[9px] font-bold text-brand-purple">Royal Indigo</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="w-full flex flex-col gap-3"
                    >
                      <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">
                        Live Editor Canvas
                      </span>
                      <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1.5 flex-grow">
                          <div className="h-2.5 w-12 bg-brand-purple/20 rounded" />
                          <div className="h-3 w-32 bg-white/15 rounded" />
                          <div className="h-2 w-28 bg-white/10 rounded" />
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-[8px] bg-brand-purple/20 text-brand-purple font-bold px-2 py-1 rounded">Font: Inter</span>
                          <span className="text-[8px] border border-white/10 text-white/80 px-2 py-0.5 rounded cursor-pointer hover:bg-white/10 transition-colors">Swap Theme</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center gap-3 text-center"
                    >
                      <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple border border-brand-purple/20 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                        <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        seed_funding_strategy.pdf
                      </span>
                      <span className="text-[10px] text-brand-success font-semibold">
                        Ready for distribution &middot; 4.2 MB
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Bar Indicator */}
              <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                {stepsList.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`h-1 flex-grow rounded cursor-pointer transition-colors duration-500 ${
                      activeStep >= idx ? "bg-brand-purple" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

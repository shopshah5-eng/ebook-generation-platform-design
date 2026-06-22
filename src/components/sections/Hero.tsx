"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";

interface HeroProps {
  onCreate: () => void;
}

export function Hero({ onCreate }: HeroProps) {
  const [demoStep, setDemoStep] = useState(0); // 0: typing, 1: checklist progress, 2: finished book
  const [typedInput, setTypedInput] = useState("");
  const [checklistIndex, setChecklistIndex] = useState(0);

  const fullPrompt = "Startup Funding Guide";
  const checklist = [
    "Researching topic",
    "Creating structure",
    "Writing chapters",
    "Designing cover",
    "Creating visuals",
    "Exporting PDF",
  ];

  // Simulation loop
  useEffect(() => {
    if (demoStep === 0) {
      setChecklistIndex(0);
      let i = 0;
      const interval = setInterval(() => {
        if (i < fullPrompt.length) {
          setTypedInput(fullPrompt.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setDemoStep(1);
          }, 800);
        }
      }, 50);
      return () => clearInterval(interval);
    } else if (demoStep === 1) {
      const interval = setInterval(() => {
        setChecklistIndex((prev) => {
          if (prev < checklist.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setDemoStep(2);
            }, 1000);
            return prev;
          }
        });
      }, 800);
      return () => clearInterval(interval);
    } else if (demoStep === 2) {
      const timer = setTimeout(() => {
        setTypedInput("");
        setDemoStep(0);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [demoStep]);

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center py-28 px-6 lg:px-16 overflow-hidden bg-[#070B14]"
    >
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <Container className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center !px-0 relative z-10">
        {/* Left Value Proposition Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple mb-4 block">
            AI-POWERED EBOOK PLATFORM
          </span>
          <h1 className="font-sans text-4xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Generate publishing-grade ebooks, lead magnets and reports using AI.
          </h1>
          <p className="text-brand-muted text-base lg:text-lg max-w-xl mb-10 leading-relaxed font-sans">
            For founders, coaches, agencies, and marketers. PageNest combines research, copywriting, and premium layout design into a single automated pipeline—no templates, no formatting headaches.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onCreate}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-sm font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 group cursor-pointer"
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
            <a
              href="#pricing"
              className="text-xs font-bold text-brand-muted hover:text-white uppercase tracking-wider transition-colors py-3"
            >
              View Pricing plans &rarr;
            </a>
          </div>
        </motion.div>

        {/* Right Live-Updating AI Demo Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-5 flex justify-center items-center"
        >
          <div className="w-full max-w-md bg-white/[0.03] border border-brand-border rounded-[20px] shadow-2xl p-6 lg:p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/[0.02] to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-6">
              <span className="text-[10px] uppercase tracking-wider font-bold text-brand-purple">
                Live Generation Studio
              </span>
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>

            <div className="flex-grow flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {demoStep === 0 && (
                  /* Input Typing Step */
                  <motion.div
                    key="demo-step-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <label className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                      Describe Ebook Concept
                    </label>
                    <div className="min-h-[80px] w-full px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-xs text-white flex items-center">
                      <span className="font-medium text-white/90">{typedInput}</span>
                      <span className="h-4 w-1 bg-brand-purple animate-pulse ml-0.5" />
                    </div>
                  </motion.div>
                )}

                {demoStep === 1 && (
                  /* Checklist Step */
                  <motion.div
                    key="demo-step-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <label className="text-[10px] uppercase font-bold text-brand-muted tracking-wider mb-1">
                      Generating Ebook Structure & Copy
                    </label>
                    <div className="flex flex-col gap-3 font-sans text-xs">
                      {checklist.map((item, idx) => {
                        const isDone = checklistIndex > idx;
                        const isActive = checklistIndex === idx;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 transition-opacity duration-300 ${
                              isDone || isActive ? "opacity-100" : "opacity-25"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                isDone
                                  ? "bg-brand-success text-[#070B14]"
                                  : isActive
                                  ? "bg-brand-purple text-white animate-pulse"
                                  : "bg-white/5 text-brand-muted border border-brand-border"
                              }`}
                            >
                              {isDone ? "✓" : isActive ? "⚙" : idx + 1}
                            </span>
                            <span className={isActive ? "font-bold text-white" : "text-brand-muted"}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {demoStep === 2 && (
                  /* Finished Book Preview Step */
                  <motion.div
                    key="demo-step-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-4 py-4"
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-36 aspect-[3/4] bg-gradient-to-br from-[#0e131f] to-[#1a2336] border border-brand-purple/40 rounded-xl shadow-2xl flex flex-col justify-between p-4 relative overflow-hidden ring-2 ring-brand-purple/20"
                    >
                      {/* Realistic Cover details */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-purple" />
                      <div className="border-b border-white/10 pb-1.5 text-[5px] tracking-widest text-brand-purple font-bold">
                        AI GENERATED EDITION
                      </div>
                      <div className="my-auto text-center px-1">
                        <p className="font-extrabold text-white text-[9px] leading-tight tracking-tight uppercase">
                          Startup Funding Guide
                        </p>
                        <div className="h-[1px] w-6 bg-brand-purple/60 mx-auto my-1.5" />
                        <p className="text-[5px] text-brand-muted italic mt-0.5">Automated Pitch Resource</p>
                      </div>
                      <div className="flex justify-between items-center text-[4px] text-white/40 tracking-wider">
                        <span>PAGENEST ENGINE</span>
                        <span>VOL. 1</span>
                      </div>
                    </motion.div>
                    
                    <span className="text-[10px] text-brand-success font-bold bg-brand-success/15 px-3 py-1 rounded border border-brand-success/20 flex items-center gap-1 animate-bounce">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Ebook Ready &middot; PDF Generated
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-brand-border/60 pt-4 mt-6 flex justify-between items-center text-[9px] text-brand-muted font-semibold">
              <span>POWERED BY GEMINI PRO</span>
              <span>100% AUTOMATED</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

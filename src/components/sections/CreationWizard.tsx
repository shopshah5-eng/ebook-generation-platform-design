"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CreationWizardProps {
  onClose: () => void;
  onGenerate: (data: { prompt: string; author: string; pageCount: number; style: string; audience: string }) => void;
  userName: string;
}

export function CreationWizard({ onClose, onGenerate, userName }: CreationWizardProps) {
  const [step, setStep] = useState(1);
  
  // Form fields
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Founders");
  const [customAudience, setCustomAudience] = useState("");
  const [template, setTemplate] = useState("Startup");
  const [pageCount, setPageCount] = useState(12);

  // Loading generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeLoaderIndex, setActiveLoaderIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const loaderSteps = [
    "Researching Topic",
    "Creating Outline",
    "Writing Chapters",
    "Designing Cover",
    "Generating Images",
    "Finalizing Ebook",
  ];

  // Animate the loader checks and progress bar
  useEffect(() => {
    if (!isGenerating) return;

    // Increment progress percent smoothly
    const progressInterval = setInterval(() => {
      setProgressPercent((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 1;
      });
    }, 120); // ~12 seconds total

    // Cycle checkmarks
    const stepInterval = setInterval(() => {
      setActiveLoaderIndex((idx) => {
        if (idx < loaderSteps.length - 1) {
          return idx + 1;
        }
        clearInterval(stepInterval);
        return idx;
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isGenerating]);

  const audienceOptions = ["Founders", "Coaches", "Students", "Creators", "Marketers", "Custom"];
  const templateOptions = [
    { name: "Business", desc: "Corporate layouts & bold type" },
    { name: "Startup", desc: "Tech grid & neon gradients" },
    { name: "Finance", desc: "Classic columns & elegant tables" },
    { name: "Marketing", desc: "High conversion contrast" },
    { name: "Wellness", desc: "Natural tones & margins" },
    { name: "Luxury", desc: "Dark mode gold leaf elements" },
  ];
  const pageOptions = [8, 12, 16, 20, 24];

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const triggerGenerate = () => {
    setIsGenerating(true);
    const finalAudience = audience === "Custom" ? customAudience : audience;
    
    // Pass generation details back to parent API route after slightly delayed loader sequence
    setTimeout(() => {
      onGenerate({
        prompt: topic,
        author: userName || "Creator",
        pageCount,
        style: template,
        audience: finalAudience,
      });
    }, 12000);
  };

  return (
    <div className="fixed inset-0 bg-brand-bg/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0E131F] border border-brand-border rounded-[20px] shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between"
      >
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <div className="flex-1 flex flex-col justify-between p-8" key="wizard-stage">
              {/* Top Row: title & steps indicator */}
              <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-6">
                <div>
                  <h3 className="font-sans font-bold text-white text-lg">Create Ebook</h3>
                  <p className="text-[10px] text-brand-muted uppercase tracking-wider mt-0.5">
                    Step {step} of 5
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-brand-muted hover:text-white text-xl cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Form stage panel */}
              <div className="flex-1 py-4 flex flex-col justify-center">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                      What is the topic of your ebook?
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. How To Build A Startup"
                      className="w-full px-5 py-3 rounded-xl border border-brand-border bg-white/5 text-white outline-none focus:border-brand-purple/60 text-sm focus:bg-white/[0.08]"
                    />
                    <span className="text-[10px] text-brand-muted">
                      💡 Tip: Descriptive briefs yields better outlines, e.g. "Artificial Intelligence Marketing Playbook for Retail Agencies"
                    </span>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                      Who is your target audience?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {audienceOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setAudience(opt)}
                          className={`py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            audience === opt
                              ? "bg-brand-purple/20 border-brand-purple text-white"
                              : "bg-white/5 border-brand-border text-brand-muted hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {audience === "Custom" && (
                      <input
                        type="text"
                        value={customAudience}
                        onChange={(e) => setCustomAudience(e.target.value)}
                        placeholder="Describe target audience..."
                        className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs focus:bg-white/[0.08] mt-2"
                      />
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                      Choose Ebook Style Template
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {templateOptions.map((tpl) => (
                        <button
                          key={tpl.name}
                          onClick={() => setTemplate(tpl.name)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            template === tpl.name
                              ? "bg-brand-purple/20 border-brand-purple text-white"
                              : "bg-white/5 border-brand-border text-brand-muted hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <p className="text-xs font-bold text-white">{tpl.name}</p>
                          <p className="text-[9px] text-brand-muted mt-1 leading-relaxed">
                            {tpl.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                      Target Page Count
                    </label>
                    <div className="flex justify-between items-center gap-3">
                      {pageOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setPageCount(opt)}
                          className={`flex-1 py-3.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                            pageCount === opt
                              ? "bg-brand-purple/20 border-brand-purple text-white"
                              : "bg-white/5 border-brand-border text-brand-muted hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-brand-muted text-center block mt-2">
                      Full book structures, chapters, and illustrations scale to selected volume counts.
                    </span>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                      Review Outline Specifications
                    </label>
                    <div className="bg-white/5 border border-brand-border rounded-xl p-5 flex flex-col gap-3.5 text-xs text-brand-muted">
                      <div className="flex justify-between border-b border-brand-border/40 pb-2">
                        <span className="font-bold text-white">Topic:</span>
                        <span className="text-white max-w-xs truncate">{topic || "Not Specified"}</span>
                      </div>
                      <div className="flex justify-between border-b border-brand-border/40 pb-2">
                        <span className="font-bold text-white">Target Audience:</span>
                        <span>{audience === "Custom" ? customAudience : audience}</span>
                      </div>
                      <div className="flex justify-between border-b border-brand-border/40 pb-2">
                        <span className="font-bold text-white">Visual Template:</span>
                        <span>{template} Theme</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-white">Volume Size:</span>
                        <span>{pageCount} Layout Pages</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action buttons row */}
              <div className="border-t border-brand-border pt-4 mt-6 flex justify-between items-center gap-4">
                <button
                  onClick={step === 1 ? onClose : handleBack}
                  className="px-5 py-2.5 rounded-full border border-brand-border text-brand-muted hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {step === 1 ? "Cancel" : "Back"}
                </button>

                <button
                  onClick={step === 5 ? triggerGenerate : handleNext}
                  disabled={step === 1 && !topic.trim()}
                  className="px-6 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-xs font-bold transition-all shadow-md disabled:opacity-40 cursor-pointer"
                >
                  {step === 5 ? "Generate Ebook" : "Continue"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col justify-between p-10 text-center" key="loader-stage">
              {/* Loader header */}
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-brand-purple bg-brand-purple/10 px-3 py-1 rounded border border-brand-purple/20">
                  AI Ebook Engine Active
                </span>
                <h3 className="font-sans text-white text-xl font-bold mt-4 leading-tight">
                  Generating Your Book
                </h3>
              </div>

              {/* Progress & previews panel */}
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-xl mx-auto w-full text-left">
                {/* Checklists */}
                <div className="flex flex-col gap-3 font-sans text-xs">
                  {loaderSteps.map((s, idx) => {
                    const isDone = activeLoaderIndex > idx;
                    const isActive = activeLoaderIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 transition-opacity duration-300 ${
                          isDone || isActive ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        <span
                          className={`h-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${
                            isDone
                              ? "bg-brand-success text-brand-bg"
                              : isActive
                              ? "bg-brand-purple text-white animate-pulse"
                              : "bg-white/10 text-brand-muted"
                          }`}
                        >
                          {isDone ? "✓" : isActive ? "⚙" : idx + 1}
                        </span>
                        <span className={isActive ? "font-bold text-white" : ""}>{s}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Cover rendering mockup */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-36 aspect-[3/4] bg-[#070B14] border border-brand-purple/30 rounded-xl shadow-2xl flex flex-col justify-between p-4 relative overflow-hidden ring-2 ring-brand-purple/20"
                  >
                    <div className="absolute inset-0 bg-radial-gradient from-brand-purple/20 to-transparent pointer-events-none" />
                    <div className="border-b border-white/10 pb-1.5 text-[6px] tracking-widest text-brand-purple font-bold">
                      PAGES GENERATOR
                    </div>
                    <div className="my-auto text-center">
                      <p className="font-sans font-bold text-white text-[9px] line-clamp-3 leading-snug">
                        {topic || "Unnamed Ebook"}
                      </p>
                      <p className="text-[6px] text-brand-muted mt-1 truncate">By {userName}</p>
                    </div>
                    <div className="h-1 w-full bg-brand-purple rounded" />
                  </motion.div>
                </div>
              </div>

              {/* Progress and status text footer */}
              <div className="w-full flex flex-col gap-2 max-w-md mx-auto">
                <div className="flex justify-between items-center text-[10px] text-brand-muted font-bold">
                  <span>Progress Pipeline</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-brand-border">
                  <div
                    className="h-full bg-brand-purple transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-brand-muted mt-1 animate-pulse">
                  {loaderSteps[activeLoaderIndex]}... Estimated time remaining: {Math.max(0, Math.ceil((100 - progressPercent) * 0.12))}s
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

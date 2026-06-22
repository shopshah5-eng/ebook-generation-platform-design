"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CreationWizardProps {
  onClose: () => void;
  onGenerate: (data: {
    prompt: string;
    author: string;
    pageCount: number;
    style: string;
    audience: string;
  }) => void;
  userName: string;
  initialTemplate?: string;
}

export default function CreationWizard({ onClose, onGenerate, userName, initialTemplate }: CreationWizardProps) {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Founders");
  const [template, setTemplate] = useState(initialTemplate || "Startup");
  const [pageCount, setPageCount] = useState(12);

  const topicSuggestions = [
    "Startup Funding Guide",
    "Fitness Transformation Blueprint",
    "LinkedIn Growth Playbook",
  ];

  const audienceOptions = [
    "Founders",
    "Coaches",
    "Students",
    "Agencies",
    "Marketers",
    "Consultants",
  ];

  const templateOptions = [
    {
      name: "Startup",
      desc: "Minimal grids & glows",
      render: () => (
        <div className="w-full h-24 bg-gradient-to-br from-[#0c0d19] to-[#1e1436] flex flex-col justify-between p-2.5 rounded-lg border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-brand-purple/20 rounded-full blur-xl" />
          <span className="text-[4px] tracking-widest text-[#a78bfa] font-bold uppercase">PAGENEST</span>
          <span className="text-[6px] font-black text-white uppercase leading-none truncate">STARTUP STYLE</span>
          <div className="h-[1px] w-full bg-white/10" />
        </div>
      ),
    },
    {
      name: "Business",
      desc: "Corporate typography",
      render: () => (
        <div className="w-full h-24 bg-[#0a0e1a] flex flex-col justify-between p-2.5 rounded-lg border border-[#16274d] relative overflow-hidden">
          <span className="text-[4px] tracking-widest text-[#60a5fa] font-bold uppercase">BLUEPRINT</span>
          <span className="text-[6px] font-bold text-white uppercase leading-none truncate">BUSINESS STANDARD</span>
          <div className="h-0.5 w-6 bg-[#3B82F6]" />
        </div>
      ),
    },
    {
      name: "Marketing",
      desc: "Conversion driven layout",
      render: () => (
        <div className="w-full h-24 bg-gradient-to-br from-[#1c0d06] to-[#3b1c0a] flex flex-col justify-between p-2.5 rounded-lg border border-[#52250d] relative overflow-hidden">
          <span className="text-[4px] tracking-widest text-[#fdba74] font-bold uppercase">MARKETING</span>
          <span className="text-[6px] font-black text-white italic uppercase leading-none truncate">GROWTH PLAYBOOK</span>
          <div className="h-[1px] w-4 bg-[#F97316]" />
        </div>
      ),
    },
    {
      name: "Finance",
      desc: "Elegant border columns",
      render: () => (
        <div className="w-full h-24 bg-[#051c14] flex flex-col justify-between p-2.5 rounded-lg border border-[#0f3b2a] relative overflow-hidden">
          <div className="absolute inset-1 border border-dashed border-[#1e5c43] opacity-60" />
          <span className="text-[4px] tracking-widest text-[#10B981] font-bold uppercase text-center">ASSETS</span>
          <span className="text-[6px] font-serif text-white uppercase leading-none text-center truncate">WEALTH ACCUMULATION</span>
          <span className="text-[4px] text-white/30 text-right">EST. NET</span>
        </div>
      ),
    },
    {
      name: "Education",
      desc: "Modern academic design",
      render: () => (
        <div className="w-full h-24 bg-[#1b1c22] flex flex-col justify-between p-2.5 rounded-lg border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[4px] tracking-widest text-brand-muted font-bold uppercase">zen labs</span>
            <span className="text-[4px] text-brand-muted">03</span>
          </div>
          <span className="text-[6px] font-extrabold text-white text-center uppercase tracking-wider truncate">MINDFUL FOCUS</span>
          <div className="text-center text-[3px] text-white/30 tracking-widest">STUDIO</div>
        </div>
      ),
    },
    {
      name: "Wellness",
      desc: "Clean sage layouts",
      render: () => (
        <div className="w-full h-24 bg-[#061e1a] flex flex-col justify-between p-2.5 rounded-lg border border-[#164d42] relative overflow-hidden">
          <span className="text-[4px] tracking-widest text-[#2dd4bf] font-bold uppercase">BALANCE</span>
          <span className="text-[6px] font-serif text-white uppercase leading-none truncate">WELLNESS JOURNAL</span>
          <div className="h-[1px] w-full bg-[#14b8a6]/20" />
        </div>
      ),
    },
  ];

  const pageOptions = [8, 12, 16, 20, 24];

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    onGenerate({
      prompt: topic,
      author: userName || "Creator",
      pageCount,
      style: template,
      audience,
    });
  };

  return (
    <div className="fixed inset-0 bg-[#070B14]/95 backdrop-blur-md z-50 flex items-center justify-center md:p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full h-full md:h-auto md:max-w-2xl bg-[#0E131F] border-0 md:border md:border-white/5 rounded-none md:rounded-[20px] shadow-2xl p-6 md:p-8 flex flex-col justify-between min-h-screen md:min-h-[540px] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.03),transparent_50%)] pointer-events-none" />
 
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 relative z-10">
          <div>
            <h3 className="font-sans font-extrabold text-white text-sm uppercase tracking-widest">Create Ebook</h3>
            <p className="text-[9px] text-[#a78bfa] font-extrabold uppercase tracking-widest mt-1">
              Step {step} of 5 &middot; {step === 1 ? "Concept" : step === 2 ? "Audience" : step === 3 ? "Template" : step === 4 ? "Volume" : "Review"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-white text-xl cursor-pointer leading-none p-2 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Top Progress Bar */}
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-6 relative z-10 shrink-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-brand-purple rounded-full shadow-[0_0_10px_rgba(124,58,237,0.8)]"
          />
        </div>
 
        {/* Content Stages */}
        <div className="flex-grow py-4 flex flex-col justify-center relative z-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
                  Describe Ebook Concept
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Startup Funding Guide..."
                  className="w-full px-5 py-4 rounded-[20px] border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs focus:bg-white/[0.08] transition-all font-sans focus:ring-1 focus:ring-brand-purple/20"
                />
                
                {/* Suggestions List */}
                <div className="flex flex-col gap-2.5 mt-3">
                  <span className="text-[9px] text-brand-muted uppercase tracking-widest font-black">Suggested Topics:</span>
                  <div className="flex flex-wrap gap-2">
                    {topicSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setTopic(suggestion)}
                        className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-brand-purple/30 text-white/80 hover:text-white text-[10px] font-bold tracking-wide transition-all cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
 
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {audienceOptions.map((opt) => {
                    const isSel = audience === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setAudience(opt)}
                        className={`p-5 rounded-[20px] text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-3 shadow-lg ${
                          isSel
                            ? "bg-brand-purple/15 border-brand-purple text-white shadow-brand-purple/5"
                            : "bg-white/[0.02] border-white/5 text-brand-muted hover:text-white hover:bg-white/[0.05] hover:border-white/10"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full border ${isSel ? "bg-brand-purple border-brand-purple" : "bg-white/10 border-white/5"}`} />
                        <span className="tracking-wide uppercase text-[10px]">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
 
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
                  Visual Layout Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {templateOptions.map((opt) => {
                    const isSel = template === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => setTemplate(opt.name)}
                        className={`flex flex-col gap-2.5 rounded-[20px] text-left transition-all cursor-pointer group`}
                      >
                        {/* Styled mini cover card */}
                        <div className={`w-full aspect-[3/4] rounded-[20px] overflow-hidden border transition-all duration-300 relative ${
                          isSel
                            ? "border-brand-purple shadow-[0_0_25px_rgba(124,58,237,0.2)] scale-[1.02]"
                            : "border-white/5 opacity-60 group-hover:opacity-100 group-hover:scale-[1.01]"
                        }`}>
                          {opt.render()}
                        </div>
                        <div className="px-1 text-center w-full">
                          <p className={`text-[10px] font-bold ${isSel ? "text-brand-purple" : "text-white"}`}>{opt.name}</p>
                          <p className="text-[8px] text-brand-muted truncate mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
 
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
                  Volume Page Count
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {pageOptions.map((opt) => {
                    const isSel = pageCount === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setPageCount(opt)}
                        className={`py-5 rounded-[20px] text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-lg ${
                          isSel
                            ? "bg-brand-purple/15 border-brand-purple text-white shadow-brand-purple/5"
                            : "bg-white/[0.02] border-white/5 text-brand-muted hover:text-white hover:bg-white/[0.05] hover:border-white/10"
                        }`}
                      >
                        <span className="text-base font-black tracking-tight">{opt}</span>
                        <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-60">Pages</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
 
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
                  Confirm Outline Setup
                </label>
                <div className="bg-white/[0.02] border border-white/5 rounded-[20px] p-5 flex flex-col gap-3.5 text-xs text-brand-muted shadow-2xl backdrop-blur-md">
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">Ebook Topic:</span>
                    <span className="text-[#a78bfa] font-extrabold max-w-[150px] sm:max-w-xs truncate text-right">{topic || "Untitled Ebook"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">Target Audience:</span>
                    <span className="text-white font-extrabold">{audience}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">Visual Template:</span>
                    <span className="text-white font-extrabold">{template} Layouts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">Total Volume:</span>
                    <span className="text-white font-extrabold">{pageCount} Pages</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
 
        {/* Footer Actions */}
        <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center gap-4 relative z-10 shrink-0 pb-[env(safe-area-inset-bottom,12px)]">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="px-6 py-3.5 rounded-full border border-white/10 text-brand-muted hover:text-white text-xs font-bold transition-all cursor-pointer uppercase tracking-wider hover:bg-white/5"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={step === 5 ? handleSubmit : handleNext}
            disabled={step === 1 && !topic.trim()}
            className="px-7 py-3.5 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:opacity-40 cursor-pointer uppercase tracking-wider active:scale-95 duration-200"
          >
            {step === 5 ? "Generate Ebook" : "Continue"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

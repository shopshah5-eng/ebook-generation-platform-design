"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Chapter {
  title: string;
  description: string;
}

interface CreationWizardProps {
  onClose: () => void;
  onGenerate: (data: {
    prompt: string;
    author: string;
    pageCount: number;
    style: string;
    audience: string;
    tone: string;
    outline: Chapter[];
  }) => void;
  userName: string;
  initialTemplate?: string;
}

export default function CreationWizard({ onClose, onGenerate, userName, initialTemplate }: CreationWizardProps) {
  const [step, setStep] = useState(1); // 1: Concept & Config, 2: Outline Edit
  const [title, setTitle] = useState("My Brand Blueprint");
  const [concept, setConcept] = useState("");
  const [audience, setAudience] = useState("Founders");
  const [tone, setTone] = useState("Professional");
  const [template, setTemplate] = useState(initialTemplate || "Startup");
  const [pageCount, setPageCount] = useState(12);

  // Outline Editing states
  const [outline, setOutline] = useState<Chapter[]>([]);
  const [loadingOutline, setLoadingOutline] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Add Chapter Form inline state
  const [newChTitle, setNewChTitle] = useState("");
  const [newChDesc, setNewChDesc] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const audienceOptions = ["Founders", "Coaches", "Agencies", "Marketers", "Other"];
  const toneOptions = ["Professional", "Casual", "Authoritative", "Friendly"];

  const templateOptions = [
    {
      name: "Startup",
      desc: "Minimal grids & glows",
      render: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#0c0d19] to-[#1e1436] flex flex-col justify-between p-3.5 rounded-lg border border-white/5 relative overflow-hidden">
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
        <div className="w-full h-full bg-[#0a0e1a] flex flex-col justify-between p-3.5 rounded-lg border border-[#16274d] relative overflow-hidden">
          <span className="text-[4px] tracking-widest text-[#60a5fa] font-bold uppercase">BLUEPRINT</span>
          <span className="text-[6px] font-bold text-white uppercase leading-none truncate">BUSINESS STANDARD</span>
          <div className="h-0.5 w-6 bg-[#3B82F6]" />
        </div>
      ),
    },
    {
      name: "Marketing",
      desc: "Conversion layouts",
      render: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#1c0d06] to-[#3b1c0a] flex flex-col justify-between p-3.5 rounded-lg border border-[#52250d] relative overflow-hidden">
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
        <div className="w-full h-full bg-[#051c14] flex flex-col justify-between p-3.5 rounded-lg border border-[#0f3b2a] relative overflow-hidden">
          <div className="absolute inset-1 border border-dashed border-[#1e5c43] opacity-60" />
          <span className="text-[4px] tracking-widest text-[#10B981] font-bold uppercase text-center text-emerald-400">ASSETS</span>
          <span className="text-[6px] font-serif text-white uppercase leading-none text-center truncate">WEALTH GROWTH</span>
        </div>
      ),
    },
    {
      name: "Wellness",
      desc: "Clean sage layouts",
      render: () => (
        <div className="w-full h-full bg-[#061e1a] flex flex-col justify-between p-3.5 rounded-lg border border-[#164d42] relative overflow-hidden">
          <span className="text-[4px] tracking-widest text-[#2dd4bf] font-bold uppercase">BALANCE</span>
          <span className="text-[6px] font-serif text-white uppercase leading-none truncate">WELLNESS JOURNAL</span>
          <div className="h-[1px] w-full bg-[#14b8a6]/20" />
        </div>
      ),
    },
  ];

  const handleGenerateOutline = async () => {
    setLoadingOutline(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: concept,
          title,
          audience,
          tone,
          pageCount,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate outline.");
      setOutline(data.outline || []);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingOutline(false);
    }
  };

  const handleAddChapter = () => {
    if (!newChTitle.trim()) return;
    setOutline([...outline, { title: newChTitle.trim(), description: newChDesc.trim() }]);
    setNewChTitle("");
    setNewChDesc("");
    setShowAddForm(false);
  };

  const handleDeleteChapter = (idx: number) => {
    setOutline(outline.filter((_, i) => i !== idx));
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const copy = [...outline];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setOutline(copy);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === outline.length - 1) return;
    const copy = [...outline];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setOutline(copy);
  };

  const handleSubmit = () => {
    if (outline.length === 0) {
      alert("Outline cannot be empty! Please add some chapters.");
      return;
    }
    onGenerate({
      prompt: concept,
      author: userName || "Creator",
      pageCount,
      style: template,
      audience,
      tone,
      outline,
    });
  };

  return (
    <div className="fixed inset-0 bg-[#070B14]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full max-w-3xl bg-[#0E131F] border border-white/5 rounded-[24px] shadow-2xl p-6 md:p-8 flex flex-col justify-between max-h-[90vh] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.03),transparent_50%)] pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 relative z-10 shrink-0">
          <div>
            <h3 className="font-sans font-extrabold text-white text-sm uppercase tracking-widest">
              {step === 1 ? "Configure Ebook Concept" : "Customize Chapter Outline"}
            </h3>
            <p className="text-[9px] text-[#a78bfa] font-extrabold uppercase tracking-widest mt-1">
              Step {step} of 2 &middot; {step === 1 ? "Concept Input" : "Outline Editing"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-white text-xl cursor-pointer leading-none p-2 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-grow overflow-y-auto pr-1 py-4 relative z-10 scrollbar-thin">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Ebook Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Startup Funding Guide"
                      className="px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] transition-all font-sans"
                    />
                  </div>

                  {/* Audience */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Audience</label>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-white/5 bg-[#0E131F] text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] transition-all font-sans"
                    >
                      {audienceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Writing Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-white/5 bg-[#0E131F] text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] transition-all font-sans"
                    >
                      {toneOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Page Count */}
                  <div className="flex flex-col gap-1.5 justify-center">
                    <div className="flex justify-between items-center text-[9px] font-black text-brand-muted uppercase tracking-widest">
                      <span>Volume (Page Count)</span>
                      <span className="text-white font-bold">{pageCount} Pages</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="w-full accent-brand-purple bg-white/10 h-1.5 rounded-full mt-2 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Concept */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Describe Your Ebook Concept</label>
                  <textarea
                    rows={4}
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="e.g. A comprehensive guide detailing seed funding stages, creating a compelling pitch deck, and key metrics that investors look for in tech companies..."
                    className="px-4 py-3.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] transition-all font-sans resize-none leading-relaxed"
                  />
                </div>

                {/* Template Preset Grid */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Visual Layout Preset</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {templateOptions.map((opt) => {
                      const isSel = template === opt.name;
                      return (
                        <button
                          key={opt.name}
                          onClick={() => setTemplate(opt.name)}
                          className={`flex flex-col gap-1.5 rounded-xl text-left cursor-pointer group`}
                        >
                          <div className={`w-full aspect-[4/3] rounded-xl overflow-hidden border transition-all duration-300 ${
                            isSel
                              ? "border-brand-purple shadow-lg scale-102"
                              : "border-white/5 opacity-55 hover:opacity-100"
                          }`}>
                            {opt.render()}
                          </div>
                          <span className={`text-[9px] font-bold text-center w-full ${isSel ? "text-brand-purple" : "text-brand-muted"}`}>{opt.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && <p className="text-[10px] text-red-400 font-semibold">{errorMsg}</p>}
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Chapters Outline</span>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-3.5 py-1.5 bg-brand-purple hover:bg-brand-purple/95 text-white font-sans text-[10px] font-bold rounded-full transition-all shadow-md cursor-pointer"
                  >
                    + Add Chapter
                  </button>
                </div>

                {/* Chapters List */}
                <div className="flex flex-col gap-3">
                  {outline.map((ch, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <span className="text-[#a78bfa] font-mono">0{idx + 1}.</span>
                          <span>{ch.title}</span>
                        </h4>
                        <p className="text-[10px] text-brand-muted leading-relaxed mt-1">
                          {ch.description || "No description provided."}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveUp(idx)}
                          className="h-7 w-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xs text-white disabled:opacity-20 cursor-pointer hover:bg-white/10"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          disabled={idx === outline.length - 1}
                          onClick={() => handleMoveDown(idx)}
                          className="h-7 w-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xs text-white disabled:opacity-20 cursor-pointer hover:bg-white/10"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(idx)}
                          className="h-7 w-7 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center text-xs text-red-400 cursor-pointer hover:bg-red-950/45"
                          title="Delete Chapter"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Add Chapter Form Modal */}
                {showAddForm && (
                  <div className="fixed inset-0 z-50 bg-[#070B14]/80 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#0E131F] border border-white/5 p-6 rounded-2xl flex flex-col gap-4 shadow-2xl relative">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">Add Custom Chapter</h4>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">Chapter Title</label>
                        <input
                          type="text"
                          value={newChTitle}
                          onChange={(e) => setNewChTitle(e.target.value)}
                          placeholder="e.g. Essential Pitch Slides"
                          className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">Chapter Description</label>
                        <textarea
                          rows={3}
                          value={newChDesc}
                          onChange={(e) => setNewChDesc(e.target.value)}
                          placeholder="What will this chapter discuss..."
                          className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] resize-none"
                        />
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 border border-white/5 rounded-xl text-xs font-bold text-brand-muted hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddChapter}
                          className="px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 rounded-xl text-xs font-bold text-white cursor-pointer"
                        >
                          Add Chapter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center gap-4 relative z-10 shrink-0 pb-[env(safe-area-inset-bottom,12px)]">
          <button
            onClick={step === 1 ? onClose : () => setStep(1)}
            className="px-6 py-3.5 rounded-full border border-white/10 text-brand-muted hover:text-white text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider hover:bg-white/5"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          
          <button
            onClick={step === 1 ? handleGenerateOutline : handleSubmit}
            disabled={(step === 1 && (!concept.trim() || !title.trim() || loadingOutline)) || (step === 2 && outline.length === 0)}
            className="px-7 py-3.5 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white text-[10px] font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:opacity-40 cursor-pointer uppercase tracking-wider active:scale-95 duration-200"
          >
            {loadingOutline ? "Planning Outline..." : step === 1 ? "Generate Outline" : "Compile Ebook"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

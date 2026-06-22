"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GenerationProgress from "../generation/GenerationProgress";

interface ContentBlock {
  id: string;
  type: string;
  content?: string;
  title?: string;
  items?: string[];
  imageUrl?: string;
  imagePrompt?: string;
  caption?: string;
}

interface EbookPage {
  id?: string;
  type: string;
  title?: string;
  subtitle?: string;
  text?: string;
  content?: string;
  quote?: string;
  image?: string;
  imageUrl?: string;
  caption?: string;
  blocks?: ContentBlock[];
  chapters?: any[];
}

interface Ebook {
  id: string;
  title: string;
  author: string;
  theme: string;
  coverImage?: string;
  pages: EbookPage[];
}

interface FirstUserOnboardingProps {
  userName: string;
  onComplete: (generatedBook: Ebook) => void;
  onClose: () => void;
}

export default function FirstUserOnboarding({
  userName,
  onComplete,
  onClose,
}: FirstUserOnboardingProps) {
  // Onboarding steps: 0 (Welcome), 1 (What), 2 (Who), 3 (Template), 4 (Topic), 5 (Generating), 6 (Success)
  const [step, setStep] = useState(0);

  // Selections state
  const [whatCreating, setWhatCreating] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [ebookTopic, setEbookTopic] = useState("");
  
  // Custom user input flag
  const [customWhat, setCustomWhat] = useState("");
  const [customAudience, setCustomAudience] = useState("");

  // Generated ebook result
  const [generatedBook, setGeneratedBook] = useState<Ebook | null>(null);

  // Quick prompt suggestions
  const topicExamples = [
    "How To Build A Startup from scratch",
    "LinkedIn Growth Guide for 2026",
    "Personal Finance Blueprint for Gen Z",
    "Weight Loss & Nutrition Playbook",
  ];

  // Visual option cards for What
  const whatOptions = [
    { id: "lead_magnet", label: "🧲 Lead Magnet", desc: "Build lists and validate leads" },
    { id: "business_ebook", label: "💼 Business Ebook", desc: "High-value corporate handbook" },
    { id: "course_companion", label: "🎓 Course Companion", desc: "Study guides and Blueprints" },
    { id: "marketing_guide", label: "📈 Marketing Guide", desc: "Growth playbooks and tactics" },
    { id: "case_study", label: "📊 Case Study", desc: "In-depth challenges and results" },
    { id: "playbook", label: "🛠 Playbook", desc: "Actionable frameworks & models" },
  ];

  // Option cards for Who
  const whoOptions = [
    { id: "founders", label: "🚀 Founders", desc: "Startup owners and visionaries" },
    { id: "coaches", label: "🧘 Coaches", desc: "Life and fitness professionals" },
    { id: "students", label: "📚 Students", desc: "Academic and research groups" },
    { id: "creators", label: "🎨 Creators", desc: "Audience builders and designers" },
    { id: "agencies", label: "🏢 Agencies", desc: "B2B service providers & teams" },
    { id: "consultants", label: "🧠 Consultants", desc: "Strategic analysts & advisors" },
  ];

  // Visual template gallery presets
  const templatesPresets = [
    { id: "Modern Business", label: "Modern Business", color: "from-[#F8FAFC] to-[#CBD5E1]" },
    { id: "Startup", label: "Startup Theme", color: "from-[#0F172A] to-[#1E293B]" },
    { id: "Wellness", label: "Wellness Green", color: "from-[#ECFDF5] to-[#D1FAE5]" },
    { id: "Finance", label: "Finance Beige", color: "from-[#F5F5DC] to-[#E5E5C8]" },
    { id: "Luxury Brand", label: "Luxury Gold", color: "from-[#0A0A0A] to-[#262626]" },
    { id: "Persuasion", label: "Persuasion Velvet", color: "from-[#4A1018] to-[#6B1724]" },
  ];

  const handleNext = () => {
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const finalWho = targetAudience === "custom" ? customAudience : targetAudience;

  const isNextDisabled = useMemo(() => {
    if (step === 1 && !whatCreating) return true;
    if (step === 1 && whatCreating === "custom" && !customWhat.trim()) return true;
    if (step === 2 && !targetAudience) return true;
    if (step === 2 && targetAudience === "custom" && !customAudience.trim()) return true;
    if (step === 3 && !selectedTemplate) return true;
    if (step === 4 && !ebookTopic.trim()) return true;
    return false;
  }, [step, whatCreating, customWhat, targetAudience, customAudience, selectedTemplate, ebookTopic]);

  return (
    <div className="fixed inset-0 z-50 bg-[#070B14] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Visual Background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute h-96 w-96 rounded-full bg-brand-purple/10 blur-[120px] top-10 left-10 animate-pulse" />
        <div className="absolute h-96 w-96 rounded-full bg-[#10B981]/5 blur-[120px] bottom-10 right-10 animate-pulse" />
      </div>

      {/* STEP COMPILATION ROUTER */}
      {step === 5 ? (
        /* STEP 5: MAGIC MOMENT (LAUNCH GENERATION FLOW) */
        <GenerationProgress
          topic={ebookTopic}
          templateName={selectedTemplate}
          userName={userName}
          author={userName || "Creator"}
          pageCount={6}
          audience={finalWho}
          tone="Professional"
          outline={[]}
          onComplete={(book) => {
            setGeneratedBook(book);
            // Increment activation checklist localstorage
            try {
              localStorage.setItem("pagenest_checklist_create", "true");
            } catch {}
            setStep(6); // Success screen
          }}
          onClose={onClose}
        />
      ) : (
        <div className="flex-grow flex flex-col justify-between p-6 md:p-10 relative z-10 max-w-4xl mx-auto w-full">
          
          {/* Progress Bar (Visible on steps 1-4) */}
          {step > 0 && step < 5 && (
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex justify-between text-[9px] font-extrabold uppercase tracking-widest text-brand-muted">
                <span>Step {step} of 4</span>
                <span>{Math.round((step / 4) * 100)}% Completed</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-brand-purple transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* MAIN STEP PANELS */}
          <div className="flex-grow flex flex-col justify-center my-6 overflow-y-auto no-scrollbar pr-1">
            <AnimatePresence mode="wait">
              
              {/* WELCOME SCREEN */}
              {step === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="text-center flex flex-col items-center gap-6"
                >
                  <div className="relative h-28 w-28 shrink-0 flex items-center justify-center bg-brand-purple/10 border border-brand-purple/20 rounded-[24px]">
                    <span className="text-5xl animate-bounce">📕</span>
                    <span className="absolute -top-1.5 -right-1.5 text-xs bg-[#10B981] text-[#070B14] font-black px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      NEW
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 max-w-md">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                      Welcome to PageNest
                    </h1>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      Let's build your first professionally designed, print-ready ebook in under 2 minutes. No design experience required.
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    className="px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-102 cursor-pointer mt-2"
                  >
                    Get Started &rarr;
                  </button>
                </motion.div>
              )}

              {/* STEP 1: WHAT ARE YOU CREATING? */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="flex flex-col gap-6 text-center"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-widest">STEP 01</span>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                      What are you creating?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left max-w-3xl mx-auto w-full">
                    {whatOptions.map((opt) => {
                      const isSelected = whatCreating === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setWhatCreating(opt.id)}
                          className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-brand-purple bg-brand-purple/10"
                              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="text-sm font-bold text-white block uppercase tracking-wide">{opt.label}</span>
                          <span className="text-[10px] text-brand-muted mt-1 block leading-normal">{opt.desc}</span>
                        </button>
                      );
                    })}

                    {/* Custom Selection */}
                    <button
                      onClick={() => setWhatCreating("custom")}
                      className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        whatCreating === "custom"
                          ? "border-brand-purple bg-brand-purple/10"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-sm font-bold text-white block uppercase tracking-wide">✍️ Custom Topic</span>
                      <span className="text-[10px] text-brand-muted mt-1 block leading-normal">Enter your own document style</span>
                    </button>
                  </div>

                  {whatCreating === "custom" && (
                    <div className="max-w-md mx-auto w-full flex flex-col gap-2 mt-1">
                      <input
                        type="text"
                        placeholder="e.g. Sales Playbook, Travel Journal Blueprints..."
                        value={customWhat}
                        onChange={(e) => setCustomWhat(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-xs text-white outline-none focus:border-brand-purple/50 font-sans"
                        autoFocus
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: WHO IS IT FOR? */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="flex flex-col gap-6 text-center"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-widest">STEP 02</span>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                      Who is this book for?
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left max-w-3xl mx-auto w-full">
                    {whoOptions.map((opt) => {
                      const isSelected = targetAudience === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setTargetAudience(opt.id)}
                          className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-brand-purple bg-brand-purple/10"
                              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="text-sm font-bold text-white block uppercase tracking-wide">{opt.label}</span>
                          <span className="text-[10px] text-brand-muted mt-1 block leading-normal">{opt.desc}</span>
                        </button>
                      );
                    })}

                    {/* Custom Selection */}
                    <button
                      onClick={() => setTargetAudience("custom")}
                      className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        targetAudience === "custom"
                          ? "border-brand-purple bg-brand-purple/10"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-sm font-bold text-white block uppercase tracking-wide">✍️ Custom Audience</span>
                      <span className="text-[10px] text-brand-muted mt-1 block leading-normal">Enter specialized target users</span>
                    </button>
                  </div>

                  {targetAudience === "custom" && (
                    <div className="max-w-md mx-auto w-full flex flex-col gap-2 mt-1">
                      <input
                        type="text"
                        placeholder="e.g. Remote Engineers, Real Estate Investors..."
                        value={customAudience}
                        onChange={(e) => setCustomAudience(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-xs text-white outline-none focus:border-brand-purple/50 font-sans"
                        autoFocus
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: PICK A TEMPLATE */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="flex flex-col gap-6 text-center"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-widest">STEP 03</span>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                      Pick a template preset
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 text-left max-w-3xl mx-auto w-full">
                    {templatesPresets.map((tpl) => {
                      const isSelected = selectedTemplate === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className={`p-3 aspect-[4/3] rounded-[20px] border flex flex-col justify-between relative overflow-hidden transition-all cursor-pointer ${
                            isSelected
                              ? "border-brand-purple bg-brand-purple/10 scale-102"
                              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className={`absolute top-0 right-0 h-10 w-16 bg-gradient-to-br ${tpl.color} opacity-20 filter blur-xs`} />
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa]">Gallery</span>
                          <span className="text-xs font-black text-white uppercase tracking-wide mt-auto z-10">{tpl.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: FIRST EBOOK TOPIC */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="flex flex-col gap-6 text-center"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-widest">STEP 04</span>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                      Describe your ebook topic
                    </h2>
                  </div>

                  <div className="max-w-xl mx-auto w-full flex flex-col gap-5 text-left">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">
                        What should this ebook cover?
                      </label>
                      <textarea
                        value={ebookTopic}
                        onChange={(e) => setEbookTopic(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-white outline-none focus:border-brand-purple/50 font-sans resize-none leading-relaxed"
                        placeholder="e.g. Actionable strategies to raise pre-seed capital for tech founders..."
                        autoFocus
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[8px] text-brand-muted uppercase font-bold tracking-wider">
                        Or click a quick starter suggestions:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {topicExamples.map((ex) => (
                          <button
                            key={ex}
                            onClick={() => setEbookTopic(ex)}
                            className="px-3.5 py-2 bg-white/5 hover:bg-brand-purple/10 border border-white/5 rounded-full text-[10px] text-white/80 hover:text-white transition-colors cursor-pointer"
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: FIRST SUCCESS MOMENT SCREEN */}
              {step === 6 && generatedBook && (
                <motion.div
                  key="success-moment"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="border border-white/5 bg-[#0E131F]/40 backdrop-blur-md p-8 md:p-10 rounded-[24px] shadow-2xl flex flex-col md:flex-row gap-8 items-center max-w-3xl mx-auto w-full"
                >
                  {/* Visual mockup cover */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-48 aspect-[3/4] bg-[#070B14] border border-brand-purple/45 rounded-[20px] shadow-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(124,58,237,0.22),transparent_70%)] pointer-events-none" />
                      <span className="text-[7px] font-extrabold uppercase tracking-widest text-[#a78bfa] border border-[#a78bfa]/20 bg-[#a78bfa]/5 px-2.5 py-1 rounded-full self-start">
                        First Edition
                      </span>
                      <div className="my-auto">
                        <h3 className="font-extrabold uppercase tracking-tight text-white leading-tight text-xs text-center line-clamp-3">
                          {generatedBook.title}
                        </h3>
                        <div className="h-0.5 w-5 bg-brand-purple mx-auto my-2" />
                        <p className="text-[6.5px] text-brand-muted text-center uppercase tracking-widest">
                          By {userName || "Creator"}
                        </p>
                      </div>
                      <span className="text-[5px] text-white/30 tracking-widest font-mono">
                        PAGENEST ONBOARDING
                      </span>
                    </div>
                  </div>

                  {/* Summary Details and Activation buttons */}
                  <div className="w-full md:w-1/2 flex flex-col gap-5 text-left">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-brand-success font-black uppercase tracking-widest bg-brand-success/15 border border-brand-success/20 px-3 py-1 rounded-full self-start">
                        🎉 Magic Moment Activated
                      </span>
                      <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                        Your First Ebook Is Ready
                      </h2>
                      <p className="text-xs text-brand-muted leading-relaxed">
                        Magical! PageNest AI fully researched, drafted, and designed your ebook in under 2 minutes. Open the editor workspace to customize pages or download compiled spreads.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                      <button
                        onClick={() => onComplete(generatedBook)}
                        className="flex-1 py-3.5 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer text-center"
                      >
                        Open Editor
                      </button>
                      <button
                        onClick={() => {
                          // Increment checklist export
                          try {
                            localStorage.setItem("pagenest_checklist_export", "true");
                          } catch {}
                          alert("Initiating compiled PDF download spread...");
                        }}
                        className="py-3.5 px-5 rounded-full border border-white/5 hover:bg-white/5 text-white font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Export PDF
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setStep(1)}
                      className="text-left text-[9px] text-brand-muted hover:text-white uppercase tracking-widest font-extrabold mt-1"
                    >
                      &larr; Create Another Ebook
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ACTION NAVIGATION FOOTER (Visible on steps 1-4) */}
          {step > 0 && step < 5 && (
            <div className="flex justify-between items-center pt-5 border-t border-white/5 shrink-0">
              <button
                onClick={handleBack}
                className="py-2.5 px-5 rounded-full text-[10px] font-bold text-brand-muted hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
              >
                Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className="py-2.5 px-6 rounded-full bg-brand-purple hover:bg-brand-purple/90 disabled:opacity-30 disabled:pointer-events-none text-white text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-md cursor-pointer"
              >
                {step === 4 ? "Generate Ebook" : "Continue"}
              </button>
            </div>
          )}

        </div>
      )}
      
    </div>
  );
}

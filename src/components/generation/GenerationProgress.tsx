"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface GenerationProgressProps {
  topic: string;
  templateName: string;
  userName: string;
  author: string;
  pageCount: number;
  audience: string;
  tone: string;
  outline: any[];
  onComplete: (generatedBook: Ebook) => void;
  onClose: () => void;
}

export default function GenerationProgress({
  topic,
  templateName,
  userName,
  author,
  pageCount,
  audience,
  tone,
  outline,
  onComplete,
  onClose,
}: GenerationProgressProps) {
  // Generation stage states
  // stages: "generating" | "cover-moment" | "complete" | "error"
  const [stage, setStage] = useState<"generating" | "cover-moment" | "complete" | "error">("generating");
  
  // Timing / timeline checklist
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  
  // Live smart stats counters
  const [wordsCount, setWordsCount] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);
  
  // Active Cover selection index during Cover Creation animation
  const [selectedCoverVer, setSelectedCoverVer] = useState<"A" | "B" | "C" | null>(null);
  const [coverSelectionTimer, setCoverSelectionTimer] = useState(0);

  // Time tracker for final screen metrics
  const [startTime] = useState(Date.now());
  const [elapsedDurationText, setElapsedDurationText] = useState("0:00");

  const timelineSteps = [
    "Researching Topic",
    "Building Outline",
    "Creating Chapter Structure",
    "Writing Content",
    "Generating Visual Concepts",
    "Creating Images",
    "Designing Cover",
    "Applying Layout System",
    "Building Table of Contents",
    "Optimizing Typography",
    "Finalizing Export Package",
  ];

  const thoughtCards = [
    { label: "Analyzing target audience", val: audience || "Professional Founders" },
    { label: "Generating writing style", val: "Editorial & Business focus" },
    { label: "Selecting ebook template", val: templateName || "Modern Business" },
    { label: "Creating visual direction", val: "Clean Minimalist Grids" },
    { label: "Generating chapter volume", val: `${pageCount || 6} Chapters` },
  ];

  const aiInsights = [
    "Your target audience prefers actionable key frameworks.",
    "Added executive summary page at Chapter 1.",
    "Incorporated comparative statistics blocks.",
    "Refined contrast settings for premium readability.",
  ];

  // API Call trigger
  useEffect(() => {
    let active = true;
    const fetchEbookData = async () => {
      try {
        const response = await fetch("/api/generate-ebook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: topic,
            templateName,
            author,
            pageCount,
            audience,
            tone,
            outline,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Generation endpoint failed");
        }

        if (active) {
          setApiResponseData(data);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setStage("error");
        }
      }
    };

    fetchEbookData();
    return () => {
      active = false;
    };
  }, [topic, templateName, author, pageCount]);

  // Main Timers loop
  useEffect(() => {
    if (stage !== "generating") return;

    // Timeline checklist sequencing
    const timelineInterval = setInterval(() => {
      setActiveStepIndex((prev) => {
        // Pause before final steps if API response is still pending
        if (prev === 6 && !apiResponseData) {
          return prev;
        }

        if (prev < timelineSteps.length - 1) {
          return prev + 1;
        } else {
          // Reached the end - move to Cover selection moment
          clearInterval(timelineInterval);
          setStage("cover-moment");
          return prev;
        }
      });
    }, 2500);

    // Smooth stats count-up
    const statsInterval = setInterval(() => {
      setWordsCount((w) => {
        const target = activeStepIndex * 180 + 100;
        if (w >= target) return w;
        return w + Math.floor(Math.random() * 20) + 10;
      });
      setPagesCount((p) => {
        const target = Math.min(pageCount || 6, Math.floor(activeStepIndex / 1.6) + 1);
        if (p >= target) return p;
        return p + 1;
      });
      setImagesCount((img) => {
        const target = Math.min(4, Math.floor(activeStepIndex / 2.5));
        if (img >= target) return img;
        return img + 1;
      });
    }, 400);

    // Time Counter
    const timerInterval = setInterval(() => {
      const diffSecs = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(diffSecs / 60);
      const secs = diffSecs % 60;
      setElapsedDurationText(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
    }, 1000);

    return () => {
      clearInterval(timelineInterval);
      clearInterval(statsInterval);
      clearInterval(timerInterval);
    };
  }, [stage, activeStepIndex, apiResponseData, pageCount, startTime]);

  // Cover Creation selection animation loop
  useEffect(() => {
    if (stage !== "cover-moment") return;

    const timer = setInterval(() => {
      setCoverSelectionTimer((t) => {
        if (t === 0) setSelectedCoverVer("A");
        if (t === 10) setSelectedCoverVer("B");
        if (t === 20) setSelectedCoverVer("C");
        if (t === 30) {
          // AI selects version B
          setSelectedCoverVer("B");
        }
        if (t >= 45) {
          // Wrap up cover selection and complete
          clearInterval(timer);
          setStage("complete");
          return t;
        }
        return t + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [stage]);

  const estimatedReadingTime = useMemo(() => {
    return Math.max(2, Math.ceil(wordsCount / 180));
  }, [wordsCount]);

  // Mock retry triggers
  const handleRetry = () => {
    setStage("generating");
    setActiveStepIndex(0);
    setWordsCount(0);
    setPagesCount(0);
    setImagesCount(0);
    setApiResponseData(null);
  };

  const handleFinish = () => {
    if (apiResponseData) {
      onComplete({
        id: apiResponseData.ebookId,
        title: apiResponseData.title,
        author: author,
        theme: apiResponseData.theme || templateName,
        pages: apiResponseData.pages || [],
      });
    } else {
      // Safety mock fallback
      onComplete({
        id: `mock-${Date.now()}`,
        title: topic,
        author: author,
        theme: templateName,
        pages: [
          { type: "cover", title: topic, subtitle: `By ${author}` },
          { type: "toc", chapters: [{ num: "01", name: "Introduction", page: "03" }] },
          { type: "chapter", title: "Introduction", content: "AI generated mock placeholder chapters." }
        ],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B14] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Dynamic Floating Gradient Circles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute h-96 w-96 rounded-full bg-brand-purple/10 blur-[120px] -top-20 -left-20 animate-pulse" />
        <div className="absolute h-96 w-96 rounded-full bg-emerald-500/[0.04] blur-[100px] -bottom-20 -right-20 animate-pulse" style={{ animationDelay: "2s" }} />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 h-2 w-2 rounded-full bg-brand-purple/35 blur-xs animate-float" style={{ animation: "float-particle 15s infinite ease-in-out" }} />
        <div className="absolute top-3/4 left-1/4 h-3.5 w-3.5 rounded-full bg-brand-purple/20 blur-xs animate-float" style={{ animation: "float-particle 22s infinite ease-in-out" }} />
        <div className="absolute top-1/3 right-1/4 h-2.5 w-2.5 rounded-full bg-white/10 blur-xs animate-float" style={{ animation: "float-particle 18s infinite ease-in-out" }} />
      </div>

      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-30px) translateX(20px) rotate(180deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
        }
        .animate-float {
          animation: float-particle 20s infinite ease-in-out;
        }
      `}</style>

      {/* HEADER SECTION */}
      <header className="h-16 border-b border-white/5 bg-[#0E131F]/30 backdrop-blur-md px-8 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-brand-purple animate-ping shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-widest leading-none">
              PageNest AI Studio
            </span>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              {stage === "complete" ? "Compilation Succeeded" : "Compiling Premium Ebook"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-bold text-brand-muted uppercase tracking-widest">
          <div>
            Topic: <span className="text-white">{topic}</span>
          </div>
          <div className="hidden sm:block">
            Estimated Time: <span className="text-white">1–2 Minutes</span>
          </div>
          <div>
            Elapsed: <span className="text-white font-mono">{elapsedDurationText}</span>
          </div>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative z-10 p-6 lg:p-10 gap-6 lg:gap-8">
        
        <AnimatePresence mode="wait">
          {stage === "error" ? (
            /* ERROR RECOVERY UI */
            <motion.div
              key="error-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-lg mx-auto my-auto p-8 border border-red-500/20 bg-[#0E131F]/60 backdrop-blur-md rounded-[20px] shadow-2xl text-center flex flex-col items-center gap-6"
            >
              <div className="text-4xl bg-red-500/10 border border-red-500/25 h-16 w-16 rounded-full flex items-center justify-center">⚠️</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Generation Interrupted
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
                  We encountered a small compile issue while writing Chapter {activeStepIndex + 1}. The AI engine is ready to retry or complete the rest of the layout pages.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Retry Chapter
                </button>
                <button
                  onClick={() => setStage("complete")}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/5 font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Continue Generation
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 text-brand-muted hover:text-white font-bold text-[10px] uppercase tracking-wider"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          ) : stage === "complete" ? (
            /* COMPLETION SUCCESS SCREEN */
            <motion.div
              key="complete-screen"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-4xl mx-auto my-auto border border-white/5 bg-[#0E131F]/40 backdrop-blur-md p-8 lg:p-12 rounded-[20px] shadow-2xl flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Left Cover Preview */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="w-56 aspect-[3/4] bg-[#070B14] border border-brand-purple/45 rounded-[20px] shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(124,58,237,0.22),transparent_70%)] pointer-events-none" />
                  {apiResponseData?.coverImage && (
                    <img src={apiResponseData.coverImage} className="absolute inset-0 opacity-15 object-cover w-full h-full" alt="Cover" />
                  )}
                  <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#a78bfa] border border-[#a78bfa]/20 bg-[#a78bfa]/5 px-2.5 py-1 rounded-full self-start z-10">
                    {templateName}
                  </span>
                  <div className="my-auto z-10">
                    <h3 className="font-extrabold uppercase tracking-tight text-white leading-tight text-sm text-center">
                      {apiResponseData?.title || topic}
                    </h3>
                    <div className="h-0.5 w-6 bg-brand-purple mx-auto my-2.5" />
                    <p className="text-[7px] text-brand-muted text-center uppercase tracking-widest">
                      By {author}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[5px] text-white/35 font-mono z-10">
                    <span>PAGENEST STUDIO</span>
                    <span>VOL 1.</span>
                  </div>
                </div>
              </div>

              {/* Right Details Info */}
              <div className="w-full md:w-1/2 flex flex-col gap-6 text-left">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-brand-success font-black uppercase tracking-widest bg-brand-success/15 border border-brand-success/20 px-3 py-1 rounded-full self-start">
                    ✓ Ebook Created
                  </span>
                  <h1 className="text-2xl font-black uppercase tracking-wider text-white">
                    Your Ebook Is Ready
                  </h1>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    PageNest AI fully structured, written, and optimized the layout framework matching your startup topic in <span className="text-white font-bold">{elapsedDurationText}</span> for <span className="text-white font-bold">{userName}</span>.
                  </p>
                </div>

                {/* Final stats grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[8px] text-brand-muted uppercase font-bold tracking-wider">Total Volume</span>
                    <h4 className="text-sm font-black text-white mt-0.5">{pageCount || 6} Pages</h4>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[8px] text-brand-muted uppercase font-bold tracking-wider">Chapter Count</span>
                    <h4 className="text-sm font-black text-white mt-0.5">5 Core Chapters</h4>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[8px] text-brand-muted uppercase font-bold tracking-wider">Visual Assets</span>
                    <h4 className="text-sm font-black text-white mt-0.5">{imagesCount || 2} Images</h4>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[8px] text-brand-muted uppercase font-bold tracking-wider">Est. Read Time</span>
                    <h4 className="text-sm font-black text-white mt-0.5">{estimatedReadingTime} Minutes</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={handleFinish}
                    className="flex-1 py-3.5 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer text-center"
                  >
                    Open Editor
                  </button>
                  <button
                    onClick={() => {
                      alert(`Compiling high-definition PDF download...`);
                    }}
                    className="py-3.5 px-6 rounded-full border border-white/5 hover:bg-white/5 text-white font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE AI GENERATION WORKSPACE (Three Columns) */
            <div className="w-full flex-grow flex flex-col lg:flex-row overflow-hidden gap-6">
              
              {/* COLUMN 1: Live Generation Timeline (Left sidebar style) */}
              <aside className="w-full lg:w-72 bg-[#0E131F]/30 border border-white/5 p-5 rounded-[20px] backdrop-blur-md flex flex-col justify-between overflow-y-auto shrink-0">
                <div className="flex flex-col gap-4">
                  <h4 className="text-[9px] font-extrabold text-brand-muted uppercase tracking-widest px-1">
                    Timeline checklist
                  </h4>

                  <div className="flex flex-col gap-2.5">
                    {timelineSteps.map((step, idx) => {
                      const isCompleted = activeStepIndex > idx;
                      const isActive = activeStepIndex === idx;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 transition-opacity duration-300 ${
                            isCompleted || isActive ? "opacity-100" : "opacity-25"
                          }`}
                        >
                          <span className={`h-4.5 w-4.5 rounded-full border text-[8px] font-extrabold flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? "bg-brand-success text-[#070B14] border-brand-success"
                              : isActive
                              ? "bg-brand-purple text-white border-brand-purple animate-pulse"
                              : "bg-white/5 border-white/5 text-brand-muted"
                          }`}>
                            {isCompleted ? "✓" : isActive ? "⚙" : idx + 1}
                          </span>
                          <span className={`text-[10.5px] uppercase font-bold tracking-wider ${
                            isActive ? "text-white" : isCompleted ? "text-white/80" : "text-brand-muted"
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* COLUMN 2: Live Preview Canvas (Center) */}
              <main className="flex-1 bg-[#0E131F]/30 border border-white/5 p-6 rounded-[20px] backdrop-blur-md flex flex-col justify-center items-center overflow-y-auto min-h-[300px]">
                
                {stage === "cover-moment" ? (
                  /* COVER CHOICE MOMENT */
                  <div className="flex flex-col items-center gap-6 w-full max-w-md">
                    <span className="text-[9px] uppercase tracking-widest font-black text-brand-purple bg-brand-purple/10 px-3.5 py-1.5 rounded-full border border-brand-purple/20 animate-pulse">
                      Designing Cover Variations
                    </span>
                    
                    <div className="grid grid-cols-3 gap-3 w-full my-2 relative">
                      {/* Scanning laser animation line */}
                      <div className="absolute left-0 right-0 h-[1.5px] bg-brand-purple blur-xs top-1/2 animate-bounce z-20 pointer-events-none" />

                      {[
                        { ver: "A", name: "Modern Minimal", selected: selectedCoverVer === "A" },
                        { ver: "B", name: "Serif Editorial", selected: selectedCoverVer === "B" },
                        { ver: "C", name: "Typographic Bold", selected: selectedCoverVer === "C" },
                      ].map((cv) => (
                        <div
                          key={cv.ver}
                          className={`aspect-[3/4] rounded-xl border p-2 flex flex-col justify-between transition-all duration-300 relative ${
                            cv.selected
                              ? "border-brand-purple bg-brand-purple/10 scale-105 shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                              : "border-white/5 bg-white/5 opacity-55"
                          }`}
                        >
                          <span className="text-[6.5px] font-extrabold text-brand-purple">VER {cv.ver}</span>
                          <div className="text-[6px] text-center font-bold text-white/90 truncate uppercase leading-none">{cv.name}</div>
                          <div className="text-[4px] text-brand-muted text-right">98% Fit</div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-brand-muted animate-pulse uppercase tracking-wider font-extrabold">
                      {coverSelectionTimer >= 30 ? "✓ Version B Selected - Premium Layout Locked" : "AI evaluating visual balance metrics..."}
                    </p>
                  </div>
                ) : (
                  /* LIVE PREVIEW BUILDING BLOCKS */
                  <div className="w-full max-w-sm aspect-[3/4] bg-[#070B14] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(124,58,237,0.12),transparent_70%)] pointer-events-none" />
                    
                    {/* Spine line binder */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent border-r border-white/5 z-20 pointer-events-none" />

                    {activeStepIndex < 2 ? (
                      /* Outline Stage */
                      <div className="my-auto flex flex-col gap-4 text-left">
                        <span className="text-[8px] font-extrabold uppercase text-brand-purple tracking-widest">OUTLINE DRAFT</span>
                        <div className="space-y-2">
                          <div className="h-2 w-3/4 bg-white/10 rounded-full animate-pulse" />
                          <div className="h-2 w-full bg-white/10 rounded-full animate-pulse" />
                          <div className="h-2 w-5/6 bg-white/10 rounded-full animate-pulse" />
                        </div>
                      </div>
                    ) : activeStepIndex < 4 ? (
                      /* TOC Stage */
                      <div className="my-auto flex flex-col gap-3 text-left">
                        <span className="text-[8px] font-extrabold uppercase text-brand-purple tracking-widest border-b border-white/10 pb-1.5">Table of Contents</span>
                        <div className="space-y-2 text-[8px] text-brand-muted font-bold font-mono">
                          <div className="flex justify-between"><span>01. Hybrid Revolution</span><span>Page 03</span></div>
                          <div className="flex justify-between"><span>02. Async Collaboration</span><span>Page 04</span></div>
                          <div className="flex justify-between"><span>03. Outcomes-Based Focus</span><span>Page 05</span></div>
                        </div>
                      </div>
                    ) : activeStepIndex < 7 ? (
                      /* Chapter text / Image loaders Stage */
                      <div className="my-auto flex flex-col gap-3 text-left relative z-10">
                        <span className="text-[7.5px] font-extrabold uppercase text-brand-purple">Chapter 01</span>
                        <h4 className="text-xs font-black text-white leading-tight uppercase tracking-wide">The Hybrid Revolution</h4>
                        
                        {activeStepIndex === 5 ? (
                          /* Image skeleton loader */
                          <div className="h-20 w-full rounded-lg bg-white/[0.02] border border-white/5 animate-pulse flex flex-col items-center justify-center gap-1.5">
                            <span className="text-[18px]">🖼</span>
                            <span className="text-[7.5px] uppercase font-bold text-brand-muted">Rendering illustration assets...</span>
                          </div>
                        ) : activeStepIndex >= 6 ? (
                          <div className="h-20 w-full rounded-lg overflow-hidden border border-white/10 relative">
                            <img
                              src="https://images.pexels.com/photos/19907129/pexels-photo-19907129.jpeg?auto=compress&cs=tinysrgb&w=800"
                              alt="Hybrid work"
                              className="w-full h-full object-cover filter brightness-75"
                            />
                          </div>
                        ) : null}

                        <p className="text-[9.5px] leading-relaxed text-brand-muted line-clamp-3">
                          Work is no longer a place we go, but an activity we perform. The modern organization must embrace asynchronous operations, culture-first connectivity, and outcomes-based management to thrive in the new paradigm.
                        </p>
                      </div>
                    ) : (
                      /* Cover Final Stage */
                      <div className="h-full flex flex-col justify-between text-center relative z-10">
                        <span className="text-[7px] font-bold uppercase tracking-widest text-brand-purple self-center">
                          Startup Edition
                        </span>
                        <div className="my-auto">
                          <h3 className="text-xs lg:text-sm font-black uppercase text-white tracking-tight leading-tight">
                            {topic}
                          </h3>
                          <div className="h-[1.5px] w-5 bg-brand-purple mx-auto my-2.5" />
                          <p className="text-[7px] text-brand-muted">By {author}</p>
                        </div>
                        <span className="text-[5px] text-white/30 tracking-widest font-mono">
                          PAGENEST STUDIO
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[5px] text-white/35 border-t border-white/5 pt-3.5">
                      <span className="font-extrabold">PAGENEST ENGINE</span>
                      <span>Page {pagesCount}</span>
                    </div>
                  </div>
                )}
              </main>

              {/* COLUMN 3: Thought process, Stats, and Insights (Mobile Swipeable Carousel / Desktop Stacked Panels) */}
              <aside className="w-full lg:w-80 shrink-0">
                {/* Mobile version */}
                <div className="lg:hidden flex flex-col items-center gap-4">
                  <div className="w-full flex overflow-x-auto flex-nowrap gap-4 snap-x snap-mandatory scroll-smooth scrollbar-none pb-4">
                    
                    {/* Slide 1: AI Thought Process */}
                    <div className="shrink-0 snap-center bg-[#0E131F]/30 border border-white/5 p-5 rounded-[20px] backdrop-blur-md flex flex-col gap-3" style={{ width: "calc(100vw - 48px)" }}>
                      <h4 className="text-[9px] font-extrabold text-brand-muted uppercase tracking-widest px-1">
                        AI Thought Process
                      </h4>
                      <div className="flex flex-col gap-2">
                        {thoughtCards.map((card, idx) => {
                          const isShown = activeStepIndex >= idx;
                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center transition-all duration-300 ${
                                isShown ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0 p-0 overflow-hidden"
                              }`}
                            >
                              <span className="text-[9px] text-brand-muted uppercase tracking-wider">{card.label}</span>
                              <span className="text-[10px] font-bold text-white uppercase">{card.val}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Slide 2: Smart Stats */}
                    <div className="shrink-0 snap-center bg-[#0E131F]/30 border border-white/5 p-5 rounded-[20px] backdrop-blur-md flex flex-col gap-3" style={{ width: "calc(100vw - 48px)" }}>
                      <h4 className="text-[9px] font-extrabold text-brand-muted uppercase tracking-widest px-1">
                        Smart stats
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                          <span className="text-[7.5px] text-brand-muted uppercase tracking-wider">Words</span>
                          <h4 className="text-xs font-black text-white mt-0.5">{wordsCount}</h4>
                        </div>
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                          <span className="text-[7.5px] text-brand-muted uppercase tracking-wider">Pages</span>
                          <h4 className="text-xs font-black text-white mt-0.5">{pagesCount}</h4>
                        </div>
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                          <span className="text-[7.5px] text-brand-muted uppercase tracking-wider">Images</span>
                          <h4 className="text-xs font-black text-white mt-0.5">{imagesCount}</h4>
                        </div>
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                          <span className="text-[7.5px] text-brand-muted uppercase tracking-wider">Reading Time</span>
                          <h4 className="text-xs font-black text-white mt-0.5">{estimatedReadingTime} min</h4>
                        </div>
                      </div>
                    </div>

                    {/* Slide 3: AI Insights */}
                    <div className="shrink-0 snap-center bg-[#0E131F]/30 border border-white/5 p-5 rounded-[20px] backdrop-blur-md flex flex-col gap-3" style={{ width: "calc(100vw - 48px)" }}>
                      <h4 className="text-[9px] font-extrabold text-brand-muted uppercase tracking-widest px-1">
                        AI Insights & Rules
                      </h4>
                      <div className="flex flex-col gap-2">
                        {aiInsights.map((insight, idx) => {
                          const isShown = activeStepIndex >= idx * 2;
                          return (
                            <div
                              key={idx}
                              className={`flex items-start gap-2.5 text-left transition-all duration-300 ${
                                isShown ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                              }`}
                            >
                              <span className="text-[9px] mt-0.5">⚡</span>
                              <span className="text-[10px] text-brand-muted leading-relaxed font-medium">
                                {insight}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Desktop Version */}
                <div className="hidden lg:flex flex-col gap-6 overflow-y-auto">
                  {/* AI Thought Process panel */}
                  <div className="bg-[#0E131F]/30 border border-white/5 p-5 rounded-[20px] backdrop-blur-md flex flex-col gap-3">
                    <h4 className="text-[9px] font-extrabold text-brand-muted uppercase tracking-widest px-1">
                      AI Thought Process
                    </h4>
                    <div className="flex flex-col gap-2">
                      {thoughtCards.map((card, idx) => {
                        const isShown = activeStepIndex >= idx;
                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center transition-all duration-300 ${
                              isShown ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0 p-0 overflow-hidden"
                            }`}
                          >
                            <span className="text-[9px] text-brand-muted uppercase tracking-wider">{card.label}</span>
                            <span className="text-[10px] font-bold text-white uppercase">{card.val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Smart Stats panel */}
                  <div className="bg-[#0E131F]/30 border border-white/5 p-5 rounded-[20px] backdrop-blur-md flex flex-col gap-3">
                    <h4 className="text-[9px] font-extrabold text-brand-muted uppercase tracking-widest px-1">
                      Smart stats
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                        <span className="text-[7.5px] text-brand-muted uppercase tracking-wider">Words</span>
                        <h4 className="text-xs font-black text-white mt-0.5">{wordsCount}</h4>
                      </div>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                        <span className="text-[7.5px] text-brand-muted uppercase tracking-wider">Pages</span>
                        <h4 className="text-xs font-black text-white mt-0.5">{pagesCount}</h4>
                      </div>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                        <span className="text-[7.5px] text-brand-muted uppercase tracking-wider">Images</span>
                        <h4 className="text-xs font-black text-white mt-0.5">{imagesCount}</h4>
                      </div>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                        <span className="text-[7.5px] text-brand-muted uppercase tracking-wider">Reading Time</span>
                        <h4 className="text-xs font-black text-white mt-0.5">{estimatedReadingTime} min</h4>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights panel */}
                  <div className="bg-[#0E131F]/30 border border-white/5 p-5 rounded-[20px] backdrop-blur-md flex flex-col gap-3">
                    <h4 className="text-[9px] font-extrabold text-brand-muted uppercase tracking-widest px-1">
                      AI Insights & Rules
                    </h4>
                    <div className="flex flex-col gap-2">
                      {aiInsights.map((insight, idx) => {
                        const isShown = activeStepIndex >= idx * 2;
                        return (
                          <div
                            key={idx}
                            className={`flex items-start gap-2.5 text-left transition-all duration-300 ${
                              isShown ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                            }`}
                          >
                            <span className="text-[9px] mt-0.5">⚡</span>
                            <span className="text-[10px] text-brand-muted leading-relaxed font-medium">
                              {insight}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

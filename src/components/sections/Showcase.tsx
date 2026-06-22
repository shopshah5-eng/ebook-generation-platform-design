"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";

export function Showcase() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "editor" | "generation" | "export">("editor");

  const tabs = [
    { id: "dashboard", label: "Dashboard", title: "Centralized Ebook Workspace", desc: "Manage all your book projects in one clean grid. Keep track of edits, duplicate layouts, or trigger new generations with a single click." },
    { id: "editor", label: "Ebook Editor", title: "Split-Screen Creative Studio", desc: "Refine generated text, regenerate contextual illustrations, change typography rules, and inspect page spreads on the live canvas." },
    { id: "generation", label: "Generation Screen", title: "Real-Time AI Processing Pipeline", desc: "Watch the AI outline, write, layout, and compile your ebook step-by-step. Get continuous visual feedback during compilation." },
    { id: "export", label: "Export Screen", title: "Instant High-Resolution Packaging", desc: "Render print-ready PDFs and standard EPUB files. Fully optimized with embedded fonts, crisp vectors, and proper margins." },
  ];

  const activeData = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="showcase" className="py-24 bg-[#070B14] px-6 lg:px-16 border-b border-brand-border/60">
      <Container className="!px-0">
        <div className="flex flex-col items-center text-center mb-16 gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">
            Inside PageNest
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Designed For Deep Creativity
          </h2>
          <p className="text-brand-muted text-sm max-w-lg mt-2">
            Take a look inside the actual interface. Everything is built to keep you in flow.
          </p>
        </div>

        {/* Tab Selector Header */}
        <div className="flex justify-center border-b border-white/5 pb-1.5 mb-12 flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer ${
                activeTab === t.id ? "text-brand-purple" : "text-brand-muted hover:text-white"
              }`}
            >
              {t.label}
              {activeTab === t.id && (
                <motion.div
                  layoutId="showcaseTabLine"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-purple"
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Detail Column */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-4">
            <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest block">
              FEATURED INTERFACE
            </span>
            <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight">
              {activeData.title}
            </h3>
            <p className="text-brand-muted text-xs leading-relaxed">
              {activeData.desc}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-wider font-semibold mt-4">
              <svg className="w-3.5 h-3.5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Verified Production UI</span>
            </div>
          </div>

          {/* Right Mock UI Rendering Panel */}
          <div className="lg:col-span-8 flex justify-center w-full">
            <div className="w-full max-w-[620px] aspect-[16/10] bg-[#0E131F] border border-white/5 rounded-[20px] shadow-2xl overflow-hidden flex flex-col relative">
              {/* Browser window controls */}
              <div className="h-9 w-full bg-white/[0.02] border-b border-white/5 flex items-center px-4 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                </div>
                <div className="bg-white/5 rounded px-8 py-0.5 text-[8px] text-white/30 font-mono select-none">
                  pagenest.com/app/{activeTab}
                </div>
                <div className="w-6" />
              </div>

              <div className="flex-grow p-4 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {/* Tab 1: Dashboard Mockup */}
                  {activeTab === "dashboard" && (
                    <motion.div
                      key="dashboard-mock"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full flex gap-3 text-white font-sans text-xs"
                    >
                      {/* Sidebar */}
                      <div className="w-20 bg-white/[0.01] border-r border-white/5 p-2 flex flex-col gap-3">
                        <div className="h-5 w-5 bg-brand-purple rounded flex items-center justify-center font-bold text-[10px]">P</div>
                        <div className="flex flex-col gap-1.5 mt-4">
                          <div className="h-4 bg-white/5 rounded flex items-center px-1.5 gap-1.5"><span className="h-1.5 w-1.5 bg-brand-purple rounded-full" /><div className="h-1.5 w-6 bg-white/40 rounded" /></div>
                          <div className="h-4 rounded flex items-center px-1.5 gap-1.5"><span className="h-1.5 w-1.5 bg-white/10 rounded-full" /><div className="h-1.5 w-6 bg-white/20 rounded" /></div>
                        </div>
                      </div>
                      {/* Main grid */}
                      <div className="flex-grow flex flex-col gap-3.5">
                        <div className="flex justify-between items-center">
                          <div className="h-3 w-16 bg-white/25 rounded" />
                          <button className="bg-brand-purple px-2 py-1 rounded text-[8px] font-bold">+ New Ebook</button>
                        </div>
                        {/* Ebook List */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { title: "Startup Playbook", theme: "Swiss Tech" },
                            { title: "Financial Freedom", theme: "Classic Gold" },
                            { title: "Mindful Focus", theme: "Zen Minimal" }
                          ].map((book, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/5 p-2.5 rounded-xl flex flex-col gap-2">
                              <div className="aspect-[3/4] bg-white/[0.02] rounded-md border border-white/5 flex flex-col justify-between p-1.5">
                                <div className="h-1 w-6 bg-brand-purple/40 rounded" />
                                <span className="text-[6px] font-black text-white/70 block uppercase leading-tight">{book.title}</span>
                                <div className="h-[2px] w-full bg-white/10 rounded" />
                              </div>
                              <div>
                                <h4 className="font-bold text-[8px] leading-tight truncate">{book.title}</h4>
                                <span className="text-[6px] text-brand-muted">{book.theme}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 2: Editor Mockup */}
                  {activeTab === "editor" && (
                    <motion.div
                      key="editor-mock"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full flex gap-3 text-white font-sans text-xs"
                    >
                      {/* Left: pages navigator */}
                      <div className="w-24 bg-white/[0.01] border-r border-white/5 p-2 flex flex-col gap-2 shrink-0">
                        <span className="text-[7px] font-bold text-brand-muted uppercase">Chapters</span>
                        <div className="flex flex-col gap-1.5">
                          <div className="border border-brand-purple/40 bg-white/5 rounded-md p-1.5 flex gap-1.5 items-center">
                            <span className="text-[6px] bg-brand-purple/20 text-brand-purple px-1 rounded">01</span>
                            <span className="text-[7px] font-bold truncate">Title Page</span>
                          </div>
                          <div className="bg-transparent border border-transparent rounded-md p-1.5 flex gap-1.5 items-center">
                            <span className="text-[6px] bg-white/10 text-white/50 px-1 rounded">02</span>
                            <span className="text-[7px] text-white/60 truncate">Introduction</span>
                          </div>
                          <div className="bg-transparent border border-transparent rounded-md p-1.5 flex gap-1.5 items-center">
                            <span className="text-[6px] bg-white/10 text-white/50 px-1 rounded">03</span>
                            <span className="text-[7px] text-white/60 truncate">Execution Plan</span>
                          </div>
                        </div>
                      </div>

                      {/* Center: document canvas preview */}
                      <div className="flex-grow bg-[#070B14] rounded-xl border border-white/5 p-4 flex flex-col justify-between shadow-inner">
                        <div className="border-b border-white/5 pb-2 text-center">
                          <span className="text-[6px] text-brand-purple font-bold tracking-widest">CHAPTER 01</span>
                          <h4 className="font-extrabold text-[10px] text-white tracking-tight uppercase mt-0.5">Startup Funding Guide</h4>
                        </div>
                        <div className="my-auto flex flex-col gap-1.5 py-4">
                          <div className="h-1.5 w-1/3 bg-white/20 rounded" />
                          <div className="h-1.5 w-full bg-white/10 rounded" />
                          <div className="h-1.5 w-11/12 bg-white/10 rounded" />
                          <div className="h-1.5 w-5/6 bg-white/10 rounded" />
                        </div>
                        <div className="flex justify-between items-center text-[5px] text-white/30 border-t border-white/5 pt-1.5">
                          <span>PageNest Studio</span>
                          <span>Page 1</span>
                        </div>
                      </div>

                      {/* Right: controls workspace */}
                      <div className="w-28 bg-white/[0.01] border-l border-white/5 p-2 flex flex-col gap-3 shrink-0">
                        <span className="text-[7px] font-bold text-brand-muted uppercase">Properties</span>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[6px] text-white/50">Edit Title Text</span>
                          <div className="bg-white/5 rounded border border-white/10 p-1.5 text-[6px]">
                            Startup Funding Guide
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[6px] text-white/50">Select Font Pair</span>
                          <div className="bg-white/5 rounded border border-white/10 p-1 flex justify-between items-center text-[6px]">
                            <span>Inter / Swiss</span>
                            <span>▾</span>
                          </div>
                        </div>
                        <button className="bg-brand-purple/20 border border-brand-purple/40 text-brand-purple py-1 rounded text-[6px] font-bold hover:bg-brand-purple hover:text-white transition-colors mt-2">
                          Regenerate Chapter
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 3: Generation Screen Mockup */}
                  {activeTab === "generation" && (
                    <motion.div
                      key="generation-mock"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full flex flex-col justify-center items-center gap-4 text-white font-sans"
                    >
                      <div className="w-64 bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[8px] text-brand-purple font-bold">PIPELINE STAGE</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-success animate-ping" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-[7px] text-brand-success">
                            <span>✓</span>
                            <span>Outlining chapter structures</span>
                          </div>
                          <div className="flex items-center gap-2 text-[7px] text-white">
                            <span className="h-2 w-2 rounded-full border border-t-transparent border-brand-purple animate-spin" />
                            <span className="font-bold">Writing chapter details...</span>
                          </div>
                          <div className="flex items-center gap-2 text-[7px] opacity-30">
                            <span>•</span>
                            <span>Designing cover layout</span>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-brand-purple rounded-full w-2/3" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 4: Export Screen Mockup */}
                  {activeTab === "export" && (
                    <motion.div
                      key="export-mock"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full flex flex-col justify-center items-center gap-4 text-white font-sans"
                    >
                      <div className="w-64 bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-4 text-center">
                        <div className="h-8 w-8 rounded-full bg-brand-success/15 border border-brand-success/30 flex items-center justify-center mx-auto text-brand-success">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-bold text-[10px]">Export Generation Complete</h4>
                          <p className="text-[7px] text-brand-muted mt-1">Document was packed and formatted successfully.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-1.5 text-[7px] font-bold">Download EPUB</button>
                          <button className="bg-brand-purple hover:bg-brand-purple/95 rounded-lg py-1.5 text-[7px] font-bold">Download PDF</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

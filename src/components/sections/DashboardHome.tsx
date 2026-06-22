"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "../ui/Card";

interface Ebook {
  id: string;
  title: string;
  author: string;
  theme: string;
  coverImage?: string;
  created_at?: string;
  updated_at?: string;
  pages?: any[];
}

interface DashboardHomeProps {
  userName: string;
  ebooks: Ebook[];
  onCreateTrigger: () => void;
  onEdit: (ebook: Ebook) => void;
  onDuplicate: (ebookId: string) => void;
  onDelete: (ebookId: string) => void;
  onExport: (ebook: Ebook, type: string) => void;
}

export function DashboardHome({
  userName,
  ebooks,
  onCreateTrigger,
  onEdit,
  onDuplicate,
  onDelete,
  onExport,
}: DashboardHomeProps) {
  const [activeActionsMenu, setActiveActionsMenu] = useState<string | null>(null);

  // Minimal Overview Stats
  const stats = [
    {
      value: ebooks.length,
      label: "Ebooks Created",
      icon: (
        <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      value: ebooks.length > 0 ? Array.from(new Set(ebooks.map(e => e.theme))).length : 0,
      label: "Templates Used",
      icon: (
        <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 7a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 7a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
        </svg>
      ),
    },
    {
      value: ebooks.length * 3 + 1,
      label: "Downloads",
      icon: (
        <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
    {
      value: "100%",
      label: "Export Success Rate",
      icon: (
        <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  // Helper to render mini covers based on book theme
  const renderMiniCover = (theme: string, title: string) => {
    const formattedTheme = (theme || "Startup").toLowerCase();
    
    if (formattedTheme === "startup" || formattedTheme === "luxury") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#0c0d19] to-[#1e1436] flex flex-col justify-between p-3 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
          <div className="absolute top-0 right-0 w-12 h-12 bg-brand-purple/20 rounded-full blur-xl" />
          <span className="text-[5px] tracking-widest text-[#a78bfa] font-bold uppercase z-10">PAGENEST</span>
          <span className="text-[7px] font-black text-white uppercase tracking-tight line-clamp-3 leading-tight z-10">{title}</span>
          <div className="h-[1px] w-full bg-white/10 z-10" />
        </div>
      );
    } else if (formattedTheme === "finance" || formattedTheme === "business") {
      return (
        <div className="w-full h-full bg-[#051c14] flex flex-col justify-between p-3 relative overflow-hidden border border-[#0f3b2a]">
          <div className="absolute inset-1 border border-dashed border-[#1e5c43] opacity-60" />
          <span className="text-[5px] tracking-widest text-[#10B981] font-bold uppercase text-center z-10">STRATEGY</span>
          <span className="text-[7px] font-serif text-white uppercase tracking-wide text-center line-clamp-3 leading-tight z-10">{title}</span>
          <span className="text-[4px] text-white/30 text-right z-10">ED. 2026</span>
        </div>
      );
    } else if (formattedTheme === "wellness" || formattedTheme === "education") {
      return (
        <div className="w-full h-full bg-[#1b1c22] flex flex-col justify-between p-3 relative overflow-hidden">
          <span className="text-[5px] tracking-widest text-brand-muted font-bold uppercase z-10">WELLNESS</span>
          <div className="h-5 w-5 rounded-full border border-white/10 flex items-center justify-center mx-auto my-auto z-10">
            <div className="h-2 w-2 rounded-full bg-brand-purple/20" />
          </div>
          <span className="text-[7px] font-extrabold text-white text-center uppercase tracking-wider line-clamp-2 leading-tight z-10">{title}</span>
        </div>
      );
    } else {
      // Default / Marketing
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#1c0d06] to-[#3b1c0a] flex flex-col justify-between p-3 relative overflow-hidden border border-[#52250d]">
          <span className="text-[5px] tracking-widest text-[#fdba74] font-bold uppercase z-10">GROWTH</span>
          <span className="text-[7px] font-black text-white uppercase italic tracking-tighter line-clamp-3 leading-none z-10">{title}</span>
          <div className="h-[1px] w-4 bg-[#F97316] z-10" />
        </div>
      );
    }
  };

  const [activeEbookIndex, setActiveEbookIndex] = useState(0);

  const handleEbookScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth;
    if (cardWidth > 0) {
      const index = Math.round(scrollPosition / cardWidth);
      setActiveEbookIndex(index);
    }
  };

  return (
    <div className="flex flex-col gap-10 text-white font-sans">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-4 sm:px-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">
            Good Morning, {userName} 👋
          </h1>
          <p className="text-xs text-brand-muted mt-2 font-medium">
            Ready to create something amazing today?
          </p>
        </div>
        <button
          onClick={onCreateTrigger}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white font-sans text-xs font-bold transition-all shadow-[0_0_25px_rgba(124,58,237,0.45)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95 duration-200"
        >
          <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="tracking-wide uppercase">Create New Ebook</span>
        </button>
      </div>
 
      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-5 flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-[20px] shadow-lg backdrop-blur-md">
            <span className="h-11 w-11 rounded-[14px] bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
              {stat.icon}
            </span>
            <div>
              <p className="text-xl font-extrabold text-white leading-none">{stat.value}</p>
              <p className="text-[9px] uppercase font-black text-brand-muted tracking-widest mt-2 leading-none">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>
 
      {/* Recent Ebooks */}
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black text-white uppercase tracking-widest">Recent Ebooks</h2>
          {ebooks.length > 0 && (
            <button onClick={onCreateTrigger} className="text-xs font-bold text-brand-purple hover:text-brand-purple/80 transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider">
              <span>Create another</span>
              <span>&rarr;</span>
            </button>
          )}
        </div>
 
        {ebooks.length === 0 ? (
          <div className="glass rounded-[20px] p-12 text-center max-w-lg mx-auto flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.04),transparent_60%)] pointer-events-none" />
            <div className="h-20 w-20 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple relative">
              <div className="absolute inset-0 bg-brand-purple/5 rounded-full blur-xl animate-pulse" />
              <svg className="w-10 h-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex flex-col gap-2 z-10">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Create Your First Ebook</h3>
              <p className="text-xs text-brand-muted max-w-sm leading-relaxed mx-auto font-medium">
                Turn any idea into a professional ebook.
              </p>
            </div>
            <button
              onClick={onCreateTrigger}
              className="px-6 py-3 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white font-bold text-xs transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer uppercase tracking-wider active:scale-95"
            >
              Generate Ebook
            </button>
          </div>
        ) : (
          <>
            <div className="sm:hidden flex flex-col items-center gap-6">
              <div
                onScroll={handleEbookScroll}
                className="w-full flex overflow-x-auto flex-nowrap gap-6 snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
              >
                {ebooks.slice(0, 4).map((book) => {
                  const formattedDate = book.created_at
                    ? new Date(book.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                    : "Just now";
                  const isMenuOpen = activeActionsMenu === book.id;
                  const pageCount = book.pages?.length || 0;
                  const status = pageCount > 10 ? "Published" : pageCount > 0 ? "Draft" : "Exported";
                  const statusBadgeStyles = status === "Published" ? "bg-brand-success/15 border-brand-success/20 text-brand-success" : status === "Draft" ? "bg-brand-purple/15 border-brand-purple/20 text-[#a78bfa]" : "bg-cyan-500/15 border-cyan-500/20 text-cyan-400";
                  return (
                    <div
                      key={book.id}
                      className="shrink-0 snap-center bg-white/[0.02] border border-white/5 hover:border-brand-purple/30 rounded-[20px] aspect-[3/4] p-5 flex flex-col justify-between relative group shadow-2xl transition-all duration-300"
                      style={{ width: "calc(100vw - 48px)" }}
                    >
                      <div className="flex justify-between items-start z-10">
                        <span className="text-[8px] uppercase tracking-widest font-extrabold bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/80">
                          {book.theme || "Startup"}
                        </span>
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveActionsMenu(isMenuOpen ? null : book.id); }}
                            className="text-brand-muted hover:text-white cursor-pointer p-1.5 text-base leading-none transition-colors"
                          >⋮</button>
                          {isMenuOpen && (
                            <>
                              <div className="fixed inset-0 z-25" onClick={() => setActiveActionsMenu(null)} />
                              <div className="absolute right-0 top-7 w-36 bg-[#0E131F] border border-white/5 rounded-xl z-30 shadow-2xl p-1 text-left">
                                <button onClick={() => { setActiveActionsMenu(null); onEdit(book); }} className="w-full text-left px-3 py-2.5 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 text-white rounded-lg cursor-pointer">Open</button>
                                <button onClick={() => { setActiveActionsMenu(null); onDuplicate(book.id); }} className="w-full text-left px-3 py-2.5 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 text-white rounded-lg cursor-pointer">Duplicate</button>
                                <button onClick={() => { setActiveActionsMenu(null); onExport(book, "PDF"); }} className="w-full text-left px-3 py-2.5 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 text-brand-success rounded-lg cursor-pointer">Export PDF</button>
                                <div className="h-[1px] bg-white/5 my-1" />
                                <button onClick={() => { setActiveActionsMenu(null); onDelete(book.id); }} className="w-full text-left px-3 py-2.5 text-[10px] uppercase font-bold tracking-wider hover:bg-red-500/10 text-red-400 rounded-lg cursor-pointer">Delete</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="w-28 aspect-[3/4] rounded-lg border border-white/5 overflow-hidden shadow-2xl mx-auto my-auto relative transition-transform duration-300 group-hover:scale-105">
                        {renderMiniCover(book.theme, book.title)}
                      </div>
                      <div className="z-10 mt-1 flex flex-col gap-2">
                        <h3 className="font-extrabold text-xs text-white tracking-tight truncate leading-tight">{book.title}</h3>
                        <div className="flex justify-between items-center text-[8px] text-brand-muted border-t border-white/5 pt-2.5 font-mono">
                          <span>Edited {formattedDate}</span>
                          <span className={`uppercase font-extrabold px-1.5 py-0.5 rounded border ${statusBadgeStyles}`}>{status}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-[#070B14]/90 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center gap-2.5 p-5 z-20">
                        <button onClick={() => onEdit(book)} className="w-32 py-2.5 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider shadow-lg hover:bg-brand-purple/95 transition-all cursor-pointer text-center">Open</button>
                        <div className="flex gap-2.5">
                          <button onClick={() => onDuplicate(book.id)} className="px-3.5 py-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-[8px] font-bold uppercase tracking-wider cursor-pointer">Duplicate</button>
                          <button onClick={() => onExport(book, "PDF")} className="px-3.5 py-2 rounded-full bg-brand-success hover:bg-brand-success/95 text-[#070B14] text-[8px] font-bold uppercase tracking-wider cursor-pointer shadow-md">Export</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {ebooks.slice(0, 4).map((_, idx) => (
                  <div key={idx} className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${activeEbookIndex === idx ? "w-4 bg-brand-purple" : "bg-white/20"}`} />
                ))}
              </div>
            </div>
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {ebooks.slice(0, 4).map((book) => {
                const formattedDate = book.created_at ? new Date(book.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Just now";
                const isMenuOpen = activeActionsMenu === book.id;
                const pageCount = book.pages?.length || 0;
                const status = pageCount > 10 ? "Published" : pageCount > 0 ? "Draft" : "Exported";
                const statusBadgeStyles = status === "Published" ? "bg-brand-success/15 border-brand-success/20 text-brand-success" : status === "Draft" ? "bg-brand-purple/15 border-brand-purple/20 text-[#a78bfa]" : "bg-cyan-500/15 border-cyan-500/20 text-cyan-400";
                return (
                  <motion.div
                    key={book.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white/[0.02] border border-white/5 hover:border-brand-purple/30 rounded-[20px] aspect-[3/4] p-5 flex flex-col justify-between relative group shadow-2xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start z-10">
                      <span className="text-[8px] uppercase tracking-widest font-extrabold bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/80">{book.theme || "Startup"}</span>
                      <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setActiveActionsMenu(isMenuOpen ? null : book.id); }} className="text-brand-muted hover:text-white cursor-pointer p-1 text-sm leading-none transition-colors">⋮</button>
                        {isMenuOpen && (
                          <>
                            <div className="fixed inset-0 z-25" onClick={() => setActiveActionsMenu(null)} />
                            <div className="absolute right-0 top-6 w-36 bg-[#0E131F] border border-white/5 rounded-xl z-30 shadow-2xl p-1 text-left">
                              <button onClick={() => { setActiveActionsMenu(null); onEdit(book); }} className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 text-white rounded-lg cursor-pointer">Open</button>
                              <button onClick={() => { setActiveActionsMenu(null); onDuplicate(book.id); }} className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 text-white rounded-lg cursor-pointer">Duplicate</button>
                              <button onClick={() => { setActiveActionsMenu(null); onExport(book, "PDF"); }} className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 text-brand-success rounded-lg cursor-pointer">Export PDF</button>
                              <div className="h-[1px] bg-white/5 my-1" />
                              <button onClick={() => { setActiveActionsMenu(null); onDelete(book.id); }} className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-red-500/10 text-red-400 rounded-lg cursor-pointer">Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-28 aspect-[3/4] rounded-lg border border-white/5 overflow-hidden shadow-2xl mx-auto my-auto relative transition-transform duration-300 group-hover:scale-105">
                      {renderMiniCover(book.theme, book.title)}
                    </div>
                    <div className="z-10 mt-1 flex flex-col gap-2">
                      <h3 className="font-extrabold text-xs text-white tracking-tight truncate leading-tight">{book.title}</h3>
                      <div className="flex justify-between items-center text-[8px] text-brand-muted border-t border-white/5 pt-2.5 font-mono">
                        <span>Edited {formattedDate}</span>
                        <span className={`uppercase font-extrabold px-1.5 py-0.5 rounded border ${statusBadgeStyles}`}>{status}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-[#070B14]/90 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center gap-2.5 p-5 z-20">
                      <button onClick={() => onEdit(book)} className="w-32 py-2.5 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider shadow-lg hover:bg-brand-purple/95 transition-all cursor-pointer transform translate-y-2 group-hover:translate-y-0 duration-300 active:scale-95">Open</button>
                      <div className="flex gap-2.5 transform translate-y-4 group-hover:translate-y-0 duration-300">
                        <button onClick={() => onDuplicate(book.id)} className="px-3.5 py-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-[8px] font-bold uppercase tracking-wider cursor-pointer">Duplicate</button>
                        <button onClick={() => onExport(book, "PDF")} className="px-3.5 py-2 rounded-full bg-brand-success hover:bg-brand-success/95 text-[#070B14] text-[8px] font-bold uppercase tracking-wider cursor-pointer shadow-md">Export</button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

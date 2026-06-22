"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "../../../lib/supabase/client";
import EditorWorkspace from "../../../components/editor/EditorWorkspace";
import { motion } from "framer-motion";

interface Ebook {
  id: string;
  title: string;
  author: string;
  theme: string;
  coverImage?: string;
  created_at?: string;
  pages: any[];
}

type FilterType = "all" | "draft" | "published" | "exported" | "archived";

export default function MyEbooksRoute() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeActionsMenu, setActiveActionsMenu] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchEbooks();
      }
    };
    loadSession();
  }, []);

  const fetchEbooks = async () => {
    try {
      const res = await fetch("/api/ebooks");
      const data = await res.json();
      if (res.ok && data.ebooks) {
        const mapped = data.ebooks.map((b: any) => ({
          id: b.id,
          title: b.title,
          author: b.author || "Creator",
          theme: b.template_name || "Startup",
          pages: Array.isArray(b.content) ? b.content : [],
          created_at: b.created_at,
        }));
        setEbooks(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (bookId: string) => {
    const book = ebooks.find((b) => b.id === bookId);
    if (!book) return;
    const supabase = createClient();
    try {
      const newId = crypto.randomUUID();
      const { error } = await supabase
        .from("ebooks")
        .insert({
          id: newId,
          user_id: userId,
          title: `${book.title} (Copy)`,
          template_name: book.theme,
          content: book.pages,
          created_at: new Date().toISOString(),
        });
      if (error) throw error;
      await fetchEbooks();
      alert("Ebook duplicated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to permanently delete this ebook?")) return;
    try {
      const res = await fetch(`/api/ebooks/${bookId}`, { method: "DELETE" });
      if (res.ok) {
        setEbooks((prev) => prev.filter((b) => b.id !== bookId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEbook = async (updatedBook: Ebook) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("ebooks")
        .update({
          title: updatedBook.title,
          content: updatedBook.pages,
        })
        .eq("id", updatedBook.id);
      if (error) throw error;
      setEbooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Helper to render mini covers
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
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#1c0d06] to-[#3b1c0a] flex flex-col justify-between p-3 relative overflow-hidden border border-[#52250d]">
          <span className="text-[5px] tracking-widest text-[#fdba74] font-bold uppercase z-10">GROWTH</span>
          <span className="text-[7px] font-black text-white uppercase italic tracking-tighter line-clamp-3 leading-none z-10">{title}</span>
          <div className="h-[1px] w-4 bg-[#F97316] z-10" />
        </div>
      );
    }
  };

  // Search & Filter lists
  const filteredEbooks = useMemo(() => {
    return ebooks.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            book.theme.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (activeFilter === "all") return true;
      
      // Simulate status mappings
      if (activeFilter === "draft") return book.pages.length <= 8;
      if (activeFilter === "published") return book.pages.length > 8;
      if (activeFilter === "exported") return book.pages.length >= 12;
      if (activeFilter === "archived") return false; // mockup doesn't hold archived
      
      return true;
    });
  }, [ebooks, searchQuery, activeFilter]);

  if (editingEbook) {
    return (
      <EditorWorkspace
        ebook={editingEbook}
        onClose={() => {
          setEditingEbook(null);
          fetchEbooks();
        }}
        onSave={handleSaveEbook}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 font-sans text-white">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">My Ebooks Collection</h1>
        <p className="text-xs text-brand-muted mt-2 font-medium">
          Manage, search, and download all generated books in your studio library.
        </p>
      </div>
 
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "draft", "published", "exported", "archived"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4.5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                  : "bg-white/[0.02] border border-white/5 text-brand-muted hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
 
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ebooks..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs transition-all font-sans focus:ring-1 focus:ring-brand-purple/20"
          />
          <svg className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
 
      {loading ? (
        <p className="text-xs text-brand-muted animate-pulse">Loading library...</p>
      ) : filteredEbooks.length === 0 ? (
        <div className="glass rounded-[20px] p-12 text-center max-w-md mx-auto">
          <p className="text-xs text-brand-muted font-medium">No ebooks found matching the query.</p>
        </div>
      ) : (
        /* Visual Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEbooks.map((book) => {
            const formattedDate = book.created_at
              ? new Date(book.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
              : "Just now";
 
            const isMenuOpen = activeActionsMenu === book.id;
            
            // Dynamic status mapping based on page counts
            const pageCount = book.pages?.length || 0;
            const status = pageCount > 10 ? "Published" : pageCount > 0 ? "Draft" : "Exported";
            
            const statusBadgeStyles = 
              status === "Published" 
                ? "bg-brand-success/15 border-brand-success/20 text-brand-success" 
                : status === "Draft"
                ? "bg-brand-purple/15 border-brand-purple/20 text-[#a78bfa]"
                : "bg-cyan-500/15 border-cyan-500/20 text-cyan-400";
 
            return (
              <motion.div
                key={book.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/[0.02] border border-white/5 hover:border-brand-purple/30 rounded-[20px] aspect-[3/4] p-5 flex flex-col justify-between relative group shadow-2xl transition-all duration-300"
              >
                <div className="flex justify-between items-start z-10">
                  <span className="text-[8px] uppercase tracking-widest font-extrabold bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/80">
                    {book.theme}
                  </span>
                  
                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionsMenu(isMenuOpen ? null : book.id);
                      }}
                      className="text-brand-muted hover:text-white cursor-pointer p-1 text-sm leading-none transition-colors"
                    >
                      ⋮
                    </button>
                    {isMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-25" onClick={() => setActiveActionsMenu(null)} />
                        <div className="absolute right-0 top-6 w-36 bg-[#0E131F] border border-white/5 rounded-xl z-30 shadow-2xl p-1 text-left">
                          <button
                            onClick={() => {
                              setActiveActionsMenu(null);
                              setEditingEbook(book);
                            }}
                            className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 text-white rounded-lg cursor-pointer"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => {
                              setActiveActionsMenu(null);
                              handleDuplicate(book.id);
                            }}
                            className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-white/5 text-white rounded-lg cursor-pointer"
                          >
                            Duplicate
                          </button>
                          <div className="h-[1px] bg-white/5 my-1" />
                          <button
                            onClick={() => {
                              setActiveActionsMenu(null);
                              handleDelete(book.id);
                            }}
                            className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-red-500/10 text-red-400 rounded-lg cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
 
                <div className="w-28 aspect-[3/4] rounded-lg border border-white/5 overflow-hidden shadow-2xl mx-auto my-auto relative transition-transform duration-300 group-hover:scale-105">
                  {renderMiniCover(book.theme, book.title)}
                </div>
 
                <div className="z-10 mt-1 flex flex-col gap-2">
                  <h3 className="font-extrabold text-xs text-white tracking-tight truncate leading-tight">
                    {book.title}
                  </h3>
                  <div className="flex justify-between items-center text-[8px] text-brand-muted border-t border-white/5 pt-2.5 font-mono">
                    <span>Edited {formattedDate}</span>
                    <span className={`uppercase font-extrabold px-1.5 py-0.5 rounded border ${statusBadgeStyles}`}>
                      {status}
                    </span>
                  </div>
                </div>
 
                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-[#070B14]/90 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center gap-2.5 p-5 z-20">
                  <button
                    onClick={() => setEditingEbook(book)}
                    className="w-32 py-2.5 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider shadow-lg hover:bg-brand-purple/95 transition-all cursor-pointer transform translate-y-2 group-hover:translate-y-0 duration-300 active:scale-95"
                  >
                    Open
                  </button>
                  <div className="flex gap-2.5 transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <button
                      onClick={() => handleDuplicate(book.id)}
                      className="px-3.5 py-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-[8px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        alert(`Downloading PDF package for "${book.title}"...`);
                      }}
                      className="px-3.5 py-2 rounded-full bg-brand-success hover:bg-brand-success/95 text-[#070B14] text-[8px] font-bold uppercase tracking-wider cursor-pointer shadow-md"
                    >
                      Export
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

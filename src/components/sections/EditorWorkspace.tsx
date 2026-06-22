"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EbookPage {
  type: string;
  title?: string;
  subtitle?: string;
  text?: string;
  content?: string;
  quote?: string;
  image?: string;
  imageUrl?: string;
  caption?: string;
  items?: string[];
  chapters?: any[];
  chapterNum?: string;
}

interface Ebook {
  id: string;
  title: string;
  author: string;
  theme: string;
  coverImage?: string;
  pages: EbookPage[];
}

interface EditorWorkspaceProps {
  ebook: Ebook;
  onClose: () => void;
  onSave: (updatedEbook: Ebook) => void;
}

export function EditorWorkspace({ ebook, onClose, onSave }: EditorWorkspaceProps) {
  // Active editing state
  const [editedEbook, setEditedEbook] = useState<Ebook>({ ...ebook });
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [history, setHistory] = useState<Ebook[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Layout View Mode (simulation screen sizes)
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewMode, setPreviewMode] = useState(false);
  
  // Mobile Tab view (Pages, Preview, Edit)
  const [mobileTab, setMobileTab] = useState<"pages" | "preview" | "edit">("preview");

  // Export overlay state
  const [exportType, setExportType] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState("");

  const activePage = useMemo(() => {
    return editedEbook.pages[activePageIndex] || editedEbook.pages[0];
  }, [editedEbook, activePageIndex]);

  const updateHistory = (newBook: Ebook) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, newBook]);
    setHistoryIndex(updatedHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setEditedEbook({ ...history[idx] });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setEditedEbook({ ...history[idx] });
    }
  };

  const handleTextChange = (field: string, val: string) => {
    const updatedPages = [...editedEbook.pages];
    updatedPages[activePageIndex] = {
      ...updatedPages[activePageIndex],
      [field]: val,
    };
    const updatedBook = {
      ...editedEbook,
      pages: updatedPages,
    };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
  };

  const handleTitleChange = (val: string) => {
    const updatedBook = {
      ...editedEbook,
      title: val,
    };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
  };

  // Page Operations
  const handleAddPage = () => {
    const newPage: EbookPage = {
      type: "chapter",
      chapterNum: String(editedEbook.pages.length + 1),
      title: "New Chapter Page",
      content: "Type new page contents here...",
    };
    const updatedBook = {
      ...editedEbook,
      pages: [...editedEbook.pages, newPage],
    };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
    setActivePageIndex(updatedBook.pages.length - 1);
  };

  const handleDuplicatePage = () => {
    const pageToDuplicate = editedEbook.pages[activePageIndex];
    const updatedPages = [...editedEbook.pages];
    updatedPages.splice(activePageIndex + 1, 0, { ...pageToDuplicate });
    const updatedBook = {
      ...editedEbook,
      pages: updatedPages,
    };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
    setActivePageIndex(activePageIndex + 1);
  };

  const handleDeletePage = () => {
    if (editedEbook.pages.length <= 1) return;
    const updatedPages = [...editedEbook.pages];
    updatedPages.splice(activePageIndex, 1);
    const updatedBook = {
      ...editedEbook,
      pages: updatedPages,
    };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
    setActivePageIndex(Math.max(0, activePageIndex - 1));
  };

  const handleMovePage = (dir: "up" | "down") => {
    if (dir === "up" && activePageIndex === 0) return;
    if (dir === "down" && activePageIndex === editedEbook.pages.length - 1) return;

    const swapIndex = dir === "up" ? activePageIndex - 1 : activePageIndex + 1;
    const updatedPages = [...editedEbook.pages];
    const temp = updatedPages[activePageIndex];
    updatedPages[activePageIndex] = updatedPages[swapIndex];
    updatedPages[swapIndex] = temp;

    const updatedBook = {
      ...editedEbook,
      pages: updatedPages,
    };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
    setActivePageIndex(swapIndex);
  };

  // Export triggers
  const triggerExport = (type: string) => {
    setExportType(type);
    setExportProgress(10);
    setExportStatus("Preparing Export");

    const steps = [
      { progress: 45, status: "Generating File" },
      { progress: 80, status: "Finalizing Layout Assets" },
      { progress: 100, status: "Download Ready" },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setExportProgress(steps[currentStep].progress);
        setExportStatus(steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B14] flex flex-col font-sans text-white">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-brand-border bg-brand-black px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-xs font-bold text-brand-muted hover:text-white border border-brand-border rounded-full px-4 py-2 hover:bg-white/5 cursor-pointer"
          >
            &larr; Dashboard
          </button>
          
          <input
            type="text"
            value={editedEbook.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="font-bold text-sm bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-purple/40 px-2 py-1 rounded w-48 sm:w-64 text-white"
          />

          <span className="text-[10px] text-brand-success font-semibold px-2 py-0.5 rounded bg-brand-success/15 border border-brand-success/20">
            ✓ Autosaved
          </span>
        </div>

        {/* Center device toggle triggers (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 border border-brand-border rounded-full">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              deviceMode === "desktop" ? "bg-brand-purple text-white" : "text-brand-muted hover:text-white"
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              deviceMode === "tablet" ? "bg-brand-purple text-white" : "text-brand-muted hover:text-white"
            }`}
          >
            Tablet
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              deviceMode === "mobile" ? "bg-brand-purple text-white" : "text-brand-muted hover:text-white"
            }`}
          >
            Mobile
          </button>
        </div>

        {/* History actions & Export actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="h-8 w-8 rounded-full border border-brand-border hover:bg-white/5 flex items-center justify-center text-sm disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            ↶
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="h-8 w-8 rounded-full border border-brand-border hover:bg-white/5 flex items-center justify-center text-sm disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            ↷
          </button>

          <div className="relative group">
            <button className="px-5 py-2 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer">
              Export ▼
            </button>
            <div className="absolute right-0 top-9 w-32 bg-brand-black border border-brand-border rounded-xl hidden group-hover:block hover:block p-1 shadow-2xl z-50">
              {["PDF", "EPUB", "DOCX"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => triggerExport(fmt)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 text-white rounded-lg cursor-pointer"
                >
                  Export {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Page navigator list (Collapsible on tablet/desktop) */}
        <aside
          className={`${
            previewMode ? "hidden" : "hidden lg:flex"
          } w-56 border-r border-brand-border bg-brand-black/30 p-5 flex flex-col justify-between shrink-0 overflow-y-auto`}
        >
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest px-1">
              Outline
            </h4>
            <div className="flex flex-col gap-2">
              {editedEbook.pages.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePageIndex(idx)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all flex items-center justify-between group cursor-pointer ${
                    activePageIndex === idx
                      ? "bg-brand-purple/15 border-brand-purple text-white font-bold"
                      : "bg-white/5 border-transparent text-brand-muted hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="truncate">
                    {idx + 1}. {p.type === "cover" ? "Cover Page" : p.title || `Page ${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddPage}
            className="w-full py-2.5 border border-dashed border-brand-border hover:border-brand-purple/60 rounded-xl text-xs font-semibold text-brand-muted hover:text-white transition-all cursor-pointer"
          >
            + Add Blank Page
          </button>
        </aside>

        {/* Center spread rendering canvas stage */}
        <main className="flex-grow p-6 lg:p-10 flex flex-col justify-center items-center overflow-y-auto bg-[#070B14]">
          {/* Canvas mock wrapper */}
          <div
            className="w-full flex items-center justify-center transition-all duration-300"
            style={{
              maxWidth:
                deviceMode === "mobile"
                  ? "375px"
                  : deviceMode === "tablet"
                  ? "768px"
                  : "100%",
            }}
          >
            <motion.div
              layout
              className="w-full aspect-[4/3] bg-[#0E131F] border border-brand-border rounded-[20px] shadow-2xl p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden ring-1 ring-white/5"
            >
              {activePage && (
                <>
                  {activePage.type === "cover" && (
                    <div className="my-auto text-center flex flex-col justify-center gap-4">
                      <span className="text-[10px] tracking-widest text-brand-purple font-bold uppercase">
                        AI PUBLISHED OUTLINE
                      </span>
                      <h2 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight">
                        {activePage.title || editedEbook.title}
                      </h2>
                      <p className="text-xs text-brand-muted">
                        {activePage.subtitle || `By ${editedEbook.author}`}
                      </p>
                    </div>
                  )}

                  {activePage.type === "chapter" && (
                    <div className="my-auto flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-brand-border pb-3">
                        <span className="text-[10px] text-brand-purple font-bold uppercase tracking-wider">
                          Chapter {activePage.chapterNum || activePageIndex}
                        </span>
                        <span className="text-[9px] text-brand-muted uppercase tracking-widest">
                          Page {activePageIndex + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {activePage.title}
                      </h3>
                      <p className="text-xs text-brand-muted leading-relaxed whitespace-pre-line">
                        {activePage.content || activePage.text}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-brand-border/40 pt-4 text-[9px] text-brand-muted uppercase tracking-widest">
                    <span>PageNest Studio V2</span>
                    <span>Page {activePageIndex + 1} of {editedEbook.pages.length}</span>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </main>

        {/* Right Panel: Page properties editor controllers (Collapsible) */}
        <aside
          className={`${
            previewMode ? "hidden" : "hidden lg:flex"
          } w-80 border-l border-brand-border bg-brand-black/30 p-6 flex flex-col justify-between shrink-0 overflow-y-auto`}
        >
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
              Page Controls
            </h4>

            {activePage && (
              <div className="flex flex-col gap-5">
                {/* Text edit area */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">
                    Page Heading Title
                  </label>
                  <input
                    type="text"
                    value={activePage.title || ""}
                    onChange={(e) => handleTextChange("title", e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-brand-border bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs"
                  />
                </div>

                {activePage.type === "cover" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">
                      Cover Subtitle
                    </label>
                    <input
                      type="text"
                      value={activePage.subtitle || ""}
                      onChange={(e) => handleTextChange("subtitle", e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-brand-border bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs"
                    />
                  </div>
                )}

                {activePage.type === "chapter" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">
                      Page Paragraph Content
                    </label>
                    <textarea
                      value={activePage.content || activePage.text || ""}
                      onChange={(e) => handleTextChange("content", e.target.value)}
                      rows={6}
                      className="px-4 py-3 rounded-xl border border-brand-border bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs resize-none"
                    />
                  </div>
                )}

                {/* Page movements / order manipulation */}
                <div className="border-t border-brand-border pt-4">
                  <label className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-2">
                    Move Order
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMovePage("up")}
                      disabled={activePageIndex === 0}
                      className="flex-1 py-2 text-xs border border-brand-border hover:bg-white/5 rounded-xl disabled:opacity-30 cursor-pointer"
                    >
                      ▲ Move Up
                    </button>
                    <button
                      onClick={() => handleMovePage("down")}
                      disabled={activePageIndex === editedEbook.pages.length - 1}
                      className="flex-1 py-2 text-xs border border-brand-border hover:bg-white/5 rounded-xl disabled:opacity-30 cursor-pointer"
                    >
                      ▼ Move Down
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Page Actions: Duplicate / Delete */}
          <div className="border-t border-brand-border pt-4 flex flex-col gap-2 mt-6">
            <button
              onClick={handleDuplicatePage}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-brand-border hover:bg-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Duplicate Current Page
            </button>
            <button
              onClick={handleDeletePage}
              disabled={editedEbook.pages.length <= 1}
              className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-semibold text-xs transition-colors disabled:opacity-35 cursor-pointer"
            >
              Delete Page
            </button>
          </div>
        </aside>
      </div>

      {/* Export Loader Overlay Modal */}
      <AnimatePresence>
        {exportType && (
          <div className="fixed inset-0 bg-brand-bg/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0E131F] border border-brand-border p-6 rounded-[20px] shadow-2xl text-center flex flex-col gap-6"
            >
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-brand-purple bg-brand-purple/10 px-3 py-1 rounded border border-brand-purple/20">
                  Export Pipeline Active
                </span>
                <h3 className="font-sans text-white text-lg font-bold mt-4">
                  Exporting to {exportType}
                </h3>
              </div>

              {/* Progress bars */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] text-brand-muted font-bold">
                  <span>{exportStatus}</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-brand-border">
                  <div
                    className="h-full bg-brand-purple transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>

              {exportProgress === 100 ? (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      alert(`Mocking download trigger for ${editedEbook.title.replace(/\s+/g, "_").toLowerCase()}.${exportType.toLowerCase()}`);
                      setExportType(null);
                    }}
                    className="w-full py-2.5 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-xs font-bold shadow-md cursor-pointer"
                  >
                    Download File Now
                  </button>
                  <button
                    onClick={() => setExportType(null)}
                    className="w-full py-2 text-xs text-brand-muted hover:text-white"
                  >
                    Back to Canvas
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-brand-muted animate-pulse">
                  Please hold... compiling pages layout and resolving high-res graphics.
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile view responsive Bottom Navigation Tabs */}
      <div className="lg:hidden h-14 border-t border-brand-border bg-brand-black px-6 flex items-center justify-around z-30">
        <button
          onClick={() => {
            setMobileTab("pages");
            setPreviewMode(false);
          }}
          className={`flex flex-col items-center text-[10px] font-bold ${
            mobileTab === "pages" ? "text-brand-purple" : "text-brand-muted"
          }`}
        >
          <span>📁</span>
          <span className="mt-1">Pages</span>
        </button>
        <button
          onClick={() => {
            setMobileTab("preview");
            setPreviewMode(true);
          }}
          className={`flex flex-col items-center text-[10px] font-bold ${
            mobileTab === "preview" ? "text-brand-purple" : "text-brand-muted"
          }`}
        >
          <span>👁</span>
          <span className="mt-1">Preview</span>
        </button>
        <button
          onClick={() => {
            setMobileTab("edit");
            setPreviewMode(false);
          }}
          className={`flex flex-col items-center text-[10px] font-bold ${
            mobileTab === "edit" ? "text-brand-purple" : "text-brand-muted"
          }`}
        >
          <span>✍</span>
          <span className="mt-1">Edit</span>
        </button>
      </div>
    </div>
  );
}

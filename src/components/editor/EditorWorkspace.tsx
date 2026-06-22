"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import FloatingAiToolbar from "./FloatingAiToolbar";
import CoverEditorPanel from "./CoverEditorPanel";
import BrandKitPanel from "./BrandKitPanel";
import ContentBlocks from "./ContentBlocks";
import PaywallModal from "../ui/PaywallModal";

interface ContentBlock {
  id: string;
  type: string;
  content?: string;
  title?: string;
  items?: string[];
  imageUrl?: string;
  imagePrompt?: string;
  caption?: string;
  tableHeader?: string[];
  tableRows?: string[][];
  statValue?: string;
  statLabel?: string;
  authorName?: string;
  authorRole?: string;
  authorImage?: string;
  studyChallenge?: string;
  studySolution?: string;
  studyResult?: string;
  timelineItems?: { date: string; title: string; description: string }[];
  faqItems?: { question: string; answer: string }[];
}

interface EbookPage {
  id?: string;
  type: string;
  title?: string;
  subtitle?: string;
  author?: string;
  text?: string;
  content?: string;
  quote?: string;
  image?: string;
  imageUrl?: string;
  caption?: string;
  items?: string[];
  chapters?: any[];
  chapterNum?: string;
  layoutStyle?: string; 
  fontFamily?: string;  
  fontSize?: string;    
  bgTheme?: string;     
  blocks?: ContentBlock[];
  
  // Typography overrides
  headingScale?: "text-xl" | "text-2xl" | "text-3xl" | "text-4xl";
  bodyScale?: "text-xs" | "text-sm" | "text-base";
  lineHeight?: "leading-snug" | "leading-normal" | "leading-relaxed" | "leading-loose";
  paraSpacing?: "space-y-2" | "space-y-4" | "space-y-6";
  alignment?: "text-left" | "text-center" | "text-right" | "text-justify";
}

interface BrandKit {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface Ebook {
  id: string;
  title: string;
  author: string;
  theme: string;
  coverImage?: string;
  pages: EbookPage[];
  brandKit?: BrandKit;
}

interface EditorWorkspaceProps {
  ebook: Ebook;
  onClose: () => void;
  onSave: (updatedEbook: Ebook) => void;
}

export default function EditorWorkspace({ ebook, onClose, onSave }: EditorWorkspaceProps) {
  // Ensure every page has a unique id and blocks list on load
  const initializedEbook = useMemo(() => {
    const pagesWithId = (ebook.pages || []).map((p, i) => {
      const pageId = p.id || `${p.type}-${i}-${Date.now()}-${Math.random()}`;
      
      // Initialize blocks if not present
      let initialBlocks = p.blocks;
      if (!initialBlocks || initialBlocks.length === 0) {
        initialBlocks = [];
        if (p.type !== "cover" && p.type !== "toc") {
          if (p.title) {
            initialBlocks.push({
              id: `block-heading-${Date.now()}-${Math.random()}`,
              type: "heading",
              title: p.title,
            });
          }
          if (p.image || p.imageUrl) {
            initialBlocks.push({
              id: `block-image-${Date.now()}-${Math.random()}`,
              type: "image",
              imageUrl: p.image || p.imageUrl,
              caption: p.caption || "Illustration",
            });
          }
          if (p.quote) {
            initialBlocks.push({
              id: `block-quote-${Date.now()}-${Math.random()}`,
              type: "quote",
              content: p.quote,
            });
          }
          if (p.items && p.items.length > 0) {
            initialBlocks.push({
              id: `block-items-${Date.now()}-${Math.random()}`,
              type: p.type === "checklist" ? "checklist" : "bullet_list",
              items: p.items,
            });
          }
          if (p.content || p.text) {
            initialBlocks.push({
              id: `block-para-${Date.now()}-${Math.random()}`,
              type: "paragraph",
              content: p.content || p.text,
            });
          }
        }
      }

      return {
        ...p,
        id: pageId,
        blocks: initialBlocks,
        headingScale: p.headingScale || "text-2xl",
        bodyScale: p.bodyScale || "text-sm",
        lineHeight: p.lineHeight || "leading-relaxed",
        paraSpacing: p.paraSpacing || "space-y-4",
        alignment: p.alignment || "text-left",
      };
    });

    const defaultBrandKit = ebook.brandKit || {
      primaryColor: "#7C3AED",
      secondaryColor: "#10B981",
      fontFamily: "sans",
    };

    return { ...ebook, pages: pagesWithId, brandKit: defaultBrandKit };
  }, [ebook]);

  const [editedEbook, setEditedEbook] = useState<Ebook>(initializedEbook);
  const [activePageIndex, setActivePageIndex] = useState(0);
  
  // Subscription and Paywall states
  /*
  const { planId } = useSubscription();
  */
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallReason] = useState("");

  // History stack for Undo/Redo & Version History
  const [history, setHistory] = useState<Ebook[]>([initializedEbook]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Layout & UI states
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mobileTab, setMobileTab] = useState<"pages" | "preview" | "edit">("preview");
  const [rightPanelTab, setRightPanelTab] = useState<"blocks" | "properties" | "design" | "brand">("properties");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pageSearchQuery, setPageSearchQuery] = useState("");
  
  // AI states
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [chapterPrompt, setChapterPrompt] = useState("");
  const [chapterGenerating, setChapterGenerating] = useState(false);
  const [chapterGenStep, setChapterGenStep] = useState("");
  
  const [isImprovingDesign, setIsImprovingDesign] = useState(false);
  const [designAiStatus, setDesignAiStatus] = useState("");
  
  const [aiWritingStatus, setAiWritingStatus] = useState<string | null>(null);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; pageIndex: number } | null>(null);

  // Version history drawer
  const [isVersionsDrawerOpen, setIsVersionsDrawerOpen] = useState(false);

  // Image upload mock loader
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [generatingBlockId, setGeneratingBlockId] = useState<string | null>(null);

  // Export progress states
  const [exportType, setExportType] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState("");
  const [isExportSheetOpen, setIsExportSheetOpen] = useState(false);

  const activePage = useMemo(() => {
    return editedEbook.pages[activePageIndex] || editedEbook.pages[0] || { type: "chapter", title: "New Page", content: "" };
  }, [editedEbook, activePageIndex]);

  const filteredPages = useMemo(() => {
    return editedEbook.pages.map((p, originalIdx) => ({ p, originalIdx })).filter(({ p }) => {
      if (!pageSearchQuery) return true;
      const titleMatch = (p.title || "").toLowerCase().includes(pageSearchQuery.toLowerCase());
      const typeMatch = p.type.toLowerCase().includes(pageSearchQuery.toLowerCase());
      return titleMatch || typeMatch;
    });
  }, [editedEbook.pages, pageSearchQuery]);

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
      onSave(history[idx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setEditedEbook({ ...history[idx] });
      onSave(history[idx]);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActivePageIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActivePageIndex((prev) => Math.min(editedEbook.pages.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history, editedEbook.pages.length]);

  const handlePagePropertyChange = (field: keyof EbookPage, val: any) => {
    const updatedPages = [...editedEbook.pages];
    updatedPages[activePageIndex] = {
      ...updatedPages[activePageIndex],
      [field]: val,
    };
    const updatedBook = { ...editedEbook, pages: updatedPages };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
  };

  const handleTitleChange = (val: string) => {
    const updatedBook = { ...editedEbook, title: val };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
  };

  const handleAddPage = () => {
    const newPage: EbookPage = {
      id: `chapter-${Date.now()}-${Math.random()}`,
      type: "chapter",
      chapterNum: String(editedEbook.pages.length + 1),
      title: "New Chapter Page",
      blocks: [
        {
          id: `block-heading-${Date.now()}`,
          type: "heading",
          title: "New Chapter Topic",
        },
        {
          id: `block-para-${Date.now()}`,
          type: "paragraph",
          content: "This is a new chapter section. Click here to begin writing, or use the design blocks to structure quotes, testimonials, or image showcases.",
        }
      ],
      layoutStyle: "standard",
      fontFamily: editedEbook.brandKit?.fontFamily || "sans",
      fontSize: "medium",
      bgTheme: "default",
      headingScale: "text-2xl",
      bodyScale: "text-sm",
      lineHeight: "leading-relaxed",
      paraSpacing: "space-y-4",
      alignment: "text-left",
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

  const handleDuplicatePage = (index = activePageIndex) => {
    const pageToDuplicate = editedEbook.pages[index];
    const duplicatedPage = {
      ...pageToDuplicate,
      id: `${pageToDuplicate.type}-${Date.now()}-${Math.random()}`,
    };
    const updatedPages = [...editedEbook.pages];
    updatedPages.splice(index + 1, 0, duplicatedPage);
    const updatedBook = { ...editedEbook, pages: updatedPages };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
    setActivePageIndex(index + 1);
  };

  const handleDeletePage = (index = activePageIndex) => {
    if (editedEbook.pages.length <= 1) return;
    const updatedPages = [...editedEbook.pages];
    updatedPages.splice(index, 1);
    const updatedBook = { ...editedEbook, pages: updatedPages };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
    setActivePageIndex(Math.max(0, index - 1));
  };

  const handleMovePage = (dir: "up" | "down", index = activePageIndex) => {
    if (dir === "up" && index === 0) return;
    if (dir === "down" && index === editedEbook.pages.length - 1) return;

    const swapIndex = dir === "up" ? index - 1 : index + 1;
    const updatedPages = [...editedEbook.pages];
    const temp = updatedPages[index];
    updatedPages[index] = updatedPages[swapIndex];
    updatedPages[swapIndex] = temp;

    const updatedBook = { ...editedEbook, pages: updatedPages };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
    setActivePageIndex(swapIndex);
  };

  const handleReorder = (newPages: EbookPage[]) => {
    const updatedBook = { ...editedEbook, pages: newPages };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);

    const activePageId = editedEbook.pages[activePageIndex]?.id;
    if (activePageId) {
      const newIndex = newPages.findIndex((p) => p.id === activePageId);
      if (newIndex !== -1) {
        setActivePageIndex(newIndex);
      }
    }
  };

  // Add Content Block
  const handleAddBlock = (blockType: string) => {
    if (activePage.type === "cover" || activePage.type === "toc") {
      alert("Please switch from Cover or Table of Contents mode to insert standard content blocks.");
      return;
    }

    let newBlock: ContentBlock = {
      id: `block-${blockType}-${Date.now()}-${Math.random()}`,
      type: blockType,
    };

    switch (blockType) {
      case "heading":
        newBlock.title = "Sub-Heading Section";
        break;
      case "paragraph":
        newBlock.content = "New paragraph content. Select this block to edit typography or trigger the Floating AI toolbar to write automatically.";
        break;
      case "quote":
        newBlock.content = "Make design simple, clean, and memorable. It should look like it was designed by a human with taste.";
        break;
      case "bullet_list":
      case "checklist":
        newBlock.items = ["First core value item", "Secondary milestone asset", "Deliverable benchmark metric"];
        break;
      case "image":
        newBlock.imageUrl = "https://images.pexels.com/photos/19907129/pexels-photo-19907129.jpeg?auto=compress&cs=tinysrgb&w=800";
        newBlock.caption = "Figure: Luxury executive presentation deck.";
        newBlock.imagePrompt = "Luxury business conference stage";
        break;
      case "statistic":
        newBlock.statValue = "94%";
        newBlock.statLabel = "Increase in team execution efficiency and delivery velocity";
        break;
      case "callout":
        newBlock.title = "Core Principle Alert";
        newBlock.content = "Ensure that your primary brand elements (fonts, colors, logo markers) align directly with your customer avatar's expectations.";
        break;
      case "comparison_table":
        newBlock.tableHeader = ["Criteria", "Starter Pack", "Pro Enterprise"];
        newBlock.tableRows = [
          ["Cost Option", "$0 / Free Plan", "$29 / Month"],
          ["Workspace Teams", "1 User seat", "Unlimited seats"],
          ["Export Types", "Standard PDF", "Kindle, EPUB, HD Vector PDF"]
        ];
        break;
      case "testimonial":
        newBlock.content = "PageNest entirely restructured our book publishing speed. We went from outline draft to Kindle launch in less than 24 hours.";
        newBlock.authorName = "Sarah Jenkins";
        newBlock.authorRole = "VP of Content, Stripe";
        newBlock.authorImage = "https://images.pexels.com/photos/14587417/pexels-photo-14587417.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
        break;
      case "case_study":
        newBlock.title = "Case Study: Scaling Async Protocols";
        newBlock.studyChallenge = "Remote engineering teams faced timezone lags and planning bloat.";
        newBlock.studySolution = "Adopted standardized linear issue checklists and async status updates.";
        newBlock.studyResult = "Reduced sync meeting durations by 78% while doubling release shipping frequency.";
        break;
      case "timeline":
        newBlock.timelineItems = [
          { date: "Q1 Launch", title: "Market Validation", description: "Collect early feedback from 50 customer interviews." },
          { date: "Q2 Sprint", title: "Beta MVP Release", description: "Ship the initial editor core features to targeted groups." },
          { date: "Q3 Expansion", title: "Global Scaling", description: "Deploy localized translations and EPUB compiler." }
        ];
        break;
      case "faq":
        newBlock.faqItems = [
          { question: "Is this platform suitable for offline books?", answer: "Yes! Every PDF export compiles using high-definition vector lines perfectly suited for physical printshops." },
          { question: "Can I customize font bindings?", answer: "Absolutely. Simply navigate to the Brand Kit panel and apply your corporate brand files." }
        ];
        break;
    }

    const currentBlocks = activePage.blocks || [];
    handlePagePropertyChange("blocks", [...currentBlocks, newBlock]);
  };

  const handleUpdateBlock = (blockId: string, updatedFields: Partial<ContentBlock>) => {
    const currentBlocks = activePage.blocks || [];
    const newBlocks = currentBlocks.map((b) => {
      if (b.id === blockId) {
        return { ...b, ...updatedFields };
      }
      return b;
    });
    handlePagePropertyChange("blocks", newBlocks);
  };

  const handleDeleteBlock = (blockId: string) => {
    const currentBlocks = activePage.blocks || [];
    const newBlocks = currentBlocks.filter((b) => b.id !== blockId);
    handlePagePropertyChange("blocks", newBlocks);
  };

  const handleMoveBlock = (blockId: string, direction: "up" | "down") => {
    const currentBlocks = [...(activePage.blocks || [])];
    const idx = currentBlocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === currentBlocks.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const temp = currentBlocks[idx];
    currentBlocks[idx] = currentBlocks[swapIdx];
    currentBlocks[swapIdx] = temp;

    handlePagePropertyChange("blocks", currentBlocks);
  };

  // Mock Upload Image
  const handleMockUploadImage = (blockId: string) => {
    setUploadingBlockId(blockId);
    setTimeout(() => {
      const stockUrls = [
        "https://images.pexels.com/photos/2099266/pexels-photo-2099266.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/8400596/pexels-photo-8400596.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=800"
      ];
      const randomUrl = stockUrls[Math.floor(Math.random() * stockUrls.length)];
      if (blockId === activePage.id) {
        handlePagePropertyChange("image", randomUrl);
      } else {
        handleUpdateBlock(blockId, { imageUrl: randomUrl });
      }
      setUploadingBlockId(null);
    }, 1500);
  };

  // Mock AI Image Generation
  const handleGenerateBlockImage = (blockId: string, prompt: string) => {
    setGeneratingBlockId(blockId);
    setTimeout(() => {
      // Pick custom scenic imagery matching prompt styles
      let chosenUrl = "https://images.pexels.com/photos/19907129/pexels-photo-19907129.jpeg?auto=compress&cs=tinysrgb&w=800";
      if (prompt.toLowerCase().includes("stage") || prompt.toLowerCase().includes("conference")) {
        chosenUrl = "https://images.pexels.com/photos/19907129/pexels-photo-19907129.jpeg?auto=compress&cs=tinysrgb&w=800";
      } else if (prompt.toLowerCase().includes("desk") || prompt.toLowerCase().includes("creator")) {
        chosenUrl = "https://images.pexels.com/photos/8400596/pexels-photo-8400596.jpeg?auto=compress&cs=tinysrgb&w=800";
      } else if (prompt.toLowerCase().includes("journal") || prompt.toLowerCase().includes("book")) {
        chosenUrl = "https://images.pexels.com/photos/2099266/pexels-photo-2099266.jpeg?auto=compress&cs=tinysrgb&w=800";
      } else {
        chosenUrl = "https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=800";
      }
      if (blockId === activePage.id) {
        handlePagePropertyChange("image", chosenUrl);
      } else {
        handleUpdateBlock(blockId, { imageUrl: chosenUrl, imagePrompt: prompt });
      }
      setGeneratingBlockId(null);
    }, 2000);
  };

  // Smart Design AI Actions
  const handleImproveDesign = () => {
    setIsImprovingDesign(true);
    const steps = [
      "Analyzing spacing vertical hierarchy...",
      "Calibrating block paragraph gutters...",
      "Optimizing color contrast matching...",
      "Aligning title font scale ratios...",
      "Design Optimized! ✨"
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setDesignAiStatus(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsImprovingDesign(false);
        // Apply optimized page changes
        handlePagePropertyChange("headingScale", "text-3xl");
        handlePagePropertyChange("lineHeight", "leading-loose");
        handlePagePropertyChange("paraSpacing", "space-y-6");
        handlePagePropertyChange("alignment", "text-justify");
      }
    }, 600);
  };

  // Chapter Generator Actions
  const handleGenerateChapter = () => {
    if (!chapterPrompt.trim()) return;
    setChapterGenerating(true);

    const steps = [
      "Outlining chapter sections...",
      "Drafting educational context blocks...",
      "Crafting executive quotes...",
      "Creating bullet summary checklist...",
      "Compiling layout grid spreads..."
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setChapterGenStep(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setChapterGenerating(false);
        setIsChapterModalOpen(false);

        // Add generated chapter
        const titleText = chapterPrompt.charAt(0).toUpperCase() + chapterPrompt.slice(1);
        const newPage: EbookPage = {
          id: `chapter-${Date.now()}-${Math.random()}`,
          type: "chapter",
          chapterNum: String(editedEbook.pages.length + 1),
          title: titleText,
          blocks: [
            {
              id: `block-heading-${Date.now()}-1`,
              type: "heading",
              title: `Introduction to ${titleText}`,
            },
            {
              id: `block-para-${Date.now()}-2`,
              type: "paragraph",
              content: `To effectively master the domain of ${chapterPrompt}, leaders must first establish a strong structural methodology. This includes tracking key outputs, reducing sync meeting durations, and prioritizing rapid prototyping. Building a workflow based on transparency yields compounding returns over time.`,
            },
            {
              id: `block-quote-${Date.now()}-3`,
              type: "quote",
              content: `\"The most efficient systems are not those with the highest complexity, but those that remove friction from everyday operations.\"`,
            },
            {
              id: `block-heading-${Date.now()}-4`,
              type: "heading",
              title: "Implementation Checklist",
            },
            {
              id: `block-checklist-${Date.now()}-5`,
              type: "checklist",
              items: [
                "Establish core milestones & objectives",
                "Define metric-driven target outputs",
                "Implement qualitative feedback loops"
              ]
            }
          ],
          layoutStyle: "standard",
          fontFamily: editedEbook.brandKit?.fontFamily || "sans",
          fontSize: "medium",
          bgTheme: "default",
          headingScale: "text-2xl",
          bodyScale: "text-sm",
          lineHeight: "leading-relaxed",
          paraSpacing: "space-y-4",
          alignment: "text-left",
        };

        const updatedBook = {
          ...editedEbook,
          pages: [...editedEbook.pages, newPage],
        };
        setEditedEbook(updatedBook);
        updateHistory(updatedBook);
        onSave(updatedBook);
        setActivePageIndex(updatedBook.pages.length - 1);
        setChapterPrompt("");
      }
    }, 800);
  };

  // Brand Kit application
  const handleApplyBrandKit = (brandKit: BrandKit) => {
    const updatedPages = editedEbook.pages.map((p) => {
      if (p.type === "cover") {
        return {
          ...p,
          fontFamily: brandKit.fontFamily,
        };
      }
      return {
        ...p,
        fontFamily: brandKit.fontFamily,
      };
    });

    const updatedBook = {
      ...editedEbook,
      pages: updatedPages,
      brandKit,
    };
    setEditedEbook(updatedBook);
    updateHistory(updatedBook);
    onSave(updatedBook);
    alert("Brand Kit applied globally! All page typography matches the presets.");
  };

  // AI Text selection rewrite triggers
  const handleAiWritingAction = (actionId: string, selectedText: string) => {
    let actionDesc = "AI is writing...";
    switch (actionId) {
      case "improve": actionDesc = "Improving text style..."; break;
      case "expand": actionDesc = "Expanding ideas..."; break;
      case "shorten": actionDesc = "Shortening paragraphs..."; break;
      case "rewrite": actionDesc = "Translating professionally..."; break;
      case "persuasive": actionDesc = "Adding persuasive hooks..."; break;
      case "bullets": actionDesc = "Summarizing to bullets..."; break;
      case "summary": actionDesc = "Drafting brief summary..."; break;
      case "cta": actionDesc = "Creating call-to-actions..."; break;
      case "casestudy": actionDesc = "Structuring case study..."; break;
    }

    setAiWritingStatus(actionDesc);

    setTimeout(() => {
      let rewrittenText = selectedText;
      switch (actionId) {
        case "improve":
          rewrittenText = `${selectedText} (polished for maximum engagement, clarity, and grammatical precision).`;
          break;
        case "expand":
          rewrittenText = `${selectedText} By diving deeper into these core parameters, we uncover primary drivers that affect long-term growth and outline actionable metrics to safeguard project success.`;
          break;
        case "shorten":
          rewrittenText = `${selectedText.substring(0, Math.floor(selectedText.length * 0.6))}... (concised by AI).`;
          break;
        case "rewrite":
          rewrittenText = `Professionally formulated: "Our primary objective is to execute strategic alignments across all operating segments to ensure maximum capital efficiency."`;
          break;
        case "persuasive":
          rewrittenText = `🔥 Don't let operational bloat limit your growth. Adopt this framework today and unlock a 50% increase in team velocity in under two weeks!`;
          break;
        case "bullets":
          rewrittenText = `• Focus on core metrics\n• Standardize user validation loops\n• Drive async alignment protocols`;
          break;
        case "summary":
          rewrittenText = `Summary: A highly structured approach prioritizing MVP feedback loops and async transparency.`;
          break;
        case "cta":
          rewrittenText = `🚀 Start building today: click the link to claim your free consulting toolkit!`;
          break;
        case "casestudy":
          rewrittenText = `📊 CHALLENGE: 70% planning lag. SOLUTION: Linear task boards. RESULT: Double shipping velocity in 30 days.`;
          break;
      }

      // Replace in active page content or block content
      if (activePage.type !== "cover" && activePage.type !== "toc" && activePage.blocks) {
        const updatedBlocks = activePage.blocks.map((b) => {
          if (b.type === "paragraph" && b.content?.includes(selectedText)) {
            return { ...b, content: b.content.replace(selectedText, rewrittenText) };
          }
          if (b.type === "quote" && b.content?.includes(selectedText)) {
            return { ...b, content: b.content.replace(selectedText, rewrittenText) };
          }
          return b;
        });
        handlePagePropertyChange("blocks", updatedBlocks);
      } else {
        // Fallback for cover subtitle or page content
        if (activePage.content && activePage.content.includes(selectedText)) {
          handlePagePropertyChange("content", activePage.content.replace(selectedText, rewrittenText));
        } else if (activePage.text && activePage.text.includes(selectedText)) {
          handlePagePropertyChange("text", activePage.text.replace(selectedText, rewrittenText));
        } else if (activePage.subtitle && activePage.subtitle.includes(selectedText)) {
          handlePagePropertyChange("subtitle", activePage.subtitle.replace(selectedText, rewrittenText));
        }
      }

      setAiWritingStatus(null);
    }, 1800);
  };

  // Export experience calculator
  const totalWordCount = useMemo(() => {
    let count = 0;
    editedEbook.pages.forEach((p) => {
      if (p.blocks) {
        p.blocks.forEach((b) => {
          if (b.content) count += b.content.split(/\s+/).length;
          if (b.title) count += b.title.split(/\s+/).length;
        });
      } else {
        if (p.content) count += p.content.split(/\s+/).length;
        if (p.text) count += p.text.split(/\s+/).length;
      }
    });
    return count;
  }, [editedEbook.pages]);

  const readingTimeMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(totalWordCount / 180));
  }, [totalWordCount]);

  const estimatedSize = useMemo(() => {
    const pageCount = editedEbook.pages.length;
    const baseSize = 0.8; 
    const pageMultiplier = 0.15; 
    return (baseSize + pageCount * pageMultiplier).toFixed(1);
  }, [editedEbook.pages.length]);

  const triggerExport = (type: string) => {
    // TODO: Restore export format check here later
    /*
    if (planId === "plan_free" && ["EPUB", "DOCX", "Kindle"].includes(type)) {
      setPaywallReason(`Exporting as ${type} is a Pro feature. Upgrade to Pro to compile print-ready EPUB, DOCX, and Kindle books.`);
      setPaywallOpen(true);
      return;
    }
    */

    setExportType(type);
    setExportProgress(10);
    setExportStatus("Analyzing page layouts...");

    const steps = [
      { progress: 35, status: "Compiling font family pairs..." },
      { progress: 65, status: "Optimizing vector block shapes..." },
      { progress: 85, status: "Embedding brand kit colors..." },
      { progress: 100, status: "Ebook compiled successfully!" },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setExportProgress(steps[currentStep].progress);
        setExportStatus(steps[currentStep].status);
        if (steps[currentStep].progress === 100) {
          try {
            localStorage.setItem("pagenest_checklist_export", "true");
          } catch {}
        }
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 800);
  };

  // Background style compiler
  const pageBgClasses = useMemo(() => {
    const theme = activePage.bgTheme || "default";
    switch (theme) {
      case "dark-slate":
        return "bg-slate-900 text-slate-100 border-slate-800";
      case "pure-black":
        return "bg-black text-white border-neutral-900";
      case "sage":
        return "bg-[#ECFDF5] text-[#14532D] border-emerald-100";
      case "beige":
        return "bg-[#F5F5DC] text-[#6B4F2A] border-amber-900/10";
      case "default":
      default:
        return "bg-[#0E131F] text-white border-white/5";
    }
  }, [activePage.bgTheme]);

  const pageFontClass = useMemo(() => {
    const font = activePage.fontFamily || editedEbook.brandKit?.fontFamily || "sans";
    switch (font) {
      case "serif": return "font-serif";
      case "mono": return "font-mono";
      case "sans":
      default:
        return "font-sans";
    }
  }, [activePage.fontFamily, editedEbook.brandKit]);

  // Close context menu
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#070B14] flex flex-col font-sans text-white select-none">
      
      {/* Top Bar Header */}
      <header className="h-16 border-b border-white/5 bg-[#0E131F]/90 px-6 flex items-center justify-between shrink-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-[10px] font-bold text-brand-muted hover:text-white border border-white/5 rounded-full px-4 py-2 hover:bg-white/5 transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedEbook.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="font-bold text-sm bg-transparent border-none outline-none focus:ring-1 focus:ring-brand-purple/40 px-2 py-1 rounded w-44 sm:w-60 text-white font-sans"
            />
            {editedEbook.brandKit?.logoUrl && (
              <img
                src={editedEbook.brandKit.logoUrl}
                alt="Brand Logo"
                className="h-5 w-auto object-contain rounded opacity-70"
              />
            )}
          </div>

          <span className="hidden sm:inline-flex text-[9px] text-brand-success font-bold px-2.5 py-1 rounded-full bg-brand-success/15 border border-brand-success/20 uppercase tracking-wide">
            ● Autosaved
          </span>
        </div>

        {/* Viewport Toggler */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 border border-white/5 rounded-full">
          {(["desktop", "tablet", "mobile"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDeviceMode(mode)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                deviceMode === mode ? "bg-brand-purple text-white shadow-md" : "text-brand-muted hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Action Buttons & Collaboration UI */}
        <div className="flex items-center gap-3">
          {/* Collaboration items: Shared, Comment counts, version triggers */}
          <div className="hidden lg:flex items-center gap-1.5 border-r border-white/5 pr-3 mr-1">
            <button
              onClick={() => alert("Invite link copied to clipboard!")}
              className="h-8 w-8 rounded-full border border-white/5 hover:bg-white/5 flex items-center justify-center text-xs text-brand-muted hover:text-white transition-all cursor-pointer"
              title="Share Ebook Workspace"
            >
              🔗
            </button>
            <button
              onClick={() => alert("No comments yet. Start adding comments to canvas blocks.")}
              className="h-8 w-8 rounded-full border border-white/5 hover:bg-white/5 flex items-center justify-center text-xs text-brand-muted hover:text-white transition-all cursor-pointer relative"
              title="Review Comments Feed"
            >
              💬
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-brand-purple rounded-full text-[7px] font-extrabold flex items-center justify-center text-white border border-brand-bg">
                3
              </span>
            </button>
            <button
              onClick={() => setIsVersionsDrawerOpen(true)}
              className="h-8 w-8 rounded-full border border-white/5 hover:bg-white/5 flex items-center justify-center text-xs text-brand-muted hover:text-white transition-all cursor-pointer"
              title="Version History"
            >
              ⏳
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="h-8 w-8 rounded-full border border-white/5 hover:bg-white/5 flex items-center justify-center text-sm disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="h-8 w-8 rounded-full border border-white/5 hover:bg-white/5 flex items-center justify-center text-sm disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              ↷
            </button>
          </div>

          {/* Export Toggler */}
          <div className="relative group">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsExportSheetOpen(true);
                }
              }}
              className="px-5 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] cursor-pointer flex items-center gap-1.5"
            >
              <span>Export</span>
              <span className="text-[8px]">▼</span>
            </button>
            <div className="absolute right-0 top-10 w-40 bg-[#0E131F]/95 backdrop-blur-md border border-white/10 rounded-2xl hidden lg:group-hover:block lg:hover:block p-1.5 shadow-2xl z-50 text-left">
              {["PDF", "EPUB", "DOCX", "Kindle"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => triggerExport(fmt)}
                  className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-brand-purple/20 text-white rounded-xl cursor-pointer transition-colors"
                >
                  Compile {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Core */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* LEFT COLUMN: Page Navigation Outlines */}
        <aside
          className={`${
            mobileTab === "pages" ? "flex" : "hidden lg:flex"
          } ${
            isSidebarCollapsed ? "w-16" : "w-64"
          } border-r border-white/5 bg-[#0E131F]/30 p-4 flex flex-col justify-between shrink-0 overflow-y-auto z-10 transition-all duration-300 relative`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              {!isSidebarCollapsed && (
                <h4 className="text-[9px] font-extrabold text-brand-muted uppercase tracking-widest">
                  Pages Layout
                </h4>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="text-xs text-brand-muted hover:text-white border border-white/5 rounded p-1 bg-white/5 cursor-pointer ml-auto"
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isSidebarCollapsed ? "→" : "←"}
              </button>
            </div>

            {/* Page Search Input */}
            {!isSidebarCollapsed && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={pageSearchQuery}
                  onChange={(e) => setPageSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-white/5 bg-white/5 text-xs text-white outline-none focus:border-brand-purple/50 font-sans"
                />
                {pageSearchQuery && (
                  <button
                    onClick={() => setPageSearchQuery("")}
                    className="absolute right-3 top-2.5 text-[9px] text-brand-muted hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Reorderable page list */}
            <Reorder.Group
              axis="y"
              values={editedEbook.pages}
              onReorder={handleReorder}
              className="flex flex-col gap-1.5"
            >
              {filteredPages.map(({ p, originalIdx }) => {
                const isActive = activePageIndex === originalIdx;
                return (
                  <Reorder.Item
                    key={p.id}
                    value={p}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        pageIndex: originalIdx,
                      });
                    }}
                    onClick={() => {
                      setActivePageIndex(originalIdx);
                      if (mobileTab === "pages") setMobileTab("preview");
                    }}
                    className={`group/item text-left rounded-[20px] border transition-all flex gap-3 items-center cursor-pointer select-none ${
                      isSidebarCollapsed ? "p-2 justify-center" : "p-2.5"
                    } ${
                      isActive
                        ? "bg-brand-purple/15 border-brand-purple text-white font-bold"
                        : "bg-white/[0.02] border-transparent text-brand-muted hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {/* Miniature Page Template Visual Preview */}
                    <div className={`h-11 w-8.5 rounded-[6px] shrink-0 flex flex-col justify-between p-1.5 border transition-all ${
                      isActive ? "border-brand-purple bg-[#070B14] shadow-md" : "border-white/5 bg-white/5"
                    }`}>
                      {p.type === "cover" ? (
                        <>
                          <div className="h-0.5 w-full bg-brand-purple rounded-full" />
                          <div className="h-2 w-full bg-white/15 rounded-full" />
                          <div className="h-0.5 w-full bg-white/10 rounded-full" />
                        </>
                      ) : p.type === "toc" ? (
                        <>
                          <div className="h-1 w-full bg-white/15 rounded-full" />
                          <div className="h-0.5 w-full bg-white/10 rounded-full" />
                          <div className="h-0.5 w-full bg-white/10 rounded-full" />
                          <div className="h-0.5 w-full bg-white/10 rounded-full" />
                        </>
                      ) : p.blocks?.some((b) => b.type === "image") || p.image ? (
                        <>
                          <div className="h-4.5 w-full bg-white/10 rounded flex items-center justify-center text-[5px]">🖼</div>
                          <div className="h-0.5 w-full bg-white/10 rounded-full" />
                        </>
                      ) : (
                        <>
                          <div className="h-1.5 w-full bg-white/15 rounded-full" />
                          <div className="h-0.5 w-full bg-white/10 rounded-full" />
                          <div className="h-0.5 w-full bg-white/10 rounded-full" />
                        </>
                      )}
                    </div>

                    {!isSidebarCollapsed && (
                      <div className="flex-grow overflow-hidden">
                        <p className="text-[8.5px] text-brand-muted uppercase font-extrabold tracking-wider leading-none mb-1">
                          {p.type === "cover" ? "📕 Cover" : p.type === "toc" ? "📖 Contents" : `📄 Page ${originalIdx + 1}`}
                        </p>
                        <p className="text-xs truncate text-white/90">
                          {p.type === "cover" ? "Cover Page" : p.type === "toc" ? "Table of Contents" : p.title || `Chapter Page`}
                        </p>
                      </div>
                    )}
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>

          {!isSidebarCollapsed && (
            <div className="mt-6 flex flex-col gap-2 shrink-0">
              <button
                onClick={handleAddPage}
                className="w-full py-3 border border-dashed border-white/10 hover:border-brand-purple/50 rounded-xl text-xs font-bold text-brand-muted hover:text-white transition-all cursor-pointer bg-white/[0.01] hover:bg-white/[0.03] uppercase tracking-widest"
              >
                + Add Page
              </button>
            </div>
          )}
        </aside>

        {/* CENTER COLUMN: Live Ebook Canvas */}
        <main
          className={`${
            mobileTab === "preview" ? "flex" : "hidden lg:flex"
          } flex-grow p-6 lg:p-10 flex flex-col justify-center items-center overflow-y-auto bg-[#070B14] z-0`}
        >
          {editedEbook.pages.length === 0 ? (
            /* EMPTY STATE SCREEN */
            <div className="text-center max-w-md p-8 border border-white/5 bg-[#0E131F]/40 backdrop-blur-md rounded-[20px] shadow-2xl flex flex-col items-center gap-5">
              <div className="text-5xl">📕</div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Start Building Your Ebook
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Add content pages manually, select templates, or prompt the Smart Design AI to build your entire ebook automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
                <button
                  onClick={() => setIsChapterModalOpen(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Generate With AI
                </button>
                <button
                  onClick={handleAddPage}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/5 hover:bg-white/5 text-white font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Start From Blank
                </button>
              </div>
            </div>
          ) : (
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
              {/* Ebook Spread Canvas */}
              <motion.div
                layout
                data-editable-canvas="true"
                className={`w-full aspect-[4/3] rounded-[20px] shadow-2xl p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${pageBgClasses} ${pageFontClass}`}
                style={{
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05)"
                }}
              >
                {/* Visual Glow Layer */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.04),transparent_60%)] pointer-events-none" />
                
                {/* Physical Book spine binder line */}
                <div className="absolute left-0 top-0 bottom-0 w-6.5 bg-gradient-to-r from-black/30 via-black/5 to-transparent border-r border-white/5 pointer-events-none z-20" />

                {/* AI improvement glow overlay */}
                {isImprovingDesign && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-brand-purple pointer-events-none z-30 animate-pulse border-4 border-brand-purple"
                  />
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePageIndex}
                    initial={{ opacity: 0, rotateY: 35, transformOrigin: "left center" }}
                    animate={{ opacity: 1, rotateY: 0, transformOrigin: "left center" }}
                    exit={{ opacity: 0, rotateY: -35, transformOrigin: "left center" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-grow flex flex-col justify-between relative z-10"
                  >
                    
                    {/* Page Header (Logo and Header Meta) */}
                    {activePage.type !== "cover" && (
                      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-2 opacity-65 text-[9px] uppercase tracking-wider font-semibold">
                        <div className="flex items-center gap-1.5">
                          {editedEbook.brandKit?.logoUrl && (
                            <img src={editedEbook.brandKit.logoUrl} alt="Logo" className="h-3 w-auto object-contain rounded" />
                          )}
                          <span className="text-brand-purple">
                            {activePage.type === "toc" ? "Contents Overview" : `Chapter ${activePage.chapterNum || activePageIndex}`}
                          </span>
                        </div>
                        <span className="font-mono text-brand-muted">
                          Section {activePageIndex + 1}
                        </span>
                      </div>
                    )}

                    {/* Page Body Renderer */}
                    <div className={`flex-grow overflow-y-auto pr-1 no-scrollbar my-auto ${activePage.paraSpacing}`}>
                      
                      {/* COVER PAGE LAYOUT */}
                      {activePage.type === "cover" && (
                        <div className="h-full flex flex-col justify-center items-center text-center gap-6 py-6 px-4 relative">
                          {activePage.image && (
                            <div className="absolute inset-0 opacity-15 overflow-hidden rounded-[16px] pointer-events-none">
                              <img src={activePage.image} className="w-full h-full object-cover filter blur-[2px]" alt="Cover graphic bg" />
                            </div>
                          )}
                          <div className="z-10 flex flex-col gap-4 items-center">
                            <span className="text-[10px] tracking-widest text-[#a78bfa] font-extrabold uppercase bg-brand-purple/10 border border-brand-purple/20 px-4 py-1.5 rounded-full">
                              {editedEbook.theme || "Modern"} Publication
                            </span>
                            <h1 className={`font-black uppercase tracking-tight text-white leading-tight ${
                              activePage.headingScale || "text-3xl"
                            }`} style={{ maxWidth: "85%" }}>
                              {activePage.title || editedEbook.title}
                            </h1>
                            <div className="h-0.5 w-16 bg-brand-purple" />
                            <p className="text-xs opacity-75 font-semibold text-brand-muted max-w-md leading-relaxed">
                              {activePage.subtitle || "Customize this subtitle descriptions directly inside the Cover Editor panel."}
                            </p>
                            <p className="text-[10px] font-bold text-white uppercase tracking-widest mt-4">
                              {activePage.author || `By ${editedEbook.author}`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* TABLE OF CONTENTS PAGE LAYOUT */}
                      {activePage.type === "toc" && (
                        <div className="flex flex-col gap-4 max-w-xl mx-auto py-2">
                          <h2 className={`font-black uppercase tracking-wider text-white border-b border-white/10 pb-2 ${activePage.headingScale || "text-2xl"}`}>
                            Table of Contents
                          </h2>
                          <div className="flex flex-col gap-3 mt-2">
                            {editedEbook.pages.map((p, idx) => {
                              if (p.type === "cover" || p.type === "toc") return null;
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => setActivePageIndex(idx)}
                                  className="flex justify-between items-center text-xs border-b border-dashed border-white/10 pb-1.5 hover:border-brand-purple/60 cursor-pointer group transition-colors"
                                >
                                  <span className="text-white/80 group-hover:text-white font-medium">
                                    {p.chapterNum ? `${p.chapterNum}. ` : ""}{p.title || `Chapter ${idx}`}
                                  </span>
                                  <span className="text-brand-purple font-mono font-bold">
                                    Page {idx + 1}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* VISUAL PAGE LAYOUT */}
                      {activePage.type === "visual" && (
                        <div className="h-full flex flex-col justify-between items-center text-center gap-4 py-4 px-6 relative">
                          <div className="flex-1 flex items-center justify-center w-full max-h-[35%] overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-md relative group/visual-img">
                            {uploadingBlockId === activePage.id || generatingBlockId === activePage.id ? (
                              <div className="h-24 w-full flex flex-col items-center justify-center gap-2">
                                <div className="h-5 w-5 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                                <span className="text-[8px] text-brand-muted animate-pulse uppercase tracking-wider font-bold">
                                  {uploadingBlockId === activePage.id ? "Uploading image..." : "AI Image is rendering..."}
                                </span>
                              </div>
                            ) : activePage.image || activePage.imageUrl ? (
                              <>
                                <img
                                  src={activePage.image || activePage.imageUrl}
                                  alt={activePage.caption}
                                  className="max-h-full max-w-full object-contain rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/visual-img:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
                                  <button
                                    onClick={() => handleMockUploadImage(activePage.id || "")}
                                    className="px-2.5 py-1 bg-white text-[#070B14] rounded-lg text-[8px] font-extrabold uppercase tracking-wider cursor-pointer"
                                  >
                                    Replace
                                  </button>
                                  <button
                                    onClick={() => {
                                      const prm = prompt("Enter image generation prompt:") || activePage.caption || "";
                                      handleGenerateBlockImage(activePage.id || "", prm);
                                    }}
                                    className="px-2.5 py-1 bg-brand-purple text-white rounded-lg text-[8px] font-extrabold uppercase tracking-wider cursor-pointer"
                                  >
                                    Regenerate
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="h-24 w-full border border-dashed border-white/10 rounded-lg flex items-center justify-center text-xs text-brand-muted">
                                No Image Content
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 w-full max-w-sm mt-1 justify-center shrink-0">
                            <button
                              onClick={() => {
                                handleMockUploadImage(activePage.id || "");
                              }}
                              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[8px] font-extrabold uppercase tracking-wider cursor-pointer border border-white/10 transition-colors"
                            >
                              Replace Image
                            </button>
                            <button
                              onClick={() => {
                                const prm = prompt("Enter image generation prompt:") || activePage.caption || "";
                                handleGenerateBlockImage(activePage.id || "", prm);
                              }}
                              className="px-2.5 py-1.5 bg-brand-purple text-white rounded-lg text-[8px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              AI Regenerate
                            </button>
                          </div>

                          <div className="flex-grow flex flex-col justify-center max-w-md w-full mt-2">
                            <textarea
                              value={activePage.caption || ""}
                              onChange={(e) => handlePagePropertyChange("caption", e.target.value)}
                              rows={3}
                              className="w-full text-center bg-transparent border-none outline-none text-xs lg:text-sm text-white/80 resize-none font-sans leading-relaxed focus:ring-1 focus:ring-brand-purple/40 rounded p-1.5"
                              placeholder="Insert visual caption description..."
                            />
                          </div>
                        </div>
                      )}

                      {/* CONTENT BLOCK RENDERING FLOW */}
                      {activePage.type !== "cover" && activePage.type !== "toc" && activePage.type !== "visual" && (
                        <div className={`w-full ${activePage.alignment}`}>
                          {(activePage.blocks || []).map((block) => (
                            <div
                              key={block.id}
                              className="group/block relative my-3 p-2 border border-transparent hover:border-brand-purple/20 hover:bg-brand-purple/[0.02] rounded-xl transition-all"
                            >
                              
                              {/* Drag & Quick Edit Controls overlay on hover */}
                              <div className="absolute right-2 top-2 opacity-0 group-hover/block:opacity-100 flex gap-1 transition-opacity z-30">
                                <button
                                  onClick={() => handleMoveBlock(block.id, "up")}
                                  className="h-5 w-5 bg-[#0E131F] border border-white/10 hover:bg-white/5 rounded flex items-center justify-center text-[9px] cursor-pointer"
                                  title="Move Up"
                                >
                                  ▲
                                </button>
                                <button
                                  onClick={() => handleMoveBlock(block.id, "down")}
                                  className="h-5 w-5 bg-[#0E131F] border border-white/10 hover:bg-white/5 rounded flex items-center justify-center text-[9px] cursor-pointer"
                                  title="Move Down"
                                >
                                  ▼
                                </button>
                                <button
                                  onClick={() => handleDeleteBlock(block.id)}
                                  className="h-5 w-5 bg-red-500/20 border border-red-500/30 hover:bg-red-500/40 rounded flex items-center justify-center text-[9px] text-red-300 cursor-pointer"
                                  title="Delete Block"
                                >
                                  ✕
                                </button>
                              </div>

                              {/* BLOCK SUBCOMPONENT RENDERING */}
                              
                              {/* HEADING BLOCK */}
                              {block.type === "heading" && (
                                <input
                                  type="text"
                                  value={block.title || ""}
                                  onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                  className={`w-full bg-transparent border-none outline-none font-extrabold text-white leading-tight ${
                                    activePage.headingScale || "text-2xl"
                                  }`}
                                  placeholder="Section Subheading..."
                                />
                              )}

                              {/* PARAGRAPH BLOCK */}
                              {block.type === "paragraph" && (
                                <textarea
                                  value={block.content || ""}
                                  onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                                  rows={Math.max(1, Math.ceil((block.content || "").length / 85))}
                                  className={`w-full bg-transparent border-none outline-none text-white/80 resize-none font-sans leading-relaxed ${
                                    activePage.bodyScale || "text-sm"
                                  }`}
                                  placeholder="Start writing chapter paragraphs..."
                                />
                              )}

                              {/* QUOTE BLOCK */}
                              {block.type === "quote" && (
                                <div className="border-l-3 border-brand-purple pl-4 italic my-2 py-0.5 bg-brand-purple/[0.01]">
                                  <textarea
                                    value={block.content || ""}
                                    onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                                    rows={Math.max(1, Math.ceil((block.content || "").length / 75))}
                                    className="w-full bg-transparent border-none outline-none text-white/90 resize-none font-sans text-xs lg:text-sm"
                                    placeholder="Insert important block quotation..."
                                  />
                                </div>
                              )}

                              {/* CHECKLIST BLOCK */}
                              {block.type === "checklist" && (
                                <div className="flex flex-col gap-2 my-1">
                                  {(block.items || []).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2.5">
                                      <input type="checkbox" className="rounded border-white/20 bg-white/5 text-brand-purple focus:ring-brand-purple h-3.5 w-3.5" />
                                      <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => {
                                          const items = [...(block.items || [])];
                                          items[idx] = e.target.value;
                                          handleUpdateBlock(block.id, { items });
                                        }}
                                        className="bg-transparent border-none outline-none text-xs text-white/80 focus:ring-1 focus:ring-brand-purple/40 rounded px-1.5 py-0.5 flex-1"
                                      />
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const items = [...(block.items || []), "New Checklist Item"];
                                      handleUpdateBlock(block.id, { items });
                                    }}
                                    className="text-left text-[9px] text-brand-purple hover:underline font-extrabold uppercase mt-1"
                                  >
                                    + Add Checklist Item
                                  </button>
                                </div>
                              )}

                              {/* BULLET LIST BLOCK */}
                              {block.type === "bullet_list" && (
                                <div className="flex flex-col gap-2 my-1">
                                  {(block.items || []).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <span className="text-brand-purple text-base leading-none">•</span>
                                      <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => {
                                          const items = [...(block.items || [])];
                                          items[idx] = e.target.value;
                                          handleUpdateBlock(block.id, { items });
                                        }}
                                        className="bg-transparent border-none outline-none text-xs text-white/80 focus:ring-1 focus:ring-brand-purple/40 rounded px-1.5 py-0.5 flex-1"
                                      />
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const items = [...(block.items || []), "New Bullet Point"];
                                      handleUpdateBlock(block.id, { items });
                                    }}
                                    className="text-left text-[9px] text-brand-purple hover:underline font-extrabold uppercase mt-1"
                                  >
                                    + Add Bullet Point
                                  </button>
                                </div>
                              )}

                              {/* IMAGE BLOCK */}
                              {block.type === "image" && (
                                <div className="flex flex-col gap-2.5 my-2 border border-white/5 bg-white/[0.01] p-3.5 rounded-2xl relative">
                                  {generatingBlockId === block.id || uploadingBlockId === block.id ? (
                                    <div className="aspect-video w-full rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-3">
                                      <div className="h-6 w-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                                      <span className="text-[10px] text-brand-muted animate-pulse uppercase tracking-wider font-bold">
                                        {uploadingBlockId === block.id ? "Uploading image file..." : "AI Image is rendering..."}
                                      </span>
                                    </div>
                                  ) : block.imageUrl ? (
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/35 group/img shadow-md">
                                      <img src={block.imageUrl} alt={block.caption} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-2.5 transition-opacity duration-300">
                                        <button
                                          onClick={() => handleMockUploadImage(block.id)}
                                          className="px-3.5 py-2 bg-white text-[#070B14] rounded-lg text-[9px] font-extrabold uppercase tracking-wider cursor-pointer"
                                        >
                                          Replace Image
                                        </button>
                                        <button
                                          onClick={() => handleGenerateBlockImage(block.id, block.imagePrompt || "Luxury business presentation")}
                                          className="px-3.5 py-2 bg-brand-purple text-white rounded-lg text-[9px] font-extrabold uppercase tracking-wider cursor-pointer"
                                        >
                                          AI Regenerate
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="aspect-video rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-brand-muted bg-white/[0.01]">
                                      No Image Content
                                    </div>
                                  )}

                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={block.imagePrompt || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { imagePrompt: e.target.value })}
                                      className="flex-grow px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[9px] text-white outline-none focus:border-brand-purple/50 font-sans"
                                      placeholder="AI Prompt (e.g. Luxury business conference stage)"
                                    />
                                    <button
                                      onClick={() => handleGenerateBlockImage(block.id, block.imagePrompt || "Luxury business presentation")}
                                      className="px-4 py-1.5 rounded-lg bg-brand-purple/20 hover:bg-brand-purple/35 text-brand-purple text-[9px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                      Generate
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* STATISTIC BLOCK */}
                              {block.type === "statistic" && (
                                <div className="my-2 p-4 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl flex items-center gap-4">
                                  <input
                                    type="text"
                                    value={block.statValue || ""}
                                    onChange={(e) => handleUpdateBlock(block.id, { statValue: e.target.value })}
                                    className="text-3xl font-black text-brand-purple bg-transparent border-none outline-none w-20 text-center"
                                    placeholder="90%"
                                  />
                                  <input
                                    type="text"
                                    value={block.statLabel || ""}
                                    onChange={(e) => handleUpdateBlock(block.id, { statLabel: e.target.value })}
                                    className="text-xs text-white/80 bg-transparent border-none outline-none flex-1 leading-relaxed"
                                    placeholder="Enter statistics details label..."
                                  />
                                </div>
                              )}

                              {/* CALLOUT BOX BLOCK */}
                              {block.type === "callout" && (
                                <div className="my-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-3 items-start">
                                  <span className="text-lg shrink-0">💡</span>
                                  <div className="flex flex-col gap-1 flex-grow">
                                    <input
                                      type="text"
                                      value={block.title || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                      className="font-bold text-[11px] text-white bg-transparent border-none outline-none"
                                      placeholder="Callout Header"
                                    />
                                    <textarea
                                      value={block.content || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                                      rows={2}
                                      className="text-xs text-brand-muted bg-transparent border-none outline-none resize-none"
                                      placeholder="Callout text details..."
                                    />
                                  </div>
                                </div>
                              )}

                              {/* COMPARISON TABLE */}
                              {block.type === "comparison_table" && (
                                <div className="my-3 overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.01]">
                                  <table className="w-full text-left text-[10px] lg:text-xs">
                                    <thead>
                                      <tr className="border-b border-white/10 bg-white/5">
                                        {(block.tableHeader || []).map((head, hIdx) => (
                                          <th key={hIdx} className="p-2.5">
                                            <input
                                              type="text"
                                              value={head}
                                              onChange={(e) => {
                                                const headers = [...(block.tableHeader || [])];
                                                headers[hIdx] = e.target.value;
                                                handleUpdateBlock(block.id, { tableHeader: headers });
                                              }}
                                              className="bg-transparent border-none outline-none font-extrabold text-white w-full"
                                            />
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(block.tableRows || []).map((row, rIdx) => (
                                        <tr key={rIdx} className="border-b border-white/5 hover:bg-white/[0.01]">
                                          {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="p-2.5">
                                              <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) => {
                                                  const rows = [...(block.tableRows || [])];
                                                  rows[rIdx] = [...rows[rIdx]];
                                                  rows[rIdx][cIdx] = e.target.value;
                                                  handleUpdateBlock(block.id, { tableRows: rows });
                                                }}
                                                className="bg-transparent border-none outline-none text-white/70 w-full"
                                              />
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {/* TESTIMONIAL BLOCK */}
                              {block.type === "testimonial" && (
                                <div className="my-3 p-4 border border-white/5 bg-[#0E131F]/30 backdrop-blur-md rounded-2xl flex flex-col gap-3">
                                  <textarea
                                    value={block.content || ""}
                                    onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                                    rows={2}
                                    className="italic text-xs text-white/95 bg-transparent border-none outline-none resize-none leading-relaxed"
                                    placeholder="Testimonial quote text..."
                                  />
                                  <div className="flex items-center gap-3">
                                    {block.authorImage && (
                                      <img src={block.authorImage} alt={block.authorName} className="h-8 w-8 rounded-full object-cover border border-white/10 shrink-0" />
                                    )}
                                    <div className="flex flex-col gap-0.5">
                                      <input
                                        type="text"
                                        value={block.authorName || ""}
                                        onChange={(e) => handleUpdateBlock(block.id, { authorName: e.target.value })}
                                        className="font-bold text-[10.5px] text-white bg-transparent border-none outline-none"
                                        placeholder="Client Name"
                                      />
                                      <input
                                        type="text"
                                        value={block.authorRole || ""}
                                        onChange={(e) => handleUpdateBlock(block.id, { authorRole: e.target.value })}
                                        className="text-[9px] text-brand-muted bg-transparent border-none outline-none"
                                        placeholder="VP of Growth"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* CASE STUDY BLOCK */}
                              {block.type === "case_study" && (
                                <div className="my-3 p-4.5 border border-brand-purple/20 bg-brand-purple/[0.02] rounded-2xl flex flex-col gap-3.5 text-left">
                                  <input
                                    type="text"
                                    value={block.title || ""}
                                    onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                    className="font-extrabold text-sm text-white bg-transparent border-none outline-none"
                                    placeholder="Case Study Header Title"
                                  />
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] text-brand-purple font-extrabold uppercase tracking-widest">Challenge</span>
                                      <textarea
                                        value={block.studyChallenge || ""}
                                        onChange={(e) => handleUpdateBlock(block.id, { studyChallenge: e.target.value })}
                                        rows={3}
                                        className="text-[10px] text-brand-muted bg-transparent border-none outline-none resize-none leading-relaxed"
                                        placeholder="Enter Challenge..."
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] text-brand-success font-extrabold uppercase tracking-widest">Solution</span>
                                      <textarea
                                        value={block.studySolution || ""}
                                        onChange={(e) => handleUpdateBlock(block.id, { studySolution: e.target.value })}
                                        rows={3}
                                        className="text-[10px] text-brand-muted bg-transparent border-none outline-none resize-none leading-relaxed"
                                        placeholder="Enter Solution..."
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] text-brand-purple font-extrabold uppercase tracking-widest">Result</span>
                                      <textarea
                                        value={block.studyResult || ""}
                                        onChange={(e) => handleUpdateBlock(block.id, { studyResult: e.target.value })}
                                        rows={3}
                                        className="text-[10px] text-brand-muted bg-transparent border-none outline-none resize-none leading-relaxed"
                                        placeholder="Enter Result..."
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* TIMELINE BLOCK */}
                              {block.type === "timeline" && (
                                <div className="my-3 flex flex-col gap-3 relative pl-3.5 border-l border-white/10">
                                  {(block.timelineItems || []).map((tItem, idx) => (
                                    <div key={idx} className="flex flex-col gap-0.5 relative">
                                      <div className="absolute -left-[19.5px] top-1.5 h-2 w-2 rounded-full bg-brand-purple border border-brand-bg shrink-0" />
                                      <div className="flex gap-2 items-center">
                                        <input
                                          type="text"
                                          value={tItem.date}
                                          onChange={(e) => {
                                            const items = [...(block.timelineItems || [])];
                                            items[idx] = { ...items[idx], date: e.target.value };
                                            handleUpdateBlock(block.id, { timelineItems: items });
                                          }}
                                          className="text-[9px] font-extrabold text-brand-purple bg-transparent border-none outline-none w-16"
                                        />
                                        <input
                                          type="text"
                                          value={tItem.title}
                                          onChange={(e) => {
                                            const items = [...(block.timelineItems || [])];
                                            items[idx] = { ...items[idx], title: e.target.value };
                                            handleUpdateBlock(block.id, { timelineItems: items });
                                          }}
                                          className="text-xs font-bold text-white bg-transparent border-none outline-none flex-grow"
                                        />
                                      </div>
                                      <textarea
                                        value={tItem.description}
                                        onChange={(e) => {
                                          const items = [...(block.timelineItems || [])];
                                          items[idx] = { ...items[idx], description: e.target.value };
                                          handleUpdateBlock(block.id, { timelineItems: items });
                                        }}
                                        rows={1}
                                        className="text-[10px] text-brand-muted bg-transparent border-none outline-none resize-none leading-relaxed pl-16"
                                      />
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const items = [...(block.timelineItems || []), { date: "New Date", title: "New Milestone", description: "Define timeline events details." }];
                                      handleUpdateBlock(block.id, { timelineItems: items });
                                    }}
                                    className="text-left text-[9px] text-brand-purple hover:underline font-extrabold uppercase mt-1"
                                  >
                                    + Add Timeline Event
                                  </button>
                                </div>
                              )}

                              {/* FAQ BLOCK */}
                              {block.type === "faq" && (
                                <div className="my-2.5 flex flex-col gap-2">
                                  {(block.faqItems || []).map((faq, idx) => (
                                    <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col gap-1 text-left">
                                      <div className="flex gap-2 items-center">
                                        <span className="text-[10px] font-extrabold text-brand-purple">Q:</span>
                                        <input
                                          type="text"
                                          value={faq.question}
                                          onChange={(e) => {
                                            const items = [...(block.faqItems || [])];
                                            items[idx] = { ...items[idx], question: e.target.value };
                                            handleUpdateBlock(block.id, { faqItems: items });
                                          }}
                                          className="text-xs font-bold text-white bg-transparent border-none outline-none flex-grow"
                                        />
                                      </div>
                                      <div className="flex gap-2 items-start mt-0.5">
                                        <span className="text-[10px] font-extrabold text-brand-success">A:</span>
                                        <textarea
                                          value={faq.answer}
                                          onChange={(e) => {
                                            const items = [...(block.faqItems || [])];
                                            items[idx] = { ...items[idx], answer: e.target.value };
                                            handleUpdateBlock(block.id, { faqItems: items });
                                          }}
                                          rows={2}
                                          className="text-[10.5px] text-brand-muted bg-transparent border-none outline-none resize-none leading-relaxed flex-grow"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const items = [...(block.faqItems || []), { question: "What is your return policy?", answer: "We offer full digital licenses which remain fully customizable globally." }];
                                      handleUpdateBlock(block.id, { faqItems: items });
                                    }}
                                    className="text-left text-[9px] text-brand-purple hover:underline font-extrabold uppercase mt-1"
                                  >
                                    + Add FAQ Entry
                                  </button>
                                </div>
                              )}

                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Page Footer (Number and Pagination outline) */}
                    <div className="flex justify-between items-center border-t border-white/10 pt-4 text-[9px] uppercase tracking-widest opacity-60 shrink-0 font-sans mt-3">
                      <span className="font-bold text-brand-purple">PageNest Publishing Experience</span>
                      <span>Page {activePageIndex + 1} of {editedEbook.pages.length}</span>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </main>

        {/* RIGHT COLUMN: Design Controls Switcher */}
        <aside
          className={`${
            mobileTab === "edit" ? "flex" : "hidden lg:flex"
          } w-80 border-l border-white/5 bg-[#0E131F]/30 p-5 flex flex-col justify-between shrink-0 overflow-y-auto z-10`}
        >
          <div className="flex flex-col gap-5">
            
            {/* Control Panel Tab Switcher */}
            <div className="grid grid-cols-4 border-b border-white/5 pb-1 gap-1">
              {(["blocks", "properties", "design", "brand"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    // TODO: Restore Brand Kit premium tier check here later
                    /*
                    if (tab === "brand" && planId !== "plan_agency") {
                      setPaywallReason("Custom Brand Kits are exclusive to the Agency tier. Upgrade to Agency to configure custom logos, colors, and global font pairings.");
                      setPaywallOpen(true);
                      return;
                    }
                    */
                    setRightPanelTab(tab);
                  }}
                  className={`pb-2.5 text-[8.5px] font-extrabold tracking-wider uppercase transition-colors cursor-pointer border-b-2 text-center truncate ${
                    rightPanelTab === tab ? "border-brand-purple text-white font-black" : "border-transparent text-brand-muted hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Content Blocks Selector */}
            {rightPanelTab === "blocks" && (
              <ContentBlocks onAddBlock={handleAddBlock} />
            )}

            {/* TAB CONTENT: Properties / Cover Editor */}
            {rightPanelTab === "properties" && (
              activePage.type === "cover" ? (
                <CoverEditorPanel page={activePage} ebook={editedEbook} onChange={handlePagePropertyChange} />
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-wider">
                      PAGE METADATA
                    </span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Active Page Options
                    </h4>
                  </div>
                  
                  <div className="h-px bg-white/5" />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                      Page Layout Template
                    </label>
                    <select
                      value={activePage.type}
                      onChange={(e) => handlePagePropertyChange("type", e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs cursor-pointer"
                    >
                      <option value="chapter" className="bg-[#0E131F]">Chapter Content</option>
                      <option value="toc" className="bg-[#0E131F]">Contents Listing</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                      Chapter Number
                    </label>
                    <input
                      type="text"
                      value={activePage.chapterNum || ""}
                      onChange={(e) => handlePagePropertyChange("chapterNum", e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs font-sans"
                      placeholder="e.g. Chapter 01"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                      Chapter Title Header
                    </label>
                    <input
                      type="text"
                      value={activePage.title || ""}
                      onChange={(e) => handlePagePropertyChange("title", e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs font-sans"
                      placeholder="Page Header Name"
                    />
                  </div>
                </div>
              )
            )}

            {/* TAB CONTENT: Typography & Layout Scales */}
            {rightPanelTab === "design" && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-wider">
                    TYPOGRAPHY & THEMES
                  </span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Fine-tune Page Grid
                  </h4>
                </div>

                <div className="h-px bg-white/5" />

                {/* Font Heading scale */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                    Heading Text Size
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(["text-xl", "text-2xl", "text-3xl", "text-4xl"] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => handlePagePropertyChange("headingScale", sz)}
                        className={`py-2 text-[9px] font-bold border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-colors ${
                          (activePage.headingScale || "text-2xl") === sz
                            ? "bg-brand-purple/20 border-brand-purple text-white"
                            : "bg-white/5 border-white/5 text-brand-muted hover:text-white"
                        }`}
                      >
                        {sz.split("-")[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Text scale */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                    Body Copy Size
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["text-xs", "text-sm", "text-base"] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => handlePagePropertyChange("bodyScale", sz)}
                        className={`py-2 text-[9px] font-bold border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-colors ${
                          (activePage.bodyScale || "text-sm") === sz
                            ? "bg-brand-purple/20 border-brand-purple text-white"
                            : "bg-white/5 border-white/5 text-brand-muted hover:text-white"
                        }`}
                      >
                        {sz.split("-")[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line heights */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                    Line Height (Leading)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["leading-snug", "leading-normal", "leading-relaxed", "leading-loose"] as const).map((lh) => (
                      <button
                        key={lh}
                        onClick={() => handlePagePropertyChange("lineHeight", lh)}
                        className={`py-2 text-[9.5px] font-bold border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-colors ${
                          (activePage.lineHeight || "leading-relaxed") === lh
                            ? "bg-brand-purple/20 border-brand-purple text-white"
                            : "bg-white/5 border-white/5 text-brand-muted hover:text-white"
                        }`}
                      >
                        {lh.split("-")[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing vertical gaps */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                    Paragraph Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["space-y-2", "space-y-4", "space-y-6"] as const).map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handlePagePropertyChange("paraSpacing", sp)}
                        className={`py-2 text-[9.5px] font-bold border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-colors ${
                          (activePage.paraSpacing || "space-y-4") === sp
                            ? "bg-brand-purple/20 border-brand-purple text-white"
                            : "bg-white/5 border-white/5 text-brand-muted hover:text-white"
                        }`}
                      >
                        {sp.split("-")[2] === "2" ? "Tight" : sp.split("-")[2] === "4" ? "Medium" : "Spacious"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alignments */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                    Text Alignment
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(["text-left", "text-center", "text-right", "text-justify"] as const).map((al) => (
                      <button
                        key={al}
                        onClick={() => handlePagePropertyChange("alignment", al)}
                        className={`py-2 text-[9px] font-bold border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-colors ${
                          (activePage.alignment || "text-left") === al
                            ? "bg-brand-purple/20 border-brand-purple text-white"
                            : "bg-white/5 border-white/5 text-brand-muted hover:text-white"
                        }`}
                      >
                        {al.split("-")[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Background Theme Presets */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                    Page Theme Colors
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "default", label: "Obsidian", from: "#0E131F" },
                      { key: "dark-slate", label: "Dark Slate", from: "#0F172A" },
                      { key: "pure-black", label: "Pure Black", from: "#000000" },
                      { key: "sage", label: "Pale Sage", from: "#ECFDF5" },
                      { key: "beige", label: "Warm Beige", from: "#F5F5DC" },
                    ].map((c) => (
                      <button
                        key={c.key}
                        onClick={() => handlePagePropertyChange("bgTheme", c.key)}
                        className={`p-2 rounded-xl text-[10px] font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                          (activePage.bgTheme || "default") === c.key
                            ? "bg-brand-purple/20 border-brand-purple text-white"
                            : "bg-white/5 border-white/5 text-brand-muted hover:text-white"
                        }`}
                      >
                        <span>{c.label}</span>
                        <div className="h-3.5 w-3.5 rounded border border-white/10" style={{ backgroundColor: c.from }} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: Brand Kit presets */}
            {rightPanelTab === "brand" && (
              <BrandKitPanel
                initialBrandKit={editedEbook.brandKit}
                onApply={handleApplyBrandKit}
              />
            )}

          </div>

          {/* Bottom Sidebar Action buttons */}
          <div className="border-t border-white/5 pt-4 flex flex-col gap-2 mt-6">
            
            {/* Smart Design AI Button */}
            <button
              onClick={() => {
                /*
                if (planId === "plan_free") {
                  setPaywallReason("Smart Design AI is a Pro feature. Upgrade to Pro to instantly balance margins, contrast grids, and typography structures.");
                  setPaywallOpen(true);
                  return;
                }
                */
                handleImproveDesign();
              }}
              disabled={isImprovingDesign}
              className="w-full py-3 rounded-xl bg-brand-purple/15 border border-brand-purple/35 text-white font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{isImprovingDesign ? "⚙ Refining..." : "✨ Smart Design AI"}</span>
            </button>

            {/* Chapter Generator Trigger */}
            <button
              onClick={() => {
                /*
                if (planId === "plan_free") {
                  setPaywallReason("The AI Chapter Generator is a Pro feature. Upgrade to Pro to outline, research, and draft new chapters with AI.");
                  setPaywallOpen(true);
                  return;
                }
                */
                setIsChapterModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Add New Chapter
            </button>

            {/* Legacy Duplicate/Delete */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDuplicatePage()}
                className="flex-grow py-2.5 text-[9px] uppercase font-bold tracking-wider border border-white/5 hover:bg-white/5 rounded-xl cursor-pointer"
              >
                Duplicate Page
              </button>
              <button
                onClick={() => handleDeletePage()}
                disabled={editedEbook.pages.length <= 1}
                className="flex-grow py-2.5 text-[9px] uppercase font-bold tracking-wider border border-white/5 hover:bg-white/5 rounded-xl disabled:opacity-30 cursor-pointer"
              >
                Delete Page
              </button>
            </div>
          </div>
        </aside>

      </div>

      {/* FLOAT AI BAR DETECTOR */}
      <FloatingAiToolbar onAiAction={handleAiWritingAction} />

      {/* CONTEXT MENU OVERLAY */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 bg-[#0E131F] border border-white/10 p-1.5 rounded-2xl shadow-2xl w-44 text-left font-sans text-xs flex flex-col gap-0.5"
        >
          <button
            onClick={() => handleDuplicatePage(contextMenu.pageIndex)}
            className="w-full text-left px-3 py-2 hover:bg-white/5 text-white rounded-lg cursor-pointer"
          >
            📋 Duplicate Page
          </button>
          <button
            onClick={() => handleMovePage("up", contextMenu.pageIndex)}
            disabled={contextMenu.pageIndex === 0}
            className="w-full text-left px-3 py-2 hover:bg-white/5 text-white rounded-lg disabled:opacity-30 cursor-pointer"
          >
            ▲ Move Page Up
          </button>
          <button
            onClick={() => handleMovePage("down", contextMenu.pageIndex)}
            disabled={contextMenu.pageIndex === editedEbook.pages.length - 1}
            className="w-full text-left px-3 py-2 hover:bg-white/5 text-white rounded-lg disabled:opacity-30 cursor-pointer"
          >
            ▼ Move Page Down
          </button>
          <div className="h-px bg-white/5 my-1" />
          <button
            onClick={() => {
              // Mock regenerate page layout
              const updated = [...editedEbook.pages];
              const p = updated[contextMenu.pageIndex];
              updated[contextMenu.pageIndex] = {
                ...p,
                blocks: [
                  { id: `block-heading-${Date.now()}`, type: "heading", title: p.title || "Regenerated Heading Section" },
                  { id: `block-para-${Date.now()}`, type: "paragraph", content: "This section was fully optimized and rewritten by Smart Design AI." }
                ]
              };
              const book = { ...editedEbook, pages: updated };
              setEditedEbook(book);
              updateHistory(book);
              onSave(book);
              alert("Section layout regenerated successfully!");
            }}
            className="w-full text-left px-3 py-2 hover:bg-brand-purple/20 text-brand-purple rounded-lg cursor-pointer font-bold"
          >
            ✨ Regenerate Section
          </button>
          <div className="h-px bg-white/5 my-1" />
          <button
            onClick={() => handleDeletePage(contextMenu.pageIndex)}
            disabled={editedEbook.pages.length <= 1}
            className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-400 rounded-lg disabled:opacity-30 cursor-pointer"
          >
            ✕ Delete Page
          </button>
        </div>
      )}

      {/* VERSION HISTORY DRAWER */}
      <AnimatePresence>
        {isVersionsDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVersionsDrawerOpen(false)}
              className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-80 h-full bg-[#0E131F]/95 backdrop-blur-md border-l border-white/5 p-6 flex flex-col gap-6 relative z-10"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-brand-purple font-extrabold uppercase tracking-wider">BACKUPS</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Version History</h3>
                </div>
                <button
                  onClick={() => setIsVersionsDrawerOpen(false)}
                  className="text-xs text-brand-muted hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="h-px bg-white/5" />

              <div className="flex-grow flex flex-col gap-3.5 overflow-y-auto no-scrollbar">
                {[
                  { name: "Published Version", time: "Active Now", badge: "Live", index: historyIndex },
                  { name: "Draft 3: Spacing Polish", time: "2 hours ago by John", index: Math.max(0, historyIndex - 1) },
                  { name: "Draft 2: Color Palette Applied", time: "5 hours ago by John", index: Math.max(0, historyIndex - 2) },
                  { name: "Draft 1: Initial AI Draft", time: "Yesterday by AI", index: 0 }
                ].map((ver, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-2.5 text-left"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11.5px] font-bold text-white">{ver.name}</span>
                      {ver.badge && (
                        <span className="text-[8px] bg-brand-purple/20 border border-brand-purple/35 text-brand-purple font-bold px-1.5 py-0.5 rounded uppercase">
                          {ver.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-brand-muted">{ver.time}</span>
                    <button
                      onClick={() => {
                        if (history[ver.index]) {
                          setEditedEbook({ ...history[ver.index] });
                          setHistoryIndex(ver.index);
                          onSave(history[ver.index]);
                          setIsVersionsDrawerOpen(false);
                          alert(`Restored snapshot: ${ver.name}`);
                        } else {
                          alert("No historical records found for this preview mock version.");
                        }
                      }}
                      className="w-full py-1.5 rounded-lg bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple text-[9px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Restore Version
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI DESIGN / WRITING LOADER OVERLAY */}
      <AnimatePresence>
        {(isImprovingDesign || aiWritingStatus) && (
          <div className="fixed inset-0 bg-[#070B14]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xs bg-[#0E131F] border border-white/5 p-6 rounded-[20px] shadow-2xl text-center flex flex-col gap-4 items-center"
            >
              <div className="h-10 w-10 border-3 border-brand-purple border-t-transparent rounded-full animate-spin" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-widest animate-pulse">
                  PageNest AI
                </span>
                <p className="text-xs text-white/90 font-bold uppercase tracking-wider">
                  {isImprovingDesign ? designAiStatus : aiWritingStatus}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHAPTER GENERATOR PROMPT MODAL */}
      <AnimatePresence>
        {isChapterModalOpen && (
          <div className="fixed inset-0 bg-[#070B14]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0E131F] border border-white/5 p-6 rounded-[20px] shadow-2xl flex flex-col gap-5 text-left"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-brand-purple font-extrabold uppercase tracking-wider">GENERATOR</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Generate New Chapter</h3>
                </div>
                <button
                  onClick={() => setIsChapterModalOpen(false)}
                  className="text-xs text-brand-muted hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="h-px bg-white/5" />

              {chapterGenerating ? (
                <div className="py-8 flex flex-col items-center justify-center gap-4 w-full">
                  <div className="h-10 w-10 border-3 border-brand-purple border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-brand-muted animate-pulse font-extrabold uppercase tracking-widest">
                    {chapterGenStep}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                      What should this chapter cover?
                    </label>
                    <input
                      type="text"
                      value={chapterPrompt}
                      onChange={(e) => setChapterPrompt(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-xs text-white outline-none focus:border-brand-purple/50 font-sans"
                      placeholder="e.g. The Psychology of Persuasion & Influence"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      onClick={() => setIsChapterModalOpen(false)}
                      className="px-4 py-2 text-[10px] text-brand-muted hover:text-white uppercase tracking-wider font-extrabold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateChapter}
                      disabled={!chapterPrompt.trim()}
                      className="px-5 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purple/90 disabled:opacity-40 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md cursor-pointer transition-all"
                    >
                      Generate Chapter
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXPORT FILE STATUS COMPILING MODAL */}
      <AnimatePresence>
        {exportType && (
          <div className="fixed inset-0 bg-[#070B14]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0E131F] border border-white/5 p-6 rounded-[20px] shadow-2xl text-center flex flex-col gap-5"
            >
              <div>
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-purple bg-brand-purple/10 px-3 py-1.5 rounded border border-brand-purple/20">
                  Export Document Compiler
                </span>
                <h3 className="text-base font-bold text-white mt-4 uppercase tracking-wider">
                  Compiling {exportType} File
                </h3>
              </div>

              <div className="flex flex-col gap-2 text-left my-2">
                <div className="flex justify-between items-center text-[9px] text-brand-muted font-bold font-sans uppercase tracking-wider">
                  <span>{exportStatus}</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-brand-purple transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>

              {exportProgress === 100 ? (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-xs text-brand-success font-bold bg-brand-success/10 border border-brand-success/20 py-3 rounded-xl flex flex-col gap-0.5">
                    <span>✓ Compilation Completed</span>
                    <span className="text-[9.5px] text-brand-muted font-normal lowercase">
                      pages: {editedEbook.pages.length} &middot; size: {estimatedSize} MB &middot; read time: {readingTimeMinutes} mins
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Downloading: ${editedEbook.title.replace(/\s+/g, "_").toLowerCase()}.${exportType.toLowerCase()}`);
                      setExportType(null);
                    }}
                    className="w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#10B981]/90 text-[#070B14] font-bold text-[10px] uppercase tracking-widest shadow-md cursor-pointer mt-2"
                  >
                    Download Compiled File
                  </button>
                  <button
                    onClick={() => setExportType(null)}
                    className="w-full py-2 text-[10px] text-brand-muted hover:text-white uppercase tracking-wider font-bold"
                  >
                    Close Compiler
                  </button>
                </div>
              ) : (
                <p className="text-[9px] text-brand-muted animate-pulse font-sans uppercase tracking-wider font-semibold">
                  Packing vectors and optimizing document sizes...
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden h-14 border-t border-white/5 bg-[#0E131F] px-6 flex items-center justify-around z-30 shrink-0">
        <button
          onClick={() => setMobileTab("pages")}
          className={`flex flex-col items-center text-[9px] font-bold uppercase tracking-wider ${
            mobileTab === "pages" ? "text-brand-purple" : "text-brand-muted"
          }`}
        >
          <span className="text-base mb-0.5">📁</span>
          <span>Outlines</span>
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex flex-col items-center text-[9px] font-bold uppercase tracking-wider ${
            mobileTab === "preview" ? "text-brand-purple" : "text-brand-muted"
          }`}
        >
          <span className="text-base mb-0.5">👁</span>
          <span>Preview</span>
        </button>
        <button
          onClick={() => setMobileTab("edit")}
          className={`flex flex-col items-center text-[9px] font-bold uppercase tracking-wider ${
            mobileTab === "edit" ? "text-brand-purple" : "text-brand-muted"
          }`}
        >
          <span className="text-base mb-0.5">✍</span>
          <span>Customize</span>
        </button>
      </div>

      {/* Mobile Sticky Floating Action Bar for Preview tab */}
      {mobileTab === "preview" && (
        <div className="lg:hidden fixed bottom-20 right-6 z-40 flex flex-col gap-3">
          <button
            onClick={() => onSave(editedEbook)}
            className="h-12 w-12 rounded-full bg-[#0E131F] border border-white/10 flex items-center justify-center text-white shadow-2xl hover:bg-white/5 cursor-pointer text-base"
            title="Save changes"
          >
            💾
          </button>
          <button
            onClick={() => setIsExportSheetOpen(true)}
            className="h-12 w-12 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)] cursor-pointer text-base"
            title="Export Ebook"
          >
            📤
          </button>
        </div>
      )}

      {/* Mobile Export Bottom Sheet Modal */}
      <AnimatePresence>
        {isExportSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportSheetOpen(false)}
              className="fixed inset-0 z-50 bg-[#070B14]/80 backdrop-blur-md lg:hidden"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E131F] border-t border-white/10 rounded-t-[24px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,16px))] lg:hidden flex flex-col gap-4 font-sans text-white"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-2" />
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Export Publication</h3>
                <button
                  onClick={() => setIsExportSheetOpen(false)}
                  className="text-2xl p-1 text-brand-muted hover:text-white"
                >
                  &times;
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {["PDF", "EPUB", "DOCX"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setIsExportSheetOpen(false);
                      triggerExport(fmt);
                    }}
                    className="w-full flex items-center justify-between py-4 px-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all text-left"
                  >
                    <span className="font-bold text-xs uppercase tracking-wider">Compile {fmt} File</span>
                    <span className="text-[10px] text-brand-purple font-bold">Standard format &rarr;</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        reason={paywallReason}
      />

    </div>
  );
}

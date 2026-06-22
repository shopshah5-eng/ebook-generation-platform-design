"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingAiToolbarProps {
  onAiAction: (action: string, text: string) => void;
}

export default function FloatingAiToolbar({ onAiAction }: FloatingAiToolbarProps) {
  const [selectionText, setSelectionText] = useState("");
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setIsOpen(false);
        return;
      }

      const text = selection.toString().trim();
      if (!text || text.length < 3) {
        setIsOpen(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();
      if (rects.length === 0) return;

      // Find selection within an editable block to prevent AI popup on UI text
      let container: Node | null = range.commonAncestorContainer;
      if (container && container.nodeType === Node.TEXT_NODE) {
        container = container.parentNode;
      }
      if (!container || !(container instanceof Element) || !container.closest("[data-editable-canvas]")) {
        setIsOpen(false);
        return;
      }

      const rect = rects[0];
      setSelectionText(text);
      setCoords({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top - 50 + window.scrollY,
      });
      setIsOpen(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // If clicking inside the menu, do not close or clear
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const actions = [
    { id: "improve", label: "Improve Writing", icon: "✨" },
    { id: "expand", label: "Expand Section", icon: "✍️" },
    { id: "shorten", label: "Shorten Text", icon: "✂️" },
    { id: "rewrite", label: "Rewrite Professionally", icon: "💼" },
    { id: "persuasive", label: "Make More Persuasive", icon: "🔥" },
    { id: "bullets", label: "Generate Bullet Points", icon: "📋" },
    { id: "summary", label: "Generate Summary", icon: "📝" },
    { id: "cta", label: "Generate Call-To-Action", icon: "🚀" },
    { id: "casestudy", label: "Generate Case Study", icon: "📊" },
  ];

  if (!isOpen || !coords) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          transform: "translateX(-50%)",
        }}
        className="absolute z-50 flex items-center bg-[#0E131F]/95 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md rounded-[16px] p-1.5 overflow-x-auto max-w-[90vw] no-scrollbar scroll-smooth gap-1"
      >
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-brand-purple font-extrabold uppercase px-2 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-md shrink-0 flex items-center gap-1 select-none">
            <span>✨</span> AI Write
          </span>
          <div className="h-4 w-px bg-white/10 shrink-0" />
          {actions.map((act) => (
            <button
              key={act.id}
              onClick={() => {
                onAiAction(act.id, selectionText);
                setIsOpen(false);
                // Clear selection
                window.getSelection()?.removeAllRanges();
              }}
              className="px-2.5 py-1.5 hover:bg-brand-purple/20 text-white font-medium hover:text-white rounded-lg text-[10.5px] whitespace-nowrap transition-all flex items-center gap-1 hover:scale-105 shrink-0 cursor-pointer"
            >
              <span>{act.icon}</span>
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

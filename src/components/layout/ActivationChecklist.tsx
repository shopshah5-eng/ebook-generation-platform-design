"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ActivationChecklist() {
  const [isOpen, setIsOpen] = useState(true);
  
  // Checklist states
  const [created, setCreated] = useState(false);
  const [edited, setEdited] = useState(false);
  const [exported, setExported] = useState(false);
  const [explored, setExplored] = useState(false);

  useEffect(() => {
    const updateChecklist = () => {
      try {
        setCreated(localStorage.getItem("pagenest_checklist_create") === "true");
        setEdited(localStorage.getItem("pagenest_checklist_edit") === "true");
        setExported(localStorage.getItem("pagenest_checklist_export") === "true");
        setExplored(localStorage.getItem("pagenest_checklist_templates") === "true");
      } catch {}
    };

    updateChecklist();
    // Listen for localstorage updates
    window.addEventListener("storage", updateChecklist);
    
    // Polling interval to check checklist updates inside the single page application
    const checkInterval = setInterval(updateChecklist, 1000);

    return () => {
      window.removeEventListener("storage", updateChecklist);
      clearInterval(checkInterval);
    };
  }, []);

  const items = [
    { label: "Create Ebook", isDone: created, desc: "Generate your first AI template" },
    { label: "Edit A Page", isDone: edited, desc: "Modify blocks in editor workspace" },
    { label: "Export PDF", isDone: exported, desc: "Compile ebook to vector format" },
    { label: "Explore Templates", isDone: explored, desc: "Browse pre-designed styles gallery" },
  ];

  const completedCount = items.filter((i) => i.isDone).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  // If checklist is 100% completed, we can show a gorgeous congratulations banner or hide it after completion
  if (completedCount === items.length) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40 max-w-xs w-72 bg-[#0E131F] border border-brand-success/30 p-4.5 rounded-[20px] shadow-2xl flex flex-col gap-3 backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-brand-success font-black uppercase tracking-widest bg-brand-success/15 border border-brand-success/20 px-2.5 py-0.5 rounded-full">
                🎉 Onboarding Complete
              </span>
              <button onClick={() => setIsOpen(false)} className="text-brand-muted hover:text-white text-xs">
                ✕
              </button>
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">All Milestones Unlocked!</h4>
              <p className="text-[10px] text-brand-muted mt-1 leading-normal">
                You've successfully mastered the PageNest publishing core flows. Ready to scale your audience!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-72 bg-[#0E131F]/95 backdrop-blur-md border border-white/5 p-4 rounded-[20px] shadow-2xl flex flex-col gap-3 text-left"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] text-brand-purple font-extrabold uppercase tracking-widest">ONBOARDING</span>
                <h4 className="text-[10.5px] font-bold text-white uppercase tracking-wider">Activation Checklist</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[9px] font-bold text-brand-muted hover:text-white border border-white/5 px-2 py-1 rounded bg-white/5 cursor-pointer uppercase tracking-wider"
              >
                Hide
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[8.5px] text-brand-muted font-bold uppercase tracking-wider">
                <span>Milestone Progress</span>
                <span className="text-white">{progressPercent}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-brand-purple transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Checklist items */}
            <div className="flex flex-col gap-2.5">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <span className={`h-4.5 w-4.5 rounded-full border text-[8px] font-extrabold flex items-center justify-center shrink-0 ${
                    item.isDone
                      ? "bg-brand-success text-[#070B14] border-brand-success"
                      : "bg-white/5 border-white/5 text-brand-muted"
                  }`}>
                    {item.isDone ? "✓" : idx + 1}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-[10.5px] font-bold tracking-wide leading-none ${item.isDone ? "text-white/60 line-through" : "text-white"}`}>
                      {item.label}
                    </span>
                    <span className="text-[8px] text-brand-muted leading-none">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Mini Collapsed Button */
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsOpen(true)}
            className="h-10 w-10 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center justify-center text-sm shadow-xl shadow-brand-purple/20 cursor-pointer border border-brand-purple/35"
            title="Open Onboarding Checklist"
          >
            📋
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

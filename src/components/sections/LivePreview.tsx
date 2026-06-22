"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";

export function LivePreview() {
  const [currentPage, setCurrentPage] = useState(0);

  const samplePages = [
    {
      type: "cover",
      title: "The Art of Persuasion",
      subtitle: "Volume I • Edition II",
      author: "ALEX MORGAN",
      bg: "#111827",
      color: "#F9FAFB",
    },
    {
      type: "toc",
      title: "Table of Contents",
      chapters: [
        { name: "Chapter 1: The Foundation of Influence", page: "04" },
        { name: "Chapter 2: Rhetoric & Resonance", page: "12" },
        { name: "Chapter 3: Cognitive Biases in Action", page: "24" },
        { name: "Chapter 4: The Art of Storytelling", page: "36" },
      ],
      bg: "#FAF7F2",
      color: "#111827",
    },
    {
      type: "chapter",
      chapterNum: "01",
      title: "The Foundation of Influence",
      content: "Persuasion is not manipulation; it is the alignment of shared goals. To influence another is to show them how your proposal serves their existing desires. All human interaction hinges on trust, and trust is built through consistency and genuine resonance.",
      bg: "#FAF7F2",
      color: "#111827",
    },
    {
      type: "quote",
      quote: "The single biggest problem in communication is the illusion that it has taken place.",
      author: "George Bernard Shaw",
      bg: "#FAF7F2",
      color: "#111827",
    },
  ];

  const nextSpread = () => {
    if (currentPage < samplePages.length - 2) {
      setCurrentPage((p) => p + 2);
    }
  };

  const prevSpread = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 2);
    }
  };

  return (
    <section id="studio" className="py-24 bg-brand-white px-6 lg:px-16 border-b border-brand-border/60">
      <Container className="!px-0">
        <div className="max-w-xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
            Product Experience
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-brand-black tracking-tight leading-tight">
            Live Preview Studio
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Ebook spreads */}
          <div className="w-full max-w-4xl flex items-center justify-center gap-1 sm:gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full grid grid-cols-1 md:grid-cols-2 bg-brand-bg rounded-2xl overflow-hidden border border-brand-border/50 shadow-2xl relative min-h-[420px]"
              >
                {/* Left Page */}
                <div
                  className="p-8 md:p-12 flex flex-col justify-between border-r border-brand-border/30"
                  style={{
                    backgroundColor: samplePages[currentPage].bg,
                    color: samplePages[currentPage].color,
                  }}
                >
                  {samplePages[currentPage].type === "cover" && (
                    <div className="my-auto flex flex-col justify-center text-center">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-3">
                        AI Published Edition
                      </span>
                      <h3 className="font-serif text-3xl font-light leading-tight">
                        {samplePages[currentPage].title}
                      </h3>
                      <p className="text-xs text-brand-muted mt-4">
                        {samplePages[currentPage].subtitle}
                      </p>
                    </div>
                  )}

                  {samplePages[currentPage].type === "chapter" && (
                    <div className="my-auto">
                      <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block mb-2">
                        Chapter {samplePages[currentPage].chapterNum}
                      </span>
                      <h3 className="font-serif text-2xl font-light mb-4">
                        {samplePages[currentPage].title}
                      </h3>
                      <p className="text-xs leading-relaxed opacity-85">
                        {samplePages[currentPage].content}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-end border-t border-brand-border/20 pt-4 mt-8 text-[9px] uppercase tracking-widest opacity-60">
                    <span>PageNest Studio</span>
                    <span>Page {currentPage + 1}</span>
                  </div>
                </div>

                {/* Right Page */}
                <div
                  className="p-8 md:p-12 flex flex-col justify-between"
                  style={{
                    backgroundColor: samplePages[currentPage + 1].bg,
                    color: samplePages[currentPage + 1].color,
                  }}
                >
                  {samplePages[currentPage + 1].type === "toc" && (
                    <div className="my-auto flex flex-col justify-center">
                      <h3 className="font-serif text-lg border-b border-brand-border pb-2 mb-4">
                        {samplePages[currentPage + 1].title}
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {samplePages[currentPage + 1].chapters?.map((ch, idx) => (
                          <li key={idx} className="flex justify-between text-xs opacity-85">
                            <span>{ch.name}</span>
                            <span className="text-brand-gold font-bold">{ch.page}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {samplePages[currentPage + 1].type === "quote" && (
                    <div className="my-auto flex flex-col justify-center gap-4 text-center border-l-2 border-brand-gold pl-4 py-2">
                      <p className="font-serif text-base italic leading-relaxed">
                        "{samplePages[currentPage + 1].quote}"
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                        — {samplePages[currentPage + 1].author}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-end border-t border-brand-border/20 pt-4 mt-8 text-[9px] uppercase tracking-widest opacity-60">
                    <span>PageNest Studio</span>
                    <span>Page {currentPage + 2}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-8">
            <button
              onClick={prevSpread}
              disabled={currentPage === 0}
              className="px-5 py-2 rounded-full border border-brand-border bg-brand-white text-brand-black text-xs font-bold font-sans disabled:opacity-40 hover:bg-brand-bg transition-colors"
            >
              &larr; Previous Page
            </button>
            <span className="text-xs font-semibold text-brand-muted">
              Page {currentPage + 1} - {currentPage + 2} of {samplePages.length}
            </span>
            <button
              onClick={nextSpread}
              disabled={currentPage >= samplePages.length - 2}
              className="px-5 py-2 rounded-full border border-brand-border bg-brand-white text-brand-black text-xs font-bold font-sans disabled:opacity-40 hover:bg-brand-bg transition-colors"
            >
              Next Page &rarr;
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

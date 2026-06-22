"use client";

import { motion } from "framer-motion";
import { Container } from "../ui/Container";

export function Features() {
  const features = [
    {
      title: "AI Writing & Editorial",
      desc: "Instantly draft entire chapters, expand rough outlines, and polish copy style. Our writer behaves like a seasoned editor.",
      icon: (
        <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      title: "Smart Layout Design",
      desc: "Automatic typesetting, margin adjustments, typographic grids, page breaks, and color presets matched to your concept.",
      icon: (
        <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 7a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 7a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
        </svg>
      ),
    },
    {
      title: "Cover Generation",
      desc: "Build professional book covers automatically. Generate custom title plaques and graphics aligned to your theme.",
      icon: (
        <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "PDF / EPUB Export",
      desc: "Download high-resolution, print-ready PDFs or standard reflowable EPUB documents with a single click.",
      icon: (
        <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#070B14] px-6 lg:px-16 border-b border-brand-border/60">
      <Container className="!px-0">
        <div className="flex flex-col items-center text-center mb-16 gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">
            Platform Capabilities
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Features Built For Authors
          </h2>
          <p className="text-brand-muted text-sm max-w-lg mt-2">
            No bloated tools. PageNest focuses on four pillars of high-end digital publishing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white/[0.03] border border-white/5 rounded-[20px] p-6 hover:border-brand-purple/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)] transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="h-10 w-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-brand-purple/20">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-brand-muted text-xs leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

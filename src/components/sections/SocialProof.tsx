"use client";

import { motion } from "framer-motion";
import { Container } from "../ui/Container";

export function SocialProof() {
  const targetAudiences = [
    { role: "Founders", desc: "Draft investor-ready funding guides and pitch books.", icon: "🚀" },
    { role: "Coaches", desc: "Generate premium training manuals, worksheets, and ebooks.", icon: "🧠" },
    { role: "Agencies", desc: "Produce white-label reports and client lead magnets at scale.", icon: "💼" },
    { role: "Marketers", desc: "Launch high-converting lead campaigns and digital guides.", icon: "⚡" },
  ];

  return (
    <section className="w-full bg-[#070B14] py-16 border-b border-brand-border/60 font-sans overflow-hidden">
      <Container className="!px-0 flex flex-col gap-12">
        {/* Trusted Partners Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-brand-border/20 pb-10 text-center md:text-left px-6 lg:px-0">
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">
            Trusted by creators at modern teams:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 text-xs font-bold text-white/20 tracking-wider">
            <span className="hover:text-white/40 transition-colors pointer-events-none select-none">NOTION</span>
            <span className="hover:text-white/40 transition-colors pointer-events-none select-none">LINEAR</span>
            <span className="hover:text-white/40 transition-colors pointer-events-none select-none">FRAMER</span>
            <span className="hover:text-white/40 transition-colors pointer-events-none select-none">RAYCAST</span>
          </div>
        </div>

        {/* Built For Personas Row */}
        <div className="flex flex-col gap-8 px-6 lg:px-0">
          <div className="text-center md:text-left">
            <p className="text-[10px] text-brand-purple uppercase font-bold tracking-widest mb-2">
              Built For Outcomes
            </p>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Designed for Professional Creators
            </h2>
          </div>
          
          {/* Scroll container on mobile, grid on desktop */}
          <div className="flex overflow-x-auto flex-nowrap md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory scroll-smooth">
            {targetAudiences.map((roleCard, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-white/[0.02] border border-white/5 rounded-[20px] p-6 flex flex-col justify-between gap-6 hover:border-brand-purple/40 hover:bg-white/[0.04] transition-all cursor-default min-w-[260px] md:min-w-0 snap-center shrink-0"
              >
                <div className="flex flex-col gap-4">
                  <span className="text-2xl h-11 w-11 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
                    {roleCard.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-tight mb-1.5">{roleCard.role}</h3>
                    <p className="text-xs text-brand-muted leading-relaxed font-sans font-medium">{roleCard.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-brand-purple font-bold uppercase tracking-wider">
                  <span>Explore Features</span>
                  <span>&rarr;</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

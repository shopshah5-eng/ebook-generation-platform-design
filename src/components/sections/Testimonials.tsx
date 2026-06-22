"use client";

import { motion } from "framer-motion";
import { Container } from "../ui/Container";

export function Testimonials() {
  const testimonials = [
    {
      name: "Julian Vane",
      role: "SaaS Founder, FlowState",
      initials: "JV",
      avatarColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      quote: "PageNest drafted and typeset our seed funding guide in under 15 minutes. The output was so clean that investors asked which design studio did it. Saved us thousands in design fees.",
    },
    {
      name: "Sophia Chen",
      role: "Executive Coach & Author",
      initials: "SC",
      avatarColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      quote: "I was skeptical of AI book generation, but PageNest's ability to maintain an authoritative tone and format beautiful dropcaps and headers is outstanding. It feels like magic.",
    },
    {
      name: "Marcus Aurelius",
      role: "Growth Lead, ScaleCorp",
      initials: "MA",
      avatarColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      quote: "Creating lead magnets for marketing campaigns used to take weeks of copywriting and styling back-and-forth. Now we feed in outlines and get high-converting PDFs instantly.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#070B14] px-6 lg:px-16 border-b border-brand-border/60">
      <Container className="!px-0">
        <div className="flex flex-col items-center text-center mb-16 gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">
            Customer Love
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Loved By Modern Creators
          </h2>
          <p className="text-brand-muted text-sm max-w-lg mt-2">
            See how founders, coaches, and marketers use PageNest to scale their digital publications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="border border-white/5 rounded-[20px] p-6 lg:p-8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-purple/30 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
            >
              <p className="text-white/80 text-xs italic leading-relaxed mb-8">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full border flex items-center justify-center font-bold text-xs ${item.avatarColor}`}>
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {item.name}
                  </h4>
                  <p className="text-[9px] text-brand-muted uppercase tracking-wider font-semibold">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

"use client";

interface ContentBlockType {
  type: string;
  label: string;
  description: string;
  icon: string;
  category: "text" | "media" | "advanced";
}

interface ContentBlocksProps {
  onAddBlock: (type: string) => void;
}

export default function ContentBlocks({ onAddBlock }: ContentBlocksProps) {
  const blocks: ContentBlockType[] = [
    { type: "heading", label: "Heading", description: "Section header block", icon: "H", category: "text" },
    { type: "paragraph", label: "Paragraph", description: "Standard copy text block", icon: "¶", category: "text" },
    { type: "quote", label: "Quote", description: "Framer-style quote display", icon: "“", category: "text" },
    { type: "bullet_list", label: "Bullet List", description: "Bulleted unordered points", icon: "•", category: "text" },
    { type: "checklist", label: "Checklist", description: "Interactive task checkbox list", icon: "☑", category: "text" },
    
    { type: "image", label: "Image Block", description: "Visual media placeholder", icon: "🖼", category: "media" },
    { type: "statistic", label: "Statistic Block", description: "Prominent percentage callout", icon: "📊", category: "media" },
    { type: "callout", label: "Callout Box", description: "Premium attention notice panel", icon: "💬", category: "media" },

    { type: "comparison_table", label: "Comparison Table", description: "Specs or pricing side-by-side", icon: "⊞", category: "advanced" },
    { type: "testimonial", label: "Testimonial", description: "Praise quote from customers", icon: "👤", category: "advanced" },
    { type: "case_study", label: "Case Study", description: "Challenge, Solution, & Results", icon: "📈", category: "advanced" },
    { type: "timeline", label: "Timeline", description: "Chronological process events", icon: "📅", category: "advanced" },
    { type: "faq", label: "FAQ Accordion", description: "Q&A interactive accordion", icon: "❓", category: "advanced" },
  ];

  const categories = [
    { id: "text", title: "Text Blocks" },
    { id: "media", title: "Media & Highlights" },
    { id: "advanced", title: "Interactive Layouts" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-wider">
          CONTENT BLOCKS
        </span>
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Insert Block Components
        </h4>
      </div>

      <div className="h-px bg-white/5" />

      {categories.map((cat) => (
        <div key={cat.id} className="flex flex-col gap-2.5">
          <span className="text-[9px] text-brand-muted uppercase font-bold tracking-wider px-1">
            {cat.title}
          </span>
          <div className="flex flex-col gap-2">
            {blocks
              .filter((b) => b.category === cat.id)
              .map((block) => (
                <button
                  key={block.type}
                  onClick={() => onAddBlock(block.type)}
                  className="w-full text-left p-3 rounded-xl border border-white/5 hover:border-brand-purple/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="h-8 w-8 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-sm font-extrabold text-brand-purple shrink-0 group-hover:scale-105 transition-transform">
                    {block.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-[10.5px] font-bold text-white group-hover:text-brand-purple transition-colors">
                      {block.label}
                    </span>
                    <span className="text-[8.5px] text-brand-muted truncate">
                      {block.description}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

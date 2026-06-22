"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import CreationWizard from "../../../components/wizard/CreationWizard";
import GenerationProgress from "../../../components/generation/GenerationProgress";
import EditorWorkspace from "../../../components/editor/EditorWorkspace";
import { motion, AnimatePresence } from "framer-motion";

interface Ebook {
  id: string;
  title: string;
  author: string;
  theme: string;
  pages: any[];
}

interface TemplatePreset {
  name: string;
  theme: string;
  desc: string;
  longDesc: string;
  accent: string;
  tag: string;
  typography: string;
  colorSystem: string;
  gridStyle: string;
  rules: string[];
  render: () => React.ReactNode;
}

export default function TemplatesRoute() {
  const [userName, setUserName] = useState("Creator");
  const [wizardActive, setWizardActive] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);
  const [previewingTemplate, setPreviewingTemplate] = useState<TemplatePreset | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [genProgressData, setGenProgressData] = useState<any | null>(null);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    };
    loadSession();
  }, []);

  const handleGenerate = (wizardData: {
    prompt: string;
    author: string;
    pageCount: number;
    style: string;
    audience: string;
  }) => {
    setWizardActive(false);
    setGenProgressData(wizardData);
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
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const templates: TemplatePreset[] = [
    {
      name: "Startup Playbook",
      theme: "Startup",
      desc: "Minimal grids & vibrant glowing layouts.",
      longDesc: "A sleek, tech-forward aesthetic engineered for modern digital builders, venture reports, SaaS guides, and pitch documents.",
      accent: "#7C3AED",
      tag: "Startup",
      typography: "Inter & Outfit Sans (Clean, Modern)",
      colorSystem: "Deep indigo & neon violet gradient with white accents",
      gridStyle: "Adaptive 12-column layout with 24px micro-gutters",
      rules: [
        "Use subtle background glowing gradient blobs behind key sections.",
        "Maintain high contrast text sizes (H1: 32px, Body: 14px).",
        "Encapsulate callouts in border-white/5 cards with backdrop-blur.",
      ],
      render: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#0c0d19] to-[#1e1436] flex flex-col justify-between p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/20 rounded-full blur-2xl animate-pulse" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[6px] tracking-widest text-[#a78bfa] font-bold uppercase">BUILD & SCALE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
          </div>
          <div className="my-auto z-10 flex flex-col gap-1.5">
            <h3 className="font-extrabold text-white text-base leading-tight tracking-tight uppercase">
              Startup Playbook
            </h3>
            <div className="h-0.5 w-8 bg-brand-purple" />
            <p className="text-[7px] text-brand-muted font-medium">A founder's roadmap to product-market fit.</p>
          </div>
          <div className="flex justify-between items-center text-[5px] text-white/30 tracking-widest border-t border-white/5 pt-3 z-10">
            <span>PAGENEST PRESS</span>
            <span>VOL. I</span>
          </div>
        </div>
      ),
    },
    {
      name: "Business Strategy",
      theme: "Business",
      desc: "Corporate layouts & high-contrast typography.",
      longDesc: "A stark, highly readable layout geared toward consultants, corporate strategists, board pitches, and quarterly operations review documentation.",
      accent: "#3B82F6",
      tag: "Business",
      typography: "Inter & System Serif",
      colorSystem: "Midnight blue & slate gray contrast elements",
      gridStyle: "Symmetrical operations blocks & double columns dividers",
      rules: [
        "Use thin solid white/10 vertical borders to separate key points.",
        "Headers must be bold and capitalized.",
        "Emphasize metrics and numbers inside high-contrast boxes.",
      ],
      render: () => (
        <div className="w-full h-full bg-[#0a0e1a] flex flex-col justify-between p-5 rounded-lg border border-[#16274d] relative overflow-hidden">
          <span className="text-[5px] tracking-widest text-[#60a5fa] font-bold uppercase">BLUEPRINT</span>
          <div className="my-auto z-10 flex flex-col gap-1">
            <h3 className="font-extrabold text-white text-base leading-tight uppercase truncate">
              Corporate Strategy
            </h3>
            <div className="h-0.5 w-6 bg-[#3B82F6]" />
            <p className="text-[7px] text-brand-muted leading-tight font-sans">Corporate layouts & operations guidelines.</p>
          </div>
          <div className="flex justify-between items-center text-[4px] text-white/40 tracking-wider">
            <span>BUSINESS STANDARD</span>
            <span>ED. 2026</span>
          </div>
        </div>
      ),
    },
    {
      name: "Financial Freedom",
      theme: "Finance",
      desc: "Elegant columns & table spreads.",
      longDesc: "A traditional, authoritative theme designed for wealth managers, investment summaries, crypto guides, and annual reports.",
      accent: "#10B981",
      tag: "Finance",
      typography: "Outfit & serif headings (Trustworthy, Classic)",
      colorSystem: "Forest green & emerald shades with soft gold accents",
      gridStyle: "Strict symmetrical columns with elegant border separators",
      rules: [
        "Include geometric divider lines between titles and descriptions.",
        "Add subtle dashed margin outlines on all content layouts.",
        "Keep callout cards green-tinted with soft shadow structures.",
      ],
      render: () => (
        <div className="w-full h-full bg-[#051c14] flex flex-col justify-between p-5 relative overflow-hidden border border-[#0f3b2a]">
          <div className="absolute inset-2 border border-dashed border-[#1e5c43] opacity-60 pointer-events-none" />
          <div className="flex justify-center z-10 mt-1">
            <span className="text-[6px] tracking-wider text-[#10B981] font-bold uppercase">ASSET ACCUMULATION</span>
          </div>
          <div className="my-auto z-10 flex flex-col items-center text-center gap-2 px-1">
            <h3 className="font-sans font-light text-white text-base leading-tight tracking-wide uppercase">
              FINANCIAL FREEDOM
            </h3>
            <svg className="w-6 h-6 text-[#10b981]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[6px] text-brand-muted leading-tight">Strategies for independent wealth creation.</p>
          </div>
          <div className="flex justify-between items-center text-[5px] text-[#10B981]/60 tracking-wider z-10 px-2">
            <span>EDITION 2026</span>
            <span>EST. NET</span>
          </div>
        </div>
      ),
    },
    {
      name: "Mindful Focus",
      theme: "Wellness",
      desc: "Clean spacing & calming sage themes.",
      longDesc: "A minimalist layout utilizing spacious margins to create a peaceful, zen-like reading experience for mental health, cookbooks, and lifestyles.",
      accent: "#14B8A6",
      tag: "Wellness",
      typography: "Outfit & soft sans-serif (Calm, Readable)",
      colorSystem: "Charcoal gray backdrop with soft teal & mint accents",
      gridStyle: "Spacious asymmetric margins with central column focusing",
      rules: [
        "Minimize decorative elements; emphasize white space (margins).",
        "Use rounded badges and soft pill-shaped buttons for controls.",
        "Allow large font spacing to ensure stress-free reading flow.",
      ],
      render: () => (
        <div className="w-full h-full bg-[#1b1c22] flex flex-col justify-between p-5 relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <span className="text-[6px] tracking-widest text-brand-muted font-bold uppercase">ZEN LABS</span>
            <span className="text-[6px] text-brand-muted">03</span>
          </div>
          <div className="my-auto z-10 flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center relative">
              <div className="h-4 w-4 rounded-full bg-brand-purple/20 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-white text-base leading-tight uppercase tracking-wider">
                Mindful Focus
              </h3>
              <p className="text-[6px] text-brand-muted mt-1 max-w-[100px] mx-auto">Tactical guidelines for distraction-free deep work.</p>
            </div>
          </div>
          <div className="text-center text-[5px] text-white/30 tracking-widest z-10">
            <span>HUMAN PERFORMANCE STUDIO</span>
          </div>
        </div>
      ),
    },
    {
      name: "Marketing Mastery",
      theme: "Marketing",
      desc: "Conversion-driven visual layouts.",
      longDesc: "High-impact typographic styles designed for lead magnets, conversion optimization playbooks, and growth agency handbooks.",
      accent: "#F97316",
      tag: "Marketing",
      typography: "Outfit ExtraBold & italic variants (High Energy)",
      colorSystem: "Dark chocolate backdrops with energetic orange accents",
      gridStyle: "Dynamic alternating blocks and stark highlighted summaries",
      rules: [
        "Highlight core keywords with an amber-orange bottom border line.",
        "Include bold header banners to divide chapters dynamically.",
        "Add key takeaway checklists in callout cards.",
      ],
      render: () => (
        <div className="w-full h-full bg-gradient-to-br from-[#1c0d06] to-[#3b1c0a] flex flex-col justify-between p-5 relative overflow-hidden border border-[#52250d]">
          <div className="absolute top-[-20%] left-[-20%] w-36 h-36 bg-[#F97316]/10 rounded-full blur-2xl" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[6px] tracking-widest text-[#fdba74] font-bold uppercase">TRAFFIC ENGINE</span>
            <span className="text-[6px] text-[#fdba74] font-bold">X90</span>
          </div>
          <div className="my-auto z-10 flex flex-col gap-2">
            <h3 className="font-black text-white text-base leading-none tracking-tighter uppercase italic">
              MARKETING<br />MASTERY
            </h3>
            <div className="h-[2px] w-full bg-[#F97316]" />
            <p className="text-[7px] text-brand-muted font-medium">Acquisition channels that convert visitors into buyers.</p>
          </div>
          <div className="flex justify-between items-center text-[5px] text-[#fdba74]/50 tracking-wider z-10">
            <span>PAGENEST GROW</span>
            <span>VOL. 3</span>
          </div>
        </div>
      ),
    },
    {
      name: "Swiss Minimalist",
      theme: "Swiss",
      desc: "Clean grid layouts with strong sans-serif.",
      longDesc: "A pure editorial look inspired by Swiss typography, prioritizing structural grid lines, sans-serif sizes, and clean alignments.",
      accent: "#EF4444",
      tag: "Education",
      typography: "Inter only (Bold weight variances, Monospace data)",
      colorSystem: "Pitch black background with stark white text and red accents",
      gridStyle: "Strict modular asymmetrical grids based on thirds",
      rules: [
        "Titles must be uppercase, ultra-bold, and compact.",
        "Incorporate page metadata (categories, numbers) on all spreads.",
        "Separate sidebar notes using a solid border-white/10 divider line.",
      ],
      render: () => (
        <div className="w-full h-full bg-[#111111] flex flex-col justify-between p-5 relative overflow-hidden border border-white/5">
          <div className="flex justify-between items-start z-10">
            <span className="text-[6px] tracking-widest text-[#EF4444] font-black uppercase">DESIGN JOURNAL</span>
            <span className="text-[5px] text-white/40">ZURICH</span>
          </div>
          <div className="my-auto z-10 flex flex-col gap-1 px-1">
            <h3 className="font-sans font-black text-white text-base leading-none tracking-tighter uppercase">
              SWISS DESIGN
            </h3>
            <p className="text-[6px] text-white/60 font-mono mt-1">GRID SYSTEMS & TYPOGRAPHY</p>
          </div>
          <div className="flex justify-between items-center text-[5px] text-white/30 tracking-widest border-t border-white/10 pt-3 z-10">
            <span>VOL. VII</span>
            <span>1957</span>
          </div>
        </div>
      ),
    },
    {
      name: "Luxury Standard",
      theme: "Luxury",
      desc: "Sophisticated gold & charcoal palettes.",
      longDesc: "An upscale design suited for real estate portfolios, premium service guides, luxury brand reviews, and boutique consultancies.",
      accent: "#D97706",
      tag: "Luxury",
      typography: "Merriweather & Outfit light headings (Luxury, Classy)",
      colorSystem: "Charcoal obsidian background with bronze & amber-gold accents",
      gridStyle: "Thin elegant margins, framed overlays, and centralized block focus",
      rules: [
        "Utilize gold highlights only on small tags, headers, and separators.",
        "Provide wide line heights (1.75x) to maintain a premium feel.",
        "Ensure all callout containers have extremely minimal borders.",
      ],
      render: () => (
        <div className="w-full h-full bg-[#0a0a0d] flex flex-col justify-between p-5 relative overflow-hidden border border-[#2b2214]">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#D97706]/5 rounded-full blur-2xl" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[6px] tracking-widest text-[#D97706] font-bold uppercase">LUXURY EDITIONS</span>
            <span className="text-[6px] text-[#D97706]/70 font-serif font-bold">&bull; EST &bull;</span>
          </div>
          <div className="my-auto z-10 flex flex-col gap-2 items-center text-center">
            <h3 className="font-sans font-light text-white text-base leading-tight uppercase tracking-widest">
              THE GOLD STANDARD
            </h3>
            <div className="h-[1px] w-6 bg-[#D97706]/40" />
            <p className="text-[6px] text-[#D97706] uppercase tracking-widest font-bold">Premium Catalog</p>
          </div>
          <div className="flex justify-between items-center text-[5px] text-white/40 tracking-wider z-10 font-mono">
            <span>AUTHENTIC</span>
            <span>N&deg; 188</span>
          </div>
        </div>
      ),
    },
  ];

  const categories = ["All", "Business", "Marketing", "Finance", "Startup", "Education", "Wellness", "Luxury"];

  const filteredTemplates = activeCategory === "All"
    ? templates
    : templates.filter(t => t.tag === activeCategory);

  if (editingEbook) {
    return (
      <EditorWorkspace
        ebook={editingEbook}
        onClose={() => setEditingEbook(null)}
        onSave={handleSaveEbook}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title Header */}
      <div>
        <h1 className="font-sans text-2xl font-bold text-white">Design Templates</h1>
        <p className="text-xs text-brand-muted mt-1">
          Explore and choose from our premium, visual ebook styles. Launch the wizard instantly with any baseline preset.
        </p>
      </div>

      {/* Categories Filtering tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === category
                ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                : "border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/5 text-brand-muted hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Premium Template Catalog Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTemplates.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            className="flex flex-col group cursor-pointer"
          >
            {/* Visual Cover Preview container */}
            <div className="w-full aspect-[3/4] rounded-[20px] overflow-hidden shadow-2xl border border-white/5 group-hover:border-white/10 group-hover:shadow-[0_0_35px_rgba(124,58,237,0.12)] transition-all duration-300 group-hover:-translate-y-2 relative">
              {t.render()}
              {/* Overlay hover prompt */}
              <div className="absolute inset-0 bg-[#070B14]/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewingTemplate(t);
                  }}
                  className="w-32 py-2 rounded-full border border-white/20 hover:border-white text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Preview Layout
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(t.theme);
                    setWizardActive(true);
                  }}
                  className="w-32 py-2 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider hover:bg-brand-purple/90 transition-colors shadow-lg shadow-brand-purple/20 cursor-pointer"
                >
                  Use Preset
                </button>
              </div>
            </div>

            {/* Template Information */}
            <div className="mt-3.5 flex items-center justify-between px-1">
              <div>
                <h4 className="text-xs font-extrabold text-white group-hover:text-brand-purple transition-colors">
                  {t.name}
                </h4>
                <p className="text-[10px] text-brand-muted mt-1 leading-normal max-w-[170px] truncate">{t.desc}</p>
              </div>
              <span
                className="text-[8px] font-bold font-sans uppercase px-2 py-0.5 rounded border leading-none self-start"
                style={{
                  borderColor: `${t.accent}25`,
                  color: t.accent,
                  backgroundColor: `${t.accent}08`,
                }}
              >
                {t.theme}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual Template Preview Modal */}
      <AnimatePresence>
        {previewingTemplate && (
          <div className="fixed inset-0 bg-brand-bg/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-[#0E131F] border border-white/5 rounded-[20px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[460px]"
            >
              {/* Left Column - Large Cover Preview */}
              <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto border-r border-white/5 relative">
                {previewingTemplate.render()}
              </div>

              {/* Right Column - Details and Actions */}
              <div className="w-full md:w-1/2 p-6 lg:p-8 flex flex-col justify-between text-white">
                <div className="flex flex-col gap-4">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span
                        className="text-[8px] font-bold font-mono uppercase px-2 py-0.5 rounded border leading-none"
                        style={{
                          borderColor: `${previewingTemplate.accent}25`,
                          color: previewingTemplate.accent,
                          backgroundColor: `${previewingTemplate.accent}08`,
                        }}
                      >
                        {previewingTemplate.tag}
                      </span>
                      <h3 className="font-extrabold text-lg text-white mt-1.5 uppercase tracking-wide leading-none">
                        {previewingTemplate.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setPreviewingTemplate(null)}
                      className="text-brand-muted hover:text-white text-xl cursor-pointer leading-none p-1"
                    >
                      &times;
                    </button>
                  </div>

                  <p className="text-xs text-brand-muted leading-relaxed">
                    {previewingTemplate.longDesc}
                  </p>

                  <div className="h-[1px] bg-white/5" />

                  {/* Aesthetic Specifications */}
                  <div className="flex flex-col gap-2 text-xs">
                    <h4 className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Aesthetic Specs</h4>
                    <div className="flex flex-col gap-1.5">
                      <div>
                        <span className="text-[10px] text-brand-muted">Typography: </span>
                        <span className="text-[10px] font-semibold text-white">{previewingTemplate.typography}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-muted">Color Palette: </span>
                        <span className="text-[10px] font-semibold text-white">{previewingTemplate.colorSystem}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-muted">Grid Type: </span>
                        <span className="text-[10px] font-semibold text-white">{previewingTemplate.gridStyle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/5" />

                  {/* Rendering Rules */}
                  <div className="flex flex-col gap-2 text-xs">
                    <h4 className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Design Principles</h4>
                    <ul className="flex flex-col gap-1.5 list-disc list-inside text-[10px] text-brand-muted">
                      {previewingTemplate.rules.map((rule, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="text-white/80">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center gap-3 border-t border-white/5 pt-5 mt-6">
                  <button
                    onClick={() => setPreviewingTemplate(null)}
                    className="flex-1 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-xs font-semibold text-brand-muted hover:text-white transition-colors cursor-pointer"
                  >
                    Back to Gallery
                  </button>
                  <button
                    onClick={() => {
                      const theme = previewingTemplate.theme;
                      setPreviewingTemplate(null);
                      setSelectedTemplate(theme);
                      setWizardActive(true);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-brand-purple text-white text-xs font-bold hover:bg-brand-purple/90 transition-colors shadow-lg shadow-brand-purple/20 cursor-pointer"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Creation Wizard Trigger */}
      {wizardActive && (
        <CreationWizard
          onClose={() => {
            setWizardActive(false);
            setSelectedTemplate(undefined);
          }}
          onGenerate={handleGenerate}
          userName={userName}
          initialTemplate={selectedTemplate}
        />
      )}

      {/* Ebook Generation Status Loader */}
      {genProgressData && (
        <GenerationProgress
          topic={genProgressData.prompt}
          templateName={genProgressData.style}
          userName={userName}
          author={genProgressData.author}
          pageCount={genProgressData.pageCount}
          audience={genProgressData.audience}
          onComplete={(generatedBook) => {
            setGenProgressData(null);
            setEditingEbook(generatedBook);
          }}
          onClose={() => setGenProgressData(null)}
        />
      )}
    </div>
  );
}

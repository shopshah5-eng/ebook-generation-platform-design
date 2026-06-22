'use client';

import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadUserFile } from "../lib/upload";
import { createClient } from "../lib/supabase/client";
import { PRICING_PLANS } from "../lib/payments/plans";

// Available Billing Options
export type Billing = "monthly" | "yearly";
export type AuthMode = "login" | "signup" | null;

// Ebook Interfaces
export interface EbookPage {
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

export interface EbookTemplate {
  id: string;
  title: string;
  author?: string;
  theme: string;
  bg?: string;
  color?: string;
  image?: string;
  lines?: string[];
  pages: EbookPage[];
}

// ----------------------------------------------------
// ICONS COMPONENT RE-DEFINITIONS
// ----------------------------------------------------
function SparklesIcon() {
  return (
    <svg className="w-5 h-5 text-brand-gold animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904zM18.007 7.007L17.5 10.5l-.507-3.493L13.5 6.5l3.493-.507L17.5 2.5l.507 3.493L21.5 6.5l-3.493.507z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand-gold mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ----------------------------------------------------
// HEADER COMPONENT (Navigation & Auth)
// ----------------------------------------------------
export function Header({
  authMode,
  setAuthMode,
  userName,
  onAuth,
  onLogout,
  pendingCreate,
  setPendingCreate,
}: {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  userName: string;
  onAuth: (name: string) => void;
  onLogout: () => void;
  pendingCreate?: boolean;
  setPendingCreate?: (val: boolean) => void;
}) {
  const toggleAuth = (mode: Exclude<AuthMode, null>) => {
    if (setPendingCreate) setPendingCreate(false);
    setAuthMode(authMode === mode ? null : mode);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border/60 bg-brand-bg/85 backdrop-blur-md px-6 lg:px-16 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="h-9 w-9 rounded-lg bg-brand-black text-brand-bg flex items-center justify-center font-serif text-lg font-bold group-hover:scale-105 transition-transform">
            P
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-brand-black">PageNest</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-sans text-xs font-semibold uppercase tracking-wider text-brand-black/70">
          <a href="#features" className="hover:text-brand-black transition-colors">Features</a>
          <a href="#templates" className="hover:text-brand-black transition-colors">Templates</a>
          <a href="#studio" className="hover:text-brand-black transition-colors">Studio</a>
          <a href="#pricing" className="hover:text-brand-black transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4 relative">
          {userName ? (
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-brand-black text-brand-bg flex items-center justify-center font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
              <button
                onClick={onLogout}
                className="font-sans text-xs font-bold text-brand-muted hover:text-brand-black transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => toggleAuth("login")}
                className="font-sans text-xs font-bold text-brand-black hover:text-brand-gold transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => toggleAuth("signup")}
                className="px-4 py-2 rounded-full bg-brand-black hover:bg-brand-black/90 text-brand-bg font-sans text-xs font-bold transition-all hover:scale-102"
              >
                Sign up
              </button>
            </>
          )}

          <AnimatePresence>
            {authMode && !userName && (
              <AuthPopover
                mode={authMode}
                onModeChange={setAuthMode}
                onAuth={onAuth}
                onClose={() => {
                  setAuthMode(null);
                  if (setPendingCreate) setPendingCreate(false);
                }}
                isCentered={pendingCreate}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// ----------------------------------------------------
// HERO SECTION (Luxury Floating Showcase)
// ----------------------------------------------------
/*
IMAGE REQUIREMENTS:
Path: /public/images/hero/hero-book-stack.webp
Size: 1200x1600
Description: Ultra-premium stack of custom hardcover ebooks showing gold foliage embossing on warm textured paper background, photorealistic 3D rendering.
Prompt: Realistic 3D rendering of luxury editorial book stack floating in space, minimalist linen textured covers with gold typography, warm sunlit shadows, elegant Apple product styling.

Path: /public/images/hero/hero-cover-1.webp
Size: 800x1100
Prompt: Premium book cover design, title 'The Art of Persuasion', Cormorant Garamond serif fonts, organic cream textures and dark forest green accent, publishing grade book design.
*/
export function Hero({
  prompt,
  setPrompt,
  onCreate,
  submitted,
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  onCreate: () => void;
  submitted: boolean;
}) {
  return (
    <section id="top" className="relative min-h-[90vh] flex items-center py-20 px-6 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#f5eedf_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Copy block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col justify-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4 block">
            Publishing Reimagined
          </span>
          <h1 className="font-serif text-5xl lg:text-7xl font-light text-brand-black leading-tight tracking-tight mb-6">
            Turn Any Idea Into A <br />
            <span className="italic font-normal text-brand-gold">Beautiful Ebook</span> In Minutes
          </h1>
          <p className="text-brand-muted text-base lg:text-lg max-w-lg mb-8 leading-relaxed font-sans font-light">
            Generate professionally designed ebooks, lead magnets, reports and publishing-grade guides instantly with advanced layout AI.
          </p>

          <div className="w-full max-w-xl bg-brand-white border border-brand-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your rough draft ideas, video transcript, or describe the book you wish to generate..."
              className="w-full h-24 resize-none border-none outline-none font-sans text-sm text-brand-black placeholder-brand-muted/70 leading-relaxed"
            />
            
            <div className="border-t border-brand-border/60 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-brand-gold font-sans uppercase tracking-wider">
                💡 Try: "Personal Finance Blueprint for Beginners"
              </span>
              <button
                onClick={onCreate}
                className="px-6 py-2.5 rounded-full bg-brand-black hover:bg-brand-black/90 text-brand-bg font-sans text-xs font-bold transition-all shadow hover:shadow-md flex items-center gap-2 group self-end sm:self-auto"
              >
                <span>Generate My Ebook</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
          
          {submitted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-xs text-brand-gold font-semibold"
            >
              ✓ Ebook design sequence initiated. Select options in the creator wizard.
            </motion.p>
          )}
        </motion.div>

        {/* Right 3D Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="lg:col-span-6 relative flex justify-center"
        >
          {/* Floating bookstack layer representation */}
          <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden luxury-shadow-lg group">
            {/* Background book mockups simulating stack */}
            <div className="absolute top-4 left-4 w-full h-full bg-brand-black/5 rounded-2xl rotate-3 transform translate-x-2 translate-y-2 pointer-events-none" />
            <div className="absolute top-2 left-2 w-full h-full bg-brand-black/10 rounded-2xl -rotate-2 transform translate-x-1 translate-y-1 pointer-events-none" />
            
            {/* Primary Book Cover Mockup */}
            <div className="w-full h-full bg-brand-black rounded-2xl border border-brand-border/30 overflow-hidden relative flex flex-col justify-between p-12 transition-transform duration-500 group-hover:scale-102">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-white/10 via-transparent to-brand-black/30 pointer-events-none" />
              {/* Paper texture overlay */}
              <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-300 via-neutral-100 to-neutral-800 pointer-events-none" />
              
              <div className="border-b border-brand-bg/25 pb-6">
                <span className="text-[10px] tracking-widest text-brand-gold uppercase font-bold block mb-2">
                  PAGE NEST EXCLUSIVE
                </span>
                <span className="font-serif text-brand-white text-xs uppercase tracking-wider block">
                  Volume I &bull; Edition II
                </span>
              </div>
              
              <div className="my-auto">
                <h2 className="font-serif text-3xl lg:text-5xl font-light text-brand-white tracking-wide leading-tight mb-4">
                  The Art of <br />
                  <span className="italic text-brand-gold font-normal">Persuasion</span>
                </h2>
                <div className="w-12 h-0.5 bg-brand-gold" />
              </div>
              
              <div className="flex justify-between items-end">
                <span className="font-serif text-[11px] text-brand-white uppercase tracking-widest">
                  ALEX MORGAN
                </span>
                <span className="font-serif text-xs text-brand-gold font-bold">
                  2026
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// TRUST BANNER (High-end partners)
// ----------------------------------------------------
export function TrustBanner() {
  return (
    <section className="border-t border-b border-brand-border/50 bg-brand-white/40 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <p className="font-serif text-brand-black text-sm tracking-wide">
          Trusted by editorial teams and modern SaaS founders:
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 font-serif text-lg font-bold text-brand-black/45 tracking-widest">
          <span className="hover:text-brand-black transition-colors pointer-events-none select-none">NOTION</span>
          <span className="hover:text-brand-black transition-colors pointer-events-none select-none">LINEAR</span>
          <span className="hover:text-brand-black transition-colors pointer-events-none select-none">FRAMER</span>
          <span className="hover:text-brand-black transition-colors pointer-events-none select-none">CANVA</span>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// SOCIAL PROOF SECTION (Animated counters)
// ----------------------------------------------------
export function StatsProof() {
  const stats = [
    { value: "12,000+", label: "Ebooks Created" },
    { value: "4.95 / 5", label: "Average Creator Rating" },
    { value: "150+", label: "Designer Layout Presets" },
    { value: "98.7%", label: "Conversion Rate Increase" },
  ];

  return (
    <section className="py-24 bg-brand-white px-6 lg:px-16 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex flex-col items-center text-center p-6 border-r border-brand-border last:border-0"
          >
            <span className="font-serif text-3xl lg:text-5xl font-light text-brand-black mb-2">
              {stat.value}
            </span>
            <span className="text-xs uppercase tracking-widest text-brand-muted font-bold font-sans">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// HOW IT WORKS (Interactive Timeline Showcase)
// ----------------------------------------------------
export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const stepsList = [
    {
      num: "01",
      title: "Write Your Brief",
      desc: "Provide a simple concept, paste raw outlines, or upload existing articles. Our parser extracts the structural intent.",
    },
    {
      num: "02",
      title: "AI Layout Engine",
      desc: "Advanced model selects the typography scale, designs custom theme palettes, inserts cover art, and writes clean chapters.",
    },
    {
      num: "03",
      title: "Export Publishing PDF",
      desc: "Instantly download a high-resolution export file optimized for printing, presentations, or digital product lead magnets.",
    },
  ];

  return (
    <section className="py-24 bg-brand-bg px-6 lg:px-16 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
            Seamless Workflow
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-brand-black tracking-tight leading-tight">
            How PageNest Works
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col gap-6">
            {stepsList.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? "bg-brand-white border-brand-gold luxury-shadow scale-102"
                    : "bg-transparent border-transparent hover:bg-brand-white/40"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold uppercase font-sans tracking-widest ${
                    activeStep === idx ? "text-brand-gold" : "text-brand-muted"
                  }`}>
                    Step {step.num}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-brand-black mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-muted font-sans text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 flex justify-center">
            {/* Interactive Timeline Visual */}
            <div className="w-full max-w-[480px] aspect-[4/3] rounded-2xl bg-brand-white border border-brand-border luxury-shadow-lg p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                  Live Process Simulator
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-brand-success animate-ping" />
              </div>

              <div className="my-auto py-8">
                {activeStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">Concept Text</span>
                    <div className="h-4 w-full bg-brand-bg rounded" />
                    <div className="h-4 w-5/6 bg-brand-bg rounded" />
                    <div className="h-4 w-2/3 bg-brand-bg rounded" />
                  </motion.div>
                )}
                {activeStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">Formatting Layout System</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-16 bg-brand-bg rounded border border-dashed border-brand-gold/60 flex items-center justify-center text-[10px] font-bold text-brand-gold">H1</div>
                      <div className="h-16 bg-brand-bg rounded border border-dashed border-brand-gold/60 flex items-center justify-center text-[10px] font-bold text-brand-gold">BODY</div>
                      <div className="h-16 bg-brand-bg rounded border border-dashed border-brand-gold/60 flex items-center justify-center text-[10px] font-bold text-brand-gold">IMAGE</div>
                    </div>
                  </motion.div>
                )}
                {activeStep === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 text-center">
                    <span className="h-12 w-12 rounded-full bg-brand-gold/25 flex items-center justify-center text-brand-gold text-lg">↓</span>
                    <span className="text-sm font-bold text-brand-black uppercase">persuasion_playbook.pdf</span>
                    <span className="text-xs text-brand-muted">Ready for publishing distribution.</span>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className={`h-1.5 flex-1 rounded ${activeStep >= 0 ? "bg-brand-gold" : "bg-brand-border"}`} />
                <div className={`h-1.5 flex-1 rounded ${activeStep >= 1 ? "bg-brand-gold" : "bg-brand-border"}`} />
                <div className={`h-1.5 flex-1 rounded ${activeStep >= 2 ? "bg-brand-gold" : "bg-brand-border"}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// INTERACTIVE EBOOK SHOWCASE (Categories Carousel)
// ----------------------------------------------------
/*
IMAGE REQUIREMENTS:
/public/images/showcase/business.webp
/public/images/showcase/wellness.webp
/public/images/showcase/luxury.webp
/public/images/showcase/marketing.webp
*/
export function Showcase() {
  const [activeCategory, setActiveCategory] = useState("Business");

  const categories = [
    { name: "Business", title: "Business Strategy Plan", theme: "Swiss Typography", bg: "#fcfcfa", color: "#111" },
    { name: "Startup", title: "Scale Up Playbook", theme: "Modern Tech", bg: "#0F172A", color: "#F8FAFC" },
    { name: "Finance", title: "Financial Freedom", theme: "Classic Serif", bg: "#f6eedc", color: "#3B2F2F" },
    { name: "Wellness", title: "The Mindful Life", theme: "Natural Editorial", bg: "#ECFDF5", color: "#14532D" },
    { name: "Luxury", title: "Brand Identity Guideline", theme: "Minimalist Gold", bg: "#0A0A0A", color: "#D4AF37" },
  ];

  const activeData = useMemo(() => {
    return categories.find((c) => c.name === activeCategory) || categories[0];
  }, [activeCategory]);

  return (
    <section id="features" className="py-24 bg-brand-white px-6 lg:px-16 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
              Platform Preview
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-brand-black tracking-tight leading-tight">
              Interactive Ebook Showcase
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 border-b border-brand-border pb-2 w-full lg:w-auto">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setActiveCategory(c.name)}
                className={`px-4 py-2 font-serif text-sm transition-all relative ${
                  activeCategory === c.name ? "text-brand-gold font-medium" : "text-brand-muted hover:text-brand-black"
                }`}
              >
                {c.name}
                {activeCategory === c.name && (
                  <motion.div
                    layoutId="categoryLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block mb-4">
              LAYOUT ENGINE PRESET
            </span>
            <h3 className="font-serif text-3xl font-light text-brand-black mb-6">
              {activeData.title}
            </h3>
            <p className="text-brand-muted text-xs leading-relaxed mb-8">
              A bespoke structural preset utilizing <strong className="text-brand-black font-semibold">{activeData.theme}</strong> formatting. Our layout AI customizes the design system variables automatically based on the book theme.
            </p>
            
            <ul className="flex flex-col gap-3">
              <li className="flex items-center text-xs font-sans text-brand-black">
                <CheckIcon /> Pre-configured typography hierarchy
              </li>
              <li className="flex items-center text-xs font-sans text-brand-black">
                <CheckIcon /> Automatically generated color matching
              </li>
              <li className="flex items-center text-xs font-sans text-brand-black">
                <CheckIcon /> Dynamic page numbers and chapter headers
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            {/* Virtual Book Mockup */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-[440px] aspect-[3/4] rounded-2xl border border-brand-border/60 overflow-hidden luxury-shadow-lg p-10 flex flex-col justify-between"
              style={{ backgroundColor: activeData.bg, color: activeData.color }}
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                  {activeData.theme} Presets
                </span>
                <h4 className="font-serif text-4xl font-light tracking-wide leading-tight mt-6">
                  {activeData.title}
                </h4>
              </div>
              
              <div className="flex justify-between items-end border-t border-brand-black/10 pt-6">
                <span className="text-xs uppercase tracking-widest font-serif">
                  PageNest Studio
                </span>
                <span className="text-[10px] font-bold">VOL. 01</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// AI FEATURES (Grid layout)
// ----------------------------------------------------
export function ShowcaseGrid() {
  const features = [
    { title: "AI Writing & Expansion", desc: "Instantly flesh out outline items, write introductions, or format paragraphs for high clarity." },
    { title: "AI Cover Generation", desc: "Creates publication-ready cover illustrations tailored exactly to your ebook theme." },
    { title: "AI Page Design Layouts", desc: "Selects elegant grids, margins, and dropcaps matching your chosen editorial presets." },
    { title: "AI Image Insertion", desc: "Generate and embed photorealistic or line-art illustrations right next to content." },
    { title: "High-Res PDF Export", desc: "Print-ready PDF documents featuring crisp typography and high-fidelity assets." },
    { title: "Bespoke Brand Themes", desc: "Apply your corporate brand guidelines, fonts, and colors in one simple click." },
    { title: "Inline Editing Tools", desc: "Manually refine text headers, blockquotes, or image prompts inside our preview canvas." },
    { title: "Lead Magnet Generation", desc: "Perfect for newsletters, client onboarding documents, and digital sales funnels." },
  ];

  return (
    <section className="py-24 bg-brand-bg px-6 lg:px-16 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
            Powerful Architecture
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-brand-black tracking-tight leading-tight">
            Features Built For Publishers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="bg-brand-white border border-brand-border/60 rounded-2xl p-6 hover:border-brand-gold/60 transition-all hover:-translate-y-1"
            >
              <div className="h-9 w-9 rounded-lg bg-brand-gold/10 flex items-center justify-center mb-4">
                <SparklesIcon />
              </div>
              <h3 className="font-serif text-lg font-medium text-brand-black mb-2">
                {feature.title}
              </h3>
              <p className="text-brand-muted font-sans text-xs leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// LIVE PREVIEW STUDIO (Ebook simulator)
// ----------------------------------------------------
/*
IMAGE REQUIREMENTS:
/public/images/studio/page-visual.webp
Size: 800x600
Prompt: Elegant abstract line art drawing in black and gold on warm ivory background, gallery-level framing.
*/
export function EbookPreviewer({
  activeTemplate,
  onSelectTemplate,
  onClose,
  userPrompt,
}: {
  activeTemplate: EbookTemplate;
  onSelectTemplate: (template: any) => void;
  onClose: () => void;
  userPrompt: string;
}) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [instruction, setInstruction] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File exceeds maximum size limit of 5MB", "error");
      return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      showToast("Invalid file type. Only PNG, JPEG, and WEBP images are allowed.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please log in before uploading images.");
      }

      const publicUrl = await uploadUserFile(file, user.id, (progress) => {
        setUploadProgress(progress);
      });

      const pages = [...activeTemplate.pages];
      const visualPageIndex = pages.findIndex((p) => p.type === "visual");
      if (visualPageIndex !== -1) {
        pages[visualPageIndex] = {
          ...pages[visualPageIndex],
          image: publicUrl,
          imageUrl: publicUrl,
        };
      }

      if (currentSpread === 0) {
        activeTemplate.image = publicUrl;
      }

      onSelectTemplate({
        ...activeTemplate,
        pages,
      });

      showToast("Image uploaded and inserted successfully!", "success");
    } catch (err: any) {
      console.warn("Direct upload failed, calling backend API fallback:", err);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload-file", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload route failed");
        }

        const pages = [...activeTemplate.pages];
        const visualPageIndex = pages.findIndex((p) => p.type === "visual");
        if (visualPageIndex !== -1) {
          pages[visualPageIndex] = {
            ...pages[visualPageIndex],
            image: data.url,
            imageUrl: data.url,
          };
        }

        if (currentSpread === 0) {
          activeTemplate.image = data.url;
        }

        onSelectTemplate({
          ...activeTemplate,
          pages,
        });

        showToast("Image uploaded via API successfully!", "success");
      } catch (fallbackErr: any) {
        console.error("Fallback upload failed:", fallbackErr);
        showToast(fallbackErr.message || "Failed to upload image.", "error");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePageEdit = async () => {
    if (!instruction.trim()) return;

    setIsEditing(true);
    try {
      const targetPageIndex = Math.min(
        activeTemplate.pages.length - 1,
        Math.max(0, currentSpread * 2)
      );

      const res = await fetch("/api/edit-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ebookId: activeTemplate.id || "a0b5b27d-78af-4b2a-a6e5-644170621099",
          pageIndex: targetPageIndex,
          instruction,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to edit page");
      }

      const pages = [...activeTemplate.pages];
      pages[targetPageIndex] = data.updatedPage;

      onSelectTemplate({
        ...activeTemplate,
        pages,
      });

      setInstruction("");
      showToast("Page updated by AI successfully!", "success");
    } catch (err: any) {
      console.error("Page edit failed:", err);
      showToast(err.message || "Failed to edit page.", "error");
    } finally {
      setIsEditing(false);
    }
  };

  const bookTitle = useMemo(() => {
    if (userPrompt && userPrompt.trim().length > 3) {
      const clean = userPrompt
        .replace(/Create an? (ebook|refined ebook|guide|handbook|manual|book)\s+(?:called|named|titled|on|about)?/gi, "")
        .trim();
      const words = clean.split(/\s+/).slice(0, 4).join(" ");
      const capitalized = words
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return capitalized.length > 28 ? capitalized.substring(0, 26) + "..." : capitalized;
    }
    return activeTemplate.title;
  }, [userPrompt, activeTemplate]);

  const totalSpreads = Math.ceil(activeTemplate.pages.length / 2);
  const leftPage = activeTemplate.pages[currentSpread * 2];
  const rightPage = activeTemplate.pages[currentSpread * 2 + 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl h-[90vh] bg-brand-bg border border-brand-border rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl relative"
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-brand-border/60 bg-brand-white px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold font-sans font-bold text-[10px] uppercase">
              Live Preview Studio
            </span>
            <h3 className="font-serif text-lg font-semibold text-brand-black">Ebook Builder Studio</h3>
          </div>
          <button
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-brand-bg text-brand-black transition-colors"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
          {/* Left panel: template presets list */}
          <aside className="border-r border-brand-border/60 bg-brand-white/40 p-5 hidden lg:flex flex-col gap-4 overflow-y-auto">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-brand-black/60 uppercase">
              Page Themes
            </h4>
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-medium text-brand-muted">
                Choose template to swap designs on the fly.
              </span>
              <div className="h-2 w-full bg-brand-gold/15 rounded" />
            </div>
          </aside>

          {/* Book Canvas Spread Stage */}
          <main className="lg:col-span-3 p-8 flex flex-col justify-between items-center relative overflow-y-auto">
            <div className="w-full max-w-3xl flex justify-center items-center gap-2">
              {/* Left page rendering */}
              <div className="flex-1 aspect-[3/4] bg-brand-white border border-brand-border rounded-l-2xl p-8 relative flex flex-col justify-between shadow-sm">
                {leftPage && (
                  <>
                    {leftPage.type === "cover" && (
                      <div className="my-auto flex flex-col justify-center text-center">
                        <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold mb-2">
                          AI PUBLISHED
                        </span>
                        <h2 className="font-serif text-2xl font-light text-brand-black tracking-wide leading-tight">
                          {bookTitle}
                        </h2>
                        <span className="text-[10px] text-brand-muted tracking-wider block mt-4">
                          {leftPage.subtitle}
                        </span>
                      </div>
                    )}
                    {leftPage.type === "toc" && (
                      <div className="my-auto flex flex-col justify-center">
                        <h3 className="font-serif text-lg text-brand-black border-b border-brand-border pb-2 mb-4">
                          Table of Contents
                        </h3>
                        <ul className="flex flex-col gap-2">
                          {leftPage.chapters?.map((ch: any, idx: number) => (
                            <li key={idx} className="flex justify-between text-xs text-brand-muted">
                              <span>{ch.name}</span>
                              <span className="text-brand-gold font-bold">{ch.page}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {leftPage.type === "chapter" && (
                      <div className="my-auto">
                        <span className="text-[9px] text-brand-gold uppercase tracking-wider block mb-2">
                          Chapter {leftPage.chapterNum}
                        </span>
                        <h3 className="font-serif text-xl font-light text-brand-black mb-4">
                          {leftPage.title}
                        </h3>
                        <p className="text-brand-muted text-xs leading-relaxed">
                          {leftPage.content}
                        </p>
                      </div>
                    )}
                    {leftPage.type === "visual" && (
                      <div className="my-auto h-full flex flex-col justify-between items-center text-center gap-4 py-2 relative w-full">
                        <div className="flex-1 flex items-center justify-center w-full max-h-[35%] overflow-hidden rounded-lg border border-brand-border/60 bg-brand-bg/10 shadow-xs">
                          <img
                            src={leftPage.image || leftPage.imageUrl || "/images/studio/page-visual.webp"}
                            alt={leftPage.caption}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <p className="text-[10px] italic text-brand-muted text-center leading-relaxed max-w-sm mt-2 flex-grow flex items-center justify-center">
                          {leftPage.caption}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Spine middle border divider */}
              <div className="w-1.5 self-stretch bg-neutral-200 border-l border-r border-brand-border" />

              {/* Right page rendering */}
              <div className="flex-1 aspect-[3/4] bg-brand-white border border-brand-border rounded-r-2xl p-8 relative flex flex-col justify-between shadow-sm">
                {rightPage ? (
                  <>
                    {rightPage.type === "content" && (
                      <div className="my-auto flex flex-col gap-4">
                        <blockquote className="border-l-2 border-brand-gold pl-3 text-xs italic text-brand-black leading-relaxed">
                          "{rightPage.quote}"
                        </blockquote>
                        <p className="text-brand-muted text-xs leading-relaxed">
                          {rightPage.text}
                        </p>
                      </div>
                    )}
                    {rightPage.type === "checklist" && (
                      <div className="my-auto">
                        <h3 className="font-serif text-lg text-brand-black mb-4">{rightPage.title}</h3>
                        <ul className="flex flex-col gap-2">
                          {rightPage.items?.map((item: string, i: number) => (
                            <li key={i} className="flex items-center text-xs text-brand-muted">
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold mr-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="my-auto flex items-center justify-center text-brand-muted text-xs">
                    Blank End Page
                  </div>
                )}
              </div>
            </div>

            {/* Floating Live AI Editor bar */}
            <div className="w-full max-w-xl bg-brand-white border border-brand-border/70 rounded-full py-2 px-3 shadow-md flex items-center gap-3 relative mt-6">
              <label className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-bg text-brand-muted cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading || isEditing}
                />
                {isUploading ? (
                  <span className="text-[9px] font-bold text-brand-gold">{uploadProgress}%</span>
                ) : (
                  <span>📎</span>
                )}
              </label>

              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Instruct AI to redesign this page (e.g. 'rewrite chapters to be formal')..."
                className="flex-1 border-none outline-none font-sans text-xs text-brand-black placeholder-brand-muted"
                disabled={isUploading || isEditing}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePageEdit();
                  }
                }}
              />

              <button
                onClick={handlePageEdit}
                disabled={isUploading || isEditing || !instruction.trim()}
                className="px-4 py-1.5 rounded-full bg-brand-black text-brand-bg font-sans text-xs font-bold hover:bg-brand-black/90 disabled:opacity-40 transition-colors"
              >
                {isEditing ? "Editing..." : "Apply"}
              </button>
            </div>

            {/* Toasts and Feedback */}
            {toast && (
              <div className={`absolute bottom-6 left-6 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-sm ${
                toast.type === "success" ? "bg-brand-success/15 text-brand-success border border-brand-success/30" : "bg-red-500/15 text-red-500 border border-red-500/30"
              }`}>
                {toast.message}
              </div>
            )}
          </main>
        </div>

        {/* Footer actions / indicators */}
        <div className="border-t border-brand-border/60 bg-brand-white px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentSpread((p) => Math.max(0, p - 1))}
            disabled={currentSpread === 0}
            className="px-4 py-2 border border-brand-border rounded-full font-sans text-xs font-bold text-brand-black disabled:opacity-30 hover:bg-brand-bg transition-colors"
          >
            &larr; Previous Page
          </button>
          
          <span className="text-xs font-semibold text-brand-muted">
            Spread {currentSpread + 1} of {totalSpreads}
          </span>

          <button
            onClick={() => setCurrentSpread((p) => Math.min(totalSpreads - 1, p + 1))}
            disabled={currentSpread === totalSpreads - 1}
            className="px-4 py-2 border border-brand-border rounded-full font-sans text-xs font-bold text-brand-black disabled:opacity-30 hover:bg-brand-bg transition-colors"
          >
            Next Page &rarr;
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------
// TEMPLATE LIBRARY (Showcase 8 premium layouts)
// ----------------------------------------------------
/*
IMAGE REQUIREMENTS:
/public/images/templates/business-blueprint.webp
/public/images/templates/startup-playbook.webp
/public/images/templates/marketing-guide.webp
/public/images/templates/financial-freedom.webp
/public/images/templates/wellness-journal.webp
/public/images/templates/luxury-brand.webp
/public/images/templates/persuasion-mastery.webp
/public/images/templates/creator-handbook.webp
Size: 800x1100 each
Prompt: Luxury editorial book mockup template with gold lettering, warm shadows, clean minimalist typography grid.
*/
export function TemplatesGallery({ onSelectTemplate }: { onSelectTemplate: (template: any) => void }) {
  const library = [
    { title: "Business Blueprint", tag: "Pro", img: "/public/images/templates/business-blueprint.webp", theme: "Modern Business" },
    { title: "Startup Playbook", tag: "Pro", img: "/public/images/templates/startup-playbook.webp", theme: "Startup" },
    { title: "Marketing Guide", tag: "Free", img: "/public/images/templates/marketing-guide.webp", theme: "Modern Business" },
    { title: "Financial Freedom", tag: "Pro", img: "/public/images/templates/financial-freedom.webp", theme: "Finance" },
    { title: "Wellness Journal", tag: "Free", img: "/public/images/templates/wellness-journal.webp", theme: "Wellness" },
    { title: "Luxury Brand Strategy", tag: "Ultra", img: "/public/images/templates/luxury-brand.webp", theme: "Luxury Brand" },
    { title: "Persuasion Mastery", tag: "Ultra", img: "/public/images/templates/persuasion-mastery.webp", theme: "Persuasion" },
    { title: "Creator Handbook", tag: "Free", img: "/public/images/templates/creator-handbook.webp", theme: "Modern Business" },
  ];

  return (
    <section id="templates" className="py-24 bg-brand-bg px-6 lg:px-16 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
            Aesthetic Presets
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-brand-black tracking-tight leading-tight">
            Premium Editorial Templates
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {library.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="flex flex-col group cursor-pointer"
              onClick={() => onSelectTemplate({ theme: t.theme, title: t.title })}
            >
              {/* Virtual Mockup Container */}
              <div className="w-full aspect-[3/4] bg-brand-white border border-brand-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group-hover:-translate-y-2 relative flex flex-col justify-between p-6">
                <span className="text-[8px] font-bold text-brand-gold uppercase tracking-wider">
                  {t.tag} Edition
                </span>
                <h3 className="font-serif text-lg font-light text-brand-black my-auto">
                  {t.title}
                </h3>
                <div className="border-t border-brand-border pt-4 text-[9px] text-brand-muted uppercase tracking-widest">
                  PageNest Layouts
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="font-serif text-sm font-medium text-brand-black group-hover:text-brand-gold transition-colors">
                  {t.title}
                </span>
                <span className="text-[10px] font-bold text-brand-gold font-sans uppercase">
                  {t.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// TESTIMONIALS SECTION (Elegant grid cards)
// ----------------------------------------------------
export function Testimonials() {
  const list = [
    {
      name: "Marcus Aurel",
      role: "SaaS Founder",
      quote: "PageNest helped us draft and distribute our fundraising deck in PDF format. We secured our seed round using an ebook draft generated in 10 minutes.",
    },
    {
      name: "Sophia Chen",
      role: "Wellness Coach",
      quote: "The layout engine selected wellness templates matching my brand tone automatically. Organic forest green accent colors and Cormorant Garamond is gorgeous.",
    },
    {
      name: "Julian Vane",
      role: "Agency Director",
      quote: "Creating high-end lead magnets for our marketing funnels has never been this frictionless. Razor-sharp PDF output quality, and no bloated formatting issues.",
    },
    {
      name: "Aria Sterling",
      role: "Creative Director",
      quote: "A masterclass in editorial publishing systems. Micro-spacing, balanced margins, and realistic page structures make books feel highly premium.",
    },
  ];

  return (
    <section className="py-24 bg-brand-white px-6 lg:px-16 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
            Customer Love
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-brand-black tracking-tight leading-tight">
            Creators Love PageNest
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="border border-brand-border/60 rounded-2xl p-6 bg-brand-bg/30 hover:bg-brand-white hover:border-brand-gold/60 transition-all hover:shadow-sm flex flex-col justify-between min-h-[220px]"
            >
              <p className="text-brand-black/80 font-serif italic text-sm leading-relaxed mb-6">
                "{item.quote}"
              </p>
              <div>
                <h4 className="font-sans text-xs font-bold text-brand-black">
                  {item.name}
                </h4>
                <p className="text-[10px] text-brand-muted uppercase tracking-wider font-semibold">
                  {item.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// PRICING SECTION (Elevated cards & comparison FAQ)
// ----------------------------------------------------
export function Pricing({
  billing,
  setBilling,
  onStart,
}: {
  billing: Billing;
  setBilling: (value: Billing) => void;
  onStart: () => void;
}) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Pluggable Razorpay checkout trigger flow hooks
  const handleCheckout = async (planId: string) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingPeriod: billing,
        }),
      });

      const session = await response.json();
      if (!response.ok) throw new Error(session.error || "Checkout error");

      if (session.provider === "razorpay") {
        // Mocking Razorpay modal load
        alert(`Initializing Razorpay checkout order: ${session.orderId} for amount: $${session.amount / 100}.00`);
      } else if (session.provider === "stripe") {
        window.location.href = session.approvalUrl;
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to trigger payment checkout.");
    }
  };

  const faqItems = [
    { q: "How does the AI write ebook chapters?", a: "We utilize Google Gemini models to outline and draft structural sections based on your custom manuscript briefs, ensuring professional content generation." },
    { q: "Can I download PDF files directly?", a: "Yes. In Pro and Ultra plans, you can export high-resolution, print-ready PDFs containing all custom layout decorations." },
    { q: "Can I upload custom images and cover art?", a: "Yes, you can upload PNG/JPG/WEBP images directly to our Supabase media buckets, or instruct our AI to generate matching covers." },
    { q: "What is the difference between Pro and Ultra?", a: "Ultra offers unlimited ebook generations, team collaboration folders, custom corporate brand guidelines, and advanced prompt customization queues." },
    { q: "How easy is it to change payment providers?", a: "Extremely easy. Our modular architecture supports switching from Razorpay to Stripe or PayPal via a single environment variable change." },
  ];

  return (
    <section id="pricing" className="py-24 bg-brand-bg px-6 lg:px-16 border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">
            Fair Pricing
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-brand-black tracking-tight leading-tight mb-6">
            Completely Transparent Pricing
          </h2>
          
          <div className="inline-flex items-center gap-2 bg-brand-white border border-brand-border rounded-full p-1.5">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded-full font-sans text-xs font-bold transition-all ${
                billing === "monthly" ? "bg-brand-black text-brand-bg shadow-xs" : "text-brand-muted hover:text-brand-black"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-1.5 rounded-full font-sans text-xs font-bold transition-all ${
                billing === "yearly" ? "bg-brand-black text-brand-bg shadow-xs" : "text-brand-muted hover:text-brand-black"
              }`}
            >
              Yearly &bull; Save 25%
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-24 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const price = billing === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl border p-8 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? "bg-brand-white border-brand-gold shadow-lg ring-1 ring-brand-gold scale-102 z-10"
                    : "bg-brand-white/70 border-brand-border hover:bg-brand-white hover:shadow-md"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-brand-gold text-brand-black font-sans text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    Most Popular
                  </span>
                )}
                
                <div>
                  <h3 className="font-serif text-2xl font-light text-brand-black mb-4">
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 border-b border-brand-border/60 pb-6 mb-6">
                    <span className="font-serif text-4xl lg:text-5xl font-light text-brand-black">
                      ${price}
                    </span>
                    <span className="text-xs text-brand-muted uppercase font-semibold">
                      / month
                    </span>
                  </div>
                  
                  <ul className="flex flex-col gap-3.5 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs text-brand-black/90 font-sans">
                        <CheckIcon />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (plan.priceMonthly === 0) {
                      onStart();
                    } else {
                      handleCheckout(plan.id);
                    }
                  }}
                  className={`w-full py-3 rounded-full font-sans text-xs font-bold transition-all ${
                    plan.isPopular
                      ? "bg-brand-black text-brand-bg hover:bg-brand-black/90 shadow-md"
                      : "bg-transparent border border-brand-border text-brand-black hover:bg-brand-bg"
                  }`}
                >
                  {plan.priceMonthly === 0 ? "Get Started For Free" : "Subscribe Now"}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Plan Comparison Table */}
        <div className="max-w-4xl mx-auto bg-brand-white border border-brand-border rounded-2xl overflow-hidden shadow-sm p-6 lg:p-10 mb-24">
          <h3 className="font-serif text-2xl font-light text-brand-black mb-6 text-center">
            Detailed Comparison Table
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="py-3 font-semibold text-brand-muted">Features Matrix</th>
                  <th className="py-3 font-semibold text-brand-black">Free</th>
                  <th className="py-3 font-semibold text-brand-black">Pro</th>
                  <th className="py-3 font-semibold text-brand-black">Ultra</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-border/60">
                  <td className="py-3.5 font-medium text-brand-black">Monthly Price</td>
                  <td className="py-3.5 text-brand-muted">$0</td>
                  <td className="py-3.5 text-brand-muted">$9</td>
                  <td className="py-3.5 text-brand-muted">$24</td>
                </tr>
                <tr className="border-b border-brand-border/60">
                  <td className="py-3.5 font-medium text-brand-black">Ebooks Limit</td>
                  <td className="py-3.5 text-brand-muted">1</td>
                  <td className="py-3.5 text-brand-muted">60</td>
                  <td className="py-3.5 text-brand-muted">Unlimited</td>
                </tr>
                <tr className="border-b border-brand-border/60">
                  <td className="py-3.5 font-medium text-brand-black">PDF Watermark</td>
                  <td className="py-3.5 text-brand-muted">Yes</td>
                  <td className="py-3.5 text-brand-muted">No</td>
                  <td className="py-3.5 text-brand-muted">No</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-medium text-brand-black">Advanced Brand Kit</td>
                  <td className="py-3.5 text-brand-muted">No</td>
                  <td className="py-3.5 text-brand-muted">No</td>
                  <td className="py-3.5 text-brand-muted">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQs accordion */}
        <div className="max-w-3xl mx-auto">
          <h3 className="font-serif text-3xl font-light text-brand-black mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="flex flex-col gap-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border-b border-brand-border pb-4">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left py-3 font-serif text-lg text-brand-black font-medium hover:text-brand-gold transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-brand-gold">{activeFaq === idx ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-brand-muted leading-relaxed font-sans pt-2">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// MANUAL CREATOR WIZARD
// ----------------------------------------------------
interface EbookCreatorWizardProps {
  initialPrompt: string;
  initialAuthor: string;
  initialStyle: string;
  onClose: () => void;
  onGenerate: (data: { prompt: string; author: string; pageCount: number; style: string }) => void;
}

export function EbookCreatorWizard({
  initialPrompt,
  initialAuthor,
  initialStyle,
  onClose,
  onGenerate,
}: EbookCreatorWizardProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [author, setAuthor] = useState(initialAuthor);
  const [pageCount, setPageCount] = useState(6);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, author, pageCount, style: selectedStyle });
  };

  const templatesList = ["Modern Business", "Startup", "Wellness", "Finance", "Luxury Brand", "Persuasion"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-brand-white border border-brand-border rounded-2xl p-8 relative shadow-xl"
      >
        <button
          className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-brand-bg text-brand-black transition-colors"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold text-brand-black mb-1">Customize Your Ebook</h2>
          <p className="text-xs text-brand-muted">Configure styling parameters for your custom AI generated ebook.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-brand-black/70">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="px-4 py-2 rounded-xl border border-brand-border bg-brand-bg/25 outline-none font-sans text-xs focus:border-brand-gold/60"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-brand-black/70">Number of Pages</label>
            <div className="grid grid-cols-4 gap-2">
              {[6, 8, 10, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPageCount(num)}
                  className={`py-2 rounded-lg font-sans text-xs font-bold transition-all border ${
                    pageCount === num ? "bg-brand-black text-brand-bg border-brand-black" : "bg-transparent border-brand-border text-brand-black hover:bg-brand-bg"
                  }`}
                >
                  {num} Pages
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-brand-black/70">Style Tone & Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {templatesList.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`py-2 rounded-lg font-sans text-[10px] font-bold transition-all border ${
                    selectedStyle === style ? "bg-brand-black text-brand-bg border-brand-black" : "bg-transparent border-brand-border text-brand-black hover:bg-brand-bg"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-brand-black/70">Ebook Idea Brief</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your book outline in detail..."
              required
              className="px-4 py-3 rounded-xl border border-brand-border bg-brand-bg/25 outline-none font-sans text-xs focus:border-brand-gold/60 h-24 resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-brand-black hover:bg-brand-black/90 text-brand-bg font-sans text-xs font-bold mt-4 shadow-sm hover:shadow transition-all"
          >
            Generate Custom Ebook
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------
// GENERATION LOADER (AI status screen)
// ----------------------------------------------------
export function GenerationLoader({ progressText, progressPercent }: { progressText: string; progressPercent: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-brand-white border border-brand-border rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl">
        <div className="h-16 w-16 border-4 border-brand-gold/20 border-t-brand-gold animate-spin rounded-full mb-6" />
        <h3 className="font-serif text-2xl font-light text-brand-black mb-2">Generating Ebook</h3>
        <p className="text-xs text-brand-muted min-h-[40px] leading-relaxed mb-6">
          {progressText}
        </p>
        <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider mt-3">
          {progressPercent}% Completed
        </span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// AUTH POPOVER FORM
// ----------------------------------------------------
function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="px-4 py-2 rounded-xl border border-brand-border bg-brand-bg/15 outline-none font-sans text-xs focus:border-brand-gold/60"
      />
    </div>
  );
}

function AuthPopover({
  mode,
  onModeChange,
  onAuth,
  onClose,
  isCentered,
}: {
  mode: Exclude<AuthMode, null>;
  onModeChange: (mode: AuthMode) => void;
  onAuth: (name: string) => void;
  onClose: () => void;
  isCentered?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim() || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        onAuth(name.trim() || email.split("@")[0] || "Creator");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuth(data.user?.user_metadata?.full_name || email.split("@")[0] || "Creator");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Google Authentication failed");
    }
  };

  return (
    <>
      {isCentered && (
        <div className="fixed inset-0 z-40 bg-brand-deep/60 backdrop-blur-xs" onClick={onClose} />
      )}
      <div className={`z-50 w-80 bg-brand-white border border-brand-border p-6 rounded-2xl shadow-xl flex flex-col gap-4 ${
        isCentered ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" : "absolute right-0 top-12"
      }`}>
      <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
        <h3 className="font-serif text-lg font-semibold text-brand-black">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h3>
        <button className="text-brand-muted hover:text-brand-black" onClick={onClose}>
          &times;
        </button>
      </div>

      <button
        onClick={handleGoogleAuth}
        className="w-full flex items-center justify-center py-2 border border-brand-border rounded-xl font-sans text-xs font-semibold text-brand-black hover:bg-brand-bg transition-colors"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      <div className="flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-brand-border" />
        <span className="text-[10px] text-brand-muted uppercase">or</span>
        <div className="h-[1px] flex-1 bg-brand-border" />
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3.5">
        {mode === "signup" && (
          <LabeledInput label="Full Name" placeholder="e.g. Alex Morgan" value={name} onChange={setName} />
        )}
        <LabeledInput label="Email Address" placeholder="you@example.com" value={email} onChange={setEmail} type="email" />
        <LabeledInput label="Password" placeholder="••••••••" value={password} onChange={setPassword} type="password" />

        {errorMsg && <p className="text-[10px] text-red-500">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-full bg-brand-black hover:bg-brand-black/90 text-brand-bg font-sans text-xs font-bold transition-colors"
        >
          {loading ? "Authenticating..." : mode === "signup" ? "Sign up" : "Log in"}
        </button>
      </form>

      <p className="text-[10px] text-brand-muted text-center pt-2">
        {mode === "signup" ? "Already have an account?" : "New to PageNest?"}{" "}
        <button
          className="text-brand-gold font-bold hover:underline"
          onClick={() => onModeChange(mode === "signup" ? "login" : "signup")}
        >
          {mode === "signup" ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
    </>
  );
}

// ----------------------------------------------------
// FOOTER (Premium Editorial Footer)
// ----------------------------------------------------
export function Footer() {
  return (
    <footer className="bg-brand-white border-t border-brand-border px-6 lg:px-16 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-brand-border/60 pb-12 mb-12">
        <div className="flex flex-col gap-4">
          <a href="#top" className="flex items-center gap-2 group w-max">
            <span className="h-8 w-8 rounded bg-brand-black text-brand-bg flex items-center justify-center font-serif text-base font-bold">
              P
            </span>
            <span className="font-serif text-lg font-semibold tracking-tight text-brand-black">PageNest</span>
          </a>
          <p className="text-brand-muted text-xs leading-relaxed max-w-xs">
            The world's premium AI-powered publishing house for modern creators, founders, and educators.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-serif text-sm font-semibold tracking-widest text-brand-black uppercase">
            Platform
          </h4>
          <a href="#features" className="text-xs text-brand-muted hover:text-brand-black transition-colors">Features</a>
          <a href="#templates" className="text-xs text-brand-muted hover:text-brand-black transition-colors">Templates</a>
          <a href="#pricing" className="text-xs text-brand-muted hover:text-brand-black transition-colors">Pricing</a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-serif text-sm font-semibold tracking-widest text-brand-black uppercase">
            Resources
          </h4>
          <span className="text-xs text-brand-muted hover:text-brand-black transition-colors pointer-events-none">Guides</span>
          <span className="text-xs text-brand-muted hover:text-brand-black transition-colors pointer-events-none">Blog</span>
          <span className="text-xs text-brand-muted hover:text-brand-black transition-colors pointer-events-none">Support</span>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-serif text-sm font-semibold tracking-widest text-brand-black uppercase">
            Legal
          </h4>
          <span className="text-xs text-brand-muted hover:text-brand-black transition-colors pointer-events-none">Privacy Policy</span>
          <span className="text-xs text-brand-muted hover:text-brand-black transition-colors pointer-events-none">Terms of Service</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <small className="text-[10px] text-brand-muted uppercase tracking-wider font-semibold">
          &copy; {new Date().getFullYear()} PageNest. All rights reserved.
        </small>
        <div className="flex gap-6 text-[10px] text-brand-muted font-bold uppercase tracking-wider">
          <span className="pointer-events-none">Twitter / X</span>
          <span className="pointer-events-none">Instagram</span>
          <span className="pointer-events-none">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}
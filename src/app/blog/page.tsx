"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Container } from "../../components/ui/Container";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  theme: string;
}

const ALL_POSTS: BlogPost[] = [
  {
    slug: "ai-writing-guide-2026",
    title: "The Ultimate Guide to AI Ebook Writing in 2026",
    excerpt: "Learn how to use generative AI models to compose, format, and structure professional ebooks that engage your audience from start to finish.",
    category: "AI Writing",
    date: "June 15, 2026",
    readTime: "6 min read",
    author: "Jane Doe",
    theme: "Startup",
  },
  {
    slug: "generate-lead-magnets-that-convert",
    title: "How to Build Lead Magnets That Actually Convert",
    excerpt: "Discover the specific layout styles, topics, and structures that generate high-quality email subscribers for SaaS products and online courses.",
    category: "Lead Magnets",
    date: "June 10, 2026",
    readTime: "5 min read",
    author: "John Vance",
    theme: "Modern Business",
  },
  {
    slug: "ebook-design-best-practices",
    title: "Ebook Design Best Practices: Grid Systems & Typography",
    excerpt: "Why clean spacing, sans-serif pairings, and curated color palettes make the difference between a throwaway PDF and a premium brand asset.",
    category: "Ebook Design",
    date: "June 05, 2026",
    readTime: "8 min read",
    author: "Sarah Lin",
    theme: "Luxury Brand",
  },
  {
    slug: "how-to-monetize-digital-products",
    title: "How to Package and Monetize Digital Products and Guides",
    excerpt: "A tactical breakdown of landing page structures, checkout providers, and email marketing workflows to build a passive digital income stream.",
    category: "Business Growth",
    date: "May 28, 2026",
    readTime: "7 min read",
    author: "Jane Doe",
    theme: "Persuasion",
  }
];

const CATEGORIES = ["All", "AI Writing", "Lead Magnets", "Ebook Design", "Business Growth"];

export default function BlogListing() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All"
    ? ALL_POSTS
    : ALL_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col font-sans">
      <Navbar
        authMode={null}
        userName=""
      />

      <main className="flex-grow py-16 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 flex flex-col gap-12">
          {/* Hero Header */}
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              PageNest <span className="text-brand-purple">Insights</span>
            </h1>
            <p className="text-sm text-brand-muted leading-relaxed font-medium">
              Guides, industry best-practices, and research notes on creating premium eBooks, packaging lead magnets, and growing digital publishing businesses.
            </p>
          </div>

          {/* Filters switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-y border-white/5 py-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[38px] flex items-center justify-center ${
                  selectedCategory === cat
                    ? "bg-brand-purple text-white shadow-lg"
                    : "text-brand-muted hover:text-white bg-white/[0.02] border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-brand-purple/40 hover:bg-white/[0.03] transition-all flex flex-col justify-between min-h-[300px] group shadow-xl"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-widest font-black text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-brand-muted font-medium">{post.readTime}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-black text-white leading-snug group-hover:text-brand-purple transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-brand-muted leading-relaxed font-medium">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <span className="text-[10px] text-brand-muted font-medium">By {post.author}</span>
                  <span className="text-[10px] text-brand-muted font-mono">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

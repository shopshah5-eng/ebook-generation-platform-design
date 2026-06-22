import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../../components/layout/Navbar";
import { Footer } from "../../../components/layout/Footer";
import { Container } from "../../../components/ui/Container";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  theme: string;
  content: string[];
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
    content: [
      "Generative AI has evolved from a simple outline helper to an advanced drafting and structural editing collaborator. In 2026, creating an ebook with AI is less about raw auto-generation and more about human-in-the-loop refinement.",
      "The first step is establishing a highly specific context prompt. Instead of asking for 'a book on startups,' you must define target audience cohorts, case studies, vocabulary limits, and design guidelines. This ensures the output reads as a professionally compiled publication.",
      "Once you generate the outline, review individual block layouts. Focus on introducing contrasting data sections, callout boxes, and custom templates. The visual structure of the page dictates readability as much as the vocabulary choice.",
      "With PageNest, you can leverage AI presets to automatically format paragraph blocks, generate corresponding chapter cover mockups, and bundle templates with one-click export functions to PDF, EPUB, and Kindle formats."
    ]
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
    content: [
      "A lead magnet is a high-value resource offered to prospective customers in exchange for their contact details. Today, generic cheatsheets and boring reports no longer work. Modern users expect premium, well-designed ebooks.",
      "To build lead magnets that convert, focus on answering a single, immediate pain point. Keep the content actionable, dense, and visual. Include bullet point guides and real-world examples that users can apply in under 30 minutes.",
      "Integrate your brand styling and color codes directly into the document spreads. When a user downloads your PDF, the visual branding establishes credibility instantly, converting cold readers into qualified leads.",
      "PageNest makes it easy to setup Brand Kits, customize cover headers, and compile formatted PDFs with built-in subscription triggers to scale your marketing funnel."
    ]
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
    content: [
      "Design is the silent ambassador of your content. Even the most insightful ebook will be ignored if it is formatted as a dense wall of unstyled text. Premium typography is the core foundation of readability.",
      "Use structured grid systems. Ensure margins are wide enough to give text blocks room to breathe, and limit line lengths to 60-70 characters. This prevents visual fatigue and increases reader completion rates.",
      "Pair fonts intentionally. Combine high-contrast display serif fonts (like Playfair or Cormorant) for chapter headers with clean, neutral sans-serif body fonts (like Inter) for body copy. This establishes an elegant editorial look.",
      "Leverage low-contrast background fills, custom borders, and dynamic layout presets to keep each page layout feeling intentional and professionally engineered."
    ]
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
    content: [
      "Selling digital products—such as specialized guides, playbooks, and templates—is one of the most profitable online models. With zero marginal distribution costs, your profit margins remain at 100%.",
      "Monetization requires a seamless checkout experience. Integrate lightweight checkout overlays (like Stripe or Razorpay) to let users purchase with single-tap credentials on mobile viewports.",
      "Setup automated onboarding drips. As soon as a purchase completes, automatically trigger welcoming notifications, send invoice receipts, and dispatch the download links to keep customer experience high.",
      "Utilize PageNest to generate premium publications and package them directly as ready-to-sell EPUB, PDF, or Kindle files."
    ]
  }
];

export async function generateStaticParams() {
  return ALL_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = ALL_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  
  return {
    title: `${post.title} | PageNest Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://pagenest.ai/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = ALL_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const related = ALL_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col font-sans">
      <Navbar
        authMode={null}
        userName=""
      />

      <main className="flex-grow py-16 relative overflow-hidden">
        {/* Background ambient glows */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-muted hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-8"
          >
            &larr; Back to insights
          </Link>

          {/* Article Header */}
          <article className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-widest font-black text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1.5 rounded-full">
                {post.category}
              </span>
              <span className="text-[10px] text-brand-muted font-medium font-mono">{post.date}</span>
              <span className="text-white/20">&bull;</span>
              <span className="text-[10px] text-brand-muted font-medium">{post.readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {post.title}
            </h1>

            {/* Author card block */}
            <div className="flex items-center gap-3 border-y border-white/5 py-4 my-2">
              <div className="h-8 w-8 rounded-full bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center font-bold text-xs text-brand-purple">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">{post.author}</p>
                <p className="text-[9px] text-brand-muted uppercase tracking-wider font-semibold mt-1">Staff Writer</p>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-6 text-sm text-white/90 leading-relaxed font-medium mt-4">
              {post.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </article>

          {/* Related Articles footer divider */}
          <div className="h-[1px] bg-white/5 w-full my-12" />

          {/* Related Articles section */}
          <div>
            <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest mb-6">
              Related Insights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="glass p-5 rounded-[20px] bg-white/[0.01] border border-white/5 hover:border-brand-purple/40 hover:bg-white/[0.02] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[8px] uppercase tracking-widest font-black text-brand-purple block mb-2">
                      {item.category}
                    </span>
                    <h5 className="text-xs font-extrabold text-white leading-snug hover:text-brand-purple transition-colors">
                      {item.title}
                    </h5>
                  </div>
                  <span className="text-[9px] text-brand-muted font-mono mt-4 block">{item.date}</span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

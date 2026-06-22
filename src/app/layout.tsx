import type { Metadata } from "next";
import { StructuredData } from "../components/layout/StructuredData";
import "../index.css";

export const metadata: Metadata = {
  title: {
    default: "PageNest | AI Ebook & Lead Magnet Generator",
    template: "%s | PageNest"
  },
  description: "Generate professionally designed ebooks, lead magnets, and digital products in minutes with AI. Fully customizable layouts, instant exports to PDF, EPUB, and Kindle formats.",
  keywords: [
    "AI Ebook Generator",
    "AI PDF Generator",
    "Lead Magnet Generator",
    "AI Content Creator",
    "AI Ebook Builder",
    "Professional Ebook Creator",
    "Digital Product Generator",
    "SaaS Ebook Publishing"
  ],
  metadataBase: new URL("https://pagenest.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PageNest | AI Ebook & Lead Magnet Generator",
    description: "Generate professionally designed ebooks and digital products in minutes with AI. Custom themes, outlines, and multi-format exports.",
    url: "https://pagenest.ai",
    siteName: "PageNest",
    images: [
      {
        url: "/screenshot_landing.png",
        width: 1200,
        height: 630,
        alt: "PageNest AI Ebook Generator Workspace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PageNest | AI Ebook Generator",
    description: "Generate professionally designed ebooks and lead magnets in minutes with AI.",
    images: ["/screenshot_landing.png"],
    creator: "@pagenest_ai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600;1,700&family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

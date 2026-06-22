import React from "react";

export function StructuredData() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PageNest",
    "url": "https://pagenest.ai",
    "logo": "https://pagenest.ai/screenshot_auth_modal.png",
    "sameAs": [
      "https://twitter.com/pagenest_ai",
      "https://github.com/pagenest"
    ],
    "description": "PageNest is an AI-powered ebook and lead magnet generation platform designed to build professional digital publications in minutes."
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PageNest AI Ebook Builder",
    "operatingSystem": "All",
    "applicationCategory": "DesignApplication",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "19",
      "offerCount": "3"
    },
    "featureList": [
      "AI outline and table of contents compilation",
      "Responsive visual eBook editor workspace",
      "Multi-format high-fidelity export (PDF, EPUB, DOCX)",
      "Dynamic brand kit customizations"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the PageNest AI Ebook Generator work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply enter your topic prompt, choose a target audience, and select a visual theme template. PageNest AI compiles a researched outline, sets up chapter layouts, writes custom text blocks, and integrates high-resolution cover graphics in under two minutes."
        }
      },
      {
        "@type": "Question",
        "name": "What formats can I export my ebooks in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can export finished ebooks in premium PDF format (with crop marks for printing), standard EPUB format (for e-readers and Kindle devices), or Microsoft DOCX format for offline text editing."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize the design colors and font themes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! PageNest provides an editor workspace where you can customize layouts, reorder chapters, upload images, and apply custom Brand Kit colors and typography rules to match your identity."
        }
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "PageNest Pro Subscription",
    "image": "https://pagenest.ai/screenshot_landing.png",
    "description": "Premium subscription tier allowing up to 50 ebook generations, premium templates access, and EPUB/DOCX downloads.",
    "brand": {
      "@type": "Brand",
      "name": "PageNest"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://pagenest.ai/#pricing",
      "priceCurrency": "USD",
      "price": "9.00",
      "priceValidUntil": "2027-01-01",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PageNest"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}

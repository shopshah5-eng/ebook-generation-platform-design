import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog", "/blog/"],
      disallow: ["/dashboard", "/dashboard/", "/auth/", "/api/"],
    },
    sitemap: "https://pagenest.ai/sitemap.xml",
  };
}

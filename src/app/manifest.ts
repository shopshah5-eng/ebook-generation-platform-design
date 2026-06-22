import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PageNest AI Ebook Workspace",
    short_name: "PageNest",
    description: "Generate professionally designed ebooks and digital products in minutes with AI.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#070B14",
    theme_color: "#070B14",
    orientation: "any",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/screenshot_auth_modal.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

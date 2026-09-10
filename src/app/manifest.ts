import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Atlas — Decision Engine & Stack Builder",
    short_name: "AI Atlas",
    description: "Don't search for AI tools. Tell us what you want to accomplish, and AI Atlas will find the right verified AI tools and build the right AI stack for you.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/images/ai-atlas-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/ai-atlas-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

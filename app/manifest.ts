import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QuiRamèneQuoi",
    short_name: "QuiRamèneQuoi",
    description: "L'application simple pour gérer les listes de courses et d'organisation pour vos soirées.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png", // Assuming valid icon paths based on standard Next.js conventions or public dir content
        sizes: "192x192",
        type: "image/png",
      },
        {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

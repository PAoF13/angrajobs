import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://angrajobs.com.br";

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacidade`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/termos`, changeFrequency: "monthly", priority: 0.3 },
  ];
}

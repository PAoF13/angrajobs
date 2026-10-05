import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AngraJobs",
    short_name: "AngraJobs",
    description: "Vagas e empregos em Angra dos Reis.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#071d33",
    lang: "pt-BR",
  };
}

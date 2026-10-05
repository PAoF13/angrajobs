import type { MetadataRoute } from "next";
import { listPublishedJobs } from "@/features/jobs/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://angrajobs.com.br";
  const jobs = await listPublishedJobs();

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/vagas`, changeFrequency: "daily", priority: 0.9 },
    ...jobs.map((job) => ({
      url: `${base}/vagas/${job.slug}`,
      lastModified: new Date(job.updated_at || job.published_at || job.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${base}/privacidade`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/termos`, changeFrequency: "monthly", priority: 0.3 },
  ];
}

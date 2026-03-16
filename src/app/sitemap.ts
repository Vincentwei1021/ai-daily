import type { MetadataRoute } from "next";
import { getAllDates } from "@/data/reports";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-daily-eight-mu.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...getAllDates().map(date => ({ url: `${base}/${date}`, lastModified: new Date(date), changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];
}

import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [celebrities, articles, categories] = await Promise.all([
    db.celebrity.findMany({ select: { slug: true, updatedAt: true } }),
    db.article.findMany({ select: { slug: true, publishedAt: true } }),
    db.category.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/celebrities`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/how-it-works`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/news`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((c) => ({
      url: `${BASE}/celebrities?category=${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...celebrities.map((c) => ({
      url: `${BASE}/celebrities/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${BASE}/news/${a.slug}`,
      lastModified: a.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

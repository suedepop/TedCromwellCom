import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/blog";
import { listConcerts } from "@/lib/concerts";
import { listVenues } from "@/lib/venues";
import { listTravelEntries } from "@/lib/travel";
import { siteUrl } from "@/lib/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, concerts, venues, travel] = await Promise.all([
    listPosts("published").catch(() => []),
    listConcerts().catch(() => []),
    listVenues().catch(() => []),
    listTravelEntries().catch(() => []),
  ]);

  const now = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: siteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: siteUrl("/concerts"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl("/venues"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl("/travel"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: siteUrl("/resume"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/search"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: siteUrl("/experiments"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: siteUrl("/experiments/dashboard"), lastModified: now, changeFrequency: "daily", priority: 0.4 },
    { url: siteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const postEntries = posts.map<MetadataRoute.Sitemap[number]>((p) => ({
    url: siteUrl(`/blog/${p.slug}`),
    lastModified: p.updatedAt ?? p.publishedAt ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const concertEntries = concerts.map<MetadataRoute.Sitemap[number]>((c) => ({
    url: siteUrl(`/concerts/${c.slug ?? c.id}`),
    lastModified: c.updatedAt ?? c.date ?? now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const venueEntries = venues.map<MetadataRoute.Sitemap[number]>((v) => ({
    url: siteUrl(`/venues/${v.id}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const travelEntries = travel.map<MetadataRoute.Sitemap[number]>((t) => ({
    url: siteUrl(`/travel/${t.slug ?? t.id}`),
    lastModified: t.updatedAt ?? t.startDate ?? now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries, ...concertEntries, ...venueEntries, ...travelEntries];
}

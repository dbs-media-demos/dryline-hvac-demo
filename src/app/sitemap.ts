import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { posts } from "@/content/posts";

const UPDATED = new Date("2026-09-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly", lastModified = UPDATED) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/services", 0.9),
    ...services.map((s) => page(`/services/${s.slug}`, 0.9)),
    page("/comfort-club", 0.8),
    page("/repair-or-replace", 0.7),
    page("/financing", 0.7),
    page("/specials", 0.7, "weekly"),
    page("/service-areas", 0.8),
    ...cities.map((c) => page(`/service-areas/${c.slug}`, 0.8)),
    page("/reviews", 0.6, "weekly"),
    page("/about", 0.6),
    page("/faq", 0.6),
    page("/blog", 0.5, "weekly"),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.5, "yearly", new Date(p.published))),
    page("/schedule", 0.8),
    page("/contact", 0.7),
    page("/privacy", 0.2, "yearly"),
  ];
}

import type { MetadataRoute } from "next";
import { noindex, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Concept sites stay out of search engines by default (NEXT_PUBLIC_NOINDEX !== "false").
  if (noindex) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

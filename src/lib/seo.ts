import type { Metadata } from "next";
import { site } from "./site";

type Input = {
  title: string;
  description: string;
  path: string;
  eyebrow?: string;
  absoluteTitle?: boolean;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
};

export const ogImageUrl = (title: string, eyebrow?: string) => {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/api/og?${params.toString()}`;
};

export function buildMetadata({ title, description, path, eyebrow, absoluteTitle, image, type = "website", publishedTime, keywords }: Input): Metadata {
  const og = image ?? ogImageUrl(title, eyebrow);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: "en_US",
      images: [{ url: og, width: 1200, height: 630, alt: title }],
      ...(type === "article" ? { publishedTime, authors: [site.name] } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [og] },
  };
}

import type { Metadata } from "next";
import { previewBiz } from "./preview";
import { L } from "./biz-core";

/** Title and description for a personalised preview (/for/<token> and its /v2); never indexed. */
export async function previewMetadata(token: string): Promise<Metadata> {
  const biz = await previewBiz(token);
  const robots = { index: false, follow: false, googleBot: { index: false, follow: false } };
  if (!biz) return { title: "Preview not found", robots };
  const place = [biz.address.city || biz.area, biz.address.region].filter(Boolean).join(", ");
  const title = L(biz, `${biz.name} | AC & Furnace Repair in ${place || biz.area}`, `${biz.name} | Klima uređaji i grejanje, ${place || biz.area}`);
  const description = L(
    biz,
    `Same-day AC and furnace repair, honest replacements and flat-rate pricing in ${biz.area}. Call ${biz.phoneDisplay || "us"}.`,
    `Servis i ugradnja klima uređaja i grejanja — ${biz.area}. Fiksne cene, servis istog dana. Pozovite ${biz.phoneDisplay || "nas"}.`,
  );
  return {
    title: { absolute: title },
    description,
    robots,
    alternates: { canonical: null },
    openGraph: { type: "website", siteName: biz.name, title, description, images: [] },
    twitter: { card: "summary", title, description },
  };
}

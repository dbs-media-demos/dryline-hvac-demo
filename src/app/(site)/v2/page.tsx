import type { Metadata } from "next";
import { JsonLd } from "@/components/layout/JsonLd";
import { HomeContent, homeFaqs } from "@/components/home/HomeContent";
import { DuctHouse } from "@/components/home/DuctHouse";
import { buildMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { faqSchema, graph, offerCatalogSchema, webPageSchema } from "@/lib/schema";

/**
 * The homepage without 3D, for a slow laptop or a lead who'd rather not: the same sections, words
 * and photos as `/`, with the drawn house (DuctHouse) as the hero's centrepiece. Not a page of its
 * own for search: it points to `/`.
 */
const title = "Dryline Heat & Air | AC & Furnace Repair in Oklahoma City";
const description =
  "Same-day AC repair, furnace repair and new systems across OKC, Edmond, Norman, Moore and Yukon. Flat-rate pricing, no overtime, 24/7 emergency service. Call (405) 555-0142.";

export const metadata: Metadata = {
  ...buildMetadata({ title, description, path: "/", absoluteTitle: true, eyebrow: "Heating & air · Oklahoma City" }),
  robots: { index: false, follow: true },
};

export default function HomeV2() {
  return (
    <HomeContent hero={<DuctHouse />}>
      <JsonLd
        data={graph(
          webPageSchema({ path: "/", name: title, description }),
          offerCatalogSchema(services.map((s) => ({ name: s.name, path: `/services/${s.slug}` }))),
          faqSchema(homeFaqs),
        )}
      />
    </HomeContent>
  );
}

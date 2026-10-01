import type { ReactNode } from "react";
import { JsonLd } from "@/components/layout/JsonLd";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { businessSchema, websiteSchema, graph } from "@/lib/schema";

/** The concept site: the fictional company's chrome and structured data around every page. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      <JsonLd data={graph(businessSchema(), websiteSchema())} />
    </>
  );
}

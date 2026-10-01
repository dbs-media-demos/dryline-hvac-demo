import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { Coupon } from "@/components/sections/Coupon";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { specials } from "@/content/company";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, webPageSchema, bizId } from "@/lib/schema";

const title = "HVAC Specials & Coupons";
const description = "Current Dryline Heat & Air specials in Oklahoma City: $69 tune-ups for new customers, $500 off a new system, free second opinions and 10% off for seniors, military and teachers.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/specials", eyebrow: "Specials" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Specials", path: "/specials" },
];

export default function SpecialsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Specials"
        title="Good deals, no fine-print games."
        lede="Mention the code when you call or add it when you book online. One offer per visit; can't be combined with Comfort Club discounts on the same repair."
        photo={img.unitTealWall}
        crumbs={crumbs}
      />
      <section className="py-20 md:py-28" aria-label="Current offers">
        <Reveal className="mx-auto grid max-w-[1480px] gap-6 px-5 md:grid-cols-2 md:px-8" stagger={0.1}>
          {specials.map((s, i) => (
            <Coupon key={s.id} tag={s.tag} title={s.title} body={s.body} code={s.code} until={s.until} featured={i === 1} />
          ))}
        </Reveal>
        <p className="mx-auto mt-8 max-w-[1480px] px-5 text-[0.82rem] text-muted md:px-8">
          Offers valid in the Dryline service area for residential customers. Energy-efficiency rebates may be available on qualifying equipment and are applied separately.
        </p>
      </section>
      <CtaBand title="Book with a code in two minutes." photo={img.summerFan} />
      <JsonLd
        data={graph(
          webPageSchema({ path: "/specials", name: title, description }),
          breadcrumbSchema(crumbs),
          ...specials.map((s) => ({
            "@type": "Offer",
            name: s.title,
            description: s.body,
            ...(s.until ? { validThrough: s.until } : {}),
            seller: { "@id": bizId },
          })),
        )}
      />
    </PageShell>
  );
}

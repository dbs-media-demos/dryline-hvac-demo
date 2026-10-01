import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ComfortClub } from "@/components/sections/ComfortClub";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Parallax, Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { faqs } from "@/content/faqs";
import { plans } from "@/content/plans";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, graph, webPageSchema, bizId } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const title = "Comfort Club HVAC Maintenance Plans";
const description =
  "Dryline's Comfort Club: spring AC and fall furnace tune-ups, priority same-day service, up to 20% off repairs, $0 diagnostics and no overtime fees. From $14.95/month in the OKC metro.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/comfort-club", eyebrow: "Comfort Club" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Comfort Club", path: "/comfort-club" },
];

const checklist = [
  "Refrigerant pressures & superheat",
  "Capacitor & contactor readings",
  "Condenser coil rinse",
  "Condensate drain flush",
  "Burner & flame sensor service",
  "Carbon monoxide test",
  "Heat exchanger inspection",
  "Blower & motor amp draw",
  "Electrical connections tightened",
  "Thermostat calibration",
  "Filter check (or delivery)",
  "Photo report to your inbox",
];

export default function ComfortClubPage() {
  const clubFaqs = faqs.filter((f) => f.topic === "Comfort Club");
  return (
    <PageShell>
      <PageHero
        eyebrow="The Comfort Club"
        title="Skip the line when the heat wave hits."
        lede="Over 4,000 metro homes are members. When 400 calls come in on the first 105° day, they're the ones we see first."
        photo={img.familyFloor}
        crumbs={crumbs}
      />

      <section className="py-24 md:py-32" aria-labelledby="plans-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead align="center" eyebrow="Pick a plan" title={<span id="plans-title">Three plans. Zero overtime fees.</span>}>
            Every plan pays for itself the first time something breaks in July.
          </SectionHead>
          <div className="mt-14">
            <ComfortClub />
          </div>
        </div>
      </section>

      <section className="theme-navy py-24 md:py-32" aria-labelledby="tune-title">
        <div className="mx-auto grid max-w-[1480px] gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-accent-auto">The 21-point tune-up</p>
            <h2 id="tune-title" className="display-md mt-5 max-w-[16ch]">
              What we actually do in your yard and attic.
            </h2>
            <Reveal as="ul" className="mt-10 grid gap-x-8 sm:grid-cols-2" stagger={0.04}>
              {checklist.map((c, i) => (
                <li key={c} className="flex items-baseline gap-3 border-b border-line py-3">
                  <span className="font-mono text-[0.7rem] text-accent-auto">{String(i + 1).padStart(2, "0")}</span>
                  {c}
                </li>
              ))}
            </Reveal>
          </div>
          <Parallax className="aspect-[4/5] rounded-[28px]" amount={14}>
            <div className="absolute inset-0">
              <Photo photo={img.techManifoldKneel} sizes="(min-width: 1024px) 45vw, 92vw" />
            </div>
          </Parallax>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="cfaq-title">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead eyebrow="Questions" title={<span id="cfaq-title">Membership, explained.</span>} />
          <Reveal>
            <FaqList items={clubFaqs} />
          </Reveal>
        </div>
      </section>

      <CtaBand title="Join today. Your first tune-up can be this week." photo={img.homeBright} />

      <JsonLd
        data={graph(
          webPageSchema({ path: "/comfort-club", name: title, description }),
          breadcrumbSchema(crumbs),
          {
            "@type": "OfferCatalog",
            name: "Comfort Club maintenance plans",
            url: absoluteUrl("/comfort-club"),
            itemListElement: plans.map((p) => ({
              "@type": "Offer",
              name: `Comfort Club ${p.name}`,
              description: p.blurb,
              price: p.monthly,
              priceCurrency: "USD",
              seller: { "@id": bizId },
            })),
          },
          faqSchema(clubFaqs),
        )}
      />
    </PageShell>
  );
}

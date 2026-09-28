import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Statement } from "@/components/home/Statement";
import { DrylineSplit } from "@/components/home/DrylineSplit";
import { ServicesList } from "@/components/home/ServicesList";
import { DayOnCall } from "@/components/home/DayOnCall";
import { RepairReplace } from "@/components/sections/RepairReplace";
import { ComfortClub } from "@/components/sections/ComfortClub";
import { ReviewsSection } from "@/components/sections/Reviews";
import { ServiceMap, ServiceAreaList } from "@/components/sections/ServiceMap";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Icons";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { faqs } from "@/content/faqs";
import { services } from "@/content/services";
import { faqSchema, graph, offerCatalogSchema, webPageSchema } from "@/lib/schema";

const title = "Dryline Heat & Air | AC & Furnace Repair in Oklahoma City";
const description =
  "Same-day AC repair, furnace repair and new systems across OKC, Edmond, Norman, Moore and Yukon. Flat-rate pricing, no overtime, 24/7 emergency service. Call (405) 555-0142.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/", absoluteTitle: true, eyebrow: "Heating & air · Oklahoma City" });

const homeFaqs = faqs.filter((_, i) => [0, 2, 3, 5, 6, 9].includes(i));

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <Stats />
      <Statement />
      <DrylineSplit />

      <section className="py-24 md:py-36" aria-labelledby="services-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHead eyebrow="Services" title={<span id="services-title">Everything between the thermostat and the sky.</span>}>
              Repairs, replacements and the upgrades that make a house feel different — all at flat prices you see before we start.
            </SectionHead>
            <Reveal>
              <Link href="/services" className="btn btn-navy">
                All services <ArrowIcon width={18} height={18} />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14">
            <ServicesList />
          </div>
        </div>
      </section>

      <DayOnCall />

      <section className="py-24 md:py-36" aria-labelledby="calc-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead eyebrow="Repair or replace?" title={<span id="calc-title">Should you fix it, or let it go?</span>}>
            Four numbers, one honest answer. The same math our comfort advisors use — no salesperson required.
          </SectionHead>
          <Reveal className="mt-14">
            <RepairReplace />
          </Reveal>
        </div>
      </section>

      <section className="bg-mist/60 py-24 md:py-36" aria-labelledby="club-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead align="center" eyebrow="The Comfort Club" title={<span id="club-title">Skip the line when the heat wave hits.</span>}>
            Tune-ups on a schedule, priority dispatch, real discounts on repairs — and never an overtime fee. From $14.95 a month.
          </SectionHead>
          <div className="mt-14">
            <ComfortClub />
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="py-24 md:py-36" aria-labelledby="area-title">
        <div className="mx-auto grid max-w-[1480px] gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <SectionHead eyebrow="Service area" title={<span id="area-title">Six cities. One flat rate.</span>}>
              Trucks stationed north, south and west of Midtown so no one in the metro waits on I-35 traffic.
            </SectionHead>
            <Reveal className="mt-10">
              <ServiceAreaList />
            </Reveal>
          </div>
          <Reveal>
            <ServiceMap />
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-36" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead eyebrow="FAQ" title={<span id="faq-title">Straight answers.</span>}>
              Still wondering? Call {site.phoneDisplay} — a real person picks up, day or night.
            </SectionHead>
            <Reveal className="mt-8">
              <Link href="/faq" className="btn btn-navy">
                More questions <ArrowIcon width={18} height={18} />
              </Link>
            </Reveal>
          </div>
          <Reveal>
            <FaqList items={homeFaqs} />
          </Reveal>
        </div>
      </section>

      <CtaBand />

      <JsonLd
        data={graph(
          webPageSchema({ path: "/", name: title, description }),
          offerCatalogSchema(services.map((s) => ({ name: s.name, path: `/services/${s.slug}` }))),
          faqSchema(homeFaqs),
        )}
      />
    </PageShell>
  );
}

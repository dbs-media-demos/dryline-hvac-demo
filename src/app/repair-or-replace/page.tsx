import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { RepairReplace } from "@/components/sections/RepairReplace";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Icons";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

const title = "Repair or Replace Your AC? Free Calculator";
const description =
  "Should you repair or replace your air conditioner or heat pump? Enter your system's age, repair quote, SEER and electric bill for an honest recommendation and estimated yearly savings.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/repair-or-replace", eyebrow: "Repair or replace?" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Repair or replace", path: "/repair-or-replace" },
];

const factors = [
  { title: "The $5,000 rule", body: "Multiply the system's age by the repair cost. Under $5,000, repair usually wins. Over it, replacement usually does." },
  { title: "Refrigerant", body: "Systems built before 2010 often use R-22, which is no longer produced. A refrigerant leak on an R-22 system is expensive to fix and a strong signal to replace." },
  { title: "Efficiency", body: "A 10 SEER system uses roughly 40% more electricity than a modern 16 SEER2 system for the same cooling. In an Oklahoma summer, that adds up fast." },
  { title: "Comfort", body: "Hot rooms, humidity and noise aren't in the math, but they matter. Variable-speed systems fix problems a repair never will." },
];

export default function RepairReplacePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Repair or replace?"
        title="Fix it, or let it go? Do the math in 30 seconds."
        lede="The same four numbers our comfort advisors look at. An honest starting point before anyone quotes you a new system."
        photo={img.unitGrate}
        crumbs={crumbs}
      />
      <section className="py-20 md:py-28" aria-label="Calculator">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <RepairReplace />
        </div>
      </section>

      <section className="bg-mist/60 py-24 md:py-32" aria-labelledby="factors-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead eyebrow="What goes into it" title={<span id="factors-title">Four things we weigh.</span>} />
          <Reveal className="mt-12 grid gap-5 md:grid-cols-2" stagger={0.08}>
            {factors.map((f, i) => (
              <div key={f.title} className="rounded-[24px] bg-white p-8 ring-1 ring-line">
                <span className="font-mono text-[0.72rem] text-accent-auto">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-[1.5rem] tracking-[-0.04em]">{f.title}</h3>
                <p className="mt-3 text-muted">{f.body}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href="/financing" className="btn btn-navy">
              See financing <ArrowIcon width={18} height={18} />
            </Link>
            <Link href="/services/ac-installation" className="btn btn-ghost">
              New AC systems
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Want a real answer? We'll give you a free second opinion." photo={img.techCondenserGauges} />
      <JsonLd data={graph(webPageSchema({ path: "/repair-or-replace", name: title, description }), breadcrumbSchema(crumbs))} />
    </PageShell>
  );
}

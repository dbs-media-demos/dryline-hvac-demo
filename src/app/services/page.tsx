import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { StepStack } from "@/components/sections/StepStack";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneIcon } from "@/components/ui/Icons";
import { services, kindLabel, type ServiceKind } from "@/content/services";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { breadcrumbSchema, graph, offerCatalogSchema, webPageSchema } from "@/lib/schema";
import Link from "next/link";

const title = "Heating & Air Conditioning Services in Oklahoma City";
const description =
  "AC repair and installation, furnace repair and installation, heat pumps, ductless mini-splits, indoor air quality, duct cleaning and smart thermostats across the OKC metro. Flat-rate pricing.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/services", eyebrow: "Services" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

const groups: { kind: ServiceKind; title: string; body: string }[] = [
  { kind: "cool", title: "Cooling", body: "For the 100° weeks. Same-day repairs and systems sized for Oklahoma summers." },
  { kind: "heat", title: "Heating", body: "For the blue northers. 24/7 furnace repair and quiet, efficient heat." },
  { kind: "air", title: "Air & comfort", body: "Heat pumps, mini-splits, cleaner air and smarter control." },
];

const process = [
  { title: "Talk to a person", body: "Call or book online. A real dispatcher gives you an arrival window — usually same day, 24/7 for emergencies." },
  { title: "Find the real problem", body: "A certified technician tests the whole system, then explains what's wrong in plain English, with photos." },
  { title: "Approve a flat price", body: "Options on a tablet, each with a fixed price. No hourly meter, no overtime, no surprise line items." },
  { title: "Fixed right — guaranteed", body: "1-year warranty on repairs, 10 years on installs, and a 100% satisfaction guarantee on everything." },
];

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Services"
        title="Everything between the thermostat and the sky."
        lede="Nine services, one standard: a real diagnosis, a flat price before we start, and work we guarantee in writing."
        photo={img.techCondenserSiding}
        crumbs={crumbs}
      >
        <a href={telHref} className="btn btn-accent on-dark">
          <PhoneIcon /> {site.phoneDisplay}
        </a>
        <Link href="/schedule" className="btn btn-ghost">
          Schedule service
        </Link>
      </PageHero>

      {groups.map((g) => (
        <section key={g.kind} className="py-20 md:py-28" aria-labelledby={`grp-${g.kind}`}>
          <div className="mx-auto max-w-[1480px] px-5 md:px-8">
            <div className="flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
              <h2 id={`grp-${g.kind}`} className="display-md">
                {g.title}
              </h2>
              <p className="max-w-[28rem] text-muted">{g.body}</p>
            </div>
            <Reveal className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
              {services
                .filter((s) => s.kind === g.kind)
                .map((s) => (
                  <ServiceCard key={s.slug} s={s} />
                ))}
            </Reveal>
            <p className="sr-only">{kindLabel[g.kind]}</p>
          </div>
        </section>
      ))}

      <section className="bg-mist/60 py-24 md:py-32" aria-labelledby="process-title">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-[calc(var(--bar-h)+var(--header-h)+24px)] lg:self-start">
            <SectionHead eyebrow="How every visit works" title={<span id="process-title">No surprises. That&rsquo;s the whole process.</span>} />
          </div>
          <StepStack steps={process} />
        </div>
      </section>

      <CtaBand photo={img.okcAerialSunset} />

      <JsonLd
        data={graph(
          webPageSchema({ path: "/services", name: title, description, type: "CollectionPage" }),
          breadcrumbSchema(crumbs),
          offerCatalogSchema(services.map((s) => ({ name: s.name, path: `/services/${s.slug}` }))),
        )}
      />
    </PageShell>
  );
}

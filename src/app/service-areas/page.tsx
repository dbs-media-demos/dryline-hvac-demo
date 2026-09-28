import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceMap } from "@/components/sections/ServiceMap";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { cities } from "@/content/cities";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

const title = "HVAC Service Areas: OKC, Edmond, Norman, Moore, Yukon & Mustang";
const description = "Dryline Heat & Air serves the whole Oklahoma City metro with same-day heating and air conditioning service: Edmond, Norman, Moore, Yukon, Mustang, Nichols Hills, Bethany and Midwest City.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/service-areas", eyebrow: "Service areas" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Service areas", path: "/service-areas" },
];

export default function ServiceAreasPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Service areas" title="Six cities. One flat rate. Zero trip charges." lede="Trucks stationed north, south and west of Midtown so no one in the metro waits on I-35 traffic." photo={img.okcAerialSunset} crumbs={crumbs} />
      <section className="py-20 md:py-28" aria-label="Map">
        <div className="mx-auto grid max-w-[1480px] gap-10 px-5 md:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <ServiceMap />
          </Reveal>
          <Reveal>
            <h2 className="display-md">Also serving</h2>
            <p className="mt-5 text-muted lede">
              Oklahoma City (all quadrants), Mustang, Nichols Hills, The Village, Bethany, Warr Acres, Midwest City, Del City, Piedmont, Newcastle and Choctaw. Not sure? Call — if we
              can get there fast, we&rsquo;ll come.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="pb-24 md:pb-32" aria-label="City pages">
        <Reveal className="mx-auto grid max-w-[1480px] gap-5 px-5 sm:grid-cols-2 md:px-8 lg:grid-cols-4" stagger={0.08}>
          {cities.map((c) => (
            <Link key={c.slug} href={`/service-areas/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[24px]" data-cursor="View">
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105">
                <Photo photo={c.photo} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 92vw" quality={60} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 text-frost">
                <p className="font-mono text-[0.68rem] tracking-[0.14em] uppercase opacity-75">{c.drive}</p>
                <h2 className="mt-2 flex items-center justify-between font-display text-[1.9rem] tracking-[-0.045em]">
                  {c.name} <ArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" />
                </h2>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>
      <CtaBand photo={img.stormLightning} />
      <JsonLd data={graph(webPageSchema({ path: "/service-areas", name: title, description, type: "CollectionPage" }), breadcrumbSchema(crumbs))} />
    </PageShell>
  );
}

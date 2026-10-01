import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneIcon, StarIcon } from "@/components/ui/Icons";
import { cities, cityBySlug } from "@/content/cities";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { breadcrumbSchema, graph, serviceSchema, webPageSchema } from "@/lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/service-areas/[city]">): Promise<Metadata> {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) return {};
  return buildMetadata({
    title: `Heating & AC Repair in ${c.name}, OK`,
    description: `Same-day AC repair, furnace repair and new HVAC systems in ${c.name}, OK. ${c.drive}. Flat-rate pricing, no overtime, 24/7 emergency service. Call ${site.phoneDisplay}.`,
    path: `/service-areas/${c.slug}`,
    eyebrow: `${c.name}, Oklahoma`,
    keywords: [`HVAC ${c.name} OK`, `AC repair ${c.name}`, `furnace repair ${c.name}`],
  });
}

export default async function CityPage({ params }: PageProps<"/service-areas/[city]">) {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service areas", path: "/service-areas" },
    { name: c.name, path: `/service-areas/${c.slug}` },
  ];
  const others = cities.filter((o) => o.slug !== c.slug);

  return (
    <PageShell>
      <PageHero
        eyebrow={`${c.name}, Oklahoma · ${c.county}`}
        title={`Heating & air in ${c.name}, done the same day.`}
        lede={c.intro}
        photo={c.photo}
        crumbs={crumbs}
        aside={
          <div className="w-full rounded-[22px] bg-frost/10 p-6 ring-1 ring-white/15 backdrop-blur-md lg:w-[300px]">
            <p className="flex items-center gap-1 text-accent">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} width={14} height={14} />
              ))}
            </p>
            <p className="mt-3 text-[0.95rem]">&ldquo;{c.review.text}&rdquo;</p>
            <p className="mt-3 font-mono text-[0.68rem] tracking-[0.12em] text-frost/60 uppercase">{c.review.name}</p>
          </div>
        }
      >
        <a href={telHref} className="btn btn-accent on-dark">
          <PhoneIcon /> {site.phoneDisplay}
        </a>
        <Link href="/schedule" className="btn btn-ghost">
          Schedule in {c.name}
        </Link>
      </PageHero>

      <section className="py-24 md:py-32" aria-labelledby="local-title">
        <div className="mx-auto grid max-w-[1480px] gap-14 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow={`Local knowledge`} title={<span id="local-title">What we see in {c.name} homes.</span>} />
            <Reveal className="mt-10">
              <p className="font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase">Neighborhoods we&rsquo;re in every week</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.neighborhoods.map((n) => (
                  <li key={n} className="rounded-full bg-white px-4 py-2 text-[0.92rem] ring-1 ring-line">
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.9rem] text-muted">ZIP codes: {c.zips.join(", ")}</p>
            </Reveal>
          </div>
          <Reveal className="grid gap-5" stagger={0.1}>
            {c.local.map((l) => (
              <div key={l.title} className="rounded-[24px] bg-white p-8 ring-1 ring-line">
                <h3 className="font-display text-[1.4rem] tracking-[-0.04em]">{l.title}</h3>
                <p className="mt-3 text-muted">{l.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-mist/60 py-24 md:py-32" aria-labelledby="csvc-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <h2 id="csvc-title" className="display-md">
            Popular in {c.name}
          </h2>
          <Reveal className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.slug} s={s} />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-16" aria-label="Other service areas">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-3 px-5 md:px-8">
          <span className="mr-2 text-muted">Also serving:</span>
          {others.map((o) => (
            <Link key={o.slug} href={`/service-areas/${o.slug}`} className="btn btn-ghost min-h-[44px]">
              {o.name}
            </Link>
          ))}
          <Link href="/service-areas" className="btn btn-ghost min-h-[44px]">
            All areas
          </Link>
        </div>
      </section>

      <CtaBand title={`${c.name}: a technician can be there today.`} />
      <JsonLd
        data={graph(
          webPageSchema({ path: `/service-areas/${c.slug}`, name: `Heating & AC Repair in ${c.name}, OK`, description: c.intro }),
          breadcrumbSchema(crumbs),
          serviceSchema({ name: `HVAC service in ${c.name}, OK`, description: c.intro, path: `/service-areas/${c.slug}`, image: c.photo.src, area: [c.name] }),
        )}
      />
    </PageShell>
  );
}

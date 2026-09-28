import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ScheduleForm } from "@/components/forms/ScheduleForm";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { CheckIcon, PhoneIcon } from "@/components/ui/Icons";
import { Stars } from "@/components/sections/Reviews";
import { reviews } from "@/content/reviews";
import { buildMetadata } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

const title = "Schedule HVAC Service Online";
const description = "Book AC repair, furnace repair, a tune-up or a free new-system estimate online in about two minutes. Same-day slots across the Oklahoma City metro, 24/7 emergency dispatch.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/schedule", eyebrow: "Schedule service" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Schedule service", path: "/schedule" },
];

export default function SchedulePage() {
  const r = reviews[0];
  return (
    <PageShell>
      <PageHero eyebrow="Schedule service" title="Book in two minutes. Cool (or warm) by tonight." crumbs={crumbs} />
      <section className="-mt-4 pb-24 md:pb-32" aria-label="Booking">
        <div className="mx-auto grid max-w-[1480px] gap-10 px-5 md:px-8 lg:grid-cols-[1fr_22rem]">
          <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[28px] bg-white ring-1 ring-line" />}>
            <ScheduleForm />
          </Suspense>
          <aside className="grid content-start gap-5 lg:sticky lg:top-[calc(var(--bar-h)+var(--header-h)+24px)]">
            <div className="theme-navy rounded-[24px] p-7">
              <p className="font-display text-[1.3rem] leading-tight tracking-[-0.04em]">Emergency? Skip the form.</p>
              <a href={telHref} className="btn btn-accent on-dark mt-5 w-full">
                <PhoneIcon width={18} height={18} /> {site.phoneDisplay}
              </a>
              <OpenBadge className="mt-5 text-frost/80" />
            </div>
            <div className="rounded-[24px] bg-white p-7 ring-1 ring-line">
              <p className="font-display text-[1.1rem] tracking-[-0.03em]">What happens next</p>
              <ul className="mt-4 space-y-3 text-[0.95rem]">
                {["We confirm by text within 15 minutes", "Your tech's name and photo before arrival", "Flat-rate options before any work starts", "1-year warranty on every repair"].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-accent-auto" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="rounded-[24px] bg-white p-7 ring-1 ring-line">
              <Stars n={5} />
              <blockquote className="mt-3 text-[0.95rem] text-navy/85">&ldquo;{r.text.slice(0, 150)}…&rdquo;</blockquote>
              <figcaption className="mt-3 text-[0.82rem] text-muted">
                {r.name}, {r.area}
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>
      <JsonLd data={graph(webPageSchema({ path: "/schedule", name: title, description }), breadcrumbSchema(crumbs))} />
    </PageShell>
  );
}

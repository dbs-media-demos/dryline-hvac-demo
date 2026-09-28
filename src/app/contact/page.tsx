import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { ServiceMap } from "@/components/sections/ServiceMap";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Reveal } from "@/components/ui/Reveal";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { hoursTable } from "@/lib/hours";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { site, telHref, mailHref } from "@/lib/site";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

const title = "Contact Dryline Heat & Air";
const description = `Call ${site.phoneDisplay} 24/7, email ${site.email}, or visit our Midtown Oklahoma City office. Office hours Mon–Fri 7am–7pm, Sat 8am–4pm; emergency dispatch around the clock.`;

export const metadata: Metadata = buildMetadata({ title, description, path: "/contact", eyebrow: "Contact" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Contact" title="A real person answers. Every hour of every day." photo={img.okcStreetGolden} crumbs={crumbs}>
        <a href={telHref} className="btn btn-accent on-dark">
          <PhoneIcon /> {site.phoneDisplay}
        </a>
      </PageHero>

      <section className="py-20 md:py-28" aria-label="Contact details">
        <div className="mx-auto grid max-w-[1480px] gap-10 px-5 md:px-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <h2 className="display-md">Send us a note</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
          <Reveal className="grid content-start gap-5">
            <div className="rounded-[24px] bg-white p-7 ring-1 ring-line">
              <ul className="space-y-4">
                <li>
                  <a href={telHref} className="flex items-center gap-4 font-display text-[1.3rem] tracking-[-0.03em]">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent-ink">
                      <PhoneIcon width={18} height={18} />
                    </span>
                    {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={mailHref} className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent-ink">
                      <MailIcon width={18} height={18} />
                    </span>
                    {site.email}
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink">
                    <PinIcon width={18} height={18} />
                  </span>
                  <address className="not-italic">
                    {site.address.street}, {site.address.city}, {site.address.region} {site.address.postal}
                  </address>
                </li>
              </ul>
              <OpenBadge className="mt-6" />
              <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[0.92rem]">
                {hoursTable.map((h) => (
                  <div key={h.day} className="contents">
                    <dt className="text-muted">{h.day}</dt>
                    <dd className="tabular">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ServiceMap />
          </Reveal>
        </div>
      </section>
      <JsonLd data={graph(webPageSchema({ path: "/contact", name: title, description, type: "ContactPage" }), breadcrumbSchema(crumbs))} />
    </PageShell>
  );
}

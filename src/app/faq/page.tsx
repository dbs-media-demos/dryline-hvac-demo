import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { faqs, type Faq } from "@/content/faqs";
import { services } from "@/content/services";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/schema";

const title = "HVAC Questions, Answered";
const description = "Answers to common heating and air conditioning questions from Oklahoma City homeowners: pricing, same-day service, system lifespan, repair vs replace, rebates and the Comfort Club.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/faq", eyebrow: "FAQ" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

const topics: Faq["topic"][] = ["Service", "Pricing", "Systems", "Comfort Club"];

export default function FaqPage() {
  const systemFaqs = services.flatMap((s) => s.faqs).slice(0, 6);
  const all = [...faqs, ...systemFaqs];
  return (
    <PageShell>
      <PageHero eyebrow="FAQ" title="Straight answers to real questions." lede="If yours isn't here, call — the person who answers can actually help." photo={img.thermostatManHome} crumbs={crumbs} position="50% 35%" />
      <section className="py-20 md:py-28" aria-label="Frequently asked questions">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 md:px-8 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-[calc(var(--bar-h)+var(--header-h)+24px)] lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {[...topics, "Equipment" as const].map((t) => (
                <li key={t}>
                  <a href={`#${t.toLowerCase().replace(" ", "-")}`} className="inline-flex min-h-[44px] items-center rounded-full bg-white px-4 ring-1 ring-line hover:ring-navy/40">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-16">
            {topics.map((t) => (
              <Reveal key={t} as="section">
                <h2 id={t.toLowerCase().replace(" ", "-")} className="display-md">
                  {t}
                </h2>
                <FaqList className="mt-6" items={faqs.filter((f) => f.topic === t)} />
              </Reveal>
            ))}
            <Reveal as="section">
              <h2 id="equipment" className="display-md">
                Equipment
              </h2>
              <FaqList className="mt-6" items={systemFaqs} />
            </Reveal>
          </div>
        </div>
      </section>
      <CtaBand photo={img.stormShelf} />
      <JsonLd data={graph(webPageSchema({ path: "/faq", name: title, description }), breadcrumbSchema(crumbs), faqSchema(all))} />
    </PageShell>
  );
}

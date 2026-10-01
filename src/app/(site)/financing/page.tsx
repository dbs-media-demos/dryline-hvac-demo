import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { PaymentEstimator } from "@/components/sections/PaymentEstimator";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

const title = "HVAC Financing in Oklahoma City";
const description =
  "Finance a new AC, furnace or heat pump with Dryline: 0% APR for 18 months or low monthly payments up to 10 years, on approved credit. Plus rebates that may be available.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/financing", eyebrow: "Financing" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Financing", path: "/financing" },
];

const points = [
  { k: "2 min", title: "Apply in the driveway", body: "A soft-pull pre-qualification on the tablet during your estimate. It won't touch your credit score." },
  { k: "0%", title: "Promotional APR", body: "18 months same-as-cash on approved credit — pay it off before the promo ends and pay no interest." },
  { k: "$89", title: "Low monthly options", body: "Terms up to 10 years so a new system costs less per month than your old one's repairs." },
  { k: "$$$", title: "Rebates & tax credits", body: "Energy-efficiency rebates and federal tax credits may be available. We check every program for your quote." },
];

export default function FinancingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Financing"
        title="A new system shouldn't wait for a better month."
        lede="When the AC dies in July, you don't get to choose the timing. Flexible payments mean you don't have to."
        photo={img.familyKitchen}
        crumbs={crumbs}
      />

      <section className="py-20 md:py-28" aria-labelledby="est-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead eyebrow="Estimate your payment" title={<span id="est-title">What would it cost per month?</span>} />
          <Reveal className="mt-12">
            <PaymentEstimator />
          </Reveal>
        </div>
      </section>

      <section className="bg-mist/60 py-24 md:py-32" aria-labelledby="how-fin">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead eyebrow="How it works" title={<span id="how-fin">Simple, on purpose.</span>} />
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {points.map((p) => (
              <div key={p.title} className="rounded-[24px] bg-white p-7 ring-1 ring-line">
                <p className="font-display text-[2.4rem] leading-none tracking-[-0.06em] text-accent-auto">{p.k}</p>
                <h3 className="mt-6 font-display text-[1.2rem] tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-2 text-muted">{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand title="Get a free estimate — financing options included." photo={img.homeFireplace} />
      <JsonLd data={graph(webPageSchema({ path: "/financing", name: title, description }), breadcrumbSchema(crumbs))} />
    </PageShell>
  );
}

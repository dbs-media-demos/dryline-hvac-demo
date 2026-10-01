import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { RatingSummary } from "@/components/sections/Reviews";
import { ReviewsGrid } from "@/components/sections/ReviewsGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

const title = "Customer Reviews";
const description = `Rated ${site.rating.value}/5 from ${site.rating.count.toLocaleString("en-US")} Google reviews. Read what Oklahoma City, Edmond, Norman, Moore and Yukon homeowners say about Dryline Heat & Air.`;

export const metadata: Metadata = buildMetadata({ title, description, path: "/reviews", eyebrow: "Reviews" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Reviews", path: "/reviews" },
];

export default function ReviewsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Reviews"
        title={`${site.rating.count.toLocaleString("en-US")} neighbors, ${site.rating.value} stars.`}
        lede="We text every customer a link after the visit and publish what they say — good days and the occasional off one."
        photo={img.familyCouch}
        crumbs={crumbs}
      />
      <section className="py-20 md:py-28" aria-label="All reviews">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <Reveal>
            <RatingSummary />
          </Reveal>
          <div className="mt-14">
            <ReviewsGrid />
          </div>
          <p className="mt-10 text-[0.82rem] text-muted">Reviews shown are illustrative for this concept site.</p>
        </div>
      </section>
      <CtaBand title="Be our next five-star story." photo={img.winterMug} />
      <JsonLd data={graph(webPageSchema({ path: "/reviews", name: title, description }), breadcrumbSchema(crumbs))} />
    </PageShell>
  );
}

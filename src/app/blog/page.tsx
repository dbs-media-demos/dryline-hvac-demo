import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { posts } from "@/content/posts";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const title = "Comfort Notes: Seasonal HVAC Tips for Oklahoma";
const description = "Practical heating and cooling advice for Oklahoma homes from Dryline's technicians: heat-wave AC care, furnace checks before the first freeze, and storm-season condenser tips.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/blog", eyebrow: "Comfort notes" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

const fmt = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function BlogPage() {
  const [first, ...rest] = [...posts].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <PageShell>
      <PageHero eyebrow="Comfort notes" title="Advice for a state with four seasons a week." lede="Written by the technicians who get the calls. No fluff, no upsell." crumbs={crumbs} />
      <section className="py-20 md:py-28" aria-label="Articles">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <Reveal>
            <Link href={`/blog/${first.slug}`} className="group grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center" data-cursor="Read">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[28px]">
                <ViewTransition name={`post-${first.slug}`} share="morph" default="none">
                  <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]">
                    <Photo photo={first.photo} sizes="(min-width: 1024px) 56vw, 92vw" />
                  </div>
                </ViewTransition>
              </div>
              <div>
                <p className="font-mono text-[0.7rem] tracking-[0.14em] text-accent-auto uppercase">
                  {first.season} · {first.readMins} min read
                </p>
                <h2 className="display-md mt-4">{first.title}</h2>
                <p className="mt-4 text-muted lede">{first.excerpt}</p>
                <p className="mt-6 inline-flex items-center gap-2 font-semibold">
                  Read the article <ArrowUpRight width={18} height={18} className="transition-transform duration-500 group-hover:rotate-45" />
                </p>
              </div>
            </Link>
          </Reveal>
          <Reveal className="mt-20 grid gap-x-6 gap-y-14 md:grid-cols-2" stagger={0.1}>
            {rest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block" data-cursor="Read">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[24px]">
                  <ViewTransition name={`post-${p.slug}`} share="morph" default="none">
                    <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]">
                      <Photo photo={p.photo} sizes="(min-width: 768px) 45vw, 92vw" quality={60} />
                    </div>
                  </ViewTransition>
                </div>
                <p className="mt-6 font-mono text-[0.7rem] tracking-[0.14em] text-accent-auto uppercase">
                  {p.season} · {fmt(p.published)}
                </p>
                <h2 className="mt-3 font-display text-[1.6rem] leading-tight tracking-[-0.04em]">{p.title}</h2>
                <p className="mt-3 text-muted">{p.excerpt}</p>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
      <CtaBand photo={img.winterCabin} />
      <JsonLd
        data={graph(webPageSchema({ path: "/blog", name: title, description, type: "CollectionPage" }), breadcrumbSchema(crumbs), {
          "@type": "Blog",
          name: "Comfort Notes",
          url: absoluteUrl("/blog"),
          blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/blog/${p.slug}`), datePublished: p.published })),
        })}
      />
    </PageShell>
  );
}

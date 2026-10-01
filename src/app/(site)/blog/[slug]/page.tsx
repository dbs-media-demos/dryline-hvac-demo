import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon, PhoneIcon } from "@/components/ui/Icons";
import { posts, postBySlug, type Block } from "@/content/posts";
import { buildMetadata } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { articleSchema, breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, eyebrow: `${p.season} · Comfort notes`, type: "article", publishedTime: p.published, keywords: p.keywords });
}

function Render({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return <p>{b.text}</p>;
    case "h2":
      return <h2>{b.text}</h2>;
    case "h3":
      return <h3>{b.text}</h3>;
    case "ul":
      return (
        <ul>
          {b.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "quote":
      return <blockquote>{b.text}</blockquote>;
  }
}

const fmt = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: p.title, path: `/blog/${p.slug}` },
  ];
  const others = posts.filter((o) => o.slug !== p.slug);

  return (
    <PageShell>
      <PageHero eyebrow={`${p.season} · ${p.readMins} min read`} title={p.title} lede={p.excerpt} photo={p.photo} crumbs={crumbs} morph={`post-${p.slug}`} />
      <article className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-14 px-5 md:px-8 lg:grid-cols-[1fr_17rem]">
          <div className="prose-dry max-w-[44rem]">
            <p className="!mt-0 font-mono text-[0.72rem] tracking-[0.12em] text-muted uppercase">
              By the Dryline service team · <time dateTime={p.published}>{fmt(p.published)}</time>
            </p>
            {p.body.map((b, i) => (
              <Render key={i} b={b} />
            ))}
          </div>
          <aside className="lg:sticky lg:top-[calc(var(--bar-h)+var(--header-h)+24px)] lg:self-start">
            <div className="theme-navy rounded-[24px] p-7">
              <p className="font-display text-[1.3rem] leading-tight tracking-[-0.04em]">Rather have a pro look at it?</p>
              <p className="mt-3 text-[0.92rem] text-frost/70">Same-day visits, flat-rate pricing, no overtime.</p>
              <a href={telHref} className="btn btn-accent on-dark mt-6 w-full">
                <PhoneIcon width={18} height={18} /> {site.phoneDisplay}
              </a>
              <Link href="/schedule" className="btn btn-ghost mt-3 w-full">
                Schedule online
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <section className="bg-mist/60 py-20 md:py-24" aria-labelledby="more-title">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <h2 id="more-title" className="display-md">
            Keep reading
          </h2>
          <Reveal className="mt-10 grid gap-5 md:grid-cols-2" stagger={0.1}>
            {others.map((o) => (
              <Link key={o.slug} href={`/blog/${o.slug}`} className="group flex items-center justify-between gap-6 rounded-[22px] bg-white p-7 ring-1 ring-line">
                <span>
                  <span className="font-mono text-[0.68rem] tracking-[0.14em] text-accent-auto uppercase">{o.season}</span>
                  <span className="mt-2 block font-display text-[1.2rem] leading-snug tracking-[-0.03em]">{o.title}</span>
                </span>
                <ArrowIcon className="shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand />
      <JsonLd
        data={graph(
          webPageSchema({ path: `/blog/${p.slug}`, name: p.title, description: p.excerpt }),
          breadcrumbSchema(crumbs),
          articleSchema({ path: `/blog/${p.slug}`, headline: p.title, description: p.excerpt, image: p.photo.src, datePublished: p.published, keywords: p.keywords }),
        )}
      />
    </PageShell>
  );
}

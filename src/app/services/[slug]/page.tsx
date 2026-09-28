import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { StepStack } from "@/components/sections/StepStack";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { CheckIcon, PhoneIcon } from "@/components/ui/Icons";
import { services, serviceBySlug, kindLabel } from "@/content/services";
import { reviews } from "@/content/reviews";
import { buildMetadata } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { breadcrumbSchema, faqSchema, graph, serviceSchema, webPageSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.name} in Oklahoma City`,
    description: `${s.short} ${s.price}. Serving OKC, Edmond, Norman, Moore, Yukon & Mustang. Call ${site.phoneDisplay}.`,
    path: `/services/${s.slug}`,
    eyebrow: kindLabel[s.kind],
    keywords: s.keywords,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: s.name, path: `/services/${s.slug}` },
  ];
  const related = services.filter((o) => o.slug !== s.slug && (o.kind === s.kind || o.kind === "air")).slice(0, 3);
  const review = reviews.find((r) => r.job.toLowerCase().startsWith(s.name.toLowerCase().split(" ")[0])) ?? reviews[0];

  return (
    <PageShell>
      <PageHero
        eyebrow={kindLabel[s.kind]}
        title={s.headline}
        lede={s.intro}
        photo={s.photo}
        crumbs={crumbs}
        morph={`svc-${s.slug}`}
        tall
        aside={
          <div className="w-full rounded-[22px] bg-frost/10 p-6 ring-1 ring-white/15 backdrop-blur-md lg:w-[300px]">
            <p className="font-mono text-[0.66rem] tracking-[0.14em] text-frost/70 uppercase">Upfront pricing</p>
            <p className="mt-2 font-display text-[2rem] leading-none tracking-[-0.05em]">{s.price}</p>
            <p className="mt-3 text-[0.9rem] text-frost/75">{s.priceNote}</p>
          </div>
        }
      >
        <a href={telHref} className="btn btn-accent on-dark">
          <PhoneIcon /> Call {site.phoneDisplay}
        </a>
        <Link href={`/schedule?service=${s.slug}`} className="btn btn-ghost">
          Book this service
        </Link>
      </PageHero>

      <section className="py-24 md:py-32" aria-labelledby="signs-title">
        <div className="mx-auto grid max-w-[1480px] gap-14 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Signs you need us" title={<span id="signs-title">Sound familiar?</span>}>
              If your system is doing any of these, call before it becomes a bigger repair.
            </SectionHead>
          </div>
          <Reveal as="ul" className="grid gap-3 sm:grid-cols-2" stagger={0.06}>
            {s.signs.map((sign, i) => (
              <li key={sign} className="rounded-[20px] bg-white p-6 ring-1 ring-line">
                <span className="font-mono text-[0.72rem] text-accent-auto">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-display text-[1.1rem] leading-snug tracking-[-0.03em]">{sign}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="theme-navy py-24 md:py-32" aria-labelledby="incl-title">
        <div className="mx-auto grid max-w-[1480px] gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
          <Parallax className="aspect-[4/5] rounded-[28px] lg:aspect-[4/5]" amount={14}>
            <div className="absolute inset-0">
              <Photo photo={s.gallery[0]} sizes="(min-width: 1024px) 45vw, 92vw" />
            </div>
          </Parallax>
          <div>
            <p className="eyebrow text-accent-auto">What&rsquo;s included</p>
            <SplitReveal id="incl-title" className="display-md mt-5 max-w-[16ch]">
              The job, done completely.
            </SplitReveal>
            <Reveal as="ul" className="mt-10 divide-y divide-line border-y border-line" stagger={0.07}>
              {s.included.map((x) => (
                <li key={x} className="flex items-start gap-4 py-4 text-[1.05rem]">
                  <CheckIcon className="mt-1 shrink-0 text-accent" />
                  {x}
                </li>
              ))}
            </Reveal>
            <Reveal className="mt-10 rounded-[22px] bg-white/5 p-6 ring-1 ring-line">
              <p className="text-[0.95rem] text-frost/80">&ldquo;{review.text}&rdquo;</p>
              <p className="mt-3 font-mono text-[0.7rem] tracking-[0.12em] text-frost/60 uppercase">
                {review.name} · {review.area} · ★★★★★
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="how-title">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-[calc(var(--bar-h)+var(--header-h)+24px)] lg:self-start">
            <SectionHead eyebrow="How it works" title={<span id="how-title">Four steps. No surprises.</span>} />
          </div>
          <StepStack steps={s.steps} />
        </div>
      </section>

      <section className="pb-24 md:pb-32" aria-label={`${s.name} photos`}>
        <div className="mx-auto grid max-w-[1480px] gap-4 px-5 md:grid-cols-3 md:px-8">
          {s.gallery.map((p, i) => (
            <Parallax key={p.src} className={i === 1 ? "aspect-[3/4] rounded-[22px] md:mt-16" : "aspect-[3/4] rounded-[22px]"} amount={12}>
              <div className="absolute inset-0">
                <Photo photo={p} sizes="(min-width: 768px) 32vw, 92vw" quality={60} />
              </div>
            </Parallax>
          ))}
        </div>
      </section>

      <section className="bg-mist/60 py-24 md:py-32" aria-labelledby="sfaq-title">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead eyebrow="FAQ" title={<span id="sfaq-title">{s.name}, answered.</span>} />
          <Reveal>
            <FaqList items={s.faqs} />
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="rel-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <h2 id="rel-title" className="display-md">
            Related services
          </h2>
          <Reveal className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {related.map((r) => (
              <ServiceCard key={r.slug} s={r} />
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand photo={s.kind === "heat" ? s.gallery[1] : undefined} />

      <JsonLd
        data={graph(
          webPageSchema({ path: `/services/${s.slug}`, name: `${s.name} in Oklahoma City`, description: s.intro }),
          breadcrumbSchema(crumbs),
          serviceSchema({ name: s.name, description: s.intro, path: `/services/${s.slug}`, image: s.photo.src, price: `${s.price}. ${s.priceNote}` }),
          faqSchema(s.faqs),
        )}
      />
    </PageShell>
  );
}

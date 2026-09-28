import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Parallax, Reveal, ScrubWords } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { ShieldIcon } from "@/components/ui/Icons";
import { team, timeline } from "@/content/company";
import { img } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";

const title = "About Dryline Heat & Air";
const description =
  "Family-owned in Midtown Oklahoma City since 2011. 21 trucks, NATE-certified technicians, flat-rate pricing and a real person answering the phone 24/7.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/about", eyebrow: "About us" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About Dryline"
        title="Born in the hottest summer on record."
        lede="Oklahoma City hit 100° on 63 days in 2011. That summer, two technicians who were tired of overtime surcharges started a company that would never charge one."
        photo={img.okcDevonDusk}
        crumbs={crumbs}
        tall
        position="50% 30%"
      />

      <section className="py-24 md:py-36" aria-labelledby="story-title">
        <div className="mx-auto grid max-w-[1480px] gap-14 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="story-title" className="eyebrow text-accent-auto flex items-center gap-3">
              <span className="h-px w-8 bg-current" aria-hidden /> Our story
            </h2>
            <ScrubWords
              className="mt-8 font-display text-[clamp(1.6rem,3.2vw,2.9rem)] leading-[1.1] tracking-[-0.045em]"
              text="The dryline is where hot, dry desert air meets cool, moist Gulf air — the line Oklahoma storms are born on. We named the company after it because that's the job: keeping the inside of your home on the comfortable side, whatever's rolling across the plains."
              accent={["dryline", "comfortable"]}
            />
            <Reveal className="mt-10 max-w-[38rem] space-y-5 text-muted">
              <p>
                Dean Whitaker and Marisol Reyes started with one truck, a borrowed vacuum pump and a simple rule: the price you&rsquo;re quoted is the price you pay, at noon or at
                3 a.m. Fifteen years later there are {site.stats.techs} trucks on the road, a dispatch office in Midtown, and the rule hasn&rsquo;t changed.
              </p>
              <p>
                We&rsquo;re still family-owned. We don&rsquo;t pay commissions on system sales, so no one here is rewarded for selling you a bigger unit than you need — and
                sometimes the best recommendation is a $190 part.
              </p>
            </Reveal>
          </div>
          <div className="relative lg:col-span-5">
            <Parallax className="aspect-[4/5] rounded-[28px]" amount={14}>
              <div className="absolute inset-0">
                <Photo photo={img.techSmiling} sizes="(min-width: 1024px) 38vw, 92vw" />
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      <section className="theme-navy relative isolate overflow-hidden" aria-labelledby="line-title">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[80svh]">
            <VideoLoop src="/video/frost-sunrise.mp4" poster="/video/frost-sunrise.jpg" label="Frost forming on a window at sunrise" />
            <p className="absolute bottom-6 left-6 font-mono text-[0.7rem] tracking-[0.14em] text-frost/80 uppercase">Cool side</p>
          </div>
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[80svh]">
            <VideoLoop src="/video/flame.mp4" poster="/video/flame.jpg" label="Flames burning against a dark background" />
            <p className="absolute right-6 bottom-6 font-mono text-[0.7rem] tracking-[0.14em] text-frost/80 uppercase">Warm side</p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-5">
          <h2 id="line-title" className="display-lg max-w-[14ch] text-center [text-shadow:0_10px_60px_rgb(10_23_38/0.8)]">
            We live on the line.
          </h2>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="tl-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead eyebrow="Fifteen years" title={<span id="tl-title">From one truck to twenty-one.</span>} />
          <Reveal as="ol" className="mt-14 grid gap-8 md:grid-cols-5" stagger={0.1}>
            {timeline.map((t) => (
              <li key={t.year} className="border-t-2 border-navy pt-5">
                <p className="font-display text-[2rem] tracking-[-0.05em] text-accent-auto">{t.year}</p>
                <h3 className="mt-3 font-display text-[1.1rem] tracking-[-0.03em]">{t.title}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{t.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-mist/60 py-24 md:py-32" aria-labelledby="team-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead eyebrow="The crew" title={<span id="team-title">People you&rsquo;ll actually meet.</span>} />
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {team.map((m) => (
              <article key={m.name} className="overflow-hidden rounded-[24px] bg-white ring-1 ring-line">
                <div className="relative aspect-[4/3] bg-navy">
                  {m.photo ? (
                    <Photo photo={m.photo} sizes="(min-width: 1024px) 22vw, 45vw" quality={60} alt={`${m.name}, ${m.role}`} />
                  ) : (
                    <div className="theme-navy absolute inset-0 grid place-items-center">
                      <span className="font-display text-[4rem] tracking-[-0.06em] text-accent" aria-hidden>
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-[1.25rem] tracking-[-0.04em]">{m.name}</h3>
                  <p className="font-mono text-[0.7rem] tracking-[0.1em] text-accent-auto uppercase">
                    {m.role} · since {m.since}
                  </p>
                  <p className="mt-3 text-[0.95rem] text-muted">{m.bio}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32" aria-labelledby="cred-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead eyebrow="Credentials" title={<span id="cred-title">Licensed, certified, guaranteed.</span>} />
          <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {site.credentials.map((c) => (
              <div key={c} className="flex items-center gap-4 rounded-[20px] bg-white p-6 ring-1 ring-line">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink">
                  <ShieldIcon />
                </span>
                <span className="font-display text-[1.05rem] tracking-[-0.03em]">{c}</span>
              </div>
            ))}
          </Reveal>
          <p className="mt-6 text-[0.85rem] text-muted">{site.license}</p>
        </div>
      </section>

      <CtaBand title="Meet the crew at your door — usually today." photo={img.okcReflection} />
      <JsonLd data={graph(webPageSchema({ path: "/about", name: title, description, type: "AboutPage" }), breadcrumbSchema(crumbs))} />
    </PageShell>
  );
}

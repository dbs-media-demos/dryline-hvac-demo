import Link from "next/link";
import clsx from "clsx";
import { reviews, ratingBreakdown, type Review } from "@/content/reviews";
import { site } from "@/lib/site";
import { GoogleG, StarIcon, ArrowIcon } from "@/components/ui/Icons";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";

const fmtDate = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });

export function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={clsx("flex items-center gap-0.5", className)} aria-label={`${n} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} width={15} height={15} className={i < n ? "text-[#fbbc05]" : "text-navy/15"} />
      ))}
    </span>
  );
}

export function ReviewCard({ r, className }: { r: Review; className?: string }) {
  return (
    <figure className={clsx("flex h-full flex-col rounded-[22px] bg-white p-6 ring-1 ring-line", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-navy font-display text-sm text-frost" aria-hidden>
            {r.name[0]}
          </span>
          <figcaption>
            <span className="block font-semibold leading-tight">{r.name}</span>
            <span className="block text-[0.8rem] text-muted">
              {r.area} · {fmtDate(r.date)}
            </span>
          </figcaption>
        </div>
        <GoogleG width={18} height={18} />
      </div>
      <Stars n={r.rating} className="mt-4" />
      <blockquote className="mt-3 text-[0.98rem] leading-relaxed text-navy/85">&ldquo;{r.text}&rdquo;</blockquote>
      <p className="mt-auto pt-4 font-mono text-[0.66rem] tracking-[0.12em] text-muted uppercase">{r.job}</p>
    </figure>
  );
}

export function RatingSummary({ className }: { className?: string }) {
  return (
    <div className={clsx("flex flex-col gap-6 rounded-[28px] bg-white p-7 ring-1 ring-line sm:flex-row sm:items-center sm:gap-10", className)}>
      <div className="flex items-center gap-4">
        <GoogleG width={40} height={40} />
        <div>
          <p className="font-display text-[3.2rem] leading-none tracking-[-0.06em]">{site.rating.value}</p>
          <Stars n={5} className="mt-2" />
          <p className="mt-1 text-[0.85rem] text-muted">{site.rating.count.toLocaleString("en-US")} Google reviews</p>
        </div>
      </div>
      <dl className="grid flex-1 gap-1.5">
        {ratingBreakdown.map((b) => (
          <div key={b.stars} className="grid grid-cols-[1.2rem_1fr_2.8rem] items-center gap-3 text-[0.8rem]">
            <dt className="text-muted">{b.stars}</dt>
            <dd className="h-2 overflow-hidden rounded-full bg-mist">
              <span className="block h-full rounded-full bg-[#fbbc05]" style={{ width: `${Math.max(b.pct, 1)}%` }} />
            </dd>
            <dd className="text-right text-muted tabular">{b.pct}%</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ReviewsMarquee() {
  const half = Math.ceil(reviews.length / 2);
  return (
    <div className="grid gap-5">
      <Marquee duration={70} pausable>
        {reviews.slice(0, half).map((r) => (
          <ReviewCard key={r.name} r={r} className="mr-5 w-[320px] sm:w-[380px]" />
        ))}
      </Marquee>
      <Marquee duration={80} reverse pausable>
        {reviews.slice(half).map((r) => (
          <ReviewCard key={r.name} r={r} className="mr-5 w-[320px] sm:w-[380px]" />
        ))}
      </Marquee>
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="overflow-hidden bg-mist/60 py-24 md:py-32" aria-labelledby="reviews-title">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-5 md:px-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Reveal>
            <p className="eyebrow text-accent-auto flex items-center gap-3">
              <span className="h-px w-8 bg-current" aria-hidden /> Reviews
            </p>
          </Reveal>
          <Reveal>
            <h2 id="reviews-title" className="display-lg mt-5 max-w-[15ch]">
              1,284 neighbors can&rsquo;t all be wrong.
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <RatingSummary className="lg:w-[560px]" />
        </Reveal>
      </div>
      <div className="mt-14">
        <ReviewsMarquee />
      </div>
      <div className="mt-10 flex justify-center px-5">
        <Link href="/reviews" className="btn btn-navy">
          Read all reviews <ArrowIcon width={18} height={18} />
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";
import clsx from "clsx";
import { reviews, ratingBreakdown, type Review } from "@/content/reviews";
import { site } from "@/lib/site";
import { defaultBiz } from "@/lib/biz";
import { num, type Biz } from "@/lib/biz-core";
import { scrub } from "@/lib/scrub";
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

/** What the house read when the tech arrived → when they left (°F, or relative humidity for air-quality jobs). */
const readings: Record<string, [number, number, "cool" | "heat" | "rh"]> = {
  "AC repair": [86, 72, "cool"],
  "AC installation": [83, 72, "cool"],
  "Mini-split": [88, 71, "cool"],
  "Comfort Club tune-up": [78, 72, "cool"],
  "Smart thermostat": [76, 72, "cool"],
  "Duct cleaning": [81, 73, "cool"],
  "Furnace repair": [58, 70, "heat"],
  "Furnace installation": [61, 70, "heat"],
  "Heat pump": [63, 71, "heat"],
  "Indoor air quality": [63, 45, "rh"],
};

/** Before → after, with air flowing along the arrow. */
function Reading({ job, lang }: { job: string; lang: "en" | "sr" }) {
  const r = readings[job];
  if (!r) return null;
  const [a, b, kind] = r;
  const fmt = (v: number) => (kind === "rh" ? `${v}%` : `${lang === "sr" ? Math.round(((v - 32) * 5) / 9) : v}°`);
  return (
    <span className="reading shrink-0" data-kind={kind} data-no-translate aria-hidden>
      <span className="reading-from">{fmt(a)}</span>
      <span className="reading-flow" />
      <span className="reading-to">{fmt(b)}</span>
      {kind === "rh" && <span className="text-muted">{lang === "sr" ? "vlaga" : "RH"}</span>}
    </span>
  );
}

export function ReviewCard({ r, className, lang = "en" }: { r: Review; className?: string; lang?: "en" | "sr" }) {
  return (
    <figure className={clsx("flex h-full flex-col rounded-[22px] bg-white p-6 ring-1 ring-line phone:rounded-[18px] phone:p-3.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-navy font-display text-sm text-frost phone:h-8 phone:w-8 phone:text-[0.75rem]" aria-hidden>
            {r.name[0]}
          </span>
          <figcaption>
            <span className="block font-semibold leading-tight">{r.name}</span>
            <span className="block text-[0.8rem] text-muted phone:text-[0.76rem] phone:leading-tight">
              {r.area} · {fmtDate(r.date)}
            </span>
          </figcaption>
        </div>
        <GoogleG width={18} height={18} />
      </div>
      <Stars n={r.rating} className="mt-4 phone:mt-1.5" />
      <blockquote className="mt-3 text-[0.98rem] leading-relaxed text-navy/85 phone:mt-1 phone:text-[0.86rem] phone:leading-[1.36]">&ldquo;{r.text}&rdquo;</blockquote>
      <div className="mt-auto flex items-end justify-between gap-3 pt-4 phone:pt-1.5 font-mono text-[0.66rem] tracking-[0.12em] text-muted uppercase">
        <p>{r.job}</p>
        <Reading job={r.job} lang={lang} />
      </div>
    </figure>
  );
}

export function RatingSummary({ className, biz = defaultBiz }: { className?: string; biz?: Biz }) {
  const rating = biz.rating ?? site.rating;
  return (
    <div className={clsx("flex flex-col gap-6 rounded-[28px] bg-white p-7 ring-1 ring-line sm:flex-row sm:items-center sm:gap-10 phone:flex-row phone:items-center phone:gap-4 phone:rounded-[20px] phone:p-4", className)}>
      <div className="flex items-center gap-4 phone:shrink-0 phone:gap-0">
        <GoogleG width={40} height={40} className="phone:hidden" />
        <div>
          <p className="font-display text-[3.2rem] phone:text-[2.2rem] leading-none tracking-[-0.06em]">{num(biz, rating.value)}</p>
          <Stars n={5} className="mt-2" />
          <p className="mt-1 text-[0.85rem] text-muted phone:text-[0.76rem]">
            {rating.count.toLocaleString(biz.lang === "sr" ? "sr-RS" : "en-US")} {biz.lang === "sr" ? "Google recenzija" : "Google reviews"}
          </p>
        </div>
      </div>
      <dl className="grid flex-1 gap-1.5 phone:gap-0.5">
        {ratingBreakdown.map((b) => (
          <div key={b.stars} className="grid grid-cols-[1.2rem_1fr_2.8rem] items-center gap-3 text-[0.8rem] phone:grid-cols-[0.6rem_1fr_1.9rem] phone:gap-1.5 phone:text-[0.68rem]">
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

export function ReviewsMarquee({ biz = defaultBiz }: { biz?: Biz }) {
  const list = biz.preview ? reviews.map((r) => ({ ...r, text: scrub(r.text, biz), area: biz.area })) : reviews;
  const half = Math.ceil(list.length / 2);
  const lang = biz.lang === "sr" ? "sr" : "en";
  return (
    <div className="grid gap-5">
      <Marquee duration={70} pausable>
        {list.slice(0, half).map((r) => (
          <ReviewCard key={r.name} r={r} lang={lang} className="mr-5 w-[320px] sm:w-[380px]" />
        ))}
      </Marquee>
      <Marquee duration={80} reverse pausable>
        {list.slice(half).map((r) => (
          <ReviewCard key={r.name} r={r} lang={lang} className="mr-5 w-[320px] sm:w-[380px]" />
        ))}
      </Marquee>
    </div>
  );
}

/** Phones: three full reviews to read straight away, the rest a swipe away. */
function PhoneReviews({ biz }: { biz: Biz }) {
  const list = biz.preview ? reviews.map((r) => ({ ...r, text: scrub(r.text, biz), area: biz.area })) : reviews;
  const lang = biz.lang === "sr" ? "sr" : "en";
  return (
    <div className="hidden phone:block">
      <div className="grid gap-2.5 px-5">
        {list.slice(0, 3).map((r) => (
          <ReviewCard key={r.name} r={r} lang={lang} className="phone-cv [--cv-h:204px]" />
        ))}
      </div>
      <div className="phone-cv no-scrollbar mt-2.5 flex snap-x snap-mandatory scroll-pl-5 gap-2.5 overflow-x-auto px-5 [--cv-h:222px]">
        {list.slice(3).map((r) => (
          <ReviewCard key={r.name} r={r} lang={lang} className="h-auto w-[74vw] max-w-[320px] shrink-0 snap-start" />
        ))}
      </div>
    </div>
  );
}

export function ReviewsSection({ biz = defaultBiz }: { biz?: Biz }) {
  const sr = biz.lang === "sr";
  const heading = !biz.preview
    ? "1,284 neighbors can’t all be wrong."
    : sr
      ? "Komšije to kažu bolje od nas."
      : biz.rating
        ? `${biz.rating.count.toLocaleString("en-US")} neighbors can’t all be wrong.`
        : "Neighbors say it better than we can.";
  return (
    <section className="overflow-hidden bg-mist/60 py-24 md:py-32 phone:py-8" aria-labelledby="reviews-title">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-5 phone:gap-3 md:px-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Reveal>
            <p className="eyebrow text-accent-auto flex items-center gap-3">
              <span className="h-px w-8 bg-current" aria-hidden /> Reviews
            </p>
          </Reveal>
          <Reveal>
            <h2 id="reviews-title" className="display-lg mt-5 max-w-[15ch] phone:mt-3 phone:max-w-none">
              {heading}
            </h2>
          </Reveal>
        </div>
        {(!biz.preview || biz.rating) && (
          <Reveal>
            <RatingSummary className="lg:w-[560px]" biz={biz} />
          </Reveal>
        )}
      </div>
      <div className="mt-14 phone:mt-2.5">
        <div className="phone:hidden">
          <ReviewsMarquee biz={biz} />
        </div>
        <PhoneReviews biz={biz} />
        {biz.preview && (
          <p className="mx-auto mt-8 max-w-[1480px] px-5 text-[0.95rem] text-muted phone:mt-3 phone:text-[0.82rem] md:px-8">
            {sr
              ? "Primeri utisaka. Na vašem pravom sajtu ovde stoje vaše najnovije Google recenzije, automatski."
              : "Sample reviews. On your live site this shows your latest Google reviews, updated automatically."}
          </p>
        )}
      </div>
      <div className="mt-10 flex justify-center px-5 phone:mt-3">
        <Link href="/reviews" className="btn btn-navy phone:min-h-[44px]">
          Read all reviews <ArrowIcon width={18} height={18} />
        </Link>
      </div>
    </section>
  );
}

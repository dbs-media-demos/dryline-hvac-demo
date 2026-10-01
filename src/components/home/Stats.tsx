import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/lib/site";
import { defaultBiz } from "@/lib/biz";
import { L, openDays, type Biz } from "@/lib/biz-core";

type Stat = { value: number; decimals?: number; suffix: string; label: string };

const conceptStats: Stat[] = [
  { value: site.stats.homes, suffix: "+", label: "Metro homes kept comfortable since 2011" },
  { value: site.stats.arrival, suffix: " min", label: "Average emergency arrival, summer 2026" },
  { value: site.rating.value, decimals: 1, suffix: "★", label: `From ${site.rating.count.toLocaleString("en-US")} Google reviews` },
  { value: site.stats.warranty, suffix: " yrs", label: "Parts & labor warranty on every install" },
];

const promises = [
  "Same-day service",
  "Flat-rate pricing",
  "No overtime, ever",
  "NATE-certified techs",
  "100% satisfaction guarantee",
  "24/7 emergency dispatch",
  "Financing from $89/mo",
  "10-year install warranty",
];

function previewStats(biz: Biz): Stat[] {
  const days = openDays(biz);
  return [
    ...(biz.rating ? [{ value: biz.rating.value, decimals: 1, suffix: "★", label: L(biz, `From ${biz.rating.count.toLocaleString("en-US")} Google reviews`, `Iz ${biz.rating.count} Google recenzija`) }] : []),
    ...(days ? [{ value: days, suffix: "", label: L(biz, "Days a week the office is open", "Dana nedeljno radimo") }] : []),
    { value: 24, suffix: "/7", label: L(biz, "Emergency line, nights and weekends included", "Hitne intervencije, i noću i vikendom") },
    { value: 10, suffix: L(biz, " yrs", " god."), label: "Parts & labor warranty on every install" },
  ];
}

export function Stats({ biz = defaultBiz }: { biz?: Biz }) {
  const stats = biz.preview ? previewStats(biz) : conceptStats;
  return (
    <section className="py-20 md:py-28" aria-label={biz.preview ? biz.name : "Dryline by the numbers"}>
      <Marquee duration={45} className="border-y border-line py-5">
        {promises.map((p) => (
          <span key={p} className="flex items-center gap-8 pr-8 font-display text-[clamp(1.4rem,2.6vw,2.2rem)] tracking-[-0.04em] whitespace-nowrap">
            {p}
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
          </span>
        ))}
      </Marquee>
      <Reveal className="mx-auto mt-16 grid max-w-[1480px] gap-10 px-5 sm:grid-cols-2 md:px-8 lg:grid-cols-4" stagger={0.1}>
        {stats.map((s) => (
          <div key={s.label} className="border-t border-navy pt-6">
            <p className="font-display text-[clamp(2.8rem,5vw,4.4rem)] leading-none tracking-[-0.06em]">
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="mt-4 max-w-[16rem] text-muted">{s.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

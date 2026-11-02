"use client";

import { useRef } from "react";
import { Photo } from "@/components/ui/Photo";
import { dayOnCall } from "@/content/company";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { useBiz } from "@/components/preview/BizContext";

/** Outside temperature at each stop of that July Tuesday (°F) — the thermometer on the timeline climbs through them. */
const TEMPS = [81, 88, 97, 104, 99, 86];

/*
 * "A day on call": a pinned horizontal photo story from 7:02 a.m. to 11:48 p.m.
 * Desktop scrubs sideways with scroll (images counter-drift for depth); phones get a
 * native swipe rail with scroll snap. Under the photos an outdoor thermometer rides the
 * timeline and climbs with the July heat as the day goes on.
 */
export function DayOnCall() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const thermo = useRef<HTMLDivElement>(null);
  const reading = useRef<HTMLSpanElement>(null);
  const sr = useBiz().lang === "sr";
  const fmt = (f: number) => `${Math.round(sr ? ((f - 32) * 5) / 9 : f)}°${sr ? "C" : "F"}`;

  const setDay = (p: number) => {
    const f = p * (TEMPS.length - 1);
    const i = Math.min(TEMPS.length - 2, Math.floor(f));
    const t = TEMPS[i] + (TEMPS[i + 1] - TEMPS[i]) * (f - i);
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    const th = thermo.current;
    if (th) {
      th.style.left = `${p * 100}%`;
      th.style.transform = `translateX(-${p * 100}%)`;
      th.style.setProperty("--fill", ((t - 60) / 48).toFixed(3));
    }
    if (reading.current) reading.current.textContent = fmt(t);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth + 64;
        const tween = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => setDay(self.progress),
          },
        });
        t.querySelectorAll<HTMLElement>("[data-drift]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -10 },
            { xPercent: 10, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
        return () => ScrollTrigger.getAll().forEach((s) => s.vars.containerAnimation === tween && s.kill());
      });
      // Phones and tablets swipe the rail instead: the thermometer follows the swipe
      mm.add("(max-width: 1023.98px)", () => {
        const t = track.current!;
        const onScroll = () => setDay(t.scrollLeft / Math.max(1, t.scrollWidth - t.clientWidth));
        t.addEventListener("scroll", onScroll, { passive: true });
        return () => t.removeEventListener("scroll", onScroll);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-navy relative overflow-hidden py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0" aria-labelledby="day-title">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between lg:pt-[calc(var(--bar-h)+var(--header-h))]">
        <div>
          <Reveal>
            <p className="eyebrow text-accent-auto flex items-center gap-3">
              <span className="h-px w-8 bg-current" aria-hidden /> A day on call
            </p>
          </Reveal>
          <SplitReveal id="day-title" className="display-lg mt-5 max-w-[14ch]">
            7:02 a.m. to 11:48 p.m.
          </SplitReveal>
        </div>
        <Reveal className="max-w-[26rem] text-frost/70">
          Twenty-one trucks, six cities, one flat rate. Here&rsquo;s a real Tuesday in July — the kind our dispatchers call &ldquo;normal.&rdquo;
        </Reveal>
      </div>

      <div className="mx-auto mt-10 w-full max-w-[1480px] px-5 md:px-8 lg:mt-8" aria-hidden>
        <div className="relative h-8">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/15">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-accent" />
          </div>
          <div ref={thermo} className="day-thermo absolute top-0 left-0 flex h-8 items-center gap-2 rounded-full bg-navy-2 pr-3 pl-2 ring-1 ring-white/15" style={{ ["--fill" as string]: ((TEMPS[0] - 60) / 48).toFixed(3) }}>
            <svg viewBox="0 0 12 26" className="h-5 w-auto" aria-hidden>
              <rect x="3.5" y="1" width="5" height="17" rx="2.5" fill="none" stroke="rgba(245,249,251,0.5)" strokeWidth="1.2" />
              <rect className="day-thermo-fill" x="5" y="3" width="2" height="15" rx="1" />
              <circle cx="6" cy="20.5" r="4" className="day-thermo-bulb" />
            </svg>
            <span ref={reading} className="font-mono text-[0.7rem] tracking-[0.08em] text-frost tabular" data-no-translate>
              {fmt(TEMPS[0])}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:px-8 lg:w-max lg:snap-none lg:gap-6 lg:overflow-visible lg:pr-[20vw]"
        >
          {dayOnCall.map((c, i) => (
            <article key={c.time} className="w-[82vw] shrink-0 snap-start sm:w-[420px] lg:w-[min(34vw,520px)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] lg:aspect-[5/4]">
                <div data-drift className="absolute inset-[-6%]">
                  <Photo photo={c.photo} sizes="(min-width: 1024px) 34vw, 82vw" quality={60} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <p className="absolute top-4 left-4 rounded-full bg-navy/70 px-3 py-1.5 font-mono text-[0.72rem] tracking-wide backdrop-blur">
                  {c.time} · {c.place}
                </p>
                <p className="absolute right-4 bottom-4 font-mono text-[0.68rem] text-frost/70">{String(i + 1).padStart(2, "0")} / 06</p>
              </div>
              <h3 className="mt-5 font-display text-[1.35rem] tracking-[-0.035em]">{c.title}</h3>
              <p className="mt-2 max-w-[30rem] text-frost/70">{c.body}</p>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}

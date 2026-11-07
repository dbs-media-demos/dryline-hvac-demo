"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { ClockIcon, ShieldIcon } from "@/components/ui/Icons";

/*
 * The two promises under the "Why" statement, each with a small live proof: the clock rolls
 * through midnight, Sunday and the Fourth while the price stays put, and the warranty years
 * light up one by one when the cards scroll in.
 */

const times = ["Tue · 2 p.m.", "Midnight", "Sunday", "July 4th"];

export function Promises({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = "true";
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={clsx("promises grid max-w-[44rem] self-start lg:mt-12 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2", className)} data-in="false">
      <article className="promise">
        <div className="flex items-center gap-2 rounded-2xl bg-mist/70 px-3.5 py-3 font-mono text-[0.7rem]">
          <ClockIcon width={15} height={15} className="shrink-0 text-muted" />
          <span className="promise-roll" aria-hidden>
            <span className="promise-roll-track">
              {[...times, times[0]].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </span>
          </span>
          <span className="promise-wire" aria-hidden />
          <span className="shrink-0 font-semibold text-accent-auto">Same price</span>
        </div>
        <p className="mt-6 font-display text-lg tracking-[-0.03em]">Flat-rate, in writing</p>
        <p className="mt-2 text-muted">You approve the price before we start. It doesn&rsquo;t change at midnight, on Sundays or on the Fourth of July.</p>
      </article>

      <article className="promise">
        <div className="grid gap-2.5 rounded-2xl bg-mist/70 px-3.5 py-3 font-mono text-[0.68rem] tracking-[0.04em]">
          {[
            { label: "Repairs", years: 1, value: "1 yr" },
            { label: "Installs", years: 10, value: "10 yrs" },
          ].map((w) => (
            <div key={w.label} className="grid grid-cols-[4.6rem_1fr_auto] items-center gap-3">
              <span className="text-muted">{w.label}</span>
              <span className="grid grid-cols-10 gap-[3px]" aria-hidden>
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} className="promise-year" data-on={i < w.years} style={{ ["--i" as string]: i }} />
                ))}
              </span>
              <span className="min-w-[3.2rem] text-right font-semibold whitespace-nowrap">{w.value}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 font-display text-lg tracking-[-0.03em]">
          Fixed right, or it&rsquo;s free
          <ShieldIcon width={18} height={18} className="promise-shield text-accent-auto" />
        </p>
        <p className="mt-2 text-muted">100% satisfaction guarantee and a 1-year warranty on every repair. Ten years on every install.</p>
      </article>
    </div>
  );
}

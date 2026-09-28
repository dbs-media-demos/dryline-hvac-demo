"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Sticky stacking cards: each step pins a little lower than the last, and the ones
 * underneath shrink and dim as the next card slides over them.
 */
export function StepStack({ steps }: { steps: { title: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-step]", root.current);
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.firstElementChild, {
            scale: 0.92,
            opacity: 0.45,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 85%", end: "top 30%", scrub: true },
          });
        });
        return () => ScrollTrigger.refresh();
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="grid gap-6">
      {steps.map((s, i) => (
        <li key={s.title} data-step className="sticky" style={{ top: `calc(var(--bar-h) + var(--header-h) + 24px + ${i * 22}px)` }}>
          <div className="theme-navy origin-top rounded-[28px] p-8 shadow-[0_-20px_60px_-30px_rgb(10_23_38/0.5)] md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-14">
              <span className="font-mono text-[0.8rem] text-accent-auto">
                {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.6rem)] tracking-[-0.045em]">{s.title}</h3>
                <p className="mt-4 max-w-[36rem] text-frost/75 lede">{s.body}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Number that counts up when scrolled into view. Server HTML already has the final value. */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => prefix + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || el.getBoundingClientRect().top < window.innerHeight) return;
      const obj = { n: 0 };
      el.textContent = fmt(0);
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => gsap.to(obj, { n: value, duration: 2, ease: "expo.out", onUpdate: () => (el.textContent = fmt(obj.n)) }),
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}

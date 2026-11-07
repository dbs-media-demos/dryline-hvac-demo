"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { getGsap, isCoarse, isPhone, loadGsap, prefersReducedMotion } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling on desktop only, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Touch devices keep native momentum scrolling; reduced motion gets plain scrolling too.
    // Phones never even download Lenis.
    if (prefersReducedMotion() || isCoarse() || isPhone()) return;
    let cleanup: (() => void) | undefined;
    let dead = false;
    void Promise.all([import("lenis"), loadGsap()]).then(([{ default: LenisClass }, { gsap, ScrollTrigger }]) => {
      if (dead) return;
      const lenis = new LenisClass({ lerp: 0.1, anchors: { offset: -120 } });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.__lenis;
      };
    });
    return () => {
      dead = true;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    window.__lenis?.resize();
    const id = window.setTimeout(() => getGsap()?.ScrollTrigger.refresh(), 350);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}

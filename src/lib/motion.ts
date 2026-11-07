"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { PHONE_QUERY } from "./phone";

/*
 * GSAP is desktop-only: phones never download it (see the phone block in globals.css for what they
 * get instead). Desktop starts fetching it as soon as this module runs; everything that animates
 * goes through useMotion, so its setup runs in component order once GSAP is there.
 */

export type GsapKit = typeof import("./gsap");

export const isPhone = () => typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches;

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarse = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;

let kit: GsapKit | null = null;
let loading: Promise<GsapKit> | null = null;

export const loadGsap = () =>
  (loading ??= import("./gsap").then((m) => {
    kit = m;
    return m;
  }));

/** GSAP if it has arrived, for code that runs on a click or a state change. */
export const getGsap = () => kit;

if (typeof window !== "undefined" && !isPhone()) void loadGsap();

const useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/** useGSAP for a site whose phones don't load GSAP: same context and cleanup, off below the phone breakpoint. */
export function useMotion(setup: (kit: GsapKit) => void | (() => void), { scope }: { scope?: RefObject<Element | null> } = {}) {
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    let stop: (() => void) | undefined;
    const sync = () => {
      stop?.();
      stop = undefined;
      if (mq.matches) return;
      let dead = false;
      let revert: (() => void) | undefined;
      const run = (k: GsapKit) => {
        if (dead) return;
        const ctx = k.gsap.context(() => setup(k), scope?.current ?? undefined);
        revert = () => ctx.revert();
      };
      if (kit) run(kit);
      else void loadGsap().then(run);
      stop = () => {
        dead = true;
        revert?.();
      };
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop?.();
    };
    // Runs once, like useGSAP without dependencies
  }, []);
}

/** A small number tween for phones, where there's no GSAP. Returns a cancel function. */
export function tween(from: number, to: number, ms: number, onUpdate: (v: number) => void, ease: (t: number) => number = (t) => 1 - (1 - t) ** 3) {
  if (ms <= 0) {
    onUpdate(to);
    return () => {};
  }
  const start = performance.now();
  let raf = requestAnimationFrame(function step(now) {
    const t = Math.min(1, (now - start) / ms);
    onUpdate(from + (to - from) * ease(t));
    if (t < 1) raf = requestAnimationFrame(step);
  });
  return () => cancelAnimationFrame(raf);
}

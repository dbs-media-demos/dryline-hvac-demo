"use client";

import { useEffect } from "react";
import { isPhone, prefersReducedMotion } from "@/lib/motion";

/**
 * Phones: one small fade-and-rise per section, once. The section's background stays put, its
 * content rises (globals.css). Anything already on screen at load, and the hero, never animates.
 */
export function PhoneRise() {
  useEffect(() => {
    if (!isPhone()) return;
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          seen.unobserve(e.target);
          e.target.classList.add("cv-seen");
        }
      },
      { rootMargin: "150% 0px" },
    );
    document.querySelectorAll(".phone-cv").forEach((b) => seen.observe(b));
    return () => seen.disconnect();
  }, []);

  useEffect(() => {
    if (!isPhone() || prefersReducedMotion()) return;
    const content = (s: Element) => Array.from(s.children).filter((c) => getComputedStyle(c).position !== "absolute");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          for (const c of content(e.target)) {
            c.classList.add("rise-go");
            c.classList.remove("rise-wait");
            window.setTimeout(() => c.classList.remove("rise-go"), 800);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    // Sections are set up as they come near, not at load: reading them all would lay out the whole page.
    const near = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          near.unobserve(e.target);
          if (e.boundingClientRect.top < window.innerHeight * 0.92) continue;
          content(e.target).forEach((c) => c.classList.add("rise-wait"));
          io.observe(e.target);
        }
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    document.querySelectorAll("main section:not([data-hero])").forEach((s) => near.observe(s));
    return () => {
      near.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}

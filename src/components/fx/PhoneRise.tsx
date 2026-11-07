"use client";

import { useEffect } from "react";
import { isPhone, prefersReducedMotion } from "@/lib/motion";

/**
 * Phones: one small fade-and-rise per section, once. The section's background stays put, its
 * content rises (globals.css). Anything already on screen at load, and the hero, never animates.
 */
export function PhoneRise() {
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
    document.querySelectorAll("main section:not([data-hero])").forEach((s) => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      content(s).forEach((c) => c.classList.add("rise-wait"));
      io.observe(s);
    });
    return () => io.disconnect();
  }, []);
  return null;
}

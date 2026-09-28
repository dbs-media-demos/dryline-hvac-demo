"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only cursor: a small accent dot plus a lagging ring. Over anything with
 * [data-cursor="Label"] the ring opens into a pill with that label ("Drag", "View"…).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    const l = label.current!;
    document.documentElement.classList.add("has-cursor");
    const pos = { x: -100, y: -100, rx: -100, ry: -100 };
    let raf = 0;
    let active = "";
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      d.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const t = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role=slider]") as HTMLElement | null;
      const next = t ? t.dataset.cursor ?? "link" : "";
      if (next !== active) {
        active = next;
        r.dataset.state = next ? (next === "link" ? "link" : "label") : "";
        l.textContent = next && next !== "link" ? next : "";
      }
    };
    const loop = () => {
      pos.rx += (pos.x - pos.rx) * 0.18;
      pos.ry += (pos.y - pos.ry) * 0.18;
      r.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      d.style.opacity = "0";
      r.style.opacity = "0";
    };
    const onEnter = () => {
      d.style.opacity = "1";
      r.style.opacity = "1";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dot} aria-hidden className="cursor-dot pointer-events-none fixed top-0 left-0 z-[100] hidden" />
      <div ref={ring} aria-hidden className="cursor-ring pointer-events-none fixed top-0 left-0 z-[100] hidden">
        <span ref={label} />
      </div>
    </>
  );
}

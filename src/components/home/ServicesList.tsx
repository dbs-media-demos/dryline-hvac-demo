"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import { services, kindLabel } from "@/content/services";
import { ArrowUpRight, FlameIcon, SnowIcon, WindIcon } from "@/components/ui/Icons";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const kindIcon = { cool: SnowIcon, heat: FlameIcon, air: WindIcon };

/**
 * Service index as a big typographic list. On desktop a photo floats after the cursor
 * and swaps as you move between rows; on phones each row carries its own thumbnail.
 */
export function ServicesList() {
  const wrap = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      const f = float.current;
      if (!el || !f || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
      const xTo = gsap.quickTo(f, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(f, "y", { duration: 0.6, ease: "power3" });
      const rTo = gsap.quickTo(f, "rotate", { duration: 0.8, ease: "power3" });
      let lastX = 0;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        xTo(x - 170);
        yTo(e.clientY - r.top - 120);
        rTo(Math.max(-8, Math.min(8, (x - lastX) * 0.6)));
        lastX = x;
      };
      el.addEventListener("pointermove", onMove);
      return () => el.removeEventListener("pointermove", onMove);
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-line">
        {services.map((s, i) => {
          const Icon = kindIcon[s.kind];
          return (
            <li key={s.slug} className="border-b border-line">
              <Link
                href={`/services/${s.slug}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                data-cursor="View"
                className={clsx(
                  "group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 transition-[opacity,color] duration-500 md:grid-cols-[4rem_1fr_14rem_auto] md:gap-6 md:py-7",
                  active !== null && active !== i ? "md:opacity-35" : "opacity-100",
                )}
              >
                <span className="relative block h-16 w-16 overflow-hidden rounded-xl md:hidden">
                  <Image src={s.photo.src} alt="" fill sizes="64px" quality={60} className="object-cover" style={{ backgroundColor: s.photo.color }} />
                </span>
                <span className="hidden font-mono text-xs text-muted md:block">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-mono text-[0.66rem] tracking-[0.14em] text-muted uppercase md:hidden">
                    <Icon width={13} height={13} /> {kindLabel[s.kind]}
                  </span>
                  <span className="block font-display text-[1.35rem] leading-tight tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-out-expo)] md:text-[clamp(1.8rem,3.4vw,3.2rem)] md:group-hover:translate-x-4">
                    {s.name}
                  </span>
                  <span className="mt-1 block text-[0.92rem] text-muted md:hidden">{s.price}</span>
                </span>
                <span className="hidden text-[0.95rem] text-muted md:block">
                  <span className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
                    <Icon width={14} height={14} /> {kindLabel[s.kind]}
                  </span>
                  <span className="mt-1 block text-navy">{s.price}</span>
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:border-transparent group-hover:bg-accent md:h-14 md:w-14">
                  <ArrowUpRight width={18} height={18} className="transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Floating preview (desktop, fine pointer) */}
      <div
        ref={float}
        aria-hidden
        className={clsx(
          "pointer-events-none absolute top-0 left-0 z-10 hidden h-[240px] w-[340px] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgb(10_23_38/0.5)] transition-[opacity,scale] duration-500 ease-[var(--ease-out-expo)] [@media(hover:hover)_and_(pointer:fine)]:block",
          active === null ? "scale-75 opacity-0" : "scale-100 opacity-100",
        )}
      >
        {services.map((s, i) => (
          <Image
            key={s.slug}
            src={s.photo.src}
            alt=""
            fill
            sizes="340px"
            quality={60}
            className={clsx("object-cover transition-[opacity,scale] duration-700 ease-[var(--ease-out-expo)]", active === i ? "scale-100 opacity-100" : "scale-110 opacity-0")}
            style={{ backgroundColor: s.photo.color }}
          />
        ))}
      </div>
    </div>
  );
}

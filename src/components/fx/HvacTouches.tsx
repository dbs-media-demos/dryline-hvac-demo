"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/*
 * Small HVAC moments, one per homepage section: fans that spin up with the scroll, a supply
 * register that opens and breathes, a condenser that runs tired as the system ages, a filter
 * that gets swapped, a thermostat that settles, frost that melts off the glass. All of them
 * sit still under prefers-reduced-motion.
 */

/** Sets data-in="true" on the element the first time it scrolls into view (CSS does the rest). */
export function useInView<T extends HTMLElement>(margin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = "true";
        io.disconnect();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return ref;
}

/** Four-blade fan, drawn in currentColor. */
export function FanBlades({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      {[0, 90, 180, 270].map((r) => (
        <path key={r} d="M12 12C11.2 8.6 12 4.6 14.6 3.4c1.9 1.1 1.4 5.6-2.6 8.6Z" transform={`rotate(${r} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.1" />
    </svg>
  );
}

/** Every `.spin-fan` inside idles slowly and spins up with the scroll speed, then coasts down. */
export function FanSpinner({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const fans = root.current!.querySelectorAll(".spin-fan");
      const IDLE = 0.3;
      let speed = IDLE;
      const spin = gsap.to(fans, { rotation: "+=360", duration: 1.4, ease: "none", repeat: -1, transformOrigin: "50% 50%" }).timeScale(IDLE).pause();
      const coast = () => {
        speed += (IDLE - speed) * 0.035;
        spin.timeScale(speed);
      };
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) {
            spin.play();
            gsap.ticker.add(coast);
          } else {
            spin.pause();
            gsap.ticker.remove(coast);
          }
        },
        onUpdate: (self) => {
          speed = Math.max(speed, IDLE + Math.min(Math.abs(self.getVelocity()) / 260, 6));
        },
      });
      return () => {
        st.kill();
        gsap.ticker.remove(coast);
      };
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

/** A supply register: its louvers open when it scrolls in, then conditioned air streams out. */
export function Vent({ className }: { className?: string }) {
  const ref = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={clsx("vent", className)} aria-hidden>
      <svg viewBox="0 0 160 116" className="block h-auto w-full overflow-visible">
        <rect x="1" y="1" width="158" height="46" rx="10" fill="var(--white)" stroke="var(--line)" strokeWidth="1.5" />
        <rect x="9" y="8" width="142" height="32" rx="5" fill="var(--navy)" opacity="0.92" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} className="vent-slat" x="12" y={10.5 + i * 6} width="136" height="3.4" rx="1.4" fill="var(--mist)" style={{ ["--i" as string]: i }} />
        ))}
        {[24, 58, 92, 126].map((x, i) => (
          <path
            key={x}
            className="vent-air"
            d={`M${x + 6} 50 C ${x - 4} 66, ${x + 16} 80, ${x + 6} 96 S ${x - 2} 108, ${x + 4} 114`}
            fill="none"
            stroke="var(--accent-ink)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="5 9"
            style={{ ["--i" as string]: i }}
          />
        ))}
      </svg>
    </div>
  );
}

/** The outdoor condenser: a fresh system spins fast and smooth, an old one slows and rattles. */
export function Condenser({ age, tired, className }: { age: number; tired: boolean; className?: string }) {
  const fan = useRef<SVGGElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    tween.current = gsap.to(fan.current, { rotation: 360, svgOrigin: "32 30", duration: 0.9, ease: "none", repeat: -1 });
    return () => tween.current?.kill();
  });
  useEffect(() => {
    if (!tween.current) return;
    const speed = gsap.utils.mapRange(1, 25, 1.6, 0.28, age);
    gsap.to(tween.current, { timeScale: speed, duration: 0.8, ease: "power2.out" });
  }, [age]);

  return (
    <svg viewBox="0 0 64 64" className={clsx("condenser", tired && "is-tired", className)} aria-hidden>
      <rect x="4" y="2" width="56" height="54" rx="6" fill="none" stroke="rgba(245,249,251,0.35)" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="21" fill="none" stroke="rgba(245,249,251,0.22)" strokeWidth="1.2" />
      <circle cx="32" cy="30" r="15" fill="none" stroke="rgba(245,249,251,0.12)" strokeWidth="1" />
      <g ref={fan} fill="var(--accent)" opacity="0.9">
        {[0, 120, 240].map((r) => (
          <path key={r} d="M32 30c-1.6-6.4.4-13.4 6.2-15.4 2.2 4.4-.8 11.4-6.2 15.4Z" transform={`rotate(${r} 32 30)`} />
        ))}
        <circle cx="32" cy="30" r="3" />
      </g>
      <path d="M8 60h10M46 60h10" stroke="rgba(245,249,251,0.35)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** An air filter that goes from dusty to clean with a wipe when it comes into view. */
export function FilterSwap({ className, children }: { className?: string; children?: ReactNode }) {
  const ref = useInView<HTMLDivElement>();
  const pleats = Array.from({ length: 15 }, (_, i) => `${8 + i * 8} ${i % 2 ? 40 : 8}`).join(" L");
  return (
    <div ref={ref} className={clsx("filter-swap flex items-center gap-3", className)} aria-hidden>
      <svg viewBox="0 0 128 48" className="h-10 w-auto overflow-visible">
        <defs>
          <filter id="fs-dust">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.33  0 0 0 0 0.22  0 0 0 1.8 -0.6" />
          </filter>
          <clipPath id="fs-inside">
            <rect x="5" y="5" width="118" height="38" rx="2" />
          </clipPath>
        </defs>
        <rect x="1" y="1" width="126" height="46" rx="5" fill="var(--white)" stroke="var(--navy)" strokeOpacity="0.25" strokeWidth="2" />
        <path d={`M${pleats}`} fill="none" stroke="var(--navy)" strokeOpacity="0.28" strokeWidth="1.4" strokeLinejoin="round" clipPath="url(#fs-inside)" />
        <g clipPath="url(#fs-inside)">
          <g className="filter-dust">
            <rect x="0" y="0" width="128" height="48" fill="#b49a76" opacity="0.5" />
            <rect x="0" y="0" width="128" height="48" filter="url(#fs-dust)" />
          </g>
          <rect className="filter-glint" x="-30" y="-10" width="14" height="70" fill="white" opacity="0.8" transform="rotate(18 0 0)" />
        </g>
      </svg>
      {children}
    </div>
  );
}

/** A round thermostat that swings in from the outside temperature and settles on the set point. */
export function SettleDial({ lang = "en", className }: { lang?: "en" | "sr"; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const arc = useRef<SVGCircleElement>(null);
  const knob = useRef<SVGGElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const sr = lang === "sr";
  const [from, to, lo, hi] = sr ? [36, 22, 10, 40] : [97, 72, 50, 104];
  const R = 26;
  const C = 2 * Math.PI * R;
  const SWEEP = 0.75; // the ring is a 270° arc

  useGSAP(
    () => {
      const set = (v: number) => {
        const p = gsap.utils.clamp(0, 1, (v - lo) / (hi - lo));
        arc.current!.style.strokeDasharray = `${(p * SWEEP * C).toFixed(2)} ${C.toFixed(2)}`;
        knob.current!.setAttribute("transform", `rotate(${(p * 270).toFixed(1)} 32 32)`);
        num.current!.textContent = `${Math.round(v)}°`;
      };
      if (prefersReducedMotion()) return set(to);
      const state = { v: from };
      set(from);
      const tw = gsap.to(state, {
        v: to,
        duration: 2.6,
        ease: "elastic.out(1, 0.42)",
        paused: true,
        onUpdate: () => set(state.v),
      });
      const st = ScrollTrigger.create({ trigger: root.current, start: "top 85%", once: true, onEnter: () => tw.play() });
      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={clsx("theme-navy pointer-events-none flex items-center gap-3 rounded-full py-2 pr-5 pl-2 shadow-[0_20px_40px_-20px_rgb(10_23_38/0.6)] ring-1 ring-white/12", className)}>
      <span className="relative grid h-16 w-16 shrink-0 place-items-center">
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-[225deg]" aria-hidden>
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(245,249,251,0.14)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${SWEEP * C} ${C}`} />
          <circle ref={arc} cx="32" cy="32" r={R} fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`0 ${C}`} />
          <g ref={knob}>
            <circle cx={32 + R} cy="32" r="4" fill="var(--frost)" />
          </g>
        </svg>
        <span ref={num} className="font-display text-[1.05rem] tracking-[-0.04em] tabular" data-no-translate>
          {to}°
        </span>
      </span>
      <span className="leading-tight">
        <span className="block font-mono text-[0.62rem] tracking-[0.14em] text-frost/60 uppercase">Set &amp; holding</span>
        <span className="mt-0.5 block text-[0.92rem] font-semibold">All over town</span>
      </span>
    </div>
  );
}

/** Frost on the glass that melts away as the section scrolls up into view. */
export function FrostMelt() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      ref.current,
      { opacity: 1 },
      { opacity: 0, ease: "none", scrollTrigger: { trigger: ref.current!.parentElement, start: "top 85%", end: "top 15%", scrub: 0.6 } },
    );
  });
  return <div ref={ref} className="frost pointer-events-none absolute inset-0 -z-[5]" aria-hidden />;
}

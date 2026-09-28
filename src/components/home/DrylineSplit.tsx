"use client";

import Link from "next/link";
import { useRef } from "react";
import { Photo } from "@/components/ui/Photo";
import { ArrowIcon, FlameIcon, SnowIcon } from "@/components/ui/Icons";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { img } from "@/lib/images";

/*
 * "The line moves": a pinned scene where a weather front — the dryline — sweeps across
 * the screen as you scroll, turning a July afternoon into a January night. The section
 * carries its own --mix, so buttons and accents inside it shift from cool to heat as the
 * front passes, independent of the visitor's thermostat.
 */

const STEPS = 28;

/** x-position (0–100) of the front at height y (0–1) for progress p. */
const frontX = (p: number, y: number) => 118 - p * 136 + Math.sin(y * Math.PI * 1.6 + p * 2.2) * 7 + (y - 0.5) * 10;

function clipFor(p: number) {
  const pts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const y = i / STEPS;
    pts.push(`${frontX(p, y).toFixed(2)}% ${(y * 100).toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")}, 120% 100%, 120% 0%)`;
}
function pathFor(p: number) {
  let d = "";
  for (let i = 0; i <= STEPS; i++) {
    const y = i / STEPS;
    d += `${i === 0 ? "M" : "L"}${frontX(p, y).toFixed(2)} ${(y * 100).toFixed(2)}`;
  }
  return d;
}

const cooling = ["AC repair, same day", "New AC systems", "Ductless mini-splits", "Heat pumps"];
const heating = ["Furnace repair, 24/7", "New furnaces", "Heat pumps & dual fuel", "Smart thermostats"];

export function DrylineSplit() {
  const root = useRef<HTMLElement>(null);
  const winter = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const glow = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const apply = (p: number) => {
          winter.current!.style.clipPath = clipFor(p);
          const d = pathFor(p);
          line.current!.setAttribute("d", d);
          glow.current!.setAttribute("d", d);
          const mix = Math.min(1, Math.max(0, (p - 0.35) / 0.3));
          root.current!.style.setProperty("--mix", mix.toFixed(3));
          root.current!.dataset.side = p > 0.5 ? "heat" : "cool";
        };
        apply(0);
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => apply(self.progress),
        });
        return () => {
          st.kill();
          winter.current!.style.clipPath = "";
          root.current!.style.removeProperty("--mix");
        };
      });
      // Reduced motion on desktop: a still frame with the front parked mid-screen.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: reduce)", () => {
        winter.current!.style.clipPath = clipFor(0.55);
        line.current!.setAttribute("d", pathFor(0.55));
        glow.current!.setAttribute("d", pathFor(0.55));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-navy mix-scope group/split relative isolate overflow-hidden md:h-[100svh]" aria-labelledby="split-title" data-side="cool">
      <h2 id="split-title" className="sr-only">
        Cooling in summer, heating in winter
      </h2>

      {/* Summer (cooling) — full frame */}
      <div className="relative h-[80svh] md:absolute md:inset-0 md:h-auto">
        <Photo photo={img.stormRoadFire} sizes="100vw" quality={60} />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/40 to-navy/10" />
        <Panel
          side="cool"
          kicker="July · 104°F"
          title={
            <>
              When it&rsquo;s this hot,
              <br />
              we cool.
            </>
          }
          items={cooling}
          href="/services/ac-repair"
          cta="AC repair"
        />
      </div>

      {/* Winter (heating) — revealed behind the moving front */}
      <div ref={winter} className="relative h-[80svh] md:absolute md:inset-0 md:h-auto md:[clip-path:polygon(120%_0,120%_100%,120%_100%,120%_0)]">
        <Photo photo={img.winterHouseNight} sizes="100vw" quality={60} />
        <div className="absolute inset-0 bg-gradient-to-l from-navy/85 via-navy/40 to-navy/10" />
        <Panel
          side="heat"
          kicker="January · 9°F"
          title={
            <>
              When it&rsquo;s this cold,
              <br />
              we heat.
            </>
          }
          items={heating}
          href="/services/furnace-repair"
          cta="Furnace repair"
          right
        />
      </div>

      {/* The front itself */}
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path ref={glow} d={pathFor(0)} fill="none" stroke="var(--accent)" strokeWidth={14} opacity={0.18} vectorEffect="non-scaling-stroke" style={{ filter: "blur(6px)" }} />
        <path ref={line} d={pathFor(0)} fill="none" stroke="var(--accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </svg>

      <p className="pointer-events-none absolute top-[calc(var(--bar-h)+var(--header-h)+12px)] left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-navy/60 px-4 py-2 font-mono text-[0.68rem] tracking-[0.16em] text-frost/85 uppercase backdrop-blur md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> The dryline is moving — keep scrolling
      </p>
    </section>
  );
}

function Panel({
  side,
  kicker,
  title,
  items,
  href,
  cta,
  right,
}: {
  side: "cool" | "heat";
  kicker: string;
  title: React.ReactNode;
  items: string[];
  href: string;
  cta: string;
  right?: boolean;
}) {
  const Icon = side === "cool" ? SnowIcon : FlameIcon;
  return (
    <div className={`absolute inset-0 flex items-end px-5 pb-12 md:items-center md:px-12 md:pb-0 lg:px-20 ${right ? "md:justify-end" : ""}`}>
      <div className="max-w-[30rem]">
        <p className={`eyebrow flex items-center gap-2 ${side === "cool" ? "text-cool" : "text-heat"}`}>
          <Icon width={16} height={16} /> {kicker}
        </p>
        <p className="display-md mt-5">{title}</p>
        <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.98rem] text-frost/85">
          {items.map((i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`h-1 w-1 rounded-full ${side === "cool" ? "bg-cool" : "bg-heat"}`} />
              {i}
            </li>
          ))}
        </ul>
        <Link href={href} className="mix-scope btn btn-accent on-dark mt-8" style={{ ["--mix" as string]: side === "cool" ? 0 : 1 }}>
          {cta} <ArrowIcon width={18} height={18} />
        </Link>
      </div>
    </div>
  );
}

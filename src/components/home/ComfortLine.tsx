"use client";

import { useRef } from "react";
import { Photo } from "@/components/ui/Photo";
import { FanIcon, FlameIcon, SnowIcon } from "@/components/ui/Icons";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { img } from "@/lib/images";

/*
 * "The comfortable side of the line": a year of outdoor highs drawn as a live trace, with the
 * indoor temperature held flat at 72° straight through it. Scrolling the section walks the
 * cursor from January to December; hovering, dragging or the arrow keys take over. The section
 * carries its own --mix (hot outside → we cool, cold → we heat), so its accents, the photo and
 * the airflow follow the season under the cursor.
 */

const DAYS = 365;
const INSIDE = 72;
const T_HI = 112; // chart range, °F
const T_LO = -4;
const W = 1000;
const H = 400;

const ease = (d: number, c: number, w: number) => Math.exp(-(((d - c) / w) ** 2));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Daily highs for a made-up but honest Oklahoma year: a 9° snap in January, a forty-degree drop in April, 104° in July. */
const YEAR: number[] = Array.from({ length: DAYS }, (_, d) => {
  const phase = (2 * Math.PI * (d - 17)) / DAYS;
  const summer = (1 - Math.cos(phase)) / 2;
  const fronts = 6 * Math.sin(d * 0.71) + 4.5 * Math.sin(d * 0.29 + 1.3) + 3 * Math.sin(d * 1.93 + 0.4);
  let t = 71 - 24 * Math.cos(phase) + fronts * (1 - 0.45 * summer);
  t = lerp(t, 9, ease(d, 13, 3.2)); // cold snap
  t = d < 99 ? lerp(t, 86, ease(d, 98, 2.2)) : lerp(t, 46, ease(d, 99, 2.2)); // the swing before dinner
  t = lerp(t, 104, ease(d, 199, 5)); // heat dome
  return t;
});
const PEAK = 199;
const SNAP = 13;
const SWING = 99;

const yOf = (t: number) => (H * (T_HI - t)) / (T_HI - T_LO);
const xOf = (d: number) => (d / (DAYS - 1)) * W;
const Y_IN = yOf(INSIDE);
const CURVE = YEAR.map((t, d) => `${d ? "L" : "M"}${xOf(d).toFixed(1)} ${yOf(t).toFixed(1)}`).join("");
const AREA = `${CURVE}L${W} ${Y_IN.toFixed(1)}L0 ${Y_IN.toFixed(1)}Z`;
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

const MONTHS = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  sr: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"],
};
const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/** Mode for an outdoor high: the system cools above 76°, heats below 60°, and just moves air between. */
const modeOf = (t: number) => (t >= 76 ? "cool" : t < 60 ? "heat" : "fan");

export function ComfortLine({ lang = "en" }: { lang?: "en" | "sr" }) {
  const root = useRef<HTMLDivElement>(null);
  const chart = useRef<HTMLDivElement>(null);
  const clip = useRef<SVGRectElement>(null);
  const date = useRef<HTMLSpanElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const delta = useRef<HTMLSpanElement>(null);

  const c = lang === "sr";
  const deg = (f: number) => (c ? Math.round(((f - 32) * 5) / 9) : Math.round(f));
  const fmt = (f: number) => `${deg(f)}°`.replace("-", "−");
  const label = (d: number) => {
    const m = MONTH_START.findLastIndex((s) => s <= d);
    return `${MONTHS[lang][m]} ${d - MONTH_START[m] + 1}`;
  };

  useGSAP(
    () => {
      const el = root.current!;
      const section = el.closest("section") ?? el;
      const box = chart.current!;
      const reduced = prefersReducedMotion();

      let scrollDay = reduced ? PEAK : 0; // where the page scroll puts the cursor
      let manual: number | null = null; // where the visitor put it
      let cur = scrollDay;
      let shown = -1;
      let raf = 0;
      let visible = false;

      const render = (d: number) => {
        const t = YEAR[Math.round(d)];
        const mix = clamp01((84 - t) / 34); // hot → 0 (cool accent), cold → 1 (heat accent)
        const x = d / (DAYS - 1);
        box.style.setProperty("--x", x.toFixed(4));
        box.style.setProperty("--yo", pct(yOf(t), H));
        el.style.setProperty("--t", clamp01((t - 20) / 80).toFixed(3));
        section.style.setProperty("--mix", mix.toFixed(3));
        el.style.setProperty("--summer", (1 - mix).toFixed(3));
        clip.current!.setAttribute("width", reduced && manual == null ? String(W) : (x * W).toFixed(1));
        const day = Math.round(d);
        if (day === shown) return;
        shown = day;
        el.dataset.mode = modeOf(t);
        box.dataset.peak = String(day >= PEAK - 2);
        box.dataset.snap = String(day >= SNAP - 2);
        box.dataset.swing = String(day >= SWING);
        date.current!.textContent = label(day);
        out.current!.textContent = fmt(t);
        delta.current!.textContent = `${Math.abs(deg(t) - deg(INSIDE))}°`;
        box.setAttribute("aria-valuenow", String(day + 1));
        box.setAttribute(
          "aria-valuetext",
          c
            ? `${label(day)}: napolju ${fmt(t)}C, unutra ${fmt(INSIDE)}C`
            : `${label(day)}: ${fmt(t)}F outside, ${fmt(INSIDE)}F inside`,
        );
      };

      const tick = () => {
        raf = 0;
        const target = manual ?? scrollDay;
        const diff = target - cur;
        cur = reduced || Math.abs(diff) < 0.05 ? target : cur + diff * 0.14;
        render(cur);
        if (cur !== target && visible) raf = requestAnimationFrame(tick);
      };
      const kick = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };

      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) kick();
      });
      io.observe(el);

      let dragging = false;
      let hovering = false;
      let keyed = false; // moved with the arrow keys: stays put until focus leaves
      // A scroll hands the cursor back to the page, unless the visitor is still pointing at the chart
      const yieldToScroll = () => {
        if (manual != null && !dragging && !hovering && !keyed) manual = null;
      };

      // Desktop: the card is sticky, so the whole section drives it. Phones: the card itself.
      const mm = gsap.matchMedia();
      const follow = (trigger: Element, start: string, end: string) => () => {
        const st = ScrollTrigger.create({
          trigger,
          start,
          end,
          onUpdate: (self) => {
            scrollDay = self.progress * (DAYS - 1);
            yieldToScroll();
            kick();
          },
        });
        return () => st.kill();
      };
      if (!reduced) {
        mm.add("(min-width: 1024px)", follow(section, "top 45%", "bottom 80%"));
        mm.add("(max-width: 1023.98px)", follow(el, "top 75%", "bottom 60%"));
      }

      const dayAt = (clientX: number) => {
        const r = box.getBoundingClientRect();
        return clamp01((clientX - r.left) / r.width) * (DAYS - 1);
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "mouse") hovering = true;
        if (hovering || dragging) {
          manual = dayAt(e.clientX);
          kick();
        }
      };
      const onDown = (e: PointerEvent) => {
        keyed = false;
        if (e.pointerType === "mouse") return;
        dragging = true;
        manual = dayAt(e.clientX);
        kick();
      };
      // A finger lifted leaves the cursor where it was dragged (until the next scroll)
      const release = () => {
        dragging = false;
      };
      const onLeave = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        hovering = false;
        yieldToScroll();
        kick();
      };
      const onKey = (e: KeyboardEvent) => {
        const step = { ArrowRight: 7, ArrowUp: 7, ArrowLeft: -7, ArrowDown: -7, PageUp: 30, PageDown: -30 }[e.key];
        const base = Math.round(manual ?? cur);
        let next: number | null = null;
        if (step) next = base + step;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = DAYS - 1;
        if (next == null) return;
        e.preventDefault();
        keyed = true;
        manual = Math.min(DAYS - 1, Math.max(0, next));
        kick();
      };
      const onBlur = () => {
        keyed = false;
        manual = null;
        kick();
      };

      box.addEventListener("pointermove", onMove);
      box.addEventListener("pointerdown", onDown);
      box.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
      box.addEventListener("keydown", onKey);
      box.addEventListener("blur", onBlur);

      render(cur);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        mm.revert();
        box.removeEventListener("pointermove", onMove);
        box.removeEventListener("pointerdown", onDown);
        box.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
        box.removeEventListener("keydown", onKey);
        box.removeEventListener("blur", onBlur);
        section.style.removeProperty("--mix");
      };
    },
    { scope: root },
  );

  const pin = (d: number) => ({ left: pct(xOf(d), W), top: pct(yOf(YEAR[d]), H) });

  return (
    <div ref={root} className="cl theme-navy relative isolate flex h-full flex-col overflow-hidden rounded-[28px] sm:min-h-[620px]" data-mode="heat">
      {/* The season behind the glass */}
      <div className="cl-photo absolute inset-0 -z-10" style={{ opacity: "var(--summer, 0)" }}>
        <Photo photo={img.summerSun} sizes="(min-width: 1024px) 42vw, 100vw" quality={60} position="50% 70%" />
      </div>
      <div className="cl-photo absolute inset-0 -z-20">
        <Photo photo={img.winterHouseNight} sizes="(min-width: 1024px) 42vw, 100vw" quality={60} />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_23_38/0.55)_0%,rgb(10_23_38/0.78)_45%,rgb(10_23_38/0.94)_100%)]" />

      {/* Readouts */}
      <div className="relative grid grid-cols-[1fr_auto] gap-x-6 p-6 sm:p-8">
        <div>
          <p className="eyebrow flex items-center gap-2 text-frost/70">
            Outside
            <span className="text-frost/40">·</span>
            <span ref={date} className="tabular text-frost" data-no-translate>
              {label(0)}
            </span>
          </p>
          <p className="cl-temp mt-2 font-display text-[clamp(4rem,9vw,6.6rem)] leading-[0.9] tracking-[-0.07em] tabular">
            <span ref={out} data-no-translate>
              {fmt(YEAR[0])}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="eyebrow flex items-center justify-end gap-2 text-frost/70">
            <span className="live-dot" aria-hidden /> Inside
          </p>
          <p className="mt-2 font-display text-[clamp(2.2rem,4.4vw,3.2rem)] leading-[0.9] tracking-[-0.06em] tabular" data-no-translate>
            {fmt(INSIDE)}
          </p>
          <p className="mt-2 font-mono text-[0.68rem] tracking-[0.12em] text-frost/60 uppercase">All year</p>
        </div>

        <div className="col-span-2 mt-6 flex flex-wrap items-center gap-2.5">
          <span className="cl-chip inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            <span className="cl-when-cool items-center gap-2">
              <SnowIcon width={14} height={14} /> Cooling
            </span>
            <span className="cl-when-fan items-center gap-2">
              <FanIcon width={14} height={14} className="cl-spin" /> Fan only
            </span>
            <span className="cl-when-heat items-center gap-2">
              <FlameIcon width={14} height={14} /> Heating
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-2 font-mono text-[0.7rem] tracking-[0.14em] text-frost/75 uppercase ring-1 ring-white/10 backdrop-blur">
            <span>Holding back</span>
            <span ref={delta} className="text-frost" data-no-translate>
              {Math.abs(deg(YEAR[0]) - deg(INSIDE))}°
            </span>
          </span>
        </div>
      </div>

      {/* The year */}
      <div className="relative mt-auto px-6 pt-8 pb-6 sm:px-8 sm:pb-8">
        <div
          ref={chart}
          style={{ ["--yin" as string]: pct(Y_IN, H) }}
          className="cl-chart relative h-[clamp(220px,34vw,270px)] lg:h-[clamp(240px,23vw,330px)] cursor-ew-resize touch-pan-y outline-none select-none"
          role="slider"
          tabIndex={0}
          aria-label="A year of outside temperatures against the indoor line"
          aria-valuemin={1}
          aria-valuemax={DAYS}
          aria-valuenow={1}
        >
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="cl-fill" x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="var(--heat)" stopOpacity="0.55" />
                <stop offset={(Y_IN / H).toFixed(3)} stopColor="var(--heat)" stopOpacity="0.04" />
                <stop offset={(Y_IN / H).toFixed(3)} stopColor="var(--cool)" stopOpacity="0.04" />
                <stop offset="1" stopColor="var(--cool)" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="cl-stroke" x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
                <stop offset="0.1" stopColor="var(--heat-ink)" />
                <stop offset="0.28" stopColor="var(--heat)" />
                <stop offset={(Y_IN / H).toFixed(3)} stopColor="#f5f9fb" />
                <stop offset="0.72" stopColor="var(--cool)" />
                <stop offset="1" stopColor="#5aa9ff" />
              </linearGradient>
              <clipPath id="cl-past">
                <rect ref={clip} x="0" y="-20" width="0" height={H + 40} />
              </clipPath>
            </defs>
            {/* months */}
            {MONTH_START.slice(1).map((s) => (
              <line key={s} x1={xOf(s)} x2={xOf(s)} y1="0" y2={H} stroke="rgb(245 249 251 / 0.07)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            {/* the rest of the year, faint */}
            <path d={CURVE} fill="none" stroke="rgb(245 249 251 / 0.16)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
            {/* the year so far */}
            <g clipPath="url(#cl-past)">
              <path d={AREA} fill="url(#cl-fill)" />
              <path d={CURVE} fill="none" stroke="url(#cl-stroke)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </g>
            {/* the line: indoor air, flowing */}
            <line x1="0" x2={W} y1={Y_IN} y2={Y_IN} stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="8" vectorEffect="non-scaling-stroke" style={{ filter: "blur(4px)" }} />
            <line className="cl-flow" x1="0" x2={W} y1={Y_IN} y2={Y_IN} stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Story pins */}
          <span className="cl-pin" data-pin="snap" style={pin(SNAP)} aria-hidden>
            <span data-no-translate>{fmt(YEAR[SNAP])}</span>
          </span>
          <span className="cl-pin" data-pin="swing" style={pin(SWING - 1)} aria-hidden>
            Forty-degree swing
          </span>
          <span className="cl-pin" data-pin="peak" style={pin(PEAK)} aria-hidden>
            <span data-no-translate>{fmt(YEAR[PEAK])}</span>
          </span>

          {/* Cursor */}
          <span className="cl-cursor" aria-hidden />
          <span className="cl-gap" aria-hidden />
          <span className="cl-dot cl-dot-out" aria-hidden />
          <span className="cl-dot cl-dot-in" style={{ top: pct(Y_IN, H) }} aria-hidden />
          <span className="cl-air" style={{ top: pct(Y_IN, H) }} aria-hidden>
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} style={{ ["--i" as string]: i }} />
            ))}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-12 font-mono text-[0.62rem] tracking-[0.1em] text-frost/45 uppercase" aria-hidden data-no-translate>
          {MONTHS[lang].map((m) => (
            <span key={m}>{m.slice(0, 1)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

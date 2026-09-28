"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { gsap } from "@/lib/gsap";
import { ArrowIcon } from "@/components/ui/Icons";

/*
 * Repair or replace? Four honest inputs → an animated gauge and an estimated yearly saving.
 * Based on the industry "$5,000 rule" (age × repair cost) plus the efficiency gain of a
 * 16 SEER2 system. Clearly an estimate — the real answer comes from a technician.
 */

const SEERS = [
  { v: 8, label: "8", hint: "Pre-1995" },
  { v: 10, label: "10", hint: "1995–2005" },
  { v: 13, label: "13", hint: "2006–2014" },
  { v: 14, label: "14", hint: "2015–2022" },
  { v: 16, label: "16+", hint: "Newer" },
];
const NEW_SEER = 17; // ≈ 16 SEER2
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

export function evaluate(age: number, repair: number, seer: number, bill: number) {
  const rule = age * repair;
  const ruleScore = clamp(rule / 8000);
  const ageScore = clamp((age - 6) / 12);
  const effScore = clamp((14 - seer) / 6);
  const score = clamp(0.5 * ruleScore + 0.32 * ageScore + 0.18 * effScore + (rule > 5000 ? 0.08 : 0) - (age < 6 ? 0.15 : 0));
  const coolingCost = bill * 0.55 * 7; // share of the bill that's cooling × cooling months in OK
  const savings = Math.max(0, Math.round((coolingCost * (1 - seer / NEW_SEER)) / 10) * 10);
  const verdict = score < 0.4 ? "repair" : score < 0.6 ? "tossup" : "replace";
  return { rule, score, savings, verdict } as const;
}

const copy = {
  repair: {
    title: "Repair it.",
    body: "The numbers favor fixing what you have. Put the money into the repair and a tune-up — you'll likely get several more good seasons.",
  },
  tossup: {
    title: "It's a toss-up.",
    body: "Either choice is reasonable. If you're planning to stay 5+ years or the system has needed repairs before, replacing starts to pay off.",
  },
  replace: {
    title: "Time to replace.",
    body: "You'd be putting good money into a tired system. A new high-efficiency system should cut your bills and come with a 10-year warranty.",
  },
};

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  hint?: string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-[1.25rem] tracking-[-0.03em] tabular">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        aria-valuetext={format(value)}
      />
      {hint && <p className="mt-1.5 text-[0.82rem] text-muted">{hint}</p>}
    </div>
  );
}

export function RepairReplace() {
  const [age, setAge] = useState(13);
  const [repair, setRepair] = useState(1200);
  const [seer, setSeer] = useState(10);
  const [bill, setBill] = useState(240);
  const result = useMemo(() => evaluate(age, repair, seer, bill), [age, repair, seer, bill]);

  const needle = useRef<SVGGElement>(null);
  const savingsEl = useRef<HTMLSpanElement>(null);
  const tenEl = useRef<HTMLSpanElement>(null);
  const shown = useRef({ s: result.savings });
  const started = useRef(false);

  useEffect(() => {
    const angle = -90 + result.score * 180;
    const first = !started.current;
    started.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(needle.current, {
      rotation: angle,
      svgOrigin: "160 160",
      duration: reduce ? 0 : first ? 2 : 1.1,
      ease: first ? "elastic.out(1, 0.45)" : "elastic.out(1, 0.6)",
    });
    gsap.to(shown.current, {
      s: result.savings,
      duration: reduce ? 0 : 0.9,
      ease: "power3.out",
      onUpdate: () => {
        if (savingsEl.current) savingsEl.current.textContent = `$${Math.round(shown.current.s).toLocaleString("en-US")}`;
        if (tenEl.current) tenEl.current.textContent = `$${(Math.round((shown.current.s * 10) / 50) * 50).toLocaleString("en-US")}`;
      },
    });
  }, [result.score, result.savings]);

  const v = copy[result.verdict];

  return (
    <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_-40px_rgb(10_23_38/0.35)] ring-1 ring-line lg:grid-cols-[1.05fr_1fr]">
      <form className="grid gap-8 p-6 sm:p-10" onSubmit={(e) => e.preventDefault()} aria-label="Repair or replace calculator">
        <Range label="System age" value={age} min={1} max={25} step={1} onChange={setAge} format={(n) => `${n} yr${n === 1 ? "" : "s"}`} />
        <Range
          label="Repair quote"
          value={repair}
          min={100}
          max={5000}
          step={50}
          onChange={setRepair}
          format={(n) => `$${n.toLocaleString("en-US")}`}
          hint="The price you've been quoted for this repair."
        />
        <fieldset>
          <legend className="font-medium">Current efficiency (SEER)</legend>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {SEERS.map((s) => (
              <label
                key={s.v}
                className={clsx(
                  "relative flex min-h-[64px] cursor-pointer flex-col items-center justify-center rounded-2xl border text-center transition-colors",
                  seer === s.v ? "border-transparent bg-navy text-frost" : "border-line hover:border-navy/40",
                )}
              >
                <input type="radio" name="seer" value={s.v} checked={seer === s.v} onChange={() => setSeer(s.v)} className="peer sr-only" />
                <span className="font-display text-lg tracking-[-0.03em]">{s.label}</span>
                <span className={clsx("text-[0.66rem] leading-tight", seer === s.v ? "text-frost/70" : "text-muted")}>{s.hint}</span>
                <span className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent-ink)]" />
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-[0.82rem] text-muted">Not sure? It&rsquo;s on the sticker on your outdoor unit — or pick by the year it was installed.</p>
        </fieldset>
        <Range label="Summer electric bill" value={bill} min={80} max={600} step={10} onChange={setBill} format={(n) => `$${n}/mo`} />
      </form>

      <div className="theme-navy relative flex flex-col justify-between gap-8 p-6 sm:p-10" aria-live="polite">
        <div>
          <p className="eyebrow text-frost/60">Our honest read</p>
          <svg viewBox="0 -14 320 204" className="mt-4 w-full max-w-[420px]" role="img" aria-label={`Gauge: ${v.title}`}>
            <defs>
              <linearGradient id="gauge-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#e8e0a0" />
                <stop offset="100%" stopColor="var(--heat)" />
              </linearGradient>
            </defs>
            <path d="M 30 160 A 130 130 0 0 1 290 160" fill="none" stroke="rgba(245,249,251,0.1)" strokeWidth="22" strokeLinecap="round" />
            <path d="M 30 160 A 130 130 0 0 1 290 160" fill="none" stroke="url(#gauge-grad)" strokeWidth="22" strokeLinecap="round" opacity="0.9" />
            {Array.from({ length: 19 }, (_, i) => {
              const a = ((-90 + i * 10 - 90) * Math.PI) / 180;
              const r0 = i % 3 === 0 ? 100 : 106;
              return (
                <line
                  key={i}
                  x1={(160 + r0 * Math.cos(a)).toFixed(2)}
                  y1={(160 + r0 * Math.sin(a)).toFixed(2)}
                  x2={(160 + 112 * Math.cos(a)).toFixed(2)}
                  y2={(160 + 112 * Math.sin(a)).toFixed(2)}
                  stroke="rgba(245,249,251,0.35)"
                  strokeWidth={i % 3 === 0 ? 2 : 1}
                />
              );
            })}
            <text x="22" y="186" fill="rgba(245,249,251,0.6)" fontSize="11" fontFamily="var(--font-mono)">REPAIR</text>
            <text x="160" y="-2" textAnchor="middle" fill="rgba(245,249,251,0.6)" fontSize="11" fontFamily="var(--font-mono)">TOSS-UP</text>
            <text x="298" y="186" textAnchor="end" fill="rgba(245,249,251,0.6)" fontSize="11" fontFamily="var(--font-mono)">REPLACE</text>
            <g ref={needle} transform="rotate(-90 160 160)">
              <path d="M 157 160 L 160 58 L 163 160 Z" fill="#f5f9fb" />
            </g>
            <circle cx="160" cy="160" r="12" fill="#f5f9fb" />
            <circle cx="160" cy="160" r="5" fill="var(--navy)" />
          </svg>
          <p className="display-md mt-2">{v.title}</p>
          <p className="mt-3 max-w-[30rem] text-frost/75">{v.body}</p>
        </div>

        <dl className="grid grid-cols-2 gap-5 border-t border-line pt-6">
          <div>
            <dt className="font-mono text-[0.66rem] tracking-[0.12em] text-frost/60 uppercase">Est. yearly savings*</dt>
            <dd className="mt-1 font-display text-[clamp(1.8rem,3vw,2.5rem)] tracking-[-0.04em] text-accent tabular">
              <span ref={savingsEl}>${result.savings.toLocaleString("en-US")}</span>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.66rem] tracking-[0.12em] text-frost/60 uppercase">Over 10 years*</dt>
            <dd className="mt-1 font-display text-[clamp(1.8rem,3vw,2.5rem)] tracking-[-0.04em] tabular">
              <span ref={tenEl}>${(Math.round((result.savings * 10) / 50) * 50).toLocaleString("en-US")}</span>
            </dd>
          </div>
        </dl>
          <div className="-mt-2 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[0.82rem] text-frost/60">
              $5,000 rule: {age} × ${repair.toLocaleString("en-US")} = <span className="text-frost">${result.rule.toLocaleString("en-US")}</span>
            </p>
            <Link href="/schedule?reason=estimate" className="btn btn-accent on-dark">
              Get a free second opinion <ArrowIcon width={18} height={18} />
            </Link>
          </div>
        <p className="text-[0.75rem] leading-snug text-frost/50">
          *Estimates only, for a 16 SEER2 replacement. Assumes cooling is ~55% of your summer bill over 7 cooling months. Actual savings depend on your home, usage, rates and
          installation. Energy-efficiency rebates may be available.
        </p>
      </div>
    </div>
  );
}

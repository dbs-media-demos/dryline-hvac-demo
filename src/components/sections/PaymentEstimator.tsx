"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { gsap } from "@/lib/gsap";

const TERMS = [
  { months: 18, apr: 0, label: "18 months", note: "0% APR promo" },
  { months: 60, apr: 7.99, label: "5 years", note: "7.99% APR" },
  { months: 120, apr: 9.99, label: "10 years", note: "9.99% APR" },
];

const payment = (price: number, months: number, apr: number) => {
  if (apr === 0) return price / months;
  const r = apr / 100 / 12;
  return (price * r) / (1 - Math.pow(1 + r, -months));
};

/** Monthly payment estimator for a new system. Illustrative only. */
export function PaymentEstimator() {
  const [price, setPrice] = useState(8900);
  const [term, setTerm] = useState(2);
  const out = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: 0 });
  const t = TERMS[term];
  const monthly = payment(price, t.months, t.apr);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(shown.current, {
      v: monthly,
      duration: reduce ? 0 : 0.8,
      ease: "power3.out",
      onUpdate: () => {
        if (out.current) out.current.textContent = `$${Math.round(shown.current.v).toLocaleString("en-US")}`;
      },
    });
  }, [monthly]);

  const pct = ((price - 3900) / (16000 - 3900)) * 100;

  return (
    <div className="grid overflow-hidden rounded-[28px] bg-white ring-1 ring-line lg:grid-cols-[1.1fr_1fr]">
      <div className="grid gap-9 p-6 sm:p-10">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="sys-price" className="font-medium">
              System price
            </label>
            <output htmlFor="sys-price" className="font-display text-[1.3rem] tracking-[-0.03em] tabular">
              ${price.toLocaleString("en-US")}
            </output>
          </div>
          <input
            id="sys-price"
            type="range"
            min={3900}
            max={16000}
            step={100}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="range mt-3 w-full"
            style={{ "--pct": `${pct}%` } as React.CSSProperties}
          />
          <p className="mt-1.5 text-[0.82rem] text-muted">Furnaces start around $3,900; complete heat pump systems run up to about $14,500.</p>
        </div>
        <fieldset>
          <legend className="font-medium">Term</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {TERMS.map((o, i) => (
              <label
                key={o.months}
                className={clsx(
                  "flex min-h-[72px] cursor-pointer flex-col items-center justify-center rounded-2xl border text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent-ink)]",
                  term === i ? "border-transparent bg-navy text-frost" : "border-line hover:border-navy/40",
                )}
              >
                <input type="radio" name="term" className="sr-only" checked={term === i} onChange={() => setTerm(i)} />
                <span className="font-display text-[1.05rem] tracking-[-0.03em]">{o.label}</span>
                <span className={clsx("text-[0.72rem]", term === i ? "text-frost/70" : "text-muted")}>{o.note}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="theme-navy flex flex-col justify-between gap-8 p-6 sm:p-10" aria-live="polite">
        <div>
          <p className="eyebrow text-frost/60">Estimated monthly payment*</p>
          <p className="mt-4 font-display text-[clamp(3.4rem,7vw,5.5rem)] leading-none tracking-[-0.06em] text-accent tabular">
            <span ref={out}>${Math.round(monthly).toLocaleString("en-US")}</span>
            <span className="ml-2 font-mono text-base tracking-normal text-frost/60">/mo</span>
          </p>
          <p className="mt-4 text-frost/70">
            {t.label} · {t.note}
            {t.apr > 0 && ` · total ≈ $${Math.round(monthly * t.months).toLocaleString("en-US")}`}
          </p>
        </div>
        <div>
          <Link href="/schedule?reason=estimate" className="btn btn-accent on-dark w-full sm:w-auto">
            Get a free in-home estimate
          </Link>
          <p className="mt-5 text-[0.75rem] leading-snug text-frost/50">
            *Illustrative estimate only. Financing is offered through third-party lenders, subject to credit approval. Rates, terms and promotional periods vary; promotional 0%
            APR requires payment in full within the promo period. This is a concept site — no real offer.
          </p>
        </div>
      </div>
    </div>
  );
}

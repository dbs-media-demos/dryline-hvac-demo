"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import clsx from "clsx";
import { plans } from "@/content/plans";
import { CheckIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

/** A price whose digits roll like an odometer when it changes. */
function Odometer({ value }: { value: string }) {
  const chars = value.split("");
  return (
    <span className="relative inline-flex overflow-hidden tabular" aria-hidden>
      {chars.map((c, i) => {
        const key = chars.length - i; // key from the right so digits keep their slot
        if (!/\d/.test(c)) {
          return (
            <span key={`s${key}`} className="inline-block">
              {c}
            </span>
          );
        }
        const d = Number(c);
        return (
          <span key={`d${key}`} className="relative inline-block h-[1em] w-[0.62em] overflow-hidden leading-none">
            <span
              className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[1.1s] ease-[var(--ease-out-expo)]"
              style={{ transform: `translateY(${-d * 10}%)`, transitionDelay: `${i * 45}ms` }}
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} className="block h-[1em] text-center">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className={clsx("group transition-transform duration-700 ease-[var(--ease-out-expo)] will-change-transform", className)}>
      {children}
    </div>
  );
}

export function ComfortClub() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Billing period" className="relative inline-grid grid-cols-2 rounded-full bg-white p-1.5 ring-1 ring-line">
          <span
            aria-hidden
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-full bg-navy transition-transform duration-700 ease-[var(--ease-out-expo)]"
            style={{ transform: yearly ? "translateX(100%)" : "none" }}
          />
          {[
            { v: false, label: "Monthly" },
            { v: true, label: "Yearly · save ~10%" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={yearly === o.v}
              onClick={() => setYearly(o.v)}
              className={clsx("relative z-10 min-h-[44px] rounded-full px-5 text-[0.92rem] font-medium whitespace-nowrap transition-colors duration-500", yearly === o.v ? "text-frost" : "text-navy")}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <Reveal className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6" stagger={0.12}>
        {plans.map((p) => {
          const price = yearly ? String(p.yearly) : p.monthly.toFixed(2);
          const saved = Math.round(p.monthly * 12 - p.yearly);
          return (
            <TiltCard key={p.id} className="h-full">
              <article
                className={clsx(
                  "relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 sm:p-9",
                  p.featured ? "theme-navy shadow-[0_40px_80px_-30px_rgb(10_23_38/0.6)]" : "bg-white ring-1 ring-line",
                )}
                aria-labelledby={`plan-${p.id}`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [.group:hover_&]:opacity-100"
                  style={{ background: "radial-gradient(400px circle at var(--gx,50%) var(--gy,0%), color-mix(in oklch, var(--accent) 22%, transparent), transparent 60%)" }}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <h3 id={`plan-${p.id}`} className="font-display text-[1.5rem] tracking-[-0.04em]">
                    {p.name}
                  </h3>
                  {p.featured && <span className="rounded-full bg-accent px-3 py-1 font-mono text-[0.64rem] tracking-[0.12em] text-navy uppercase">Most popular</span>}
                </div>
                <p className={clsx("relative mt-2 min-h-[3rem] text-[0.95rem]", p.featured ? "text-frost/70" : "text-muted")}>{p.blurb}</p>

                <p className="relative mt-6 flex items-end gap-2">
                  <span className="font-display text-[3.4rem] leading-none tracking-[-0.06em]">
                    <span className="mr-0.5 align-top text-[1.6rem]">$</span>
                    <Odometer value={price} />
                    <span className="sr-only">{`$${price}`}</span>
                  </span>
                  <span className={clsx("mb-1.5 font-mono text-[0.72rem]", p.featured ? "text-frost/60" : "text-muted")}>/{yearly ? "year" : "month"}</span>
                </p>
                <p className={clsx("relative mt-2 h-5 text-[0.82rem] transition-opacity duration-500", yearly ? "opacity-100" : "opacity-0", p.featured ? "text-accent" : "text-accent-auto")}>
                  You save ${saved} a year
                </p>

                <dl className={clsx("relative mt-6 divide-y border-y", p.featured ? "divide-white/12 border-white/12" : "divide-line border-line")}>
                  {p.rows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-4 py-3 text-[0.95rem]">
                      <dt className={p.featured ? "text-frost/70" : "text-muted"}>{r.label}</dt>
                      <dd className="font-semibold">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="relative mt-5 space-y-2 text-[0.95rem]">
                  {p.extras.map((x) => (
                    <li key={x} className="flex items-start gap-2.5">
                      <CheckIcon width={18} height={18} className={clsx("mt-0.5 shrink-0", p.featured ? "text-accent" : "text-accent-auto")} />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-auto pt-8">
                  <Link href={`/schedule?plan=${p.id}`} className={clsx("btn w-full", p.featured ? "btn-accent on-dark" : "btn-navy")}>
                    Join {p.name}
                  </Link>
                </div>
              </article>
            </TiltCard>
          );
        })}
      </Reveal>
      <p className="mt-6 text-center text-[0.85rem] text-muted">Cancel anytime. Every plan: no overtime fees, ever — and a $0 diagnostic when something breaks.</p>
    </div>
  );
}

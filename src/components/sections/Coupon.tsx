"use client";

import { useState } from "react";
import clsx from "clsx";

type Props = { tag: string; title: string; body: string; code: string; until: string | null; featured?: boolean };

/** Ticket-style coupon with a click-to-copy code. */
export function Coupon({ tag, title, body, code, until, featured }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  const date = until ? new Date(until + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null;

  return (
    <article
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-[28px] transition-transform duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5",
        featured ? "theme-navy" : "bg-white ring-1 ring-line",
      )}
    >
      <div className="flex-1 p-7 sm:p-9">
        <p className={clsx("font-mono text-[0.68rem] tracking-[0.14em] uppercase", featured ? "text-accent" : "text-accent-auto")}>{tag}</p>
        <h3 className="mt-5 font-display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[0.95] tracking-[-0.06em]">{title}</h3>
        <p className={clsx("mt-4 max-w-[26rem]", featured ? "text-frost/75" : "text-muted")}>{body}</p>
      </div>
      {/* perforation */}
      <div className="relative h-0 border-t-2 border-dashed border-current/15">
        <span className={clsx("absolute -top-4 -left-4 h-8 w-8 rounded-full", "bg-frost")} />
        <span className={clsx("absolute -top-4 -right-4 h-8 w-8 rounded-full", "bg-frost")} />
      </div>
      <div className="flex items-center justify-between gap-4 p-7 sm:px-9">
        <div>
          <p className={clsx("text-[0.75rem]", featured ? "text-frost/60" : "text-muted")}>{date ? `Expires ${date}` : "Ongoing offer"}</p>
          <p className="mt-1 font-mono text-[1.05rem] tracking-[0.12em]">{code}</p>
        </div>
        <button type="button" onClick={copy} className={clsx("btn min-h-[44px] px-5 text-[0.88rem]", featured ? "btn-accent on-dark" : "btn-navy")} aria-live="polite">
          {copied ? "Copied ✓" : "Copy code"}
        </button>
      </div>
    </article>
  );
}

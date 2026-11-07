import clsx from "clsx";

/** Native <details> accordion — accessible and crawlable; height animates where supported. */
export function FaqList({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={clsx("divide-y divide-line border-y border-line", className)}>
      {items.map((f) => (
        <details key={f.q} className="faq group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 phone:gap-3 phone:py-2 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.12rem] leading-snug tracking-[-0.03em] md:text-[1.3rem] phone:text-[0.9rem]">{f.q}</span>
            {/* A little register: opening the answer opens the louvers and lets the air out */}
            <span className="faq-vent mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-[background-color,border-color] duration-500 group-open:border-transparent group-open:bg-accent" aria-hidden>
              <svg viewBox="0 0 20 20" width="18" height="18" className="overflow-visible">
                {[6, 10, 14].map((y, i) => (
                  <rect key={y} className="faq-slat" x="3" y={y - 1} width="14" height="2" rx="1" fill="currentColor" style={{ ["--i" as string]: i }} />
                ))}
                {[6, 10, 14].map((y, i) => (
                  <path key={y} className="faq-puff" d={`M18.5 ${y}h4`} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" style={{ ["--i" as string]: i }} />
                ))}
              </svg>
            </span>
          </summary>
          <p className="max-w-[46rem] pb-7 text-muted phone:pb-4 phone:text-[0.92rem] phone:leading-[1.45]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

import clsx from "clsx";
import { PlusIcon } from "@/components/ui/Icons";

/** Native <details> accordion — accessible and crawlable; height animates where supported. */
export function FaqList({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={clsx("divide-y divide-line border-y border-line", className)}>
      {items.map((f) => (
        <details key={f.q} className="faq group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.12rem] leading-snug tracking-[-0.03em] md:text-[1.3rem]">{f.q}</span>
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color] duration-500 group-open:rotate-45 group-open:border-transparent group-open:bg-accent">
              <PlusIcon width={16} height={16} />
            </span>
          </summary>
          <p className="max-w-[46rem] pb-7 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

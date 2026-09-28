import Link from "next/link";
import { ViewTransition } from "react";
import clsx from "clsx";
import { Photo } from "@/components/ui/Photo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { kindLabel, type Service } from "@/content/services";

export function ServiceCard({ s, className }: { s: Service; className?: string }) {
  return (
    <Link href={`/services/${s.slug}`} data-cursor="View" className={clsx("group block", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
        <ViewTransition name={`svc-${s.slug}`} share="morph" default="none">
          <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
            <Photo photo={s.photo} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" quality={60} />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 rounded-full bg-frost/90 px-3 py-1.5 font-mono text-[0.66rem] tracking-[0.12em] text-navy uppercase backdrop-blur">
          {kindLabel[s.kind]}
        </span>
        <span className="absolute right-4 bottom-4 grid h-12 w-12 place-items-center rounded-full bg-frost text-navy transition-[background-color,transform] duration-500 group-hover:rotate-45 group-hover:bg-accent">
          <ArrowUpRight width={18} height={18} />
        </span>
      </div>
      <h3 className="mt-5 font-display text-[1.5rem] tracking-[-0.04em]">{s.name}</h3>
      <p className="mt-2 text-muted">{s.short}</p>
      <p className="mt-3 font-mono text-[0.78rem] text-accent-auto">{s.price}</p>
    </Link>
  );
}

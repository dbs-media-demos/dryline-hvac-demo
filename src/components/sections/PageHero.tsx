import { ViewTransition, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { Photo } from "@/components/ui/Photo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { Photo as PhotoT } from "@/lib/images";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  photo?: PhotoT;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
  aside?: ReactNode;
  /** Shared-element name so a card image can morph into this hero. */
  morph?: string;
  tall?: boolean;
  position?: string;
};

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Inner-page header: full-bleed photo with a CSS-only intro (paints immediately for LCP). */
export function PageHero({ eyebrow, title, lede, photo, crumbs, children, aside, morph, tall, position }: Props) {
  const img = photo ? (
    <div className="anim-zoom absolute inset-0">
      <Photo photo={photo} sizes="100vw" preload quality={60} position={position} />
    </div>
  ) : null;

  return (
    <section className={clsx("theme-navy relative isolate flex flex-col justify-end overflow-hidden", photo ? (tall ? "min-h-[92svh]" : "min-h-[78svh]") : "min-h-[56svh]")}>
      {photo && (
        <div className="absolute inset-0 -z-10">
          {morph ? (
            <ViewTransition name={morph} share="morph" default="none">
              <div className="absolute inset-0">{img}</div>
            </ViewTransition>
          ) : (
            img
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/70 to-transparent" />
        </div>
      )}
      {!photo && (
        <div aria-hidden className="absolute -top-40 right-[-10%] -z-10 h-[520px] w-[720px] rounded-full opacity-35 blur-[120px]" style={{ background: "var(--accent)" }} />
      )}
      <div className="mx-auto w-full max-w-[1480px] px-5 pt-[calc(var(--bar-h)+var(--header-h)+40px)] pb-14 md:px-8 md:pb-20">
        <Breadcrumbs items={crumbs} className="anim-fade text-frost/80" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="anim-fade eyebrow flex items-center gap-3 text-accent-auto" style={d(0.05)}>
              <span className="h-px w-8 bg-current" aria-hidden />
              {eyebrow}
            </p>
            <h1 className="anim-heading display-lg mt-5 max-w-[18ch]" style={d(0.1)}>
              {title}
            </h1>
            {lede && (
              <p className="lede mt-6 max-w-[40rem] text-frost/80">
                {lede}
              </p>
            )}
            {children && (
              <div className="anim-fade mt-9 flex flex-col gap-3 sm:flex-row" style={d(0.32)}>
                {children}
              </div>
            )}
          </div>
          {aside && (
            <div className="anim-fade" style={d(0.4)}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

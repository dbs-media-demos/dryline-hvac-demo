import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

/** CSS-only infinite marquee. Content is duplicated once; the copy is hidden from assistive tech. */
export function Marquee({ children, duration = 40, reverse, className, pausable }: { children: ReactNode; duration?: number; reverse?: boolean; className?: string; pausable?: boolean }) {
  return (
    <div className={clsx("marquee flex overflow-hidden", className)}>
      <div className="marquee-track flex w-max shrink-0" data-reverse={reverse || undefined} data-pausable={pausable || undefined} style={{ "--marquee-dur": `${duration}s` } as CSSProperties}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

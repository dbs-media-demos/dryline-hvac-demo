import clsx from "clsx";
import type { ReactNode } from "react";
import { SplitReveal, Reveal } from "./Reveal";

export function SectionHead({ eyebrow, title, children, className, align = "left", as = "h2" }: { eyebrow: string; title: ReactNode; children?: ReactNode; className?: string; align?: "left" | "center"; as?: "h1" | "h2" }) {
  return (
    <div className={clsx(align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p className={clsx("eyebrow text-accent-auto flex items-center gap-3", align === "center" && "justify-center")}>
          <span className="h-px w-8 bg-current" aria-hidden />
          {eyebrow}
        </p>
      </Reveal>
      <SplitReveal as={as} className={clsx("display-lg mt-5", align === "center" ? "mx-auto max-w-[18ch]" : "max-w-[16ch]")}>
        {title}
      </SplitReveal>
      {children && (
        <Reveal delay={0.1} className={clsx("lede mt-6 text-muted", align === "center" ? "mx-auto max-w-[40rem]" : "max-w-[38rem]")}>
          {children}
        </Reveal>
      )}
    </div>
  );
}

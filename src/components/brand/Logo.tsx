import clsx from "clsx";

/**
 * The Dryline mark: a disc split by one S-curve — the dryline, where hot dry air meets
 * cool moist air. Teal on one side, amber on the other. It turns with the thermostat:
 * cooling brings the teal half up top, heating rolls the amber half over.
 */
export const MARK_LEFT = "M24 2C10 14 38 34 24 46A22 22 0 0 1 24 2Z";
export const MARK_RIGHT = "M24 2C10 14 38 34 24 46A22 22 0 0 0 24 2Z";
export const MARK_LINE = "M24 1.5C10 14 38 34 24 46.5";

export function LogoMark({ className, spin = true, tone = "light" }: { className?: string; spin?: boolean; tone?: "light" | "dark" }) {
  const cool = tone === "dark" ? "var(--cool)" : "var(--cool-ink)";
  const heat = tone === "dark" ? "var(--heat)" : "var(--heat-ink)";
  const gap = tone === "dark" ? "var(--navy)" : "var(--frost)";
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className={clsx("shrink-0", className)}
      style={
        spin
          ? { transform: "rotate(calc(90deg - var(--mix) * 180deg))", transition: "transform 1.1s var(--ease-out-expo)" }
          : { transform: "rotate(90deg)" }
      }
    >
      <path d={MARK_LEFT} fill={cool} />
      <path d={MARK_RIGHT} fill={heat} />
      <path d={MARK_LINE} fill="none" stroke={gap} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8" tone={tone} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.28rem] font-semibold tracking-[-0.06em]">dryline</span>
        <span className="mt-[3px] font-mono text-[0.52rem] tracking-[0.3em] whitespace-nowrap opacity-70">HEAT &amp; AIR</span>
      </span>
    </span>
  );
}

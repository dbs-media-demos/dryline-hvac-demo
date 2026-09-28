import clsx from "clsx";
import type { ReactNode } from "react";

export function Field({ id, label, error, hint, children, className, optional }: { id: string; label: string; error?: string; hint?: string; children: ReactNode; className?: string; optional?: boolean }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.92rem] font-medium">
        {label}
        {optional && <span className="text-[0.78rem] font-normal text-muted">Optional</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[0.82rem] font-medium text-[#b42318]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.82rem] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const inputCls = (error?: string) =>
  clsx(
    "block w-full min-h-[52px] rounded-2xl bg-white px-4 text-[1rem] ring-1 transition-shadow outline-none placeholder:text-navy/35 focus:ring-2",
    error ? "ring-[#b42318] focus:ring-[#b42318]" : "ring-line focus:ring-[var(--accent-ink)]",
  );

export function OptionCard({
  name,
  value,
  checked,
  onChange,
  title,
  desc,
  icon,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  title: string;
  desc?: string;
  icon?: ReactNode;
}) {
  return (
    <label
      className={clsx(
        "relative flex min-h-[72px] cursor-pointer items-start gap-4 rounded-2xl p-5 ring-1 transition-[background-color,box-shadow,color] duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--accent-ink)]",
        checked ? "bg-navy text-frost ring-navy" : "bg-white ring-line hover:ring-navy/40",
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {icon && <span className={clsx("mt-0.5 shrink-0", checked ? "text-accent" : "text-accent-auto")}>{icon}</span>}
      <span>
        <span className="block font-display text-[1.02rem] tracking-[-0.03em]">{title}</span>
        {desc && <span className={clsx("mt-1 block text-[0.85rem]", checked ? "text-frost/70" : "text-muted")}>{desc}</span>}
      </span>
    </label>
  );
}

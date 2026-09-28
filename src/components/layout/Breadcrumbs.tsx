import Link from "next/link";
import clsx from "clsx";

export function Breadcrumbs({ items, className }: { items: { name: string; path: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={clsx("font-mono text-[0.68rem] tracking-[0.12em] uppercase", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="opacity-50">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="opacity-70">{item.name}</span>
            ) : (
              <Link href={item.path} className="link-underline opacity-90 hover:opacity-100">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

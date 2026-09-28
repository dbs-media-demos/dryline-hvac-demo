import Link from "next/link";
import clsx from "clsx";
import { serviceTowns, cities } from "@/content/cities";
import { ArrowUpRight } from "@/components/ui/Icons";

/*
 * Stylised metro map (not a real-address map): projected town positions, interstates as
 * hairlines, lakes as soft shapes, and response rings pulsing out from Midtown.
 */

const W = 800;
const H = 700;
const B = { n: 35.72, s: 35.15, w: -97.85, e: -97.33 };
const px = (lng: number) => Math.round(((lng - B.w) / (B.e - B.w)) * W);
const py = (lat: number) => Math.round(((B.n - lat) / (B.n - B.s)) * H);

const hq = serviceTowns.find((t) => t.hq)!;
const HX = px(hq.lng);
const HY = py(hq.lat);

export function ServiceMap({ className }: { className?: string }) {
  return (
    <div className={clsx("theme-navy relative overflow-hidden rounded-[28px]", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Dryline service area map</title>
        <desc id="map-desc">Stylised map of the Oklahoma City metro showing Oklahoma City, Edmond, Norman, Moore, Yukon, Mustang and nearby towns.</desc>
        <defs>
          <pattern id="map-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="rgba(245,249,251,0.09)" />
          </pattern>
          <radialGradient id="map-glow">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#map-dots)" />
        <circle cx={HX} cy={HY} r="330" fill="url(#map-glow)" />

        <ellipse cx={px(-97.58)} cy={py(35.565)} rx="34" ry="26" fill="rgba(142,227,239,0.14)" />
        <ellipse cx={px(-97.66)} cy={py(35.49)} rx="20" ry="16" fill="rgba(142,227,239,0.12)" />
        <ellipse cx={px(-97.35)} cy={py(35.35)} rx="22" ry="30" fill="rgba(142,227,239,0.12)" />

        <g fill="none" stroke="rgba(245,249,251,0.22)" strokeWidth="1.5" strokeLinecap="round">
          <path d={`M ${px(-97.47)} 0 C ${px(-97.47)} 180, ${px(-97.5)} 260, ${px(-97.49)} ${py(35.45)} S ${px(-97.47)} ${py(35.3)}, ${px(-97.44)} ${H}`} />
          <path d={`M 0 ${py(35.462)} L ${W} ${py(35.445)}`} />
          <path d={`M ${px(-97.72)} ${H} L ${px(-97.55)} ${py(35.43)} L ${px(-97.5)} ${py(35.53)} L ${W} ${py(35.66)}`} />
          <path
            d={`M ${px(-97.76)} ${py(35.43)} C ${px(-97.76)} ${py(35.6)}, ${px(-97.6)} ${py(35.62)}, ${px(-97.48)} ${py(35.61)} L ${px(-97.4)} ${py(35.62)}`}
            strokeDasharray="5 6"
          />
        </g>
        <text x={px(-97.475) + 8} y="24" fill="rgba(245,249,251,0.4)" fontSize="11" fontFamily="var(--font-mono)">
          I-35
        </text>
        <text x="14" y={py(35.462) - 8} fill="rgba(245,249,251,0.4)" fontSize="11" fontFamily="var(--font-mono)">
          I-40
        </text>

        {[110, 200, 290].map((r, i) => (
          <circle key={r} cx={HX} cy={HY} r={r} fill="none" stroke="var(--accent)" strokeOpacity={0.3 - i * 0.07} strokeDasharray="2 7" />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={HX} cy={HY} r="40" fill="none" stroke="var(--accent)" strokeWidth="1.5" className="map-ping" style={{ animationDelay: `${i * 1.1}s` }} />
        ))}
        <text x={HX + 112} y={HY - 6} fill="var(--accent)" fontSize="10.5" fontFamily="var(--font-mono)" opacity="0.8">
          20 MIN
        </text>
        <text x={HX + 202} y={HY - 6} fill="var(--accent)" fontSize="10.5" fontFamily="var(--font-mono)" opacity="0.65">
          30 MIN
        </text>

        {serviceTowns.map((t) => {
          const x = px(t.lng);
          const y = py(t.lat);
          const big = Boolean(t.hq || t.slug);
          const labelLeft = x > W - 170;
          const inner = (
            <g className="map-town">
              <circle cx={x} cy={y} r={t.hq ? 9 : big ? 6 : 4} fill={t.hq ? "var(--accent)" : "#f5f9fb"} />
              {t.hq && <circle cx={x} cy={y} r="3.5" fill="#0a1726" />}
              <text
                x={labelLeft ? x - 12 : x + 12}
                y={y + 5}
                textAnchor={labelLeft ? "end" : "start"}
                fill={big ? "#f5f9fb" : "rgba(245,249,251,0.6)"}
                fontSize={big ? 18 : 13}
                fontFamily="var(--font-display)"
                letterSpacing="-0.5"
              >
                {t.hq ? "OKC · HQ" : t.name}
              </text>
            </g>
          );
          return t.slug ? (
            <Link key={t.name} href={`/service-areas/${t.slug}`} aria-label={`${t.name} service area`}>
              {inner}
            </Link>
          ) : (
            <g key={t.name}>{inner}</g>
          );
        })}
      </svg>
    </div>
  );
}

export function ServiceAreaList() {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {cities.map((c) => (
        <li key={c.slug}>
          <Link href={`/service-areas/${c.slug}`} className="group flex items-center justify-between gap-4 py-5">
            <span>
              <span className="block font-display text-[1.6rem] tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                {c.name}
              </span>
              <span className="mt-1 block text-[0.9rem] text-muted">
                {c.drive} · ZIP {c.zips.slice(0, 3).join(", ")}…
              </span>
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors group-hover:border-transparent group-hover:bg-accent">
              <ArrowUpRight width={18} height={18} />
            </span>
          </Link>
        </li>
      ))}
      <li className="py-5 text-muted">Also serving Oklahoma City, Mustang, Nichols Hills, The Village, Bethany, Warr Acres, Midwest City and Del City.</li>
    </ul>
  );
}

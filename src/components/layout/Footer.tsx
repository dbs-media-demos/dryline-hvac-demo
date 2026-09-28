import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { PhoneIcon, MailIcon, PinIcon } from "@/components/ui/Icons";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { hoursTable } from "@/lib/hours";
import { site, telHref, mailHref } from "@/lib/site";

const company = [
  { href: "/about", label: "About Dryline" },
  { href: "/comfort-club", label: "Comfort Club" },
  { href: "/repair-or-replace", label: "Repair or replace?" },
  { href: "/financing", label: "Financing" },
  { href: "/specials", label: "Specials" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Comfort notes (blog)" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="theme-navy relative overflow-hidden pb-40 lg:pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[420px] left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: "var(--accent)" }}
      />
      <div className="relative mx-auto max-w-[1480px] px-5 md:px-8">
        <div className="grid gap-12 pt-20 pb-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <div>
            <p className="eyebrow text-muted">Services</p>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="link-underline text-frost/85 hover:text-frost">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-muted">Company</p>
            <ul className="mt-5 space-y-2.5">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline text-frost/85 hover:text-frost">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-muted">Service areas</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link href="/service-areas" className="link-underline text-frost/85 hover:text-frost">
                  Oklahoma City metro
                </Link>
              </li>
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/service-areas/${c.slug}`} className="link-underline text-frost/85 hover:text-frost">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li className="text-frost/60">Mustang · Nichols Hills · Bethany · Midwest City</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-muted">Visit &amp; call</p>
            <ul className="mt-5 space-y-3 text-frost/85">
              <li>
                <a href={telHref} className="flex items-center gap-3 hover:text-frost">
                  <PhoneIcon width={18} height={18} className="text-accent" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={mailHref} className="flex items-center gap-3 hover:text-frost">
                  <MailIcon width={18} height={18} className="text-accent" /> {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <PinIcon width={18} height={18} className="mt-1 text-accent" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.region} {site.address.postal}
                </span>
              </li>
            </ul>
            <OpenBadge className="mt-6 text-frost/85" />
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[0.9rem]">
              {hoursTable.map((h) => (
                <div key={h.day} className="contents">
                  <dt className="text-frost/60">{h.day}</dt>
                  <dd className="tabular text-frost/85">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex items-end gap-4 border-t border-line pt-10 md:gap-8" aria-hidden>
          <LogoMark tone="dark" className="h-[15vw] w-[15vw] max-h-[190px] max-w-[190px]" />
          <span className="font-display text-[19vw] leading-[0.72] font-semibold tracking-[-0.08em] lg:text-[16.5rem]">dryline</span>
        </div>

        <div className="mt-10 flex flex-col gap-4 text-[0.8rem] text-frost/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName} · {site.license} · <Link href="/privacy" className="link-underline">Privacy</Link>
          </p>
          <p>
            A concept site — Dryline is a fictional company.{" "}
            <a href="https://dbs-media.com" target="_blank" rel="noopener" className="link-underline text-frost/85">
              Design &amp; development: DBS Media
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { getImageProps } from "next/image";
import { Photo } from "@/components/ui/Photo";
import { Dial } from "@/components/mode/Dial";
import { LiveWeather } from "@/components/mode/LiveWeather";
import { Airflow } from "@/components/fx/Airflow";
import { PhoneIcon, ShieldIcon, StarIcon } from "@/components/ui/Icons";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { defaultBiz } from "@/lib/biz";
import { L, num, telOf, type Biz } from "@/lib/biz-core";
import { NOT_PHONE_QUERY, PHONE_QUERY } from "@/lib/phone";
import { sr as srDict } from "@/i18n/sr";
import { enPreview } from "@/i18n/en-preview";

function Letters({ text, accentFrom }: { text: string; accentFrom: number }) {
  const words = text.split(" ");
  let i = 0;
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className={`inline-block whitespace-nowrap ${wi >= accentFrom ? "text-accent" : ""}`}>
          {w.split("").map((ch) => (
            <span key={i} className="mode-word" style={{ "--i": i++ } as React.CSSProperties}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block w-[0.28em]" />}
        </span>
      ))}
    </>
  );
}

const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/** The desktop hero's frost layer, preloaded on desktop only: phones get a blank here and never fetch it. */
function DesktopFrost() {
  const { props } = getImageProps({ src: img.heroFrost.src, alt: img.heroFrost.alt, fill: true, sizes: "100vw", quality: 60, loading: "eager", fetchPriority: "high" });
  return (
    <>
      <link rel="preload" as="image" imageSrcSet={props.srcSet} imageSizes={props.sizes} fetchPriority="high" media={NOT_PHONE_QUERY} />
      <picture>
        <source media={PHONE_QUERY} srcSet={BLANK} />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img {...props} className="object-cover" style={{ ...props.style, backgroundColor: img.heroFrost.color }} />
      </picture>
    </>
  );
}

/**
 * Phones: one sharp still of real work for the current mode. A CSS background (globals.css), so only
 * that mode's file is fetched and it paints with the first frame; the head script preloads it.
 */
function PhoneStill({ biz }: { biz: Biz }) {
  const stills = [
    { cls: "show-cool hero-still-cool", photo: img.techCondenserSiding },
    { cls: "show-heat hero-still-heat", photo: img.techHeatingSystem },
  ];
  return (
    <div className="absolute inset-x-0 top-0 -z-10 hidden h-[calc(var(--header-h)+clamp(140px,27svh,226px))] overflow-hidden phone:block">
      {stills.map((s) => (
        <span key={s.cls} role="img" aria-label={L(biz, s.photo.alt, srDict[s.photo.alt] ?? s.photo.alt)} className={`${s.cls} absolute inset-0`} style={{ backgroundColor: s.photo.color }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-navy from-5% via-navy/65 to-navy/30" />
    </div>
  );
}

export function Hero({ biz = defaultBiz }: { biz?: Biz }) {
  const sr = biz.lang === "sr";
  // Translated here, not after hydration: on phones this text is on screen from the first paint
  const t = (s: string) => (sr ? (srDict[s] ?? s) : biz.preview ? (enPreview[s] ?? s) : s);
  const statRow = "phone:flex phone:items-baseline phone:justify-between phone:gap-3";
  const statValue = "mt-1 block font-display text-[1.05rem] tracking-[-0.03em] phone:mt-0 phone:font-sans phone:text-[0.86rem] phone:font-semibold phone:tracking-normal phone:whitespace-nowrap";
  return (
    <section data-hero className="theme-navy relative isolate flex min-h-[100svh] flex-col overflow-hidden phone:min-h-0" aria-labelledby="hero-title">
      {/* Photo layers: frost for cooling, flame for heating — crossfaded by --mix. */}
      <div className="absolute inset-0 -z-10 phone:hidden">
        <div className="anim-zoom absolute inset-0">
          <DesktopFrost />
        </div>
        <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: "var(--mix)" }}>
          <Photo photo={img.heroFlame} sizes="100vw" quality={60} />
        </div>
        <div className="absolute inset-0 mix-blend-color opacity-40" style={{ background: "var(--accent)" }} />
        <div className="absolute inset-0 bg-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/20 to-transparent" />
        <div className="grain absolute inset-0 overflow-hidden" />
      </div>
      <PhoneStill biz={biz} />
      <Airflow className="absolute inset-0 -z-10 h-full w-full phone:hidden" />

      <div className="hero-grid mx-auto grid w-full max-w-[1480px] flex-1 content-center items-center gap-x-10 gap-y-7 px-5 pt-[calc(var(--bar-h)+var(--header-h)+28px)] pb-10 md:px-8 lg:grid-cols-12 lg:gap-6 lg:pb-6 phone:content-start phone:gap-y-2 phone:pt-[calc(var(--header-h)+clamp(72px,14svh,114px))] phone:pb-3">
        {/* On phones the column dissolves (display: contents) so the first screen can stack: licence, service + town, rating, call. */}
        <div className="contents lg:col-span-7 lg:block">
          <p className="eyebrow hero-left order-0 hidden items-center gap-1.5 text-frost/90 phone:flex phone:text-[0.64rem] phone:tracking-[0.06em]">
            <ShieldIcon width={14} height={14} className="shrink-0 text-accent" />
            {biz.preview ? L(biz, "Licensed & insured · 24/7 emergency line", "Licencirani i osigurani · hitne intervencije 24/7") : `Licensed · ${site.license}`}
          </p>

          <h1
            id="hero-title"
            className="anim-fade eyebrow hero-left order-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-frost/85 phone:block phone:font-display phone:text-[clamp(1.6rem,8.1vw,2.6rem)] phone:leading-[1.06] phone:font-medium phone:tracking-[-0.045em] phone:text-frost phone:normal-case"
            style={{ "--d": "0.05s" } as React.CSSProperties}
          >
            <span className="h-px w-8 bg-accent phone:hidden" aria-hidden />
            <span>
              {biz.preview ? (sr ? "Klima i grejanje" : "Heating & air conditioning") : "Heating & air conditioning"}
              <span className="phone:hidden"> · </span>
              <span className="phone:block phone:text-accent">{biz.preview ? biz.area : "Oklahoma City"}</span>
            </span>
          </h1>

          {biz.rating && (
            <p className="hero-left order-1 hidden items-center gap-2 text-[0.88rem] font-medium phone:flex">
              <span className="flex items-center gap-0.5 text-accent" role="img" aria-label={`${num(biz, biz.rating.value)} / 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} width={14} height={14} />
                ))}
              </span>
              {num(biz, biz.rating.value)} · {biz.rating.count.toLocaleString(sr ? "sr-RS" : "en-US")} Google {sr ? "recenzija" : "reviews"}
            </p>
          )}

          <div className="anim-heading hero-left relative order-2 lg:mt-6 phone:mt-1" aria-hidden style={{ "--d": "0.1s" } as React.CSSProperties}>
            <p className="mode-cool display-xl phone:text-[1.25rem] phone:leading-[1.2] phone:tracking-[-0.04em]">
              {/* Letters splits the text as it renders, so the Serbian is chosen here */}
              <Letters text={sr ? "Hladno. Odmah." : "Cool it down."} accentFrom={sr ? 1 : 2} />
            </p>
            <p className="mode-heat display-xl phone:text-[1.25rem] phone:leading-[1.2] phone:tracking-[-0.04em]">
              <Letters text={sr ? "Toplo. Odmah." : "Warm it up."} accentFrom={sr ? 1 : 2} />
            </p>
          </div>

          <p className="lede hero-right order-4 max-w-[34rem] text-frost/80 lg:mt-7 phone:text-[0.95rem] phone:leading-[1.42]">
            {t("Oklahoma weather doesn’t do mild. We do. Same-day AC and furnace repair, honest replacements, and a real person on the phone at 3 a.m. —")}{" "}
            <span className="text-frost">{t("at the same flat rate as noon.")}</span>
          </p>

          <div className="anim-fade hero-right order-5 flex flex-col gap-3 sm:flex-row lg:mt-9 phone:mt-1.5 phone:gap-2" style={{ "--d": "0.35s" } as React.CSSProperties}>
            <a href={telOf(biz)} data-hero-call className="btn btn-accent on-dark min-h-[56px] px-7 text-[1.02rem]">
              <PhoneIcon /> {L(biz, "Call", "Pozovite")} {biz.phoneDisplay}
            </a>
            <Link href="/schedule" className="btn btn-ghost min-h-[56px] px-7 text-[1.02rem] phone:min-h-[46px]">
              {t("Schedule service")}
            </Link>
          </div>
        </div>

        <div className="anim-fade order-3 mx-auto w-full max-w-[290px] sm:max-w-[380px] lg:order-none lg:col-span-5 lg:max-w-[480px] phone:hidden" style={{ "--d": "0.3s" } as React.CSSProperties}>
          <Dial />
        </div>
      </div>

      <div className="anim-fade relative mx-auto w-full max-w-[1480px] px-5 pb-8 md:px-8 phone:pb-3" style={{ "--d": "0.5s" } as React.CSSProperties}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-6 md:grid-cols-4 phone:grid-cols-1 phone:gap-y-1 phone:pt-3">
          {biz.rating && (
            <p className="phone:hidden">
              <span className="flex items-center gap-1 text-accent" role="img" aria-label={`${num(biz, biz.rating.value)} / 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} width={14} height={14} />
                ))}
              </span>
              <span className="mt-1 block font-display text-[1.05rem] tracking-[-0.03em]">
                {num(biz, biz.rating.value)}{" "}
                <span className="text-frost/60">· {biz.rating.count.toLocaleString(sr ? "sr-RS" : "en-US")} Google {sr ? "recenzija" : "reviews"}</span>
              </span>
            </p>
          )}
          {biz.preview ? (
            <p className={statRow}>
              <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase">{sr ? "Radno vreme" : "Hours"}</span>
              <span className={statValue}>{biz.hoursSummary || (sr ? "Pozovite nas" : "Call us")}</span>
            </p>
          ) : (
            <p className={statRow}>
              <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase">Emergency arrival</span>
              <span className={statValue}>{site.stats.arrival} min average</span>
            </p>
          )}
          <p className={statRow}>
            <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase">{t("Pricing")}</span>
            <span className={statValue}>{t("Flat-rate · no overtime")}</span>
          </p>
          <LiveWeather className={statRow} />
        </div>
      </div>
    </section>
  );
}

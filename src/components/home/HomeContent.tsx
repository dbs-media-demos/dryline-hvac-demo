import type { ReactNode } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Statement } from "@/components/home/Statement";
import { Promises } from "@/components/home/Promises";
import { DrylineSplit } from "@/components/home/DrylineSplit";
import { ServicesList } from "@/components/home/ServicesList";
import { DayOnCall } from "@/components/home/DayOnCall";
import { ModeToggle } from "@/components/mode/ModeToggle";
import { QuickRequest } from "@/components/forms/QuickRequest";
import { RepairReplace } from "@/components/sections/RepairReplace";
import { ComfortClub } from "@/components/sections/ComfortClub";
import { ReviewsSection } from "@/components/sections/Reviews";
import { ServiceMap, ServiceAreaList } from "@/components/sections/ServiceMap";
import { FaqList } from "@/components/sections/FaqList";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Icons";
import { defaultBiz } from "@/lib/biz";
import { L, type Biz } from "@/lib/biz-core";
import { scrub } from "@/lib/scrub";
import { PreviewMap } from "@/components/preview/PreviewMap";
import { SettleDial, Vent } from "@/components/fx/HvacTouches";
import { faqs } from "@/content/faqs";

export const homeFaqs = faqs.filter((_, i) => [0, 2, 3, 5, 6, 9].includes(i));

/**
 * The homepage sections. The concept site renders them as they are; a personalised preview
 * (/for/<token>) passes a real business: its name, phone, hours, rating and a map of its address
 * replace Dryline's, and the Oklahoma-specific lines step aside.
 *
 * Phones read them in a half-emergency trade's order (CSS order, phones only): first screen with
 * the licence line, then proof, project photos, reviews, how the estimate works, the form and the
 * FAQ, with everything else after. Two blocks exist for phones alone (the Cool/Heat control, the
 * estimate intro and the form).
 *
 * Phones lay out only what is near the screen (phone-cv in globals.css): --cv-h is each block's
 * height at 375 px, so the page keeps its length until a block is really measured.
 */
export function HomeContent({ biz = defaultBiz, children }: { biz?: Biz; children?: ReactNode }) {
  return (
    <PageShell>
      {children}
      <div className="phone:flex phone:flex-col">
      <div className="phone:order-1">
        <Hero biz={biz} />
      </div>
      <div className="hidden phone:order-3 phone:block phone-cv [--cv-h:77px]">
        <ModeToggle />
      </div>
      <div className="phone:order-2 phone-cv [--cv-h:318px]">
        <Stats biz={biz} />
      </div>
      <div className="phone:order-10 phone-cv [--cv-h:728px]">
        <Statement biz={biz} />
      </div>
      <div className="phone:order-11 phone-cv [--cv-h:500px]">
        <DrylineSplit />
      </div>

      <div className="phone:order-9 phone-cv [--cv-h:512px]">
      <section className="py-24 md:py-36 phone:bg-mist/60 phone:py-8" aria-labelledby="services-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between phone:gap-3">
            <SectionHead eyebrow="Services" title={<span id="services-title">Everything between the thermostat and the sky.</span>}>
              Repairs, replacements and the upgrades that make a house feel different — all at flat prices you see before we start.
            </SectionHead>
            <Reveal className="flex flex-col items-start gap-8 lg:items-end">
              <Vent className="w-[136px] md:w-[160px] phone:hidden" />
              <Link href="/services" className="btn btn-navy phone:min-h-[44px]">
                All services <ArrowIcon width={18} height={18} />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 phone:mt-3">
            <ServicesList />
          </div>
        </div>
      </section>
      </div>

      <div className="phone:order-4 phone-cv [--cv-h:530px]">
        <DayOnCall />
      </div>

      {/* The estimate on phones: the two promises (which sit under "Why" on desktop), then the calculator */}
      <div className="phone:order-6 phone-cv [--cv-h:1390px]">
        <section className="hidden pt-8 pb-4 phone:block" aria-labelledby="estimate-title">
          <div className="px-5">
            <p className="eyebrow text-accent-auto flex items-center gap-3">
              <span className="h-px w-8 bg-current" aria-hidden /> {L(biz, "The estimate", "Procena")}
            </p>
            <h2 id="estimate-title" className="display-lg mt-3">
              {L(biz, "How the estimate works.", "Kako ide procena.")}
            </h2>
            <Promises className="mt-3 phone-cv [--cv-h:200px]" />
          </div>
        </section>

      {/* The calculator and the club are priced in dollars (SEER, US bills): not on Serbian previews */}
      {biz.lang !== "sr" && (
      <section className="py-24 md:py-36 phone:pt-3 phone:pb-8" aria-labelledby="calc-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead eyebrow="Repair or replace?" title={<span id="calc-title">Should you fix it, or let it go?</span>}>
            Four numbers, one honest answer. The same math our comfort advisors use — no salesperson required.
          </SectionHead>
          <Reveal className="mt-14 phone:mt-3">
            <RepairReplace />
          </Reveal>
        </div>
      </section>
      )}
      </div>

      {biz.lang !== "sr" && (
      <div className="phone:order-12 phone-cv [--cv-h:767px]">
      <section className="bg-mist/60 py-24 md:py-36 phone:py-8" aria-labelledby="club-title">
        <div className="mx-auto max-w-[1480px] px-5 md:px-8">
          <SectionHead align="center" eyebrow="The Comfort Club" title={<span id="club-title">Skip the line when the heat wave hits.</span>}>
            Tune-ups on a schedule, priority dispatch, real discounts on repairs — and never an overtime fee. From $14.95 a month.
          </SectionHead>
          <div className="mt-14 phone:mt-4">
            <ComfortClub />
          </div>
        </div>
      </section>
      </div>
      )}

      <div className="phone:order-5 phone-cv [--cv-h:1211px]">
        <ReviewsSection biz={biz} />
      </div>

      <div className="phone:order-13 phone-cv [--cv-h:698px]">
      {biz.preview ? (
        <PreviewMap biz={biz} />
      ) : (
      <section className="py-24 md:py-36 phone:py-8" aria-labelledby="area-title">
        <div className="mx-auto grid max-w-[1480px] gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:items-center phone:gap-3">
          <div>
            <SectionHead eyebrow="Service area" title={<span id="area-title">Six cities. One flat rate.</span>}>
              Trucks stationed north, south and west of Midtown so no one in the metro waits on I-35 traffic.
            </SectionHead>
            <Reveal className="mt-10 phone:mt-3">
              <ServiceAreaList />
            </Reveal>
          </div>
          <Reveal className="relative phone:mx-auto phone:w-full phone:max-w-[270px]">
            <ServiceMap />
            <SettleDial className="absolute bottom-3 left-3 origin-bottom-left max-sm:scale-[0.85] sm:bottom-6 sm:left-6" />
          </Reveal>
        </div>
      </section>
      )}
      </div>

      <div className="hidden phone:order-7 phone:block phone-cv [--cv-h:423px]">
        <section className="bg-mist/60 px-5 py-8" aria-labelledby="request-title">
          <p className="eyebrow text-accent-auto flex items-center gap-3">
            <span className="h-px w-8 bg-current" aria-hidden /> {L(biz, "Request a visit", "Zahtev za servis")}
          </p>
          <h2 id="request-title" className="display-lg mt-3">
            {L(biz, "Tell us what’s going on.", "Recite nam šta se dešava.")}
          </h2>
          <div className="mt-3">
            <QuickRequest />
          </div>
        </section>
      </div>

      <div className="phone:order-8 phone-cv [--cv-h:577px]">
      <section className="pb-24 md:pb-36 phone:py-8" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] phone:gap-3">
          <div>
            <SectionHead eyebrow="FAQ" title={<span id="faq-title">Straight answers.</span>}>
              {L(biz, `Still wondering? Call ${biz.phoneDisplay} — a real person picks up, day or night.`, `Imate još pitanja? Pozovite ${biz.phoneDisplay} — javlja se pravi čovek, danju i noću.`)}
            </SectionHead>
            <Reveal className="mt-8 phone:mt-3">
              <Link href="/faq" className="btn btn-navy phone:min-h-[44px]">
                More questions <ArrowIcon width={18} height={18} />
              </Link>
            </Reveal>
          </div>
          <Reveal>
            <FaqList items={homeFaqs.map((f) => ({ ...f, a: scrub(f.a, biz) }))} />
          </Reveal>
        </div>
      </section>
      </div>

      <div className="phone:order-14 phone-cv [--cv-h:390px]">
        <CtaBand biz={biz} />
      </div>
      </div>

    </PageShell>
  );
}

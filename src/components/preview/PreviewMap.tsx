import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { ArrowIcon } from "@/components/ui/Icons";
import { DAY_NAMES, L, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";

/** A preview's service-area block: the business's real address on a Google map, hours and directions. */
export function PreviewMap({ biz }: { biz: Biz }) {
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section className="py-24 md:py-36" aria-labelledby="area-title">
      <div className="mx-auto grid max-w-[1480px] gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <SectionHead
            eyebrow={L(biz, "Service area", "Gde radimo")}
            title={<span id="area-title">{L(biz, `${biz.area} and around.`, "Vaš grad i okolina.")}</span>}
          >
            {biz.address.full}
          </SectionHead>
          <Reveal className="mt-10 space-y-6">
            <OpenBadge />
            {biz.hours && (
              <dl className="grid max-w-sm grid-cols-[auto_1fr] gap-x-8 gap-y-1.5 text-[0.95rem]">
                {weekFromMonday(biz.hours).map((h) => (
                  <div key={h.day} className="contents">
                    <dt className="text-muted">{DAY_NAMES[biz.lang][h.day]}</dt>
                    <dd className="tabular text-right">{dayRange(h, biz.lang)}</dd>
                  </div>
                ))}
              </dl>
            )}
            <a href={directions} target="_blank" rel="noopener" className="btn btn-navy">
              {L(biz, "Get directions", "Kako do nas")} <ArrowIcon width={18} height={18} />
            </a>
          </Reveal>
        </div>
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] ring-1 ring-line">
            <iframe src={embed} title={L(biz, `Map: ${query}`, `Mapa: ${query}`)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

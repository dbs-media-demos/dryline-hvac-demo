import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Parallax, SplitReveal, Reveal } from "@/components/ui/Reveal";
import { PhoneIcon } from "@/components/ui/Icons";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { img, type Photo as PhotoT } from "@/lib/images";
import { site, telHref } from "@/lib/site";

export function CtaBand({
  title = "When the weather turns, we’re already on the way.",
  photo = img.stormSupercell,
  body = "A real dispatcher answers 24/7. Tell us what’s going on and you’ll have an arrival window before you hang up.",
}: {
  title?: string;
  photo?: PhotoT;
  body?: string;
}) {
  return (
    <section className="theme-navy relative isolate overflow-hidden" aria-labelledby="cta-title">
      <Parallax className="absolute inset-0 -z-10" amount={16} reveal={false}>
        <div className="absolute inset-0">
          <Photo photo={photo} sizes="100vw" quality={60} />
        </div>
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
      <div className="mx-auto flex min-h-[80svh] max-w-[1480px] flex-col justify-end px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <OpenBadge className="text-frost/85" />
        </Reveal>
        <SplitReveal id="cta-title" className="display-lg mt-6 max-w-[17ch]">
          {title}
        </SplitReveal>
        <Reveal className="lede mt-6 max-w-[34rem] text-frost/75">{body}</Reveal>
        <Reveal className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href={telHref} className="btn btn-accent on-dark min-h-[56px] px-7">
            <PhoneIcon /> Call {site.phoneDisplay}
          </a>
          <Link href="/schedule" className="btn btn-ghost min-h-[56px] px-7">
            Schedule online in 2 minutes
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

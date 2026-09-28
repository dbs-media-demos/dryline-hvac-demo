import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Dryline Heat & Air collects, uses and protects your information.",
  path: "/privacy",
  eyebrow: "Privacy",
});

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Privacy"
        title="Privacy policy"
        lede="Short version: we use your details to show up and fix things, and for nothing else."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
      />
      <section className="py-20 md:py-28">
        <div className="prose-dry mx-auto max-w-[46rem] px-5 md:px-8">
          <p>
            <strong>This is a concept website created by DBS Media.</strong> Dryline Heat &amp; Air is a fictional company, and the forms on this site do not transmit or store any
            information. The policy below shows how a real HVAC company might describe its practices.
          </p>
          <p>Last updated: September 28, 2026.</p>
          <h2>What we collect</h2>
          <ul>
            <li>Contact details you give us: name, phone, email and service address.</li>
            <li>Details about your equipment and the problem, so we can bring the right parts.</li>
            <li>Basic, anonymous site analytics (pages visited, device type).</li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To schedule, confirm and complete service visits.</li>
            <li>To send arrival texts, invoices, warranty registrations and tune-up reminders.</li>
            <li>To improve our website and service.</li>
          </ul>
          <p>We never sell your information. We share it only with service providers who help us operate (for example, scheduling software, payment processing or financing partners you choose to apply with), and only as needed.</p>
          <h2>Your choices</h2>
          <p>
            You can opt out of text reminders by replying STOP, and ask us to update or delete your information at any time by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <h2>Storage on your device</h2>
          <p>This site remembers your thermostat setting and whether you dismissed the concept-site notice in your browser&rsquo;s local storage. Nothing is sent to a server.</p>
          <h2>Contact</h2>
          <p>
            {site.legalName}, {site.address.street}, {site.address.city}, {site.address.region} {site.address.postal} · {site.phoneDisplay}
          </p>
        </div>
      </section>
    </PageShell>
  );
}

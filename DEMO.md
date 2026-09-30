# Dryline Heat & Air (Scale by Noon demo)

- Niche: HVAC / heating & air         (matches scale-by-noon.vercel.app industry id: hvac)
- Market / city: US – Oklahoma City, OK (service area: OKC, Edmond, Norman, Moore, Yukon, Mustang)
- Languages: en
- Live URL: https://dryline-hvac-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/dryline-hvac-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/hvac
- Vercel project: dryline-hvac-demo (team "Dimitrije's projects"), no custom domain
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText), Lenis
- Palette: frost #F5F9FB · navy #0A1726 · slate #566677 · glacier #8EE3EF / deep teal #0A7485 (cool) · amber #FFB547 / kiln #C2410C (heat). The accent blends between cool and heat along a "thermal camera" hue sweep, driven by the thermostat.
- Fonts: Unbounded (display), Figtree (body), Martian Mono (readouts)
- Pages: 31 routes, all static: home; services index + 9 service pages; Comfort Club; repair-or-replace; financing; specials; about; reviews; FAQ; blog + 3 articles; schedule (multi-step); contact; service areas + Edmond, Norman, Moore, Yukon; privacy; 404. Also sitemap.xml, robots.txt, manifest, dynamic OG images (/api/og).
- Signature features:
  - **The thermostat dial hero**: drag, scroll or arrow-key a 60–85°F dial. It re-themes the whole site (accent colours, the airflow particle field that sinks for cooling and rises for heating, frost ↔ flame hero photo, "Cool it down." ↔ "Warm it up." headline, the rotating logo) and remembers the setting.
  - **"The dryline is moving"**: a pinned scroll scene where a weather front sweeps across the screen, turning a July storm sky into a January night and shifting the section from cooling to heating.
  - **Repair-or-replace calculator**: system age, quote, SEER and bill feed an elastic gauge needle and a rolling estimated-savings readout (labelled as estimates).
  - **Comfort Club tiers**: monthly/yearly toggle with odometer-rolling prices, cursor-tilt cards.
  - **24/7 emergency mode**: a sticky "No cool? No heat?" bar with a live "technicians available now" count and one-tap call; on phones it becomes a thumb-reach Call + Schedule bar.
  - Also: a sideways-scrolling "A day on call" photo story, a services list with a cursor-following photo preview, sticky stacking process cards, a live OKC temperature (Open-Meteo), a stylised metro map with response rings, a custom cursor, image morphs between pages, a validated multi-step booking form, a payment estimator and click-to-copy coupons.
- Lighthouse (local production build, simulated mobile):
  - Home: P 86 / A 100 / BP 100 / SEO 69*
  - Inner pages: P 84–93 / A 100 / BP 100
  - Desktop home and inner pages: P 99–100 / A 100 / BP 100
  - CLS 0 everywhere.
  - *SEO is 69 only because the demo is intentionally `noindex` (`is-crawlable` is the single failing audit). Set `NEXT_PUBLIC_NOINDEX=false` to lift it.

## Portfolio copy
EN title: Dryline Heat & Air
EN one-liner (≤ 120 chars): An HVAC site with a working thermostat: turn the dial and the whole site switches between cooling and heating.
EN summary (2–3 sentences): A concept site for an Oklahoma City heating & air company, built to win emergency calls and sell maintenance plans. Visitors turn a real thermostat dial to re-theme the entire site, watch a weather front sweep through the seasons, and get an honest repair-or-replace answer from an animated calculator. 31 pages, full local SEO, and a one-tap call button on every screen.
SR title: Dryline Heat & Air
SR one-liner: Sajt za grejanje i klimu sa pravim termostatom: okrenete točkić i ceo sajt prelazi iz hlađenja u grejanje.
SR summary: Koncept sajt za servis grejanja i klimatizacije iz Oklahoma Sitija, napravljen da donosi hitne pozive i prodaje planove održavanja. Posetilac okreće pravi termostat koji menja boje celog sajta, gleda kako vremenski front prelazi preko ekrana iz leta u zimu, i dobija iskren odgovor „popraviti ili zameniti“ iz animiranog kalkulatora. 31 stranica, kompletan lokalni SEO i dugme za poziv na svakom ekranu.

## Screenshots
handoff/desktop-home.png (1440×900; @2x also included), handoff/desktop-feature.png (the dial in heat mode; the whole site re-themed), handoff/mobile-home.png (390×844; @3x also included), handoff/scroll.mp4 (8 s home scroll, 1440×900)

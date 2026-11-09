# Dryline Heat & Air (Scale by Noon demo)

- Niche: HVAC / heating & air         (matches www.scalebynoon.com industry id: hvac)
- Market / city: US – Oklahoma City, OK (service area: OKC, Edmond, Norman, Moore, Yukon, Mustang)
- Languages: en
- Live URL: https://dryline-hvac-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/dryline-hvac-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/hvac
- Vercel project: dryline-hvac-demo (team "Dimitrije's projects"), no custom domain
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText), Lenis, three.js 0.187 (desktop hero only: its own 137 KB gz chunk, imported inside an effect after the media check)
- Palette: frost #F5F9FB · navy #0A1726 · slate #566677 · glacier #8EE3EF / deep teal #0A7485 (cool) · amber #FFB547 / kiln #C2410C (heat). The accent blends between cool and heat along a "thermal camera" hue sweep, driven by the thermostat.
- Fonts: Unbounded (display), Figtree (body), Martian Mono (readouts, desktop only). Unbounded and Figtree are self-hosted subsets in src/app/fonts (Latin + Latin Ext-A, the weights in use), made with fontTools from the Google Fonts variable TTFs.
- Phones (under 768 px, or touch under 1024 px; lib/phone.ts): no GSAP, Lenis, Martian Mono or three.js are downloaded. The Cool/Heat control shows the 3D thermostat as a still (public/images/dial, made by scripts/render-3d-stills.mjs) with the setting on its display. Home order: first screen with licence line, proof, project photos, reviews, how the estimate works, form, FAQ, then the rest. Hero stills: public/images/phone (crops of tech-condenser-siding and tech-heating-system).
- Pages: 31 routes, all static: home; services index + 9 service pages; Comfort Club; repair-or-replace; financing; specials; about; reviews; FAQ; blog + 3 articles; schedule (multi-step); contact; service areas + Edmond, Norman, Moore, Yukon; privacy; 404. Also sitemap.xml, robots.txt, manifest, dynamic OG images (/api/og).
- Signature features:
  - **The 3D thermostat hero** (desktop with a mouse): a real-time three.js wall thermostat built from primitives (src/components/mode/thermostatScene.ts): a turned-aluminium ring brushed in circles with a knurled grip, a domed black-glass display whose scale lights up in the accent colour and glows on the bevel, a soft spotlight shadow and pool of light on the hero behind it. It powers on by itself, tilts toward the cursor, presses in and turns as you drag it, and tips back as the hero scrolls away; it renders only while something moves. Drag or arrow-key it from 60 to 85 °F (Celsius on Serbian previews): it re-themes the whole site (accent colours, the airflow particle field that sinks for cooling and rises for heating, frost ↔ flame hero photo, "Cool it down." ↔ "Warm it up." headline, the rotating logo) and remembers the setting. Tablets, reduced motion, Save-Data and no-WebGL get a still rendered from the same scene with the readout drawn on it, and the dial works the same. Start-up never stutters: the still stays until the scene is built in short idle steps, its shaders compiled (compileAsync) and a frame drawn off screen with the display lit once; no real graphics chip (software rendering) keeps the still without fetching three.js. Its first 2 s are timed (under 45 fps, a frame over 100 ms, or over 1.5 ms of main thread per frame, about 4x a desktop's 0.4 ms): too slow fades it back to the still and sessionStorage keeps the visit on the still. Pixel ratio capped at 1.5; stops off screen and in a hidden tab.
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
  - 3D pass (9 Nov 2026), phone home and a /for/ preview, production build, 375 px, 4x CPU, 1.6 Mbps / 150 ms: JS 193–195 KB gz by load (201–203 KB counting a chunk fetched after load), three.js 0 bytes, LCP 1.5 s, CLS 0, blocking time 90–190 ms (trace) / 125–220 ms (long-task observer, unchanged by the pass), about 540 KB in all.
  - Smooth 3D pass (9 Nov 2026), desktop 1440×900, production build, headed Chrome on an RTX 5070: the scene appears 0.4–0.7 s after load (1.1–1.4 s on a first visit, cold shader cache), no fallback in 12 runs. 4x CPU: it appears around 5–8 s, falls back 2.5 s later and later loads stay on the still (no three.js fetched).
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

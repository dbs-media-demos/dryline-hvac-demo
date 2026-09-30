# Dryline Heat & Air — Scale by Noon concept site

A fictional heating & air company in Oklahoma City, built by [Scale by Noon](https://www.scalebynoon.com) as a demo for HVAC businesses.

- Next.js 16 (App Router, Turbopack), React 19.2, Tailwind CSS v4, GSAP + Lenis
- Signature features: the thermostat dial that re-themes the whole site, the "dryline" seasons scroll scene, the repair-or-replace calculator, Comfort Club plans, 24/7 emergency bar
- 31 statically generated pages, full local-business SEO (HVACBusiness JSON-LD, OG images, sitemap)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

The site is `noindex` by default. Set `NEXT_PUBLIC_NOINDEX=false` to allow indexing, and `NEXT_PUBLIC_SITE_URL` for canonical URLs.

Photo and video credits: `public/images/SOURCES.md`. See `DEMO.md` for the portfolio handoff.

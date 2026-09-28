import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { MARK_LEFT, MARK_RIGHT, MARK_LINE } from "@/components/brand/Logo";

// Brand fonts, read once. URLs relative to this file get traced into the deployment.
const [display, sans, mono] = await Promise.all([
  readFile(new URL("../../../../assets/fonts/Unbounded-500.ttf", import.meta.url)),
  readFile(new URL("../../../../assets/fonts/Figtree-500.ttf", import.meta.url)),
  readFile(new URL("../../../../assets/fonts/MartianMono-400.ttf", import.meta.url)),
]);

/** Branded 1200×630 share image: /api/og?title=…&eyebrow=… */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Dryline Heat & Air").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Heating & air · Oklahoma City").slice(0, 60);
  const size = title.length > 70 ? 52 : title.length > 40 ? 62 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a1726",
          backgroundImage:
            "radial-gradient(circle at 12% 110%, rgba(142,227,239,0.42) 0%, rgba(11,127,145,0.12) 30%, rgba(10,23,38,0) 55%), radial-gradient(circle at 96% -10%, rgba(255,181,71,0.45) 0%, rgba(194,65,12,0.14) 30%, rgba(10,23,38,0) 55%)",
          padding: 72,
          fontFamily: "Figtree",
          color: "#f5f9fb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="60" height="60" viewBox="0 0 48 48" style={{ transform: "rotate(90deg)" }}>
            <path d={MARK_LEFT} fill="#8ee3ef" />
            <path d={MARK_RIGHT} fill="#ffb547" />
            <path d={MARK_LINE} fill="none" stroke="#0a1726" strokeWidth="3" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Unbounded", fontSize: 38, letterSpacing: -2.4, lineHeight: 1 }}>dryline</div>
            <div style={{ fontFamily: "Martian", fontSize: 12, letterSpacing: 5, opacity: 0.7, marginTop: 6 }}>HEAT & AIR</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Martian", fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "#8ee3ef" }}>
            <div style={{ width: 40, height: 2, background: "#8ee3ef" }} />
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontFamily: "Unbounded", fontSize: size, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1020 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24, color: "rgba(245,249,251,0.7)" }}>
          <div style={{ display: "flex" }}>Same-day · Flat-rate · 24/7 emergency</div>
          <div style={{ display: "flex", fontFamily: "Unbounded", color: "#ffb547", fontSize: 28, letterSpacing: -1 }}>(405) 555-0142</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Unbounded", data: display, weight: 500, style: "normal" },
        { name: "Figtree", data: sans, weight: 500, style: "normal" },
        { name: "Martian", data: mono, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}

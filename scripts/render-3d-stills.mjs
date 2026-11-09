// Stills rendered from the live 3D thermostat (src/components/mode/thermostatScene.ts), for everyone
// who doesn't get it live (phones, tablets, reduced motion, Save-Data) and for desktops to show
// before the canvas fades in over them. Display off, ring mark hidden, at rest, one per mode:
//   - public/images/dial/dial-{cool,heat}.{avif,webp}  the hero, under the canvas (same framing)
//   - public/images/dial/dial-phone-{cool,heat}.webp   a close crop for the phone's Cool/Heat row
// Also prints where the display sits in the frame (Dial.tsx draws the readout there).
//
//   ESBUILD=<path to esbuild package> PLAYWRIGHT=<path to playwright-core> node scripts/render-3d-stills.mjs [--preview 68]
//
// --preview <temp> renders the live look (display on, cursor centred) over the hero photo to
// scripts/.preview-*.png instead, for checking the scene by eye. Needs Google Chrome (real GPU).
// Nothing is served: the page and /public are answered by the browser's request interception.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const load = async (name, env) => {
  const mod = await import(pathToFileURL(createRequire(import.meta.url).resolve(process.env[env] || name)).href);
  return mod.default ?? mod;
};
const esbuild = await load("esbuild", "ESBUILD");
const { chromium } = await load("playwright-core", "PLAYWRIGHT");
setTimeout(() => {
  console.error("timed out");
  process.exit(3);
}, 180000).unref();

const pi = process.argv.indexOf("--preview");
const preview = pi > 0 ? Number(process.argv[pi + 1] || 68) : null;
const SIZE = 1400;
const out = (f) => path.join(ROOT, "public/images/dial", f);
fs.mkdirSync(path.dirname(out("x")), { recursive: true });

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dial-"));
  const entry = path.join(tmp, "entry.ts");
  fs.writeFileSync(
    entry,
    `import { createThermostatScene, restProjection } from ${JSON.stringify(path.join(ROOT, "src/components/mode/thermostatScene"))};
const q = new URLSearchParams(location.search);
const live = q.has("t");
document.fonts.load("500 100px Disp").finally(async () => {
  const h = await createThermostatScene(document.querySelector("canvas")!, { temp: live ? +q.get("t")! : 68, sr: q.has("sr"), still: !live, fonts: { display: "Disp", mono: "ui-monospace, monospace" },
    onReady: () => setTimeout(() => ((window as any).__ready = true), live ? 2600 : 50) });
  (window as any).__freeze = (m: "cool" | "heat", bare?: boolean) => h.freeze(m, bare);
  (window as any).__proj = restProjection();
});`,
  );
  await esbuild.build({ entryPoints: [entry], bundle: true, outfile: path.join(tmp, "entry.js"), nodePaths: [path.join(ROOT, "node_modules")], tsconfig: path.join(ROOT, "tsconfig.json"), logLevel: "warning" });
  const page = (bg) =>
    `<!doctype html><style>@font-face{font-family:Disp;src:url(/__font.woff2)}html,body{margin:0;background:${bg}}canvas{position:fixed;inset:0;width:100vw;height:100vh}</style><body><canvas></canvas><script src="/__entry.js"></script>`;

  const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=d3d11"] });
  const shoot = async (query, size, bg = "transparent", setup) => {
    const tab = await browser.newPage({ viewport: { width: size, height: size } });
    tab.on("pageerror", (e) => console.error(e));
    tab.on("console", (m) => m.type() === "error" && console.error(m.text()));
    await tab.route("**/*", async (route) => {
      const p = new URL(route.request().url()).pathname;
      if (p === "/") return route.fulfill({ body: page(bg), headers: { "content-type": "text/html" } });
      if (p === "/__entry.js") return route.fulfill({ body: fs.readFileSync(path.join(tmp, "entry.js")), headers: { "content-type": "text/javascript" } });
      if (p === "/__font.woff2") return route.fulfill({ body: fs.readFileSync(path.join(ROOT, "src/app/fonts/unbounded-latin-var.woff2")), headers: { "content-type": "font/woff2" } });
      const file = path.join(ROOT, "public", p);
      if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: "" });
      return route.fulfill({ body: fs.readFileSync(file) });
    });
    await tab.goto("http://dial.local/" + query);
    await tab.waitForFunction(() => window.__ready, null, { timeout: 30000 });
    if (setup) await setup(tab);
    await tab.waitForTimeout(200);
    const png = await tab.screenshot({ omitBackground: bg === "transparent" });
    const proj = await tab.evaluate(() => window.__proj);
    await tab.close();
    return { png, proj };
  };

  if (preview !== null) {
    for (const [name, bg] of [
      ["dark", "#0a1726"],
      ["photo", "#0a1726 url(/images/hero-flame.jpg) center/cover"],
    ]) {
      const { png } = await shoot(`?t=${preview}${process.argv.includes("--sr") ? "&sr" : ""}`, 900, bg);
      fs.writeFileSync(path.join(ROOT, `scripts/.preview-${name}.png`), png);
    }
    await browser.close();
    fs.rmSync(tmp, { recursive: true, force: true });
    process.exit(0);
  }

  let proj;
  for (const mode of ["cool", "heat"]) {
    const shot = await shoot("", SIZE, "transparent", (tab) => tab.evaluate((m) => window.__freeze(m), mode));
    proj = shot.proj;
    const img = () => sharp(shot.png);
    await img().resize(1200).avif({ quality: 56, effort: 8 }).toFile(out(`dial-${mode}.avif`));
    await img().resize(1200).webp({ quality: 74, alphaQuality: 80 }).toFile(out(`dial-${mode}.webp`));
    // Phones: the thermostat alone with its shadow, no pool, faded out before the crop's edges (shown at 68 px)
    const bare = await shoot("", SIZE, "transparent", (tab) => tab.evaluate((m) => window.__freeze(m, true), mode));
    const half = proj.ring.w * 0.66;
    const w = Math.round(SIZE * half * 2);
    const fade = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}"><defs><radialGradient id="g"><stop offset="0.8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
    );
    const crop = await sharp(bare.png)
      .extract({ left: Math.round(SIZE * (proj.ring.cx - half)), top: Math.round(SIZE * (proj.face.cy - half)), width: w, height: w })
      .composite([{ input: fade, blend: "dest-in" }])
      .png()
      .toBuffer();
    await sharp(crop).resize(240).webp({ quality: 80, alphaQuality: 85 }).toFile(out(`dial-phone-${mode}.webp`));
  }
  await browser.close();
  console.log("projection", JSON.stringify(proj));
  for (const f of fs.readdirSync(path.dirname(out("x")))) console.log(f, Math.round(fs.statSync(out(f)).size / 1024), "KB");
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

import * as THREE from "three";
import { FACE, drawFace, faceText, toAngle } from "./dialFace";
import { accentRgb, mixFor, modeFor } from "@/lib/mode";

/*
 * The hero thermostat, desktop only: a real wall thermostat in turned aluminium.
 *
 * - The ring is lathed from a machined profile. Its top is brushed in circles (anisotropic, so the
 *   highlight runs round it as it tilts), its side is knurled for grip, and it turns with the
 *   setting: a small lit mark on it shows where it stands.
 * - The display is black glass, slightly domed, with the readout as its light: the scale lights up
 *   to the setting in the accent colour, which also glows on the ring's inner bevel.
 * - It hangs a little off the hero, in a soft pool of light that its own shadow falls across (a
 *   spotlight with a blurred shadow map): the canvas is see-through, so both land on the photo.
 * - It tilts toward the cursor on a spring, tips back as the hero scrolls away, and presses in a
 *   touch while it's being turned. On first show the display powers on.
 *
 * Nothing renders unless something is moving, and nothing at all while it's off screen.
 */

export type ThermostatHandle = {
  setTemp: (t: number) => void;
  /** Cursor relative to the thermostat, roughly -1..1 each way. */
  setPointer: (x: number, y: number) => void;
  setDragging: (d: boolean) => void;
  /** 0..1 as the hero scrolls away. */
  setProgress: (p: number) => void;
  setVisible: (v: boolean) => void;
  resize: () => void;
  /** The still: display off, ring mark hidden, at rest, in the given mode (`bare`: no pool of light, for a tight crop). */
  freeze: (mode: "cool" | "heat", bare?: boolean) => void;
  dispose: () => void;
};

type Opts = {
  temp: number;
  sr: boolean;
  fonts: { display: string; mono: string };
  onReady?: () => void;
  /** Skip the power-on (stills). */
  still?: boolean;
};

// ───────────────────────────── shape ─────────────────────────────
// Thermostat radius 1, its axis toward the camera (+z), mounted 0.22 in front of the backdrop.

const WALL = -0.22;
const RING_TOP = 0.345;
const FACE_R = 0.828;
const FACE_Z = 0.285;
const REST = { x: -0.07, y: -0.23 };
const TILT = { x: 0.16, y: 0.2 };
/** Camera: the thermostat fills 60% of the square canvas. */
export const FRAME = { fov: 24, z: 8.05, fill: 0.6 };

/** Ring profile (radius, height), outside up and over to the glass: bevels, a turned groove, the inner wall. */
const RING: [number, number][] = [
  [1.0, 0.3],
  [0.996, 0.322],
  [0.986, 0.337],
  [0.972, RING_TOP],
  [0.94, RING_TOP],
  [0.878, RING_TOP],
  [0.874, RING_TOP - 0.006],
  [0.869, RING_TOP - 0.006],
  [0.865, RING_TOP],
  [0.852, RING_TOP],
  [0.842, RING_TOP - 0.01],
  [0.836, RING_TOP - 0.03],
  [0.833, FACE_Z - 0.01],
];

function lathe(profile: [number, number][], segments: number) {
  const g = new THREE.LatheGeometry(
    profile.map(([r, h]) => new THREE.Vector2(r, h)),
    segments,
  );
  g.rotateX(Math.PI / 2); // lathe axis +y → +z
  return g;
}

/** A shallow dome of glass with flat (screen) UVs, so the display maps straight on. */
function faceGeometry() {
  const g = new THREE.RingGeometry(0, FACE_R, 128, 24);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const k = (x * x + y * y) / (FACE_R * FACE_R);
    p.setZ(i, FACE_Z + 0.022 * (1 - k));
  }
  g.computeVertexNormals();
  return g;
}

// ───────────────────────────── textures ─────────────────────────────

function canvasTex(w: number, h: number, paint: (c: CanvasRenderingContext2D) => void, color = false) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.anisotropy = 8;
  return t;
}

/** Turned finish: fine streaks along u (round the ring), as roughness. */
function brushedRoughness() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return canvasTex(1024, 512, (c) => {
    c.fillStyle = "rgb(84,84,84)";
    c.fillRect(0, 0, 1024, 512);
    for (let y = 0; y < 512; y++) {
      const v = 60 + rnd() * 52;
      c.fillStyle = `rgba(${v},${v},${v},0.8)`;
      c.fillRect(0, y, 1024, 1);
      // a few longer, brighter scratches
      if (rnd() < 0.06) {
        c.fillStyle = `rgba(150,150,150,${0.25 + rnd() * 0.3})`;
        c.fillRect(rnd() * 1024, y, 120 + rnd() * 600, 1);
      }
    }
  });
}

/** Knurled grip: ridges across u, as a tangent-space normal map. */
function knurlNormals(ridges: number) {
  const W = 2048;
  const t = canvasTex(W, 4, (c) => {
    const img = c.createImageData(W, 4);
    for (let x = 0; x < W; x++) {
      const s = Math.cos(((x + 0.5) / W) * ridges * Math.PI * 2);
      const nx = s * 0.55;
      const nz = Math.sqrt(1 - nx * nx);
      for (let y = 0; y < 4; y++) {
        const i = (y * W + x) * 4;
        img.data[i] = Math.round((nx * 0.5 + 0.5) * 255);
        img.data[i + 1] = 128;
        img.data[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        img.data[i + 3] = 255;
      }
    }
    c.putImageData(img, 0, 0);
  });
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Soft round mask, white in the middle (for the light pool and the contact shade). */
function radial(inner: number) {
  return canvasTex(256, 256, (c) => {
    const g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "#fff");
    g.addColorStop(inner, "#fff");
    g.addColorStop(inner + (1 - inner) * 0.45, "#6a6a6a");
    g.addColorStop(1, "#000");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
  });
}

/** A dark studio with softboxes, for the metal and glass to reflect. */
function studio(renderer: THREE.WebGLRenderer) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x1c232d);
  const panel = (w: number, h: number, at: [number, number, number], intensity: number, color = 0xffffff) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(...at);
    m.lookAt(0, 0, 0);
    s.add(m);
  };
  panel(8, 6, [-6, 6, 6], 4.2, 0xfff4e6); // key softbox, upper left
  panel(14, 7, [0, 4.5, 11], 1.25, 0xf2f5f8); // big frontal fill, over the camera: lights the ring's top
  panel(1.6, 10, [7, 0.5, 3], 2.4, 0xe6f2ff); // strip, right
  panel(12, 3, [0, 9, -1], 1.6); // top
  panel(14, 4, [0, -7, 5], 0.45, 0x9fb4cc); // floor bounce
  panel(5, 5, [-3, -2, -8], 0.7, 0xcfdcea); // behind
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(s, 0.035).texture;
  pmrem.dispose();
  s.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return env;
}

// ───────────────────────────── scene ─────────────────────────────

export function createThermostatScene(canvas: HTMLCanvasElement, opts: Opts): ThermostatHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance", premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  const env = studio(renderer);
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(FRAME.fov, 1, 1, 30);
  camera.position.set(0, 0, FRAME.z);

  // The thermostat: tilt → press → (ring turns inside)
  const tilt = new THREE.Group();
  const press = new THREE.Group();
  tilt.add(press);
  scene.add(tilt);

  const brushed = brushedRoughness();
  brushed.repeat.set(2, 1);
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0xe4e7ec,
    metalness: 1,
    roughness: 0.38,
    roughnessMap: brushed,
    anisotropy: 0.9,
    envMapIntensity: 1.15,
  });
  const knurl = knurlNormals(1);
  knurl.repeat.set(220, 1);
  const grip = new THREE.MeshPhysicalMaterial({
    color: 0xd2d6dd,
    metalness: 1,
    roughness: 0.36,
    normalMap: knurl,
    normalScale: new THREE.Vector2(0.9, 0.9),
    envMapIntensity: 1.05,
  });

  const ring = new THREE.Group();
  press.add(ring);
  const top = new THREE.Mesh(lathe(RING, 256), metal);
  const side = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.24, 256, 1, true), grip);
  side.rotation.x = Math.PI / 2;
  side.position.z = 0.18;
  const mark = new THREE.Mesh(new THREE.CircleGeometry(0.016, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
  mark.position.set(0, 0.91, RING_TOP + 0.0015);
  ring.add(top, side, mark);

  // Graphite base where it meets the wall: a shadow line under the ring
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.955, 0.94, 0.12, 128),
    new THREE.MeshStandardMaterial({ color: 0x1b2330, roughness: 0.55, metalness: 0.2, envMapIntensity: 0.6 }),
  );
  base.rotation.x = Math.PI / 2;
  base.position.z = 0.0;
  press.add(base);

  // The display
  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = FACE;
  faceCanvas.height = FACE;
  const faceCtx = faceCanvas.getContext("2d")!;
  const faceTex = new THREE.CanvasTexture(faceCanvas);
  faceTex.colorSpace = THREE.SRGBColorSpace;
  faceTex.anisotropy = 8;
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x020407,
    roughness: 0.07,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.035,
    emissive: 0xffffff,
    emissiveMap: faceTex,
    emissiveIntensity: 1.25,
    envMapIntensity: 0.42,
  });
  const face = new THREE.Mesh(faceGeometry(), glass);
  press.add(face);

  for (const m of [top, side, base, face]) m.castShadow = true;

  // Backdrop: a pool of light and the shadow inside it
  // 3.3 across: the pool fades out inside the canvas, never at its edge
  const backdrop = new THREE.PlaneGeometry(3.3, 3.3);
  // Plain alpha, not added light, so the transparent stills carry it exactly as the live canvas shows it
  const poolMat = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaMap: radial(0), transparent: true, opacity: 0.2, depthWrite: false, toneMapped: false });
  const pool = new THREE.Mesh(backdrop, poolMat);
  pool.position.set(-0.12, 0.1, WALL);
  const shadowMat = new THREE.ShadowMaterial({ color: 0x01060d, opacity: 0.62, transparent: true, depthWrite: false });
  const shade = new THREE.Mesh(backdrop, shadowMat);
  shade.position.z = WALL + 0.001;
  shade.receiveShadow = true;
  shade.renderOrder = 2;
  // Contact shade right behind the body
  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 2.7),
    new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: radial(0.55), transparent: true, opacity: 0.55, depthWrite: false }),
  );
  contact.position.set(0.05, -0.06, WALL + 0.002);
  contact.renderOrder = 3;
  scene.add(pool, shade, contact);

  // Lights: a soft key from the upper left (casts the shadow), the display's glow, an accent rim
  const key = new THREE.SpotLight(0xfff3e4, 120, 0, 0.4, 1, 2);
  key.position.set(-3.9, 4.6, 4.9);
  key.target.position.set(0.15, -0.2, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 14;
  key.shadow.blurSamples = 24;
  key.shadow.bias = -0.0006;
  key.shadow.camera.near = 3;
  key.shadow.camera.far = 12;
  scene.add(key, key.target);
  // just under the glass, so it lights the bevel round the display but never shows on the glass itself
  const glow = new THREE.PointLight(0xffffff, 0, 2, 2);
  glow.position.set(0, 0, FACE_Z - 0.012);
  press.add(glow);
  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(3, -2.4, -1.2);
  scene.add(rim);

  // ───────────── state ─────────────
  let temp = opts.temp;
  let on = opts.still ? 0 : 0;
  let onTarget = opts.still ? 0 : 1;
  let markOn = !opts.still;
  let shownMix = mixFor(temp);
  let ringAngle = -toAngle(temp) * (Math.PI / 180);
  let ringTarget = ringAngle;
  const ptr = { x: 0, y: 0 };
  const rot = { x: REST.x, y: REST.y, vx: 0, vy: 0 };
  let dragging = false;
  let pressZ = 0;
  let progress = 0;
  let shownProgress = 0;
  let visible = true;
  let frozen = false;
  let mode: "cool" | "heat" | null = null;
  let faceDirty = true;

  const accent = new THREE.Color();
  const applyMix = (mix: number) => {
    const [r, g, b] = accentRgb(mix);
    accent.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
    mark.material.color.copy(accent).multiplyScalar(1.6);
    mark.visible = markOn;
    glow.color.copy(accent);
    rim.color.copy(accent);
    // the pool takes a little of the mode's colour
    poolMat.color.setRGB(0.6, 0.66, 0.74).lerp(accent, 0.4);
  };
  applyMix(shownMix);

  const redrawFace = () => {
    const m = modeFor(temp);
    drawFace(faceCtx, { t: temp, text: faceText(temp, m, opts.sr), accent: accentRgb(shownMix), on, display: opts.fonts.display, mono: opts.fonts.mono });
    faceTex.needsUpdate = true;
    faceDirty = false;
  };

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    kick();
  };

  // ───────────── loop: runs only while something moves ─────────────
  let raf = 0;
  let last = 0;
  const step = (now: number) => {
    raf = 0;
    if (!visible && !frozen) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    let moving = false;

    // tilt spring toward the cursor (and back as the hero scrolls away)
    shownProgress += (progress - shownProgress) * Math.min(1, dt * 10);
    if (Math.abs(progress - shownProgress) > 0.0005) moving = true;
    const tx = REST.x - ptr.y * TILT.x + shownProgress * 0.42;
    const ty = REST.y + ptr.x * TILT.y;
    const k = 60;
    const d = 2 * Math.sqrt(k) * 0.82;
    rot.vx += ((tx - rot.x) * k - rot.vx * d) * dt;
    rot.vy += ((ty - rot.y) * k - rot.vy * d) * dt;
    rot.x += rot.vx * dt;
    rot.y += rot.vy * dt;
    if (Math.abs(tx - rot.x) + Math.abs(ty - rot.y) + Math.abs(rot.vx) + Math.abs(rot.vy) > 0.0004) moving = true;
    tilt.rotation.set(rot.x, rot.y, 0);
    tilt.position.y = shownProgress * 0.35;

    // a small press while turning it
    const pz = dragging ? -0.035 : 0;
    pressZ += (pz - pressZ) * Math.min(1, dt * 16);
    if (Math.abs(pz - pressZ) > 0.0003) moving = true;
    press.position.z = pressZ;

    // the ring follows the setting (the dial sets it 1:1 while dragging, tweens otherwise)
    ringAngle += (ringTarget - ringAngle) * Math.min(1, dt * 18);
    if (Math.abs(ringTarget - ringAngle) > 0.0005) moving = true;
    ring.rotation.z = ringAngle;

    // colour and display
    const mixTarget = mixFor(temp);
    if (Math.abs(mixTarget - shownMix) > 0.002) {
      shownMix += (mixTarget - shownMix) * Math.min(1, dt * 6);
      applyMix(shownMix);
      faceDirty = true;
      moving = true;
    }
    if (on !== onTarget) {
      on = Math.min(onTarget, on + dt / 1.6);
      faceDirty = true;
      moving = true;
    }
    if (faceDirty) redrawFace();
    glow.intensity = 2.4 * on;
    rim.intensity = 0.9 * (0.4 + 0.6 * on);

    renderer.render(scene, camera);
    if (moving && !frozen) raf = requestAnimationFrame(step);
    else last = 0;
  };
  function kick() {
    if (!raf && !frozen) raf = requestAnimationFrame(step);
  }

  const m0 = modeFor(temp);
  mode = m0;
  resize();
  redrawFace();
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  // Show only once the first real frame is on the canvas, then power on.
  requestAnimationFrame(() => {
    opts.onReady?.();
    if (!opts.still) window.setTimeout(kick, 380);
  });

  return {
    setTemp(t) {
      temp = t;
      ringTarget = -toAngle(t) * (Math.PI / 180);
      if (dragging) ringAngle = ringTarget;
      const m = modeFor(t);
      if (m !== mode) mode = m;
      faceDirty = true;
      kick();
    },
    setPointer(x, y) {
      ptr.x = Math.max(-1, Math.min(1, x));
      ptr.y = Math.max(-1, Math.min(1, y));
      kick();
    },
    setDragging(v) {
      dragging = v;
      kick();
    },
    setProgress(p) {
      progress = Math.max(0, Math.min(1, p));
      kick();
    },
    setVisible(v) {
      visible = v;
      if (v) kick();
    },
    resize,
    freeze(m, bare = false) {
      frozen = true;
      pool.visible = contact.visible = !bare;
      cancelAnimationFrame(raf);
      raf = 0;
      temp = m === "cool" ? 66 : 78;
      shownMix = mixFor(temp);
      markOn = false;
      applyMix(shownMix);
      on = 0;
      onTarget = 0;
      ringAngle = ringTarget = 0;
      ring.rotation.z = 0;
      rot.x = REST.x;
      rot.y = REST.y;
      tilt.rotation.set(rot.x, rot.y, 0);
      tilt.position.y = 0;
      press.position.z = 0;
      glow.intensity = 0;
      rim.intensity = 0.36;
      redrawFace();
      renderer.render(scene, camera);
    },
    dispose() {
      cancelAnimationFrame(raf);
      frozen = true;
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const mat = o.material as THREE.Material & Record<string, unknown>;
          for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
          mat.dispose();
        }
      });
      env.dispose();
      renderer.dispose();
    },
  };
}

/** Where the thermostat and its display sit in the canvas at rest, as fractions of its width (for the still's overlay). */
export function restProjection() {
  const cam = new THREE.PerspectiveCamera(FRAME.fov, 1, 1, 30);
  cam.position.set(0, 0, FRAME.z);
  cam.updateMatrixWorld();
  const g = new THREE.Object3D();
  g.rotation.set(REST.x, REST.y, 0);
  g.updateMatrixWorld();
  const p = (x: number, y: number, z: number) => {
    const v = new THREE.Vector3(x, y, z).applyMatrix4(g.matrixWorld).project(cam);
    return { x: (v.x + 1) / 2, y: (1 - v.y) / 2 };
  };
  const c = p(0, 0, FACE_Z + 0.02);
  const fx = [p(-FACE_R, 0, FACE_Z), p(FACE_R, 0, FACE_Z)];
  const fy = [p(0, FACE_R, FACE_Z), p(0, -FACE_R, FACE_Z)];
  const rx = [p(-1, 0, 0.3), p(1, 0, 0.3)];
  return { face: { cx: c.x, cy: c.y, w: fx[1].x - fx[0].x, h: fy[1].y - fy[0].y }, ring: { w: rx[1].x - rx[0].x, cx: (rx[0].x + rx[1].x) / 2 } };
}

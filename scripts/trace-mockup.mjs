// Vectorisation (potrace, local) d'éléments de la maquette validée : visage au trait (verso) et « Юлия » (recto).
// Sortie : print/assets/traced.json -> chemins SVG déjà calés en millimètres (origine = coin haut-gauche du rognage).
// Usage : node scripts/trace-mockup.mjs
import fs from "node:fs";
import sharp from "sharp";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const potrace = require("potrace");

const SRC = "print/assets/maquette-reference.png";
// Cartes dans la maquette (px) : recto / verso — 100 x 42 mm
const CARD = { front: { x: 237, y: 38, w: 1060, h: 450 }, back: { x: 237, y: 536, w: 1060, h: 438 } };
const UP = 5; // sur-échantillonnage avant vectorisation (adoucit les contours)

async function trace({ name, card, box, thr }) {
  const c = CARD[card];
  const buf = await sharp(SRC).extract({ left: box.x, top: box.y, width: box.w, height: box.h })
    .resize({ width: box.w * UP, kernel: "lanczos3" }).greyscale().blur(0.4).threshold(thr).negate().png().toBuffer();
  const svg = await new Promise((res, rej) => potrace.trace(buf, { turdSize: 12, optTolerance: 0.35, alphaMax: 1.05, blackOnWhite: true }, (e, s) => e ? rej(e) : res(s)));
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(" ");
  const pxPerMm = c.w / 100;
  // coordonnées potrace (px sur-échantillonnés) -> mm, repère rognage
  const tx = (box.x - c.x) / pxPerMm, ty = (box.y - c.y) / pxPerMm, k = 1 / (UP * pxPerMm);
  return { name, d, transform: `translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${k.toFixed(5)})` };
}

const out = {};
for (const job of [
  { name: "face", card: "back", box: { x: 238, y: 537, w: 150, h: 436 }, thr: 100 },
  { name: "yuliaFront", card: "front", box: { x: 395, y: 150, w: 335, h: 110 }, thr: 90 },
  { name: "nameBack", card: "back", box: { x: 396, y: 554, w: 372, h: 66 }, thr: 90 },
]) { const r = await trace(job); out[r.name] = r; console.log(r.name, r.d.length); }
fs.writeFileSync("print/assets/traced.json", JSON.stringify(out));

#!/usr/bin/env node
// Vectorise une zone d'une maquette raster (potrace, 100 % local) -> chemin SVG déjà en millimètres.
// Usage : node trace-region.mjs <image> <box x,y,w,h> <card x,y,w,h> <card_width_mm> [threshold=100] [out.json]
//   box  = zone à vectoriser (px de l'image)    card = rectangle de la carte/du support dans l'image (px)
//   Sortie JSON : { d, transform } ; l'utiliser ainsi : <path d="{d}" transform="translate(ox oy) {transform}" fill-rule="evenodd"/>
//   (ox, oy = fond perdu en mm si l'origine du SVG est le coin du fond perdu)
// Dépendances : npm i -D sharp potrace
import fs from "node:fs";
import sharp from "sharp";
import { createRequire } from "node:module";
const potrace = createRequire(import.meta.url)("potrace");

const [src, boxS, cardS, mmW, thrS = "100", out] = process.argv.slice(2);
if (!src || !boxS || !cardS || !mmW) { console.error("usage: trace-region.mjs <image> x,y,w,h x,y,w,h <card_mm_width> [thr] [out.json]"); process.exit(1); }
const [bx, by, bw, bh] = boxS.split(",").map(Number), [cx, cy, cw] = cardS.split(",").map(Number);
const UP = 5, pxPerMm = cw / Number(mmW);

const png = await sharp(src).extract({ left: bx, top: by, width: bw, height: bh })
  .resize({ width: bw * UP, kernel: "lanczos3" }).greyscale().blur(0.4).threshold(Number(thrS)).negate().png().toBuffer();
const svg = await new Promise((res, rej) => potrace.trace(png, { turdSize: 12, optTolerance: 0.35, alphaMax: 1.05, blackOnWhite: true }, (e, s) => (e ? rej(e) : res(s))));
const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(" ");
const k = 1 / (UP * pxPerMm);
const result = { d, transform: `translate(${((bx - cx) / pxPerMm).toFixed(3)} ${((by - cy) / pxPerMm).toFixed(3)}) scale(${k.toFixed(5)})` };
if (out) fs.writeFileSync(out, JSON.stringify(result)); else console.log(JSON.stringify(result).slice(0, 300) + "…");
console.error(`ok: ${d.length} car., ${pxPerMm.toFixed(2)} px/mm`);

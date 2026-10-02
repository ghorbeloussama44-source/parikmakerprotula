// Génère la carte de visite de Юля Горбель en vectoriel (SVG + PDF), textes convertis en tracés.
// Usage : node scripts/business-card.mjs
import fs from "node:fs";
import sharp from "sharp";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const opentype = require("opentype.js");
const QR = require("qrcode");

const TRIM = { w: 90, h: 50 }, BLEED = 3;
const W = TRIM.w + BLEED * 2, H = TRIM.h + BLEED * 2;
const C = { ink: "#0B0B0D", gold: "#D6B88D", goldDeep: "#A98456", ivory: "#F5F2ED", smoke: "#232323" };
const MAX_URL = "https://max.ru/u/f9LHodD0cOL1qfuCzyKJ_4S9Z7rZVJYQmdtXqgIgZ1KaBvcEa5U7Z1IODrc";

const f = (pkg, name) => opentype.parse(fs.readFileSync(require.resolve(`@fontsource/${pkg}/files/${name}.woff`)).buffer.slice(0));
const fonts = {
  playfair: [f("playfair-display", "playfair-display-cyrillic-400-normal"), f("playfair-display", "playfair-display-latin-400-normal")],
  script: [f("cormorant", "cormorant-cyrillic-500-italic"), f("cormorant", "cormorant-latin-500-italic")],
  sans: [f("inter", "inter-cyrillic-500-normal"), f("inter", "inter-latin-500-normal")],
  sansBold: [f("inter", "inter-cyrillic-600-normal"), f("inter", "inter-latin-600-normal")],
};

// Texte -> tracé SVG (mm). size = corps en mm, tracking en mm entre les lettres.
function text(set, str, x, y, size, { anchor = "start", tracking = 0 } = {}) {
  const items = [...str].map((ch) => {
    const font = set.find((ft) => ft.charToGlyphIndex(ch) > 0) ?? set[0];
    const g = font.charToGlyph(ch);
    return { font, ch, adv: (g.advanceWidth * size) / font.unitsPerEm };
  });
  const total = items.reduce((s, i) => s + i.adv + tracking, 0) - tracking;
  let cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  let d = "";
  for (const it of items) {
    d += it.font.getPath(it.ch, cx, y, size).toPathData(3);
    cx += it.adv + tracking;
  }
  return `<path d="${d}"/>`;
}

// QR vectoriel : une seule forme (rectangles fusionnés par ligne)
function qr(data, x, y, size) {
  const m = QR.create(data, { errorCorrectionLevel: "M" }).modules;
  const n = m.size, u = size / n;
  let d = "";
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (!m.get(r, c)) { c++; continue; }
      let e = c; while (e < n && m.get(r, e)) e++;
      d += `M${(x + c * u).toFixed(3)} ${(y + r * u).toFixed(3)}h${((e - c) * u).toFixed(3)}v${u.toFixed(3)}h${(-(e - c) * u).toFixed(3)}z`;
      c = e;
    }
  }
  return `<path d="${d}"/>`;
}

const o = BLEED; // décalage du rognage
const wrap = (body, bg) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">
<rect id="fond-perdu" width="${W}" height="${H}" fill="${bg}"/>
${body}
</svg>`;

// Ciseaux (tracé fin) centrés en (cx, cy)
const scissors = (cx, cy, s, col) => `<g fill="none" stroke="${col}" stroke-width="0.18" stroke-linecap="round" stroke-linejoin="round" transform="translate(${cx} ${cy}) scale(${s})">
<circle cx="-1.6" cy="3.6" r="1.25"/><circle cx="1.6" cy="3.6" r="1.25"/>
<path d="M-1.1 2.5 L1.9 -4.2 M1.1 2.5 L-1.9 -4.2"/></g>`;

// ---------- RECTO ----------
const mid = o + TRIM.w / 2;
const front = wrap(`
<g id="gold-foil" fill="${C.gold}">
  ${text(fonts.script, "Юля", mid, o + 22.6, 15, { anchor: "middle" })}
  ${text(fonts.playfair, "ГОРБЕЛЬ", mid, o + 32, 7.2, { anchor: "middle", tracking: 1.1 })}
  ${text(fonts.sans, "ПАРИКМАХЕР-МОДЕЛЬЕР", mid, o + 38, 1.9, { anchor: "middle", tracking: 0.6 })}
  ${text(fonts.script, "С любовью к каждой пряди", mid, o + 44.3, 3.1, { anchor: "middle" })}
</g>
<g id="gold-foil-lines" fill="none" stroke="${C.gold}" stroke-width="0.18">
  <rect x="${o + 3.5}" y="${o + 3.5}" width="${TRIM.w - 7}" height="${TRIM.h - 7}" rx="0"/>
  <path d="M${mid - 9} ${o + 34.7}H${mid + 9}"/>
</g>
${scissors(mid, o + 8.4, 0.5, C.gold)}
`, C.ink);

// ---------- VERSO ----------
const L = o + 7; // marge gauche
const back = wrap(`
<g id="texte" fill="${C.ink}">
  ${text(fonts.script, "Горбель Юлия Александровна", L, o + 11.6, 4.0)}
  ${text(fonts.sansBold, "ПАРИКМАХЕР-МОДЕЛЬЕР", L, o + 15.6, 1.5, { tracking: 0.4 })}
  ${text(fonts.sans, "Стаж более 20 лет", L, o + 19.4, 1.5)}
  ${text(fonts.sans, "Стрижки для всех, любой сложности · Сложные окрашивания", L, o + 22.2, 1.4)}
  ${text(fonts.sans, "Химическая и кератиновая завивка · Кератиновое выпрямление", L, o + 24.8, 1.4)}
  ${text(fonts.sans, "Любые праздничные прически · Уверенная работа с детьми", L, o + 27.4, 1.4)}
  ${text(fonts.sansBold, "MAX", L, o + 33.2, 1.35, { tracking: 0.3 })}
  ${text(fonts.sans, "8 (995) 442-47-12", L + 13, o + 33.2, 2.45)}
  ${text(fonts.sansBold, "ЗВОНКИ", L, o + 36.8, 1.35, { tracking: 0.3 })}
  ${text(fonts.sans, "8 (991) 529-25-42", L + 13, o + 36.8, 2.45)}
  ${text(fonts.sansBold, "INSTAGRAM", L, o + 40.4, 1.35, { tracking: 0.3 })}
  ${text(fonts.sans, "@yulia.gorbel", L + 13, o + 40.4, 2.45)}
  ${text(fonts.sansBold, "АДРЕС", L, o + 44, 1.35, { tracking: 0.3 })}
  ${text(fonts.sans, "пр. Ленина, 127а, офис 221", L + 13, o + 44, 2.45)}
</g>
<g id="gold-foil-mono" fill="${C.goldDeep}">${text(fonts.script, "Ю", o + 72.75, o + 15.2, 9, { anchor: "middle" })}</g>
<g id="qr" fill="${C.ink}">${qr(MAX_URL, o + 64, o + 19, 17.5)}</g>
<g id="qr-legende" fill="${C.ink}">${text(fonts.sansBold, "ЗАПИСЬ В MAX", o + 64 + 8.75, o + 40.2, 1.3, { anchor: "middle", tracking: 0.25 })}</g>
<g id="gold-foil-lines" fill="none" stroke="${C.gold}" stroke-width="0.25">
  <path d="M${L} ${o + 29.6}H${o + 56}"/>
  <path d="M${o + 60} ${o + 8}V${o + 44}" stroke-width="0.15"/>
</g>
<rect id="bandeau-or" x="0" y="0" width="${W}" height="${o + 2.2}" fill="${C.gold}"/>
<rect id="bandeau-noir" x="0" y="${H - o - 2.2}" width="${W}" height="${o + 2.2}" fill="${C.ink}"/>
`, C.ivory);

// ---------- PDF avec traits de coupe (marge 5 mm autour du format perdu) ----------
const SLUG = 6, PW = W + SLUG * 2, PH = H + SLUG * 2;
const marks = () => {
  const t = { x0: SLUG + BLEED, y0: SLUG + BLEED, x1: SLUG + BLEED + TRIM.w, y1: SLUG + BLEED + TRIM.h };
  const l = 3, g = 1; let d = "";
  for (const x of [t.x0, t.x1]) d += `M${x} ${t.y0 - g}v${-l}M${x} ${t.y1 + g}v${l}`;
  for (const y of [t.y0, t.y1]) d += `M${t.x0 - g} ${y}h${-l}M${t.x1 + g} ${y}h${l}`;
  return `<path d="${d}" stroke="#000" stroke-width="0.1" fill="none"/>`;
};
const inner = (svg) => svg.replace(/^<\?xml[^>]*>\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const page = (svg, label) => `<section><svg xmlns="http://www.w3.org/2000/svg" width="${PW}mm" height="${PH}mm" viewBox="0 0 ${PW} ${PH}">
<g transform="translate(${SLUG} ${SLUG})">${inner(svg)}</g>${marks()}
<g fill="#000">${text(fonts.sans, label + " · 90x50 mm + 3 mm bleed · foil: gold-foil*", SLUG, PH - 1.8, 1.4)}</g></svg></section>`;
const html = `<!doctype html><meta charset="utf-8"><style>@page{size:${PW}mm ${PH}mm;margin:0}html,body{margin:0}section{width:${PW}mm;height:${PH}mm;page-break-after:always;overflow:hidden}svg{display:block}</style>${page(front, "FRONT")}${page(back, "BACK")}`;

fs.mkdirSync("print", { recursive: true });
fs.writeFileSync("print/carte-recto.svg", front);
fs.writeFileSync("print/carte-verso.svg", back);
fs.writeFileSync("/tmp/card.html", html);

// ---------- RECTO AVEC PHOTO ----------
// Photo : public/img/portrait.jpg recadrée au format de la zone (48 x 56 mm, ~300 dpi).
const PH_X = o + 44, PH_W = W - PH_X, PH_H = H;
const photoBuf = await sharp("public/img/portrait.jpg")
  .extract({ left: 0, top: 40, width: 580, height: Math.round((580 * PH_H) / PH_W) })
  .jpeg({ quality: 95 }).toBuffer();
const cx = o + 22.5;
const frontPhoto = wrap(`
<defs>
  <linearGradient id="fondu" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="${C.ink}" stop-opacity="1"/><stop offset="0.28" stop-color="${C.ink}" stop-opacity="0"/>
  </linearGradient>
</defs>
<image id="photo" x="${PH_X}" y="0" width="${PH_W}" height="${PH_H}" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,${photoBuf.toString("base64")}"/>
<rect x="${PH_X}" y="0" width="${PH_W}" height="${PH_H}" fill="url(#fondu)"/>
<g id="gold-foil" fill="${C.gold}">
  ${text(fonts.script, "Юля", cx, o + 22, 11.5, { anchor: "middle" })}
  ${text(fonts.playfair, "ГОРБЕЛЬ", cx, o + 29.8, 5.1, { anchor: "middle", tracking: 0.75 })}
  ${text(fonts.sans, "ПАРИКМАХЕР-МОДЕЛЬЕР", cx, o + 36.4, 1.55, { anchor: "middle", tracking: 0.45 })}
  ${text(fonts.sans, "Стаж более 20 лет", cx, o + 39.4, 1.5, { anchor: "middle" })}
  ${text(fonts.script, "С любовью к каждой пряди", cx, o + 44.6, 2.5, { anchor: "middle" })}
</g>
<g id="gold-foil-lines" fill="none" stroke="${C.gold}" stroke-width="0.18"><path d="M${cx - 6} ${o + 32.6}H${cx + 6}"/></g>
${scissors(cx, o + 9.3, 0.45, C.gold)}
`, C.ink);
fs.writeFileSync("print/carte-recto-photo.svg", frontPhoto);
const html2 = `<!doctype html><meta charset="utf-8"><style>@page{size:${PW}mm ${PH}mm;margin:0}html,body{margin:0}section{width:${PW}mm;height:${PH}mm;page-break-after:always;overflow:hidden}svg{display:block}</style>${page(frontPhoto, "FRONT (photo)")}${page(back, "BACK")}`;
fs.writeFileSync("/tmp/card-photo.html", html2);
console.log("svg ok");

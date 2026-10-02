// Carte de visite « ornée » (inspirée d'une maquette baroque noir & or) — vectoriel, sans photo, sans QR, sans adresse.
// Usage : node scripts/business-card-baroque.mjs  ->  print/carte-ornee-*.svg + /tmp/card-baroque.html (pour le PDF)
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const opentype = require("opentype.js");

const TRIM = { w: 90, h: 50 }, B = 3, o = B;
const W = TRIM.w + B * 2, H = TRIM.h + B * 2;
const C = { ink: "#0B0B0D", gold: "#D6B88D", goldHi: "#F1DCB9", goldLo: "#A98456", ivory: "#E9E4DB", dim: "#B9B2A6", damask: "#111114" };

const f = (pkg, name) => opentype.parse(fs.readFileSync(require.resolve(`@fontsource/${pkg}/files/${name}.woff`)).buffer.slice(0));
const pair = (pkg, base) => [f(pkg, base.replace("{s}", "cyrillic")), f(pkg, base.replace("{s}", "latin"))];
const fonts = { hand: pair("marck-script", "marck-script-{s}-400-normal"), sans: pair("inter", "inter-{s}-500-normal"), sansBold: pair("inter", "inter-{s}-600-normal") };

function text(set, str, x, y, size, { anchor = "start", tracking = 0 } = {}) {
  const items = [...str].map((ch) => {
    const font = set.find((ft) => ft.charToGlyphIndex(ch) > 0) ?? set[0];
    return { font, ch, adv: (font.charToGlyph(ch).advanceWidth * size) / font.unitsPerEm };
  });
  const total = items.reduce((s, i) => s + i.adv + tracking, 0) - tracking;
  let cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  let d = "";
  for (const it of items) { d += it.font.getPath(it.ch, cx, y, size).toPathData(3); cx += it.adv + tracking; }
  return `<path d="${d}"/>`;
}

// ---------- ornements ----------
const defs = `<defs>
  <linearGradient id="or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.goldHi}"/><stop offset="0.5" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldLo}"/></linearGradient>
  <linearGradient id="filet" gradientUnits="userSpaceOnUse" x1="-26" x2="26" y1="0" y2="0"><stop offset="0" stop-color="${C.gold}" stop-opacity="0"/><stop offset="0.5" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></linearGradient>
  <pattern id="damas" width="12" height="12" patternUnits="userSpaceOnUse">
    <g fill="${C.damask}">
      <path d="M3 0.8 C4.3 2.2 4.3 3.8 3 5.2 C1.7 3.8 1.7 2.2 3 0.8Z"/><path d="M0.6 3 C2 1.7 4 1.7 5.4 3 C4 4.3 2 4.3 0.6 3Z"/>
      <path d="M9 6.8 C10.3 8.2 10.3 9.8 9 11.2 C7.7 9.8 7.7 8.2 9 6.8Z"/><path d="M6.6 9 C8 7.7 10 7.7 11.4 9 C10 10.3 8 10.3 6.6 9Z"/>
      <circle cx="9" cy="3" r="0.7"/><circle cx="3" cy="9" r="0.7"/>
    </g>
  </pattern>
</defs>`;

const spiral = (cx, cy, r0, turns, dir = 1, a0 = 0) => {
  let d = ""; const n = 40;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + dir * t * turns * 2 * Math.PI, r = r0 * (1 - t * 0.9);
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(3)} ${(cy + r * Math.sin(a)).toFixed(3)}`;
  }
  return d;
};

// Coin ornemental (haut-gauche, ~7 mm) : deux volutes + petites feuilles, symétriques sur la diagonale
const cornerOrn = () => {
  const arm = (swap) => {
    const P = (x, y) => (swap ? `${y} ${x}` : `${x} ${y}`);
    return `<path d="M${P(0.5, 8)} C${P(0.5, 4.6)} ${P(1.3, 2.4)} ${P(2.9, 1.7)} C${P(4.3, 1.2)} ${P(5.6, 2)} ${P(5.2, 3.1)} C${P(4.9, 3.9)} ${P(3.7, 3.9)} ${P(3.4, 3.1)}"/>
<path d="M${P(0.5, 5.2)} C${P(1.7, 4.6)} ${P(2.4, 3.8)} ${P(2.6, 2.9)} C${P(1.4, 3.3)} ${P(0.6, 4.1)} ${P(0.5, 5.2)}Z" fill="url(#or)"/>
<path d="M${P(5.3, 0.5)} C${P(6.4, 0.9)} ${P(7.3, 0.9)} ${P(8.4, 0.5)} C${P(7.4, 1.5)} ${P(6.2, 1.5)} ${P(5.3, 0.5)}Z" fill="url(#or)"/>`;
  };
  return `<g fill="none" stroke="url(#or)" stroke-width="0.2" stroke-linecap="round" stroke-linejoin="round">${arm(false)}${arm(true)}<circle cx="1.3" cy="1.3" r="0.4" fill="url(#or)" stroke="none"/></g>`;
};
const corners = (x0, y0, x1, y1, s = 1) => [
  `translate(${x0} ${y0}) scale(${s})`, `translate(${x1} ${y0}) scale(${-s} ${s})`,
  `translate(${x0} ${y1}) scale(${s} ${-s})`, `translate(${x1} ${y1}) scale(${-s})`,
].map((t) => `<g transform="${t}">${cornerOrn()}</g>`).join("");

// Filet orné avec fleuron central (largeur totale len)
const rule = (cx, y, len) => `<g transform="translate(${cx} ${y})">
<path d="M${-len / 2} 0H-3.6" stroke="url(#filet)" stroke-width="0.2" fill="none"/><path d="M3.6 0H${len / 2}" stroke="url(#filet)" stroke-width="0.2" fill="none"/>
<g fill="url(#or)">
  <path d="M0 -2.4 C1.3 -1.1 1.5 0.5 0 1.8 C-1.5 0.5 -1.3 -1.1 0 -2.4Z"/>
  <path d="M-0.5 1.1 C-2 0.3 -3 -0.9 -2.6 -2.2 C-1.5 -1.5 -0.9 -0.4 -0.5 1.1Z"/><path d="M0.5 1.1 C2 0.3 3 -0.9 2.6 -2.2 C1.5 -1.5 0.9 -0.4 0.5 1.1Z"/>
  <path d="M-1.6 2.2H1.6V2.6H-1.6Z"/><circle cx="-5" cy="0" r="0.28"/><circle cx="5" cy="0" r="0.28"/>
</g></g>`;

// Logo : visage de femme aux cheveux fluides + ciseaux + peigne (traits dorés)
const logo = () => `<g id="gold-foil-logo">
<g fill="url(#or)" stroke="none">
  <path d="M20 1 C8 3 1 17 3 31 C4 38 7 42 11 45 C8.4 39 7.6 31 9.2 22.6 C11 13.8 15.4 5.6 20 1Z"/>
  <path d="M20 1 C32 3 39 17 37 31 C36 38 33 42 29 45 C31.6 39 32.4 31 30.8 22.6 C29 13.8 24.6 5.6 20 1Z"/>
  <path d="M20 4.6 C13.6 8.6 11.4 17.6 12.2 26 C12.6 32 14.4 37 18 41.4 C15.4 35.4 14.8 29.4 15.2 23.4 C15.7 16.4 17.4 9.6 20 4.6Z" opacity="0.8"/>
  <path d="M20.8 4.6 C26.4 8.6 28.6 17.6 27.8 26 C27.4 32 25.6 37 22 41.4 C24.6 35.4 25.2 29.4 24.8 23.4 C24.3 16.4 22.6 9.6 20.8 4.6Z" opacity="0.8"/>
</g>
<g fill="none" stroke="url(#or)" stroke-linecap="round" stroke-linejoin="round">
  <path d="M16.6 18 C16.8 14 18.6 12 20.4 12 C22.4 12 23.6 14.2 23.6 17.6 C23.6 23 21.8 28 19.6 30.2 C17.4 28.2 16.3 22.6 16.6 18Z" stroke-width="0.4"/>
  <path d="M17.7 19.3 Q19 20.5 20.5 19.4" stroke-width="0.55"/><path d="M17.5 19.1 L16.8 18.5 M18.4 20 L18.1 20.7 M19.5 20.3 L19.5 21" stroke-width="0.28"/>
  <path d="M21.9 25.2 Q20.9 26 20.2 25.5" stroke-width="0.4"/>
  <path d="M18.4 30.6 C18.2 34 16.8 36.4 14.4 38 M20.8 30.2 C21.2 33.6 22.8 36 25.4 37.2" stroke-width="0.38"/>
</g>
<g transform="translate(46.5 24) rotate(12) scale(6.2)" fill="none" stroke="url(#or)" stroke-width="0.11" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="-0.62" cy="1.25" r="0.5"/><circle cx="0.62" cy="1.25" r="0.5"/><path d="M-0.42 0.82 L0.85 -1.7 M0.42 0.82 L-0.85 -1.7"/>
</g>
<g transform="translate(56 24) rotate(10)" fill="none" stroke="#D6B88D" stroke-linecap="round">
  <rect x="-2.1" y="-9" width="4.2" height="2.2" rx="0.8" fill="url(#or)" stroke="none"/>
  ${Array.from({ length: 6 }, (_, i) => `<path d="M${-1.65 + i * 0.66} -6.6 V8" stroke-width="0.42"/>`).join("")}
</g></g>`;

const bg = (extra) => `<rect id="fond-perdu" width="${W}" height="${H}" fill="${C.ink}"/><rect width="${W}" height="${H}" fill="url(#damas)"/>${extra}`;
const wrap = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">${defs}${body}</svg>`;

// ================= RECTO =================
const front = wrap(bg(`
<g id="gold-foil">
  ${rule(o + 28.5, o + 11.5, 50)}
  <g fill="url(#or)">${text(fonts.hand, "Юлия Горбель", o + 28.5, o + 26.2, 6.8, { anchor: "middle" })}</g>
  ${rule(o + 28.5, o + 31.2, 50)}
  <g fill="${C.gold}">${text(fonts.sans, "ПАРИКМАХЕР-МОДЕЛЬЕР", o + 28.5, o + 37.4, 1.7, { anchor: "middle", tracking: 0.55 })}
  ${text(fonts.sans, "С ЛЮБОВЬЮ К КАЖДОЙ ПРЯДИ", o + 28.5, o + 42.6, 1.6, { anchor: "middle", tracking: 0.5 })}</g>
  <g transform="translate(${o + 58} ${o + 13.2}) scale(0.5)">${logo()}</g>
</g>`));

// ================= VERSO =================
const L = o + 10.5;
const icons = {
  scissors: `<circle cx="-0.55" cy="1.15" r="0.5"/><circle cx="0.55" cy="1.15" r="0.5"/><path d="M-0.4 0.75 L0.75 -1.55 M0.4 0.75 L-0.75 -1.55"/>`,
  drop: `<path d="M0 -1.6 C1 -0.4 1.5 0.4 1.5 0.9 A1.5 1.5 0 0 1 -1.5 0.9 C-1.5 0.4 -1 -0.4 0 -1.6Z"/>`,
  sparkle: `<path d="M-0.35 -1.6 C-0.2 -0.5 -0.1 -0.35 1 -0.2 C-0.1 -0.05 -0.2 0.1 -0.35 1.2 C-0.5 0.1 -0.6 -0.05 -1.7 -0.2 C-0.6 -0.35 -0.5 -0.5 -0.35 -1.6Z"/><path d="M1 0.5 C1.05 0.9 1.1 0.95 1.5 1 C1.1 1.05 1.05 1.1 1 1.5 C0.95 1.1 0.9 1.05 0.5 1 C0.9 0.95 0.95 0.9 1 0.5Z"/>`,
  crown: `<path d="M-1.6 1 L-1.35 -0.9 L-0.55 0 L0 -1.3 L0.55 0 L1.35 -0.9 L1.6 1Z M-1.6 1.6H1.6"/>`,
};
const iconCircle = (cx, cy, key) => `<g transform="translate(${cx} ${cy})" fill="none" stroke="${C.gold}" stroke-width="0.17" stroke-linecap="round" stroke-linejoin="round"><circle r="2.5"/><g transform="scale(0.95)">${icons[key]}</g></g>`;
const rows = [
  { icon: "scissors", title: "СТРИЖКИ", sub: ["Для всех, любой сложности", "Уверенная работа с детьми"] },
  { icon: "drop", title: "ОКРАШИВАНИЕ", sub: ["Сложные окрашивания"] },
  { icon: "sparkle", title: "ЗАВИВКА И КЕРАТИН", sub: ["Химическая и кератиновая завивка", "Кератиновое выпрямление волос"] },
  { icon: "crown", title: "ПРАЗДНИЧНЫЕ ПРИЧЁСКИ", sub: ["Любые праздничные прически"] },
];
const y0 = o + 22.4, pitch = 6.6;
const list = rows.map((r, i) => {
  const cy = y0 + i * pitch, two = r.sub.length > 1;
  return `${iconCircle(L + 2.5, cy, r.icon)}<g fill="${C.gold}">${text(fonts.sansBold, r.title, L + 6.3, cy - (two ? 0.85 : 0.2), 1.35, { tracking: 0.28 })}</g>
<g fill="${C.dim}">${r.sub.map((t, k) => text(fonts.sans, t, L + 6.3, cy + (two ? 0.9 : 1.5) + k * 1.8, 1.2)).join("")}</g>`;
}).join("\n");
const bx = o + 56, by = o + 9.5, bw = 24.5, bh = 33.5, bc = bx + bw / 2;
const contact = (label, value, y) => `<g fill="${C.gold}">${text(fonts.sansBold, label, bc, y, 1.05, { anchor: "middle", tracking: 0.32 })}</g><g fill="${C.ivory}">${text(fonts.sans, value, bc, y + 2.9, 1.95, { anchor: "middle" })}</g>`;
const fr = 2.4; // retrait du cadre par rapport au rognage
const back = wrap(bg(`
<g id="gold-foil" fill="none" stroke="url(#or)">
  <rect x="${o + fr}" y="${o + fr}" width="${TRIM.w - 2 * fr}" height="${TRIM.h - 2 * fr}" stroke-width="0.16"/>
  <rect x="${o + fr + 0.7}" y="${o + fr + 0.7}" width="${TRIM.w - 2 * fr - 1.4}" height="${TRIM.h - 2 * fr - 1.4}" stroke-width="0.08"/>
</g>
<g id="gold-foil-ornements">${corners(o + fr + 0.2, o + fr + 0.2, o + TRIM.w - fr - 0.2, o + TRIM.h - fr - 0.2, 0.78)}</g>
<g id="gold-foil-texte">
<g fill="url(#or)">${text(fonts.hand, "Горбель Юлия Александровна", L, o + 11.6, 2.9)}</g>
<g fill="${C.dim}">${text(fonts.sans, "ПАРИКМАХЕР-МОДЕЛЬЕР  ·  СТАЖ БОЛЕЕ 20 ЛЕТ", L, o + 15.2, 1.1, { tracking: 0.2 })}</g>
<path d="M${L} ${o + 17}H${o + 50}" stroke="${C.gold}" stroke-opacity="0.6" stroke-width="0.14" fill="none"/>
${list}
<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="2.2" fill="none" stroke="${C.gold}" stroke-width="0.15"/>
<g fill="${C.gold}">${text(fonts.sansBold, "ЗАПИСЬ И", bc, by + 5.6, 1.35, { anchor: "middle", tracking: 0.36 })}${text(fonts.sansBold, "КОНСУЛЬТАЦИЯ", bc, by + 7.9, 1.35, { anchor: "middle", tracking: 0.3 })}</g>
${contact("MAX", "8 (995) 442-47-12", by + 14.4)}
${contact("ЗВОНКИ", "8 (991) 529-25-42", by + 21.4)}
${contact("INSTAGRAM", "@yulia.gorbel", by + 28.4)}
</g>`));

// ================= PDF avec traits de coupe =================
const SLUG = 6, PW = W + SLUG * 2, PH = H + SLUG * 2;
const t = { x0: SLUG + B, y0: SLUG + B, x1: SLUG + B + TRIM.w, y1: SLUG + B + TRIM.h };
let md = ""; const l = 3, g = 1;
for (const x of [t.x0, t.x1]) md += `M${x} ${t.y0 - g}v${-l}M${x} ${t.y1 + g}v${l}`;
for (const y of [t.y0, t.y1]) md += `M${t.x0 - g} ${y}h${-l}M${t.x1 + g} ${y}h${l}`;
const parts = (svg) => ({ defs: svg.match(/<defs>[\s\S]*?<\/defs>/)[0], body: svg.replace(/^<\?xml[^>]*>\s*<svg[^>]*>/, "").replace(/<defs>[\s\S]*?<\/defs>/, "").replace(/<\/svg>\s*$/, "") });
// ids de dégradés uniques par page (le PDF contient deux <svg> dans un même document)
const page = (svg, label, k) => { const p = parts(svg); const u = (s) => s.replace(/id="(or|filet|damas)"/g, `id="$1${k}"`).replace(/url\(#(or|filet|damas)\)/g, `url(#$1${k})`); return `<section><svg xmlns="http://www.w3.org/2000/svg" width="${PW}mm" height="${PH}mm" viewBox="0 0 ${PW} ${PH}">${u(p.defs)}<g transform="translate(${SLUG} ${SLUG})">${u(p.body)}</g><path d="${md}" stroke="#000" stroke-width="0.1" fill="none"/><g fill="#000">${text(fonts.sans, `${label} · 90x50 mm + 3 mm bleed · foil: gold-foil*`, SLUG, PH - 1.8, 1.4)}</g></svg></section>`; };

fs.mkdirSync("print", { recursive: true });
fs.writeFileSync("print/carte-ornee-recto.svg", front);
fs.writeFileSync("print/carte-ornee-verso.svg", back);
fs.writeFileSync("/tmp/card-baroque.html", `<!doctype html><meta charset="utf-8"><style>@page{size:${PW}mm ${PH}mm;margin:0}html,body{margin:0}section{width:${PW}mm;height:${PH}mm;page-break-after:always;overflow:hidden}svg{display:block}</style>${page(front, "FRONT", 1)}${page(back, "BACK", 2)}`);
console.log("svg ok");

// Carte de visite de Юлия Горбель — version noire recto/verso, sans photo, sans QR, sans adresse.
// Tous les textes sont convertis en tracés (aucune police à fournir). Usage : node scripts/business-card.mjs
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const opentype = require("opentype.js");

const TRIM = { w: 90, h: 50 }, B = 3, o = B;
const W = TRIM.w + B * 2, H = TRIM.h + B * 2;
const C = { ink: "#0B0B0D", gold: "#D6B88D", ivory: "#E9E4DB", dim: "#B9B2A6" };

const f = (pkg, name) => opentype.parse(fs.readFileSync(require.resolve(`@fontsource/${pkg}/files/${name}.woff`)).buffer.slice(0));
const pair = (pkg, base) => [f(pkg, `${base.replace("{s}", "cyrillic")}`), f(pkg, `${base.replace("{s}", "latin")}`)];
const fonts = {
  hand: pair("marck-script", "marck-script-{s}-400-normal"),           // écriture manuscrite (« Юлия »)
  caps: pair("cormorant", "cormorant-{s}-400-normal"),                  // capitales fines (« ГОРБЕЛЬ »)
  sans: pair("inter", "inter-{s}-500-normal"),
  sansBold: pair("inter", "inter-{s}-600-normal"),
};

function text(set, str, x, y, size, { anchor = "start", tracking = 0 } = {}) {
  const items = [...str].map((ch) => {
    const font = set.find((ft) => ft.charToGlyphIndex(ch) > 0) ?? set[0];
    return { font, ch, adv: (font.charToGlyph(ch).advanceWidth * size) / font.unitsPerEm };
  });
  const total = items.reduce((s, i) => s + i.adv + tracking, 0) - tracking;
  let cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  let d = "";
  for (const it of items) { d += it.font.getPath(it.ch, cx, y, size).toPathData(3); cx += it.adv + tracking; }
  return { svg: `<path d="${d}"/>`, width: total };
}
const T = (...a) => text(...a).svg;

const wrap = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">
<rect id="fond-perdu" width="${W}" height="${H}" fill="${C.ink}"/>
${body}
</svg>`;

// ---- Icônes au trait (style de l'affiche), centrées en (0,0) dans un cercle de r = 2.7 mm ----
const icons = {
  scissors: `<circle cx="-0.55" cy="1.15" r="0.5"/><circle cx="0.55" cy="1.15" r="0.5"/><path d="M-0.4 0.75 L0.75 -1.55 M0.4 0.75 L-0.75 -1.55"/>`,
  drop: `<path d="M0 -1.6 C1 -0.4 1.5 0.4 1.5 0.9 A1.5 1.5 0 0 1 -1.5 0.9 C-1.5 0.4 -1 -0.4 0 -1.6Z"/>`,
  sparkle: `<path d="M-0.35 -1.6 C-0.2 -0.5 -0.1 -0.35 1 -0.2 C-0.1 -0.05 -0.2 0.1 -0.35 1.2 C-0.5 0.1 -0.6 -0.05 -1.7 -0.2 C-0.6 -0.35 -0.5 -0.5 -0.35 -1.6Z"/><path d="M1 0.5 C1.05 0.9 1.1 0.95 1.5 1 C1.1 1.05 1.05 1.1 1 1.5 C0.95 1.1 0.9 1.05 0.5 1 C0.9 0.95 0.95 0.9 1 0.5Z"/>`,
  crown: `<path d="M-1.6 1 L-1.35 -0.9 L-0.55 0 L0 -1.3 L0.55 0 L1.35 -0.9 L1.6 1Z M-1.6 1.6H1.6"/>`,
};
const iconCircle = (cx, cy, key) => `<g transform="translate(${cx} ${cy})" fill="none" stroke="${C.gold}" stroke-width="0.17" stroke-linecap="round" stroke-linejoin="round"><circle r="2.7"/>${icons[key]}</g>`;

// ================= RECTO =================
const mid = o + TRIM.w / 2;
const front = wrap(`
<g id="gold-foil" fill="${C.gold}">
  ${T(fonts.hand, "Юлия", mid, o + 22.5, 13, { anchor: "middle" })}
  ${T(fonts.caps, "ГОРБЕЛЬ", mid, o + 31.8, 9.2, { anchor: "middle", tracking: 1.6 })}
  ${T(fonts.sans, "ПАРИКМАХЕР-МОДЕЛЬЕР", mid, o + 37.4, 1.7, { anchor: "middle", tracking: 0.6 })}
  ${T(fonts.sans, "С ЛЮБОВЬЮ К КАЖДОЙ ПРЯДИ", mid, o + 44.4, 1.85, { anchor: "middle", tracking: 0.55 })}
</g>
<g id="gold-foil-lines" fill="none" stroke="${C.gold}" stroke-width="0.18">
  <path d="M${mid - 9} ${o + 34.4}H${mid + 9}"/>
  <path d="M${mid - 11} ${o + 41.2}H${mid + 11}" stroke-width="0.12"/>
</g>
<g id="gold-foil-icon" transform="translate(${mid} ${o + 7.2}) scale(0.9)" fill="none" stroke="${C.gold}" stroke-width="0.17" stroke-linecap="round" stroke-linejoin="round">${icons.scissors}</g>
`);

// ================= VERSO =================
const L = o + 6.5;
const rows = [
  { icon: "scissors", title: "СТРИЖКИ", sub: ["Для всех, любой сложности", "Уверенная работа с детьми"] },
  { icon: "drop", title: "ОКРАШИВАНИЕ", sub: ["Сложные окрашивания"] },
  { icon: "sparkle", title: "ЗАВИВКА И КЕРАТИН", sub: ["Химическая и кератиновая завивка", "Кератиновое выпрямление волос"] },
  { icon: "crown", title: "ПРАЗДНИЧНЫЕ ПРИЧЁСКИ", sub: ["Любые праздничные прически"] },
];
const y0 = o + 22, pitch = 7.1;
const list = rows.map((r, i) => {
  const cy = y0 + i * pitch;
  const two = r.sub.length > 1;
  return `${iconCircle(L + 2.7, cy, r.icon)}
<g fill="${C.gold}">${T(fonts.sansBold, r.title, L + 6.8, cy - (two ? 0.9 : 0.25), 1.45, { tracking: 0.3 })}</g>
<g fill="${C.dim}">${r.sub.map((t, k) => T(fonts.sans, t, L + 6.8, cy + (two ? 0.95 : 1.55) + k * 1.9, 1.3)).join("")}</g>`;
}).join("\n");

// cadre « запись » à droite (comme l'encadré de l'affiche)
const bx = o + 54.5, by = o + 7.8, bw = 29, bh = 38;
const contact = (label, value, y, vs = 2.2) => `<g fill="${C.gold}">${T(fonts.sansBold, label, bx + bw / 2, y, 1.15, { anchor: "middle", tracking: 0.35 })}</g><g fill="${C.ivory}">${T(fonts.sans, value, bx + bw / 2, y + 3.1, vs, { anchor: "middle" })}</g>`;

const back = wrap(`
<g fill="${C.gold}">${T(fonts.hand, "Горбель Юлия Александровна", L, o + 11.8, 3.1)}</g>
<g fill="${C.dim}">${T(fonts.sans, "ПАРИКМАХЕР-МОДЕЛЬЕР  ·  СТАЖ БОЛЕЕ 20 ЛЕТ", L, o + 15.6, 1.2, { tracking: 0.22 })}</g>
<path d="M${L} ${o + 17.4}H${o + 49.5}" stroke="${C.gold}" stroke-width="0.14" fill="none"/>
${list}
<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="2.6" fill="none" stroke="${C.gold}" stroke-width="0.17"/>
<g fill="${C.gold}">${T(fonts.sansBold, "ЗАПИСЬ И", bx + bw / 2, by + 6.2, 1.5, { anchor: "middle", tracking: 0.4 })}${T(fonts.sansBold, "КОНСУЛЬТАЦИЯ", bx + bw / 2, by + 8.7, 1.5, { anchor: "middle", tracking: 0.4 })}</g>
<path d="M${bx + bw / 2 - 4} ${by + 10.8}H${bx + bw / 2 + 4}" stroke="${C.gold}" stroke-width="0.12" fill="none"/>
${contact("MAX", "8 (995) 442-47-12", by + 16.2)}
${contact("ЗВОНКИ", "8 (991) 529-25-42", by + 23.8)}
${contact("INSTAGRAM", "@yulia.gorbel", by + 31.4)}
`);

// ================= PDF avec traits de coupe =================
const SLUG = 6, PW = W + SLUG * 2, PH = H + SLUG * 2;
const t = { x0: SLUG + B, y0: SLUG + B, x1: SLUG + B + TRIM.w, y1: SLUG + B + TRIM.h };
let md = ""; const l = 3, g = 1;
for (const x of [t.x0, t.x1]) md += `M${x} ${t.y0 - g}v${-l}M${x} ${t.y1 + g}v${l}`;
for (const y of [t.y0, t.y1]) md += `M${t.x0 - g} ${y}h${-l}M${t.x1 + g} ${y}h${l}`;
const inner = (svg) => svg.replace(/^<\?xml[^>]*>\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const page = (svg, label) => `<section><svg xmlns="http://www.w3.org/2000/svg" width="${PW}mm" height="${PH}mm" viewBox="0 0 ${PW} ${PH}"><g transform="translate(${SLUG} ${SLUG})">${inner(svg)}</g><path d="${md}" stroke="#000" stroke-width="0.1" fill="none"/><g fill="#000">${T(fonts.sans, `${label} · 90x50 mm + 3 mm bleed · foil: gold-foil*`, SLUG, PH - 1.8, 1.4)}</g></svg></section>`;

fs.mkdirSync("print", { recursive: true });
fs.writeFileSync("print/carte-recto.svg", front);
fs.writeFileSync("print/carte-verso.svg", back);
fs.writeFileSync("/tmp/card.html", `<!doctype html><meta charset="utf-8"><style>@page{size:${PW}mm ${PH}mm;margin:0}html,body{margin:0}section{width:${PW}mm;height:${PH}mm;page-break-after:always;overflow:hidden}svg{display:block}</style>${page(front, "FRONT")}${page(back, "BACK")}`);
console.log("svg ok");

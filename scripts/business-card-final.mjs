// Carte de visite FINALE (100 x 42 mm + 3 mm de fond perdu) — reproduction de la maquette validée.
// Textes et illustrations en tracés vectoriels ; seule la photo du recto est une image (300+ dpi).
// Usage : node scripts/business-card-final.mjs  ->  print/carte-finale-v2-*.svg + /tmp/card-final2.html
import fs from "node:fs";
import sharp from "sharp";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const opentype = require("opentype.js");

const TRIM = { w: 100, h: 42 }, B = 3, o = B;
const W = TRIM.w + B * 2, H = TRIM.h + B * 2;
const C = { ink: "#0B0B0D", gold: "#D6B88D", goldHi: "#F1DCB9", goldLo: "#A98456", ivory: "#E9E4DB", dim: "#BDB6AA" };

const f = (pkg, name) => opentype.parse(fs.readFileSync(require.resolve(`@fontsource/${pkg}/files/${name}.woff`)).buffer.slice(0));
const pair = (pkg, base) => [f(pkg, base.replace("{s}", "cyrillic")), f(pkg, base.replace("{s}", "latin"))];
const fonts = {
  italic: pair("cormorant", "cormorant-{s}-500-italic"),
  caps: pair("cormorant", "cormorant-{s}-600-normal"),
  sans: pair("inter", "inter-{s}-500-normal"),
  sansBold: pair("inter", "inter-{s}-600-normal"),
};

// Sérialisation maison : toPathData d'opentype.js produit parfois « NaN » pour certains flottants.
const n3 = (v) => (+v).toFixed(3);
function pathData(path) {
  return path.commands.map((c) => c.type === "Z" ? "Z"
    : c.type === "M" || c.type === "L" ? `${c.type}${n3(c.x)} ${n3(c.y)}`
    : c.type === "Q" ? `Q${n3(c.x1)} ${n3(c.y1)} ${n3(c.x)} ${n3(c.y)}`
    : `C${n3(c.x1)} ${n3(c.y1)} ${n3(c.x2)} ${n3(c.y2)} ${n3(c.x)} ${n3(c.y)}`).join("");
}
function text(set, str, x, y, size, { anchor = "start", tracking = 0 } = {}) {
  const items = [...str].map((ch) => {
    const font = set.find((ft) => ft.charToGlyphIndex(ch) > 0) ?? set[0];
    return { font, ch, adv: (font.charToGlyph(ch).advanceWidth * size) / font.unitsPerEm };
  });
  const total = items.reduce((s, i) => s + i.adv + tracking, 0) - tracking;
  let cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  let d = "";
  for (const it of items) { d += pathData(it.font.getPath(it.ch, cx, y, size)); cx += it.adv + tracking; }
  return `<path d="${d}"/>`;
}

const defs = `<defs>
  <linearGradient id="or" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}"><stop offset="0" stop-color="${C.goldHi}"/><stop offset="0.5" stop-color="${C.gold}"/><stop offset="1" stop-color="${C.goldLo}"/></linearGradient>
  <linearGradient id="fond" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#121215"/><stop offset="1" stop-color="#050506"/></linearGradient>
</defs>`;
const wrap = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">${defs}<rect id="fond-perdu" width="${W}" height="${H}" fill="url(#fond)"/>${body}</svg>`;

const GOLD = "url(#or)";
const stroke = (w = 0.17) => `fill="none" stroke="${GOLD}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

// ---------- icônes (centrées en 0,0, ~ rayon 2 mm) ----------
const icons = {
  scissors: `<circle cx="-0.55" cy="1.15" r="0.5"/><circle cx="0.55" cy="1.15" r="0.5"/><path d="M-0.4 0.75 L0.75 -1.55 M0.4 0.75 L-0.75 -1.55"/>`,
  drop: `<path d="M-0.2 -1.6 C0.8 -0.4 1.3 0.4 1.3 0.9 A1.3 1.3 0 0 1 -1.3 0.9 C-1.3 0.4 -0.8 -0.4 -0.2 -1.6Z"/><path d="M0.1 0.3 C0.5 0.7 0.5 1 0.1 1.3" />`,
  sparkle: `<path d="M-0.35 -1.6 C-0.2 -0.5 -0.1 -0.35 1 -0.2 C-0.1 -0.05 -0.2 0.1 -0.35 1.2 C-0.5 0.1 -0.6 -0.05 -1.7 -0.2 C-0.6 -0.35 -0.5 -0.5 -0.35 -1.6Z"/><path d="M1 0.5 C1.05 0.9 1.1 0.95 1.5 1 C1.1 1.05 1.05 1.1 1 1.5 C0.95 1.1 0.9 1.05 0.5 1 C0.9 0.95 0.95 0.9 1 0.5Z"/>`,
  crown: `<path d="M-1.6 1 L-1.35 -0.9 L-0.55 0 L0 -1.3 L0.55 0 L1.35 -0.9 L1.6 1Z M-1.6 1.6H1.6"/>`,
  phone: `<path d="M-1.1 -1.5 C-1.5 -1.1 -1.5 -0.3 -0.7 0.9 C0.1 2 1 2.5 1.5 2.1 L1.9 1.6 L0.9 0.7 L0.4 1 C-0.1 0.7 -0.6 0.2 -0.9 -0.4 L-0.5 -0.8 L-1.1 -1.5Z" transform="scale(0.82) translate(-0.2 -0.4)"/>`,
  insta: `<rect x="-1.3" y="-1.3" width="2.6" height="2.6" rx="0.8"/><circle r="0.65"/><circle cx="0.85" cy="-0.85" r="0.12"/>`,
};
const iconCircle = (cx, cy, key, r = 2.35) => `<g transform="translate(${cx} ${cy})" ${stroke()}><circle r="${r}"/><g transform="scale(${(r / 2.35).toFixed(2)})">${icons[key]}</g></g>`;

// ================= RECTO =================
const ph = fs.readFileSync("print/assets/modele-photo.jpg").toString("base64");
const cx = o + 33;
const front = wrap(`
<image id="photo" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMaxYMid slice" href="data:image/jpeg;base64,${ph}"/>
<linearGradient id="fondu" gradientUnits="userSpaceOnUse" x1="${o + 36}" x2="${o + 62}" y1="0" y2="0"><stop offset="0" stop-color="#0B0B0D" stop-opacity="1"/><stop offset="1" stop-color="#0B0B0D" stop-opacity="0"/></linearGradient>
<rect x="0" y="0" width="${o + 62}" height="${H}" fill="url(#fondu)"/>
<rect x="0" y="0" width="${o + 36}" height="${H}" fill="url(#fond)"/>
<g id="gold-foil">
  <g transform="translate(${cx} ${o + 6.4}) scale(1.05)" ${stroke(0.17)}>${icons.scissors}</g>
  <g fill="${GOLD}">${text(fonts.italic, "Юлия", cx, o + 17.2, 11.5, { anchor: "middle" })}
  ${text(fonts.caps, "ГОРБЕЛЬ", cx, o + 26.4, 7.2, { anchor: "middle", tracking: 1.35 })}
  ${text(fonts.sans, "ПАРИКМАХЕР-МОДЕЛЬЕР", cx, o + 31.6, 1.55, { anchor: "middle", tracking: 0.5 })}
  ${text(fonts.sans, "С ЛЮБОВЬЮ К КАЖДОЙ ПРЯДИ", cx, o + 37.4, 1.45, { anchor: "middle", tracking: 0.42 })}</g>
  <path d="M${cx - 22.5} ${o + 31}H${cx - 16.5} M${cx + 16.5} ${o + 31}H${cx + 22.5}" ${stroke(0.14)}/>
</g>`);

// ================= VERSO =================
// Illustration au trait : visage de femme, yeux fermés, cheveux fluides (bord gauche, déborde dans le fond perdu)
const face = `<g id="gold-foil-visage" transform="translate(${o - 5.2} ${o + 3}) scale(0.86)">
  <g ${stroke(0.5)}>
    <path d="M17 1 C8 4 1.4 12 0.2 23 C-0.4 30 1.4 36.4 5.6 41"/>
    <path d="M20.6 5 C24.4 9 26 15 25 22 C24.4 26 23 29.6 21 32.6" stroke-width="0.42"/>
  </g>
  <g ${stroke(0.26)}>
    <path d="M13 3 C6.6 6.6 2.8 13.4 2.4 21 C2.2 26 3.2 31 5.4 35.4"/>
    <path d="M17 2 C10.4 6 7 12 6.6 19"/>
    <path d="M18.4 7 C22.6 11 24 17 22.6 23 C21.6 27 19.6 30 17 32"/>
    <path d="M14.4 12.6 C11.4 8.8 7.4 9 5.4 13 C3.6 17 3.8 24 5.4 30 C6.2 33 7.8 36 10 38.6"/>
    <path d="M9.6 30.6 C9.8 33.4 9.4 36.6 8.4 39 M13.6 28.6 C13.8 31.4 15 34.2 17.4 36.6"/>
  </g>
  <g ${stroke(0.24)}>
    <path d="M14.4 12.6 C15.2 15 15.2 17 15.4 18.6 C15.8 19.6 16.8 20.4 16.6 21 C16 21.5 15.3 21.4 15.2 21.9 C15.8 22.4 15.6 22.9 15 23.2 C15.6 23.6 15.6 24.2 15.1 24.6 C14.8 25.8 14.2 26.8 13 27.6 C11.4 28.4 10.2 29.2 9.4 30.4"/>
    <path d="M9.6 17.7 Q11.5 19.3 13.7 17.8" stroke-width="0.3"/><path d="M9.4 17.5 L8.6 16.8 M10.4 18.5 L9.9 19.3 M11.6 19 L11.6 19.9 M12.8 18.8 L13.1 19.7" stroke-width="0.18"/>
    <path d="M9.2 14.8 Q11.8 13.4 14.4 14.4" stroke-width="0.22"/>
  </g></g>`;

const L = o + 21;
const rows = [
  { icon: "scissors", title: "СТРИЖКИ", sub: ["Для всех, любой сложности", "Уверенная работа с детьми"] },
  { icon: "drop", title: "ОКРАШИВАНИЕ", sub: ["Сложные окрашивания"] },
  { icon: "sparkle", title: "ЗАВИВКА И КЕРАТИН", sub: ["Химическая и кератиновая завивка", "Кератиновое выпрямление волос"] },
  { icon: "crown", title: "ПРАЗДНИЧНЫЕ ПРИЧЁСКИ", sub: ["Любые праздничные прически"] },
];
const y0 = o + 17.8, pitch = 6.05;
const list = rows.map((r, i) => {
  const cy = y0 + i * pitch, two = r.sub.length > 1;
  return `${iconCircle(L + 2.3, cy, r.icon)}<g fill="${GOLD}">${text(fonts.sansBold, r.title, L + 6.4, cy - (two ? 0.8 : 0.15), 1.4, { tracking: 0.3 })}</g>
<g fill="${C.dim}">${r.sub.map((t, k) => text(fonts.sans, t, L + 6.4, cy + (two ? 0.85 : 1.45) + k * 1.75, 1.2)).join("")}</g>`;
}).join("\n");

const bx = o + 67.5, by = o + 3, bw = 29.5, bh = 36, bc = bx + bw / 2;
const contact = (label, value, y, icon, big = 1.95) => `<g fill="${GOLD}">${text(fonts.sansBold, label, bc, y, 1.05, { anchor: "middle", tracking: 0.34 })}</g>
${iconCircle(bx + 4.8, y + 3.2, icon, 1.7)}<g fill="${C.ivory}">${text(fonts.sans, value, bx + 8.6, y + 3.9, big)}</g>`;

const back = wrap(`
${face}
<g id="gold-foil-texte">
<g fill="${GOLD}">${text(fonts.italic, "Юлия Горбель", L, o + 8.6, 5.6)}</g>
<g fill="${C.dim}">${text(fonts.sans, "ПАРИКМАХЕР-МОДЕЛЬЕР  ·  СТАЖ БОЛЕЕ 20 ЛЕТ", L, o + 12, 1.15, { tracking: 0.22 })}</g>
<path d="M${L} ${o + 13.6}H${o + 62.5}" ${stroke(0.12)}/>
${list}
<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="2.6" ${stroke(0.18)}/>
<g fill="${GOLD}">${text(fonts.sansBold, "ЗАПИСЬ И", bc, by + 5.2, 1.4, { anchor: "middle", tracking: 0.38 })}${text(fonts.sansBold, "КОНСУЛЬТАЦИЯ", bc, by + 7.6, 1.4, { anchor: "middle", tracking: 0.32 })}</g>
<path d="M${bc - 7} ${by + 9.4}H${bc + 7}" ${stroke(0.12)}/>
${contact("MAX", "8 (995) 442-47-12", by + 13.0, "phone")}
${contact("ЗВОНКИ", "8 (991) 529-25-42", by + 20.6, "phone")}
${contact("INSTAGRAM", "@yulia.gorbel", by + 28.2, "insta", 2.05)}
</g>`);

// ================= PDF : fond perdu + traits de coupe =================
const SLUG = 6, PW = W + SLUG * 2, PH = H + SLUG * 2;
const t = { x0: SLUG + B, y0: SLUG + B, x1: SLUG + B + TRIM.w, y1: SLUG + B + TRIM.h };
let md = ""; const l = 3, g = 1;
for (const x of [t.x0, t.x1]) md += `M${x} ${t.y0 - g}v${-l}M${x} ${t.y1 + g}v${l}`;
for (const y of [t.y0, t.y1]) md += `M${t.x0 - g} ${y}h${-l}M${t.x1 + g} ${y}h${l}`;
const parts = (svg) => ({ defs: svg.match(/<defs>[\s\S]*?<\/defs>/)[0], body: svg.replace(/^<\?xml[^>]*>\s*<svg[^>]*>/, "").replace(/<defs>[\s\S]*?<\/defs>/, "").replace(/<\/svg>\s*$/, "") });
const page = (svg, label, k) => {
  const p = parts(svg);
  const u = (s) => s.replace(/id="(or|fond|fondu)"/g, `id="$1${k}"`).replace(/url\(#(or|fond|fondu)\)/g, `url(#$1${k})`);
  return `<section><svg xmlns="http://www.w3.org/2000/svg" width="${PW}mm" height="${PH}mm" viewBox="0 0 ${PW} ${PH}">${u(p.defs)}<g transform="translate(${SLUG} ${SLUG})">${u(p.body)}</g><path d="${md}" stroke="#000" stroke-width="0.1" fill="none"/><g fill="#000">${text(fonts.sans, `${label} · ${TRIM.w}x${TRIM.h} mm + 3 mm bleed · foil: gold-foil*`, SLUG, PH - 1.8, 1.4)}</g></svg></section>`;
};

fs.writeFileSync("print/carte-finale-v2-recto.svg", front);
fs.writeFileSync("print/carte-finale-v2-verso.svg", back);
fs.writeFileSync("/tmp/card-final2.html", `<!doctype html><meta charset="utf-8"><style>@page{size:${PW}mm ${PH}mm;margin:0}html,body{margin:0}section{width:${PW}mm;height:${PH}mm;page-break-after:always;overflow:hidden}svg{display:block}</style>${page(front, "FRONT", 1)}${page(back, "BACK", 2)}`);
console.log("svg ok", PW, PH);

```js
const n3 = (v) => (+v).toFixed(3);
function pathData(path) {                       // remplace path.toPathData()
  return path.commands.map((c) => c.type === "Z" ? "Z"
    : c.type === "M" || c.type === "L" ? `${c.type}${n3(c.x)} ${n3(c.y)}`
    : c.type === "Q" ? `Q${n3(c.x1)} ${n3(c.y1)} ${n3(c.x)} ${n3(c.y)}`
    : `C${n3(c.x1)} ${n3(c.y1)} ${n3(c.x2)} ${n3(c.y2)} ${n3(c.x)} ${n3(c.y)}`).join("");
}
```
Exemple complet : `scripts/business-card-final.mjs` et `scripts/trace-mockup.mjs` du dépôt.

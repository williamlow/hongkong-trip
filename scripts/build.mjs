import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../dist/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const path of [
  "index.html",
  "app.js",
  "data.js",
  "styles.css",
  "racing.html",
  "racing.css",
  "racing.js",
  "racing-data.js",
  "race-engine.js",
  "walk.html",
  "walk.css",
  "walk.js",
  "walk-data.js",
  "walk-utils.js",
  "neighbourhoods.html",
  "neighbourhoods.css",
  "neighbourhoods.js",
  "neighbourhood-data.js",
  "sham-shui-po.html",
  "sheung-wan.html",
  "sai-ying-pun.html",
  "wong-chuk-hang.html",
  "vendor",
  ".nojekyll",
]) {
  await cp(`${root}${path}`, new URL(path, output), { recursive: true });
}
console.log(
  "Built static site in dist/. The same files at the repository root publish directly to GitHub Pages.",
);

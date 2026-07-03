// One-off: generate retro pixel-art cursors from a character map.
// B = black outline, F = fill. Run: node scripts/gen-cursors.mjs
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const ARROW = [
  "B..........",
  "BB.........",
  "BFB........",
  "BFFB.......",
  "BFFFB......",
  "BFFFFB.....",
  "BFFFFFB....",
  "BFFFFFFB...",
  "BFFFFFFFB..",
  "BFFFFFFFFB.",
  "BFFFFFBBBB.",
  "BFFBFFB....",
  "BFB.BFFB...",
  "BB..BFFB...",
  ".....BFFB..",
  ".....BB....",
];

const SCALE = 2;

function toSvg(map, fill) {
  const h = map.length;
  const w = map[0].length;
  let rects = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = map[y][x];
      if (c === ".") continue;
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${c === "B" ? "#000" : fill}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w * SCALE}" height="${h * SCALE}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects}</svg>`;
}

await mkdir("public/cursors", { recursive: true });
// phosphor cyan for the default arrow, memo yellow for interactive targets
await sharp(Buffer.from(toSvg(ARROW, "#63e7f0"))).png().toFile("public/cursors/arrow.png");
await sharp(Buffer.from(toSvg(ARROW, "#f2d94e"))).png().toFile("public/cursors/point.png");
console.log("cursors generated");

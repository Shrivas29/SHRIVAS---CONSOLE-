// One-off: subset the console's fonts to exactly the glyphs it uses.
// A full JP family ships ~120 unicode-range files (~2MB); this emits tiny woff2s.
// Run: node scripts/subset-fonts.mjs
// Expects TTFs in /tmp: DotGothic16-Regular.ttf, ZenKaku-Regular.ttf, ZenKaku-Bold.ttf
import { readFile, writeFile } from "node:fs/promises";
import subsetFont from "subset-font";

const ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("");
const EXTRA = "·×Ø—…→↻∞⏭─█▪▼◑♪♫✕★●◉‹›⏻ァオカガクゲシジスタッテトホムムュリンヴー’‘“”";

const jobs = [
  ["/tmp/DotGothic16-Regular.ttf", "public/fonts/DotGothic16-subset.woff2"],
  ["/tmp/ZenKaku-Regular.ttf", "public/fonts/ZenKaku-Regular-subset.woff2"],
  ["/tmp/ZenKaku-Bold.ttf", "public/fonts/ZenKaku-Bold-subset.woff2"],
];

for (const [src, out] of jobs) {
  const woff2 = await subsetFont(await readFile(src), ASCII + EXTRA, {
    targetFormat: "woff2",
  });
  await writeFile(out, woff2);
  console.log(out, woff2.length, "bytes");
}

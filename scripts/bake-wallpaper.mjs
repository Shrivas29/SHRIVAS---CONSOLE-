// One-off asset bake: duotone the messy-room wallpaper toward the CRT palette
// and convert portrait/poster assets to webp. Run: node scripts/bake-wallpaper.mjs
import sharp from "sharp";

const RAW = "public/images/raw";
const OUT = "public/images";

const bakeWallpaper = async (width, name) =>
  sharp(`${RAW}/wonderlane-6jA6eVsRJ6Q-unsplash.jpg`)
    .resize({ width })
    .modulate({ saturation: 0.25 })
    .tint({ r: 70, g: 140, b: 150 })
    .linear(0.62, -8)
    .webp({ quality: 78 })
    .toFile(`${OUT}/${name}`);

const toWebp = async (src, name, width = 1200) =>
  sharp(`${RAW}/${src}`)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${OUT}/${name}`);

await bakeWallpaper(1920, "wallpaper.webp");
await bakeWallpaper(828, "wallpaper-mobile.webp");
await toWebp("WhatsApp Image 2026-06-24 at 11.07.29.jpeg", "portrait-ento.webp");
await toWebp("WhatsApp Image 2026-06-24 at 11.07.06.jpeg", "poster-ento.webp");
console.log("baked:", OUT);

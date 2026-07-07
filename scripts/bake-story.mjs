// Bake Shrivas's real photos into the console's cyan-phosphor language.
// Desk → the home-screen wallpaper; the rest → STORY beats. Run:
//   node scripts/bake-story.mjs
import sharp from "sharp";

const RAW = "public/images/raw";
const OUT = "public/images";

// teal duotone matching the wallpaper, kept bright so faces read clearly
const duotone = (img) =>
  img.modulate({ saturation: 0.28 }).tint({ r: 82, g: 152, b: 162 });

// wallpaper: the real desk, cyan-duotoned and darkened so text reads over it
const bakeWall = (width, name) =>
  sharp(`${RAW}/desk.jpeg`)
    .resize({ width })
    .modulate({ saturation: 0.22 })
    .tint({ r: 70, g: 140, b: 150 })
    .linear(0.6, -10)
    .webp({ quality: 78 })
    .toFile(`${OUT}/${name}`);

const bakeStory = (src, name, width = 900) =>
  duotone(sharp(`${RAW}/${src}`).resize({ width, withoutEnlargement: true }))
    .webp({ quality: 82 })
    .toFile(`${OUT}/${name}`);

await bakeWall(1920, "wallpaper.webp");
await bakeWall(828, "wallpaper-mobile.webp");
await bakeStory("baby.jpeg", "story-baby.webp", 760);
await bakeStory("triptych.jpeg", "story-fork.webp", 900);
await bakeStory("stage.png", "story-award.webp", 900);
await bakeStory("blurry.jpeg", "story-next.webp", 900);
console.log("story + wallpaper baked");

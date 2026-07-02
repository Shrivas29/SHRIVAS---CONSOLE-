// One-off: crop real album art from user-dropped reference images into
// square webp covers for the NOW PLAYING widget. Run: node scripts/bake-covers.mjs
import sharp from "sharp";

const RAW = "public/images/raw";
const OUT = "public/images";

// Sloppy Joe (slayr): source screenshot missing — re-drop it into
// public/images/raw and re-enable this block.
// await sharp(`${RAW}/<spotify screenshot>.png`)
//   .extract({ left: 30, top: 30, width: 790, height: 776 })
//   .resize(640, 640, { fit: "cover" })
//   .webp({ quality: 82 })

// A$AP Rocky — B&W portrait, square crop on the face
await sharp(`${RAW}/_ (4).jpeg`)
  .extract({ left: 0, top: 170, width: 675, height: 675 })
  .resize(640, 640, { fit: "cover" })
  .webp({ quality: 82 })
  .toFile(`${OUT}/cover-alla.webp`);

console.log("covers baked");

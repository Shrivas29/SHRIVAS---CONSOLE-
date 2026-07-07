// Warm the browser cache while the visitor reads the boot screen, so every
// window opens with its imagery already local. Order = likelihood of need.
const ASSETS = [
  "/images/wallpaper.webp",
  "/images/wallpaper-mobile.webp",
  "/images/portrait-ento.webp",
  "/images/poster-ento.webp",
  "/images/story-baby.webp",
  "/images/story-fork.webp",
  "/images/story-award.webp",
  "/images/story-next.webp",
  "/images/cover-sos.webp",
  "/images/cover-alla.webp",
  "/images/cover-chairs.webp",
  "/images/cover-neon.webp",
  "/images/cover-glow.webp",
];

let done = false;

export function prefetchAssets(): void {
  if (done || typeof window === "undefined") return;
  done = true;
  for (const src of ASSETS) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  }
}

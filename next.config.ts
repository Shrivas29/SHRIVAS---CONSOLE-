import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All raster assets are hand-baked to their display size (scripts/*.mjs).
  // Serving them directly skips Vercel's cold image-optimizer pass, which
  // added 2-3s to first paint of widget images.
  images: { unoptimized: true },
};

export default nextConfig;

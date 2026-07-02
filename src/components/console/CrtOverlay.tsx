"use client";

// Pure-CSS CRT pass: scanlines + vignette + gentle flicker. Sits above
// everything, never intercepts input. Toggled by the boot-config CRT switch.
export default function CrtOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      {/* scanlines */}
      <div
        className="absolute inset-0 motion-safe:animate-[crt-flicker_1.4s_ease-in-out_infinite]"
        style={{
          opacity: 0.07,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #000 2px, #000 3px)",
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.38) 100%)",
        }}
      />
    </div>
  );
}

"use client";

// Task 6 builds the real desktop; this stub proves the boot → desktop gate.
export default function Desktop() {
  return (
    <main
      data-testid="desktop"
      className="grid min-h-dvh place-items-center bg-crt-black"
    >
      <p className="font-dot tracking-[0.3em] text-phosphor-dim">
        LOADING DESKTOP…
      </p>
    </main>
  );
}

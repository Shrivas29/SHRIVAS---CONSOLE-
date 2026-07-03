"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// idle time before the saver kicks in (?fastidle shortens it for testing)
const idleMs = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("fastidle")
    ? 2500
    : 45_000;

const WAKE_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];

export default function Screensaver() {
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const logoRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // idle detection
  useEffect(() => {
    let timer = window.setTimeout(() => setActive(true), idleMs());
    const wake = () => {
      setActive(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setActive(true), idleMs());
    };
    for (const e of WAKE_EVENTS) window.addEventListener(e, wake, { passive: true });
    return () => {
      window.clearTimeout(timer);
      for (const e of WAKE_EVENTS) window.removeEventListener(e, wake);
    };
  }, []);

  // DVD bounce
  useEffect(() => {
    if (!active || reduced) return;
    const logo = logoRef.current;
    const overlay = overlayRef.current;
    if (!logo || !overlay) return;
    let x = 40;
    let y = 80;
    let vx = 110;
    let vy = 90;
    let last = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const bw = overlay.clientWidth - logo.offsetWidth;
      const bh = overlay.clientHeight - logo.offsetHeight;
      x += vx * dt;
      y += vy * dt;
      if (x <= 0 || x >= bw) vx *= -1;
      if (y <= 0 || y >= bh) vy *= -1;
      x = Math.max(0, Math.min(x, bw));
      y = Math.max(0, Math.min(y, bh));
      logo.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      data-testid="screensaver"
      aria-hidden="true"
      className="fixed inset-0 z-[45] overflow-hidden bg-black/[0.97]"
    >
      <div
        ref={logoRef}
        className={reduced ? "grid h-full place-items-center" : "w-fit"}
      >
        <div className="p-2 text-center">
          <p className="font-segment text-3xl text-phosphor">SHRIVAS PS</p>
          <p className="font-dot mt-1 text-[10px] tracking-[0.3em] text-phosphor-dim">
            IDLE · ANY INPUT TO WAKE
          </p>
        </div>
      </div>
    </div>
  );
}

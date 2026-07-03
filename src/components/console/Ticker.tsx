"use client";

import { headlines } from "@/content/ticker";
import { useOS } from "@/store/os";

export default function Ticker() {
  const played = useOS((s) => s.played);
  const complete = Object.values(played).every(Boolean);
  const line = (
    complete
      ? ["VISITOR ACHIEVES 100% COMPLETION — THE CONSOLE APPROVES", ...headlines]
      : headlines
  ).join("  ///  ");
  return (
    <div
      aria-label="Breaking news ticker"
      className="fixed inset-x-0 bottom-12 z-30 overflow-hidden border-y border-alert/60 bg-alert"
    >
      <div
        className="flex w-max hover:[animation-play-state:paused] motion-safe:animate-[ticker-scroll_38s_linear_infinite]"
      >
        {[0, 1].map((i) => (
          <p
            key={i}
            aria-hidden={i === 1}
            className="font-dot whitespace-pre px-4 py-1.5 text-sm tracking-[0.15em] text-ink"
          >
            {"BREAKING NEWS  ///  "}
            {line}
            {"  ///  "}
          </p>
        ))}
      </div>
    </div>
  );
}

"use client";

import { headlines, timeHeadline } from "@/content/ticker";
import { useOS } from "@/store/os";

export default function Ticker() {
  const played = useOS((s) => s.played);
  const playerName = useOS((s) => s.playerName);
  const complete = Object.values(played).every(Boolean);
  const items = [...headlines];
  const timed = timeHeadline(new Date().getHours());
  if (timed) items.splice(2, 0, timed);
  if (playerName)
    items.unshift(`PLAYER ${playerName} REFUSES TO STOP CLICKING, WITNESSES SAY`);
  if (complete)
    items.unshift("VISITOR ACHIEVES 100% COMPLETION — THE CONSOLE APPROVES");
  const line = items.join("  ///  ");
  return (
    <div
      aria-label="Breaking news ticker"
      className="fixed left-[var(--bezel)] right-[var(--bezel)] bottom-[calc(3rem+var(--bezel))] z-30
        overflow-hidden border-y border-alert/60 bg-alert"
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

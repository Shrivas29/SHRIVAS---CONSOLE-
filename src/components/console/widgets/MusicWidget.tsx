"use client";

import { useState } from "react";
import { rotation } from "@/content/music";
import { playSound } from "@/lib/sound";
import { useOS } from "@/store/os";

export default function MusicWidget() {
  const [i, setI] = useState(0);
  const audio = useOS((s) => s.config.audio);
  const track = rotation[i];

  const next = () => {
    playSound("open", audio);
    setI((i + 1) % rotation.length);
  };

  return (
    <div className="space-y-4">
      <div
        className="relative grid aspect-square place-items-center border border-phosphor-dim"
        style={{ background: track.bg }}
      >
        {/* grain pass, echoing the SOS / TESTING cover language */}
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
        <span className="font-segment text-[clamp(3rem,10vw,5rem)]" style={{ color: track.fg }}>
          {track.mark}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-dot text-xs tracking-[0.3em] text-phosphor">NOW PLAYING</p>
          <p className="font-zen mt-1 font-bold text-ink">
            {track.title} — {track.artist}
          </p>
          <p className="font-zen text-sm text-ink-muted">{track.note}</p>
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next track"
          className="focus-brackets font-dot h-11 w-11 shrink-0 cursor-pointer border
            border-phosphor text-phosphor transition-colors duration-150
            hover:bg-phosphor hover:text-crt-black"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}

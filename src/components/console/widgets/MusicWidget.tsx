"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { rotation } from "@/content/music";
import { playSound } from "@/lib/sound";
import { useOS } from "@/store/os";
import { useMediaQuery } from "@/lib/useMediaQuery";

const SWIPE_PX = 60;

export default function MusicWidget() {
  const [i, setI] = useState(0);
  const audio = useOS((s) => s.config.audio);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const track = rotation[i];

  const step = (dir: 1 | -1) => {
    playSound("open", audio);
    setI((i + dir + rotation.length) % rotation.length);
  };

  const onSwipe = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_PX) step(1);
    else if (info.offset.x > SWIPE_PX) step(-1);
  };

  return (
    <div className={isMobile ? "flex h-full flex-col gap-4" : "space-y-4"}>
      <motion.div
        className={`relative grid touch-pan-y place-items-center overflow-hidden border border-phosphor-dim
          ${isMobile ? "min-h-0 w-full flex-1" : "aspect-square"}`}
        style={{ background: track.bg }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        dragMomentum={false}
        onDragEnd={isMobile ? onSwipe : undefined}
      >
        {track.cover && (
          <Image
            src={track.cover.src}
            alt={track.cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="pointer-events-none object-cover"
          />
        )}
        {/* grain pass over everything — the SOS / ALLA texture language */}
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
        {!track.cover && (
          <span className="font-segment text-[clamp(3rem,10vw,5rem)]" style={{ color: track.fg }}>
            {track.mark}
          </span>
        )}
      </motion.div>

      <div className="flex shrink-0 items-end justify-between gap-3">
        <div>
          <p className="font-dot text-xs tracking-[0.3em] text-phosphor">
            NOW PLAYING
            {isMobile && (
              <span className="ml-2 text-[9px] tracking-[0.2em] text-phosphor-dim">
                ‹ SWIPE ›
              </span>
            )}
          </p>
          <p className="font-zen mt-1 font-bold text-ink">
            {track.title} — {track.artist}
          </p>
          <p className="font-zen text-sm text-ink-muted">{track.note}</p>
        </div>
        <button
          type="button"
          onClick={() => step(1)}
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

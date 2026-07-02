"use client";

import Image from "next/image";
import { useState } from "react";
import { storyBeats } from "@/content/story";
import { playSound } from "@/lib/sound";
import { useOS } from "@/store/os";

export default function StoryWidget() {
  const [i, setI] = useState(0);
  const audio = useOS((s) => s.config.audio);
  const beat = storyBeats[i];
  const last = i === storyBeats.length - 1;

  const advance = () => {
    playSound("click", audio);
    setI(last ? 0 : i + 1);
  };

  return (
    <div className="space-y-4">
      {beat.img && (
        <Image
          src={beat.img.src}
          alt={beat.img.alt}
          width={640}
          height={800}
          className="max-h-56 w-full border border-phosphor-dim object-cover object-top"
        />
      )}
      <button
        type="button"
        onClick={advance}
        aria-label={last ? "Restart story" : "Next story line"}
        className="focus-brackets block w-full cursor-pointer border border-phosphor-dim
          bg-black/40 p-4 text-left transition-colors duration-150 hover:border-phosphor"
      >
        <p className="font-dot text-xs tracking-[0.3em] text-phosphor">
          {beat.speaker}
        </p>
        <p className="font-zen mt-2 text-ink">{beat.line}</p>
        <p className="font-dot mt-3 text-right text-xs text-phosphor-dim">
          {last ? "↻ REWIND" : "▼ NEXT"} · {i + 1}/{storyBeats.length}
        </p>
      </button>
    </div>
  );
}

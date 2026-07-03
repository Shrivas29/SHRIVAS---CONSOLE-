"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { storyBeats } from "@/content/story";
import { playSound } from "@/lib/sound";
import { useOS } from "@/store/os";

const TYPE_MS = 18;

export default function StoryWidget() {
  const [i, setI] = useState(0);
  const [chars, setChars] = useState(0);
  const audio = useOS((s) => s.config.audio);
  const reduced = useReducedMotion();
  const beat = storyBeats[i];
  const last = i === storyBeats.length - 1;
  const typing = !reduced && chars < beat.line.length;

  // JRPG textbox: letters arrive one at a time; a click reveals the rest
  useEffect(() => {
    if (reduced) {
      setChars(beat.line.length);
      return;
    }
    setChars(0);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      // soft key-tick every third letter, in the machine's voice
      if (n % 3 === 0 && n < beat.line.length)
        playSound("tick", useOS.getState().config.audio);
      setChars((c) => {
        if (c >= beat.line.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [i, beat.line, reduced]);

  const advance = () => {
    playSound("click", audio);
    if (typing) {
      setChars(beat.line.length); // skip the crawl
      return;
    }
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
          className="max-h-64 w-full border border-phosphor-dim object-cover object-[center_32%]"
        />
      )}
      <button
        type="button"
        onClick={advance}
        aria-label={typing ? "Reveal full line" : last ? "Restart story" : "Next story line"}
        className="focus-brackets block w-full cursor-pointer border border-phosphor-dim
          bg-black/40 p-4 text-left transition-colors duration-150 hover:border-phosphor"
      >
        <p className="font-dot text-xs tracking-[0.3em] text-phosphor">
          {beat.speaker}
        </p>
        <p className="font-zen mt-2 min-h-[3.4em] text-ink">
          {beat.line.slice(0, chars)}
          {typing && (
            <span aria-hidden="true" className="text-phosphor">
              ▌
            </span>
          )}
        </p>
        <p className="font-dot mt-3 text-right text-xs text-phosphor-dim">
          <span
            aria-hidden="true"
            className={typing ? "opacity-0" : "motion-safe:animate-[crt-blink_1.1s_steps(1)_infinite]"}
          >
            ▼
          </span>{" "}
          {typing ? "…" : last ? "↻ REWIND" : "NEXT"} · {i + 1}/{storyBeats.length}
        </p>
      </button>
    </div>
  );
}

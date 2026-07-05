"use client";

import Image from "next/image";
import { ento } from "@/content/ento";

export default function EntoWidget() {
  return (
    <div className="space-y-4">
      <Image
        src={ento.poster.src}
        alt={ento.poster.alt}
        width={640}
        height={780}
        className="max-h-64 w-full border border-phosphor-dim object-cover object-[center_28%]"
      />
      <p className="font-dot text-sm tracking-[0.2em] text-memo">{ento.tagline}</p>
      <p className="font-zen text-ink">{ento.body}</p>
      <p className="font-dot border-y border-phosphor-dim/40 py-2 text-center text-xs tracking-[0.25em] text-phosphor">
        {ento.services}
      </p>
      <p className="font-zen text-sm text-ink-muted">{ento.foundingStat}</p>
      {ento.accepting && (
        <p className="font-dot text-xs tracking-[0.25em] text-memo">
          <span className="motion-safe:animate-[crt-blink_1.4s_steps(1)_infinite]">●</span>{" "}
          ACCEPTING QUESTS: YES
        </p>
      )}
      <a
        href={ento.url}
        target="_blank"
        rel="noopener"
        className="focus-brackets font-dot block min-h-11 cursor-pointer border border-phosphor
          bg-phosphor/15 p-3 text-center text-sm tracking-[0.2em] text-phosphor
          transition-colors duration-150 hover:bg-phosphor hover:text-crt-black"
      >
        {ento.cta}
      </a>
    </div>
  );
}

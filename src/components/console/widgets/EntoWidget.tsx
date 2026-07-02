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
        className="max-h-64 w-full border border-phosphor-dim object-cover object-top"
      />
      <p className="font-dot text-sm tracking-[0.2em] text-memo">{ento.tagline}</p>
      <p className="font-zen text-ink">{ento.body}</p>
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

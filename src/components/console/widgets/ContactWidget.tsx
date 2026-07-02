"use client";

import { cables } from "@/content/contact";

export default function ContactWidget() {
  return (
    <div className="space-y-4">
      <p className="font-zen text-ink">
        Four cables out of this machine. Plug into any of them.
      </p>
      <ul className="space-y-px">
        {cables.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener"
              className="focus-brackets flex min-h-11 cursor-pointer items-center justify-between
                border border-phosphor-dim px-4 transition-colors duration-150
                hover:border-phosphor hover:bg-phosphor/10"
            >
              <span className="font-dot text-xs tracking-[0.3em] text-phosphor">
                {c.label}
              </span>
              <span className="font-zen text-sm text-ink">{c.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

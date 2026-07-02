"use client";

import { useEffect } from "react";
import { useOS } from "@/store/os";
import { playSound } from "@/lib/sound";

const BOOT_CHECKS = [
  ["MEM CHECK", "OK"],
  ["SOUND CHIP", "READY"],
  ["CARTRIDGES", "5 DETECTED"],
] as const;

function ToggleRow({
  label,
  hint,
  checked,
  onToggle,
  delay,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onToggle: () => void;
  delay: string;
}) {
  return (
    <div className="boot-rise" style={{ animationDelay: delay }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onToggle}
        className="focus-brackets font-dot group flex min-h-12 w-full cursor-pointer items-center
          justify-between gap-3 border border-phosphor bg-transparent px-4 text-sm
          tracking-[0.2em] text-phosphor transition-colors duration-150 hover:bg-phosphor/10"
      >
        <span className="flex items-baseline gap-3">
          {label}
          <span className="hidden text-[10px] tracking-[0.15em] text-phosphor-dim sm:inline">
            {hint}
          </span>
        </span>
        <span className="flex items-center gap-2">
          {/* switch track: two hardware cells */}
          <span aria-hidden="true" className="flex gap-px">
            <span
              className={`h-3 w-5 border border-phosphor-dim transition-colors duration-150 ${checked ? "bg-phosphor" : "bg-transparent"}`}
            />
            <span
              className={`h-3 w-5 border border-phosphor-dim transition-colors duration-150 ${checked ? "bg-transparent" : "bg-phosphor-dim/40"}`}
            />
          </span>
          <span className={`w-8 text-right ${checked ? "" : "text-phosphor-dim"}`}>
            {checked ? "ON" : "OFF"}
          </span>
        </span>
      </button>
    </div>
  );
}

export default function BootScreen() {
  const { config, toggleAudio, toggleCrt, start } = useOS();

  const handleStart = () => {
    playSound("boot", config.audio);
    start();
  };

  // hardware hook: ENTER boots the console (ignore key events on the toggles)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (e.target instanceof HTMLElement && e.target.closest("button")) return;
      handleStart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.audio]);

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-crt-black p-4">
      {/* phosphor haze behind the panel — tube glow, not decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 48%, oklch(0.82 0.14 200 / 0.07), transparent 70%)",
        }}
      />
      {/* one slow scan line drifting down the tube */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-16
          bg-gradient-to-b from-transparent via-phosphor/[0.04] to-transparent
          motion-safe:animate-[scan-sweep_9s_linear_infinite]"
      />

      <div
        className="relative w-full max-w-xl border-2 border-phosphor bg-black p-8 sm:p-12"
        style={{ boxShadow: "0 0 42px oklch(0.82 0.14 200 / 0.14)" }}
      >
        <p
          className="boot-rise font-dot text-xs tracking-[0.35em] text-phosphor-dim"
          style={{ animationDelay: "0.1s" }}
        >
          シュリヴァス-64 SYSTEM CONFIGURATION
        </p>

        <h1
          className="boot-rise font-segment mt-3 text-[clamp(1.9rem,6vw,3.4rem)] whitespace-nowrap text-phosphor"
          style={{
            animationDelay: "0.25s",
            textShadow: "0 0 18px oklch(0.82 0.14 200 / 0.45)",
          }}
        >
          SHRIVAS-64
          <span
            aria-hidden="true"
            className="ml-2 inline-block h-[0.75em] w-[0.45em] translate-y-[0.08em] bg-phosphor
              motion-safe:animate-[crt-blink_1.1s_steps(1)_infinite]"
          />
        </h1>

        {/* boot checks — the machine proving it has something inside */}
        <ul className="font-dot mt-5 space-y-1 text-[11px] tracking-[0.25em]">
          {BOOT_CHECKS.map(([label, result], i) => (
            <li
              key={label}
              className="boot-rise flex justify-between text-phosphor-dim"
              style={{ animationDelay: `${0.4 + i * 0.12}s` }}
            >
              <span>{label}</span>
              <span className="text-phosphor">{result}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 space-y-px">
          <ToggleRow
            label="AUDIO"
            hint="BLIPS + BOOT JINGLE"
            checked={config.audio}
            delay="0.85s"
            onToggle={() => {
              toggleAudio();
              // preview blip only when switching ON
              playSound("click", !config.audio);
            }}
          />
          <ToggleRow
            label="CRT MODE"
            hint="SCANLINES + FLICKER"
            checked={config.crt}
            delay="0.95s"
            onToggle={toggleCrt}
          />
        </div>

        <div className="boot-rise mt-8" style={{ animationDelay: "1.1s" }}>
          <button
            type="button"
            onClick={handleStart}
            className="focus-brackets font-dot group min-h-13 w-full cursor-pointer border
              border-phosphor bg-phosphor/15 px-4 py-3 text-sm tracking-[0.35em] text-phosphor
              transition-colors duration-150 hover:bg-phosphor hover:text-crt-black
              motion-safe:animate-[start-pulse_2.4s_ease-in-out_infinite]"
          >
            <span
              aria-hidden="true"
              className="mr-3 inline-block motion-safe:animate-[crt-blink_1.1s_steps(1)_infinite]"
            >
              ▶
            </span>
            START
          </button>
          <p
            className="font-dot mt-2 hidden text-center text-[10px] tracking-[0.3em] text-phosphor-dim sm:block"
            aria-hidden="true"
          >
            OR PRESS ENTER
          </p>
        </div>

        <p
          className="boot-rise font-dot mt-6 text-right text-[11px] tracking-widest text-phosphor-dim"
          style={{ animationDelay: "1.25s" }}
          aria-hidden="true"
        >
          v6.4.0 · one owner · no resets
        </p>
      </div>
    </main>
  );
}

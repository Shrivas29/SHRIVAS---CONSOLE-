"use client";

import { useOS } from "@/store/os";
import { playSound } from "@/lib/sound";

function ToggleRow({
  label,
  checked,
  onToggle,
  delay,
}: {
  label: string;
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
        className="focus-brackets font-dot flex min-h-11 w-full cursor-pointer items-center
          justify-between border border-phosphor bg-transparent px-4 text-sm tracking-[0.2em]
          text-phosphor transition-colors duration-150 hover:bg-phosphor/10"
      >
        <span>{label}</span>
        <span className={checked ? "" : "text-phosphor-dim"}>
          {checked ? "ON" : "OFF"}
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

  return (
    <main className="grid min-h-dvh place-items-center bg-crt-black p-4">
      <div className="w-full max-w-xl border-2 border-phosphor bg-black p-8 sm:p-12">
        <p
          className="boot-rise font-dot text-xs tracking-[0.35em] text-phosphor-dim"
          style={{ animationDelay: "0.1s" }}
        >
          シュリヴァス-64 SYSTEM CONFIGURATION
        </p>

        <h1
          className="boot-rise font-segment mt-3 text-[clamp(2.2rem,7vw,4rem)] text-phosphor"
          style={{ animationDelay: "0.25s" }}
        >
          SHRIVAS-64
        </h1>

        <div className="mt-8 space-y-px">
          <ToggleRow
            label="AUDIO"
            checked={config.audio}
            delay="0.45s"
            onToggle={() => {
              toggleAudio();
              // preview blip only when switching ON
              playSound("click", !config.audio);
            }}
          />
          <ToggleRow
            label="CRT MODE"
            checked={config.crt}
            delay="0.55s"
            onToggle={toggleCrt}
          />
        </div>

        <div className="boot-rise mt-8" style={{ animationDelay: "0.7s" }}>
          <button
            type="button"
            onClick={handleStart}
            className="focus-brackets font-dot min-h-12 w-full cursor-pointer border
              border-phosphor bg-phosphor/15 px-4 text-sm tracking-[0.35em] text-phosphor
              transition-colors duration-150 hover:bg-phosphor hover:text-crt-black"
          >
            START →
          </button>
        </div>

        <p
          className="boot-rise font-dot mt-6 text-right text-[11px] tracking-widest text-phosphor-dim"
          style={{ animationDelay: "0.85s" }}
          aria-hidden="true"
        >
          v6.4.0 · one owner · no resets
        </p>
      </div>
    </main>
  );
}

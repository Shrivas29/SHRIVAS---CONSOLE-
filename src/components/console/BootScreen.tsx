"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useOS } from "@/store/os";
import { playSound } from "@/lib/sound";

const row = {
  hidden: { opacity: 0, y: 6 },
  shown: { opacity: 1, y: 0 },
};

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div variants={row}>
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
    </motion.div>
  );
}

export default function BootScreen() {
  const { config, toggleAudio, toggleCrt, start } = useOS();
  const reduced = useReducedMotion();

  const handleStart = () => {
    playSound("boot", config.audio);
    start();
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-crt-black p-4">
      <motion.div
        initial={reduced ? "shown" : "hidden"}
        animate="shown"
        variants={{
          shown: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
        }}
        className="w-full max-w-xl border-2 border-phosphor bg-black p-8 sm:p-12"
      >
        <motion.p
          variants={row}
          className="font-dot text-xs tracking-[0.35em] text-phosphor-dim"
        >
          シュリヴァス-64 SYSTEM CONFIGURATION
        </motion.p>

        <motion.h1
          variants={row}
          className="font-segment mt-3 text-[clamp(2.2rem,7vw,4rem)] text-phosphor"
        >
          SHRIVAS-64
        </motion.h1>

        <motion.div variants={row} className="mt-8 space-y-px">
          <ToggleRow
            label="AUDIO"
            checked={config.audio}
            onToggle={() => {
              toggleAudio();
              // preview blip only when switching ON
              playSound("click", !config.audio);
            }}
          />
          <ToggleRow label="CRT MODE" checked={config.crt} onToggle={toggleCrt} />
        </motion.div>

        <motion.div variants={row} className="mt-8">
          <button
            type="button"
            onClick={handleStart}
            className="focus-brackets font-dot min-h-12 w-full cursor-pointer border
              border-phosphor bg-phosphor/15 px-4 text-sm tracking-[0.35em] text-phosphor
              transition-colors duration-150 hover:bg-phosphor hover:text-crt-black"
          >
            START →
          </button>
        </motion.div>

        <motion.p
          variants={row}
          className="font-dot mt-6 text-right text-[11px] tracking-widest text-phosphor-dim"
          aria-hidden="true"
        >
          v6.4.0 · one owner · no resets
        </motion.p>
      </motion.div>
    </main>
  );
}

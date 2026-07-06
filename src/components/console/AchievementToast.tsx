"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ACHIEVEMENTS, useAchievements } from "@/store/achievements";
import { playSound } from "@/lib/sound";
import { useOS } from "@/store/os";

const TOAST_MS = 3200;

export default function AchievementToast() {
  const queue = useAchievements((s) => s.queue);
  const shiftToast = useAchievements((s) => s.shiftToast);
  const audio = useOS((s) => s.config.audio);
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    playSound("open", audio);
    const id = window.setTimeout(shiftToast, TOAST_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-[calc(1rem+var(--bezel))] top-[calc(1rem+var(--bezel))] z-[47]"
    >
      <AnimatePresence>
        {current && (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="border-2 border-memo bg-black/95 px-4 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.6)]"
          >
            <p className="font-dot text-[10px] tracking-[0.3em] text-memo">
              ★ ACHIEVEMENT UNLOCKED
            </p>
            <p className="font-dot mt-1 text-sm tracking-[0.2em] text-ink">
              {ACHIEVEMENTS[current]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { RefObject } from "react";
import { useOS, type WidgetId } from "@/store/os";
import { playSound } from "@/lib/sound";

type WindowProps = {
  id: WidgetId;
  title: string;
  children: React.ReactNode;
  dragRef: RefObject<HTMLDivElement | null>;
  /** art-directed desktop position, e.g. { left: "8%", top: "12%" } */
  position: { left?: string; right?: string; top?: string; bottom?: string };
  width?: string;
  isMobile: boolean;
};

export default function Window({
  id,
  title,
  children,
  dragRef,
  position,
  width = "26rem",
  isMobile,
}: WindowProps) {
  const z = useOS((s) => s.windows[id].z);
  const closeWindow = useOS((s) => s.closeWindow);
  const focusWindow = useOS((s) => s.focusWindow);
  const audio = useOS((s) => s.config.audio);
  const reduced = useReducedMotion();

  const handleClose = () => {
    playSound("close", audio);
    closeWindow(id);
  };

  return (
    <motion.section
      role="dialog"
      aria-label={title}
      drag={!isMobile && !reduced}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragRef}
      onPointerDown={() => focusWindow(id)}
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={
        isMobile
          ? "fixed inset-0 flex flex-col bg-crt-well"
          : "absolute flex max-h-[80dvh] flex-col border border-phosphor bg-crt-well shadow-[6px_6px_0_rgba(0,0,0,0.55)]"
      }
      style={isMobile ? { zIndex: 20 + z } : { ...position, width, zIndex: 20 + z }}
    >
      <header
        className="flex min-h-11 shrink-0 cursor-grab items-center justify-between
          border-b border-phosphor bg-black/40 pl-4 active:cursor-grabbing"
      >
        <h2 className="font-dot text-sm tracking-[0.25em] text-phosphor">
          {title}
        </h2>
        <button
          type="button"
          aria-label={`Close ${title}`}
          onClick={handleClose}
          onPointerDown={(e) => e.stopPropagation()}
          className="focus-brackets font-dot grid h-11 w-11 cursor-pointer place-items-center
            text-phosphor transition-colors duration-150 hover:bg-alert hover:text-ink"
        >
          ✕
        </button>
      </header>
      <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
    </motion.section>
  );
}

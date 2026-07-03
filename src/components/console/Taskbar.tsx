"use client";

import { useEffect, useState } from "react";
import { useOS, type WidgetId } from "@/store/os";

const TAB_LABELS: Record<WidgetId, string> = {
  story: "STORY",
  ento: "ENTØ",
  music: "MUSIC",
  stats: "STATS",
  contact: "LINK",
};

export default function Taskbar({ onClockTriple }: { onClockTriple: () => void }) {
  const { config, toggleAudio, toggleCrt, focusWindow } = useOS();
  const windows = useOS((s) => s.windows);
  const played = useOS((s) => s.played);
  const openIds = (Object.keys(windows) as WidgetId[]).filter(
    (id) => windows[id].open,
  );
  const topId =
    openIds.length === 0
      ? null
      : openIds.reduce((a, b) => (windows[a].z >= windows[b].z ? a : b));
  const playedCount = Object.values(played).filter(Boolean).length;
  const [time, setTime] = useState("");
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  const handleClock = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 3) {
      setClicks(0);
      onClockTriple();
    }
  };

  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-30 flex min-h-12 items-stretch
        border-t border-phosphor bg-black/80 backdrop-blur-[2px]"
    >
      <div className="flex flex-1 items-stretch gap-px overflow-x-auto">
        {openIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => focusWindow(id)}
            aria-current={id === topId || undefined}
            className={`focus-brackets font-dot min-w-11 cursor-pointer border-r border-phosphor/30
              px-3 text-xs tracking-[0.2em] transition-colors duration-150
              ${id === topId ? "bg-phosphor text-crt-black" : "text-phosphor hover:bg-phosphor/15"}`}
          >
            {TAB_LABELS[id]}
          </button>
        ))}
      </div>

      <p
        className="font-dot hidden items-center px-3 text-[10px] tracking-[0.25em] text-phosphor-dim sm:flex"
        aria-label={`${playedCount} of 5 cartridges explored`}
      >
        {playedCount}/5 EXPLORED
      </p>

      <button
        type="button"
        role="switch"
        aria-checked={config.audio}
        aria-label="Audio"
        onClick={toggleAudio}
        className="focus-brackets font-dot min-w-11 cursor-pointer px-3 text-xs tracking-widest
          text-phosphor transition-colors duration-150 hover:bg-phosphor/15"
      >
        {config.audio ? "♪ ON" : "♪ OFF"}
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={config.crt}
        aria-label="CRT mode"
        onClick={toggleCrt}
        className="focus-brackets font-dot min-w-11 cursor-pointer border-l border-phosphor/30 px-3
          text-xs tracking-widest text-phosphor transition-colors duration-150 hover:bg-phosphor/15"
      >
        ◑ CRT
      </button>
      <button
        type="button"
        aria-label="System clock"
        onClick={handleClock}
        className="focus-brackets font-segment min-w-20 cursor-pointer border-l border-phosphor/30
          px-4 text-xl text-phosphor"
      >
        {time}
      </button>
    </footer>
  );
}

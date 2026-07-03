"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useOS, WIDGET_IDS, type WidgetId } from "@/store/os";
import { playSound } from "@/lib/sound";
import { useMediaQuery } from "@/lib/useMediaQuery";
import Window from "./Window";
import Taskbar from "./Taskbar";
import Ticker from "./Ticker";
import StoryWidget from "./widgets/StoryWidget";
import EntoWidget from "./widgets/EntoWidget";
import MusicWidget from "./widgets/MusicWidget";
import StatsWidget from "./widgets/StatsWidget";
import ContactWidget from "./widgets/ContactWidget";

type Cartridge = {
  id: WidgetId;
  label: string;
  kana: string;
  /** art-directed desktop slot for the tile */
  tile: React.CSSProperties;
  /** art-directed desktop slot for the opened window */
  win: { left?: string; right?: string; top?: string; bottom?: string };
  width?: string;
};

const CARTRIDGES: Cartridge[] = [
  {
    id: "story",
    label: "STORY",
    kana: "ストーリー",
    tile: { left: "6%", top: "14%", rotate: "-2deg" },
    win: { left: "8%", top: "10%" },
    width: "26rem",
  },
  {
    id: "ento",
    label: "ENTØ",
    kana: "スタジオ",
    tile: { left: "24%", top: "26%", rotate: "1.5deg" },
    win: { left: "28%", top: "8%" },
    width: "24rem",
  },
  {
    id: "music",
    label: "NOW PLAYING",
    kana: "オンガク",
    tile: { right: "16%", top: "16%", rotate: "2deg" },
    win: { right: "10%", top: "12%" },
    width: "20rem",
  },
  {
    id: "stats",
    label: "STATS",
    kana: "ステータス",
    tile: { left: "10%", bottom: "24%", rotate: "1deg" },
    win: { left: "14%", bottom: "18%" },
    width: "22rem",
  },
  {
    id: "contact",
    label: "CONTACT",
    kana: "リンク",
    tile: { right: "8%", bottom: "28%", rotate: "-1.5deg" },
    win: { right: "12%", bottom: "20%" },
    width: "22rem",
  },
];

const WIDGET_BODY: Record<WidgetId, React.ReactNode> = {
  story: <StoryWidget />,
  ento: <EntoWidget />,
  music: <MusicWidget />,
  stats: <StatsWidget />,
  contact: <ContactWidget />,
};

function CartridgeTile({
  cart,
  isMobile,
  played,
  onOpen,
}: {
  cart: Cartridge;
  isMobile: boolean;
  played: boolean;
  onOpen: (id: WidgetId) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(cart.id)}
      whileHover={{ y: -4 }}
      whileTap={{ y: 2, scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`focus-brackets group cursor-pointer border-2 border-phosphor bg-black/70
        p-3 text-left shadow-[4px_4px_0_rgba(0,0,0,0.6)] backdrop-blur-[1px]
        ${isMobile ? "min-h-20 w-full" : "absolute z-10 w-40"}`}
      style={isMobile ? undefined : cart.tile}
    >
      <span className="font-dot block text-[10px] tracking-[0.3em] text-phosphor-dim">
        {cart.kana} · カートリッジ
      </span>
      <span className="font-dot mt-1 block text-sm tracking-[0.2em] text-phosphor group-hover:text-ink">
        {cart.label}
      </span>
      <span className="mt-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`block h-1.5 w-8 transition-colors duration-150 group-hover:bg-phosphor
            ${played ? "bg-memo" : "bg-phosphor/40"}`}
        />
        {played && (
          <span className="font-dot text-[9px] tracking-[0.25em] text-memo">
            PLAYED
          </span>
        )}
      </span>
    </motion.button>
  );
}

const STICKY_NOTES = [
  "try clicking around!",
  "the clock has a secret.",
  "↑ ↑ ↓ ↓ ← → ← → B A",
  "just type: e n t o",
];

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

export default function Desktop() {
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const keyBuffer = useRef<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const openWindow = useOS((s) => s.openWindow);
  const closeWindow = useOS((s) => s.closeWindow);
  const audio = useOS((s) => s.config.audio);
  const windows = useOS((s) => s.windows);
  const played = useOS((s) => s.played);
  const openEntries = WIDGET_IDS.filter((id) => windows[id].open);
  const topWindow =
    openEntries.length === 0
      ? null
      : openEntries.reduce((a, b) => (windows[a].z >= windows[b].z ? a : b));
  const [voidOpen, setVoidOpen] = useState(false);
  const [degauss, setDegauss] = useState(false);
  const [noteIdx, setNoteIdx] = useState(0);
  const playedCount = Object.values(played).filter(Boolean).length;

  const handleOpen = (id: WidgetId) => {
    playSound("open", audio);
    openWindow(id);
  };

  const openList = openEntries;

  // keyboard layer: Esc closes the top window; Konami degausses the tube;
  // typing "ento" inserts the studio cartridge
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea"))
        return;

      if (e.key === "Escape") {
        if (voidOpen) setVoidOpen(false);
        else if (topWindow) {
          playSound("close", audio);
          closeWindow(topWindow);
        }
        return;
      }

      const buf = keyBuffer.current;
      buf.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (buf.length > 10) buf.shift();

      if (buf.slice(-KONAMI.length).join(",") === KONAMI.join(",")) {
        setDegauss(true);
        playSound("boot", audio);
        window.setTimeout(() => setDegauss(false), 750);
        buf.length = 0;
      } else if (buf.slice(-4).join("") === "ento") {
        handleOpen("ento");
        buf.length = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topWindow, voidOpen, audio]);

  return (
    <main
      ref={desktopRef}
      data-testid="desktop"
      className={`relative min-h-dvh overflow-hidden bg-crt-black ${degauss ? "degauss" : ""}`}
    >
      {/* wallpaper */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${isMobile ? "/images/wallpaper-mobile.webp" : "/images/wallpaper.webp"})`,
        }}
      />
      {/* film grain */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.08]">
        <filter id="desk-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#desk-grain)" />
      </svg>

      {/* header plate */}
      <div className="pointer-events-none relative z-10 flex items-start justify-between p-4 sm:p-6">
        <div>
          <h1 className="font-segment text-2xl text-phosphor sm:text-3xl">SHRIVAS PS</h1>
          <p className="font-dot mt-1 text-[11px] tracking-[0.3em] text-ink-muted">
            ホーム · HOME SCREEN
          </p>
          {playedCount === 0 && (
            <p className="font-dot mt-2 text-[11px] tracking-[0.25em] text-phosphor">
              <span
                aria-hidden="true"
                className="mr-1 inline-block motion-safe:animate-[crt-blink_1.1s_steps(1)_infinite]"
              >
                ▶
              </span>
              PLAYER 1 CONNECTED — OPEN A CARTRIDGE
            </p>
          )}
        </div>
        <p className="font-dot hidden text-right text-[11px] leading-relaxed tracking-[0.2em] text-ink-muted sm:block">
          1 PLAYER CONNECTED
          <br />
          COIMBATORE, IN
        </p>
      </div>

      {/* memo sticky — click to flip through the machine's notes (hints included) */}
      <button
        type="button"
        aria-label="Note to self — click for the next note"
        onClick={() => {
          playSound("click", audio);
          setNoteIdx((noteIdx + 1) % STICKY_NOTES.length);
        }}
        className={`focus-brackets font-dot z-10 cursor-pointer border border-black/30 bg-memo
          px-3 py-2 text-left text-xs tracking-wider text-black shadow-[3px_3px_0_rgba(0,0,0,0.5)]
          transition-transform duration-150 hover:rotate-0
          ${isMobile ? "relative mx-4 mb-3 w-fit rotate-[-1deg]" : "absolute right-[30%] top-[42%] rotate-[-3deg]"}`}
      >
        note to self:
        <br />
        <span className="font-bold">{STICKY_NOTES[noteIdx]}</span>
      </button>

      {/* cartridges */}
      {isMobile ? (
        <div className="relative z-10 grid grid-cols-2 gap-3 p-4 pb-32">
          {CARTRIDGES.map((c) => (
            <CartridgeTile
              key={c.id}
              cart={c}
              isMobile
              played={played[c.id]}
              onOpen={handleOpen}
            />
          ))}
        </div>
      ) : (
        CARTRIDGES.map((c) => (
          <CartridgeTile
            key={c.id}
            cart={c}
            isMobile={false}
            played={played[c.id]}
            onOpen={handleOpen}
          />
        ))
      )}

      {/* windows */}
      <AnimatePresence>
        {openList.map((id) => {
          const cart = CARTRIDGES.find((c) => c.id === id)!;
          return (
            <Window
              key={id}
              id={id}
              title={`${cart.label} · ${cart.kana}`}
              dragRef={desktopRef}
              position={cart.win}
              width={cart.width}
              isMobile={isMobile}
              focused={id === topWindow}
            >
              {WIDGET_BODY[id]}
            </Window>
          );
        })}

        {/* VOID easter egg — clock clicked 3× */}
        {voidOpen && (
          <motion.div
            key="void"
            role="dialog"
            aria-label="VOID"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[45] grid cursor-pointer place-items-center bg-black/95"
            onClick={() => setVoidOpen(false)}
          >
            <div className="max-w-md p-8 text-center">
              <p className="font-segment text-4xl text-phosphor">VOID</p>
              <p className="font-zen mt-4 text-ink">
                You clicked a clock three times. That&apos;s the kind of person
                who gets hired. The console remembers you.
              </p>
              <p className="font-dot mt-6 text-xs tracking-[0.3em] text-phosphor-dim">
                CLICK ANYWHERE TO RETURN
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="sr-only" aria-live="polite">
        {topWindow ? `${topWindow} window focused` : "no windows open"}
      </span>

      <Ticker />
      <Taskbar onClockTriple={() => setVoidOpen(true)} />
    </main>
  );
}

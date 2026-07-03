"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playSound } from "@/lib/sound";
import { useOS } from "@/store/os";
import { useAchievements } from "@/store/achievements";

const BEST_KEY = "shrivas-ps-badminton-best";
const W = 360;
const H = 420;
const PADDLE_W = 72;
const PADDLE_H = 8;
const SHUTTLE_R = 5;

type Phase = "serve" | "rally" | "over";

export default function BadmintonGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audio = useOS((s) => s.config.audio);
  const [phase, setPhase] = useState<Phase>("serve");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const state = useRef({
    px: W / 2, // paddle center
    x: W / 2,
    y: H / 3,
    vx: 2.2,
    vy: 3,
    rally: 0,
    running: false,
  });

  useEffect(() => {
    setBest(Number(localStorage.getItem(BEST_KEY) || 0));
  }, []);

  // input: pointer moves the racket
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scale = W / rect.width;
      state.current.px = Math.max(
        PADDLE_W / 2,
        Math.min(W - PADDLE_W / 2, (e.clientX - rect.left) * scale),
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;

    const draw = () => {
      const s = state.current;
      ctx.fillStyle = "#0b1013";
      ctx.fillRect(0, 0, W, H);

      // court lines
      ctx.strokeStyle = "rgba(99,231,240,0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, W - 20, H - 20);
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(10, H * 0.55);
      ctx.lineTo(W - 10, H * 0.55);
      ctx.stroke();
      ctx.setLineDash([]);

      if (s.running) {
        // float physics: shuttle decelerates sideways, gravity pulls down
        s.vy += 0.11;
        s.vx *= 0.998;
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 10 + SHUTTLE_R || s.x > W - 10 - SHUTTLE_R) {
          s.vx *= -1;
          s.x = Math.max(10 + SHUTTLE_R, Math.min(W - 10 - SHUTTLE_R, s.x));
        }
        if (s.y < 10 + SHUTTLE_R) {
          s.vy = Math.abs(s.vy);
          s.y = 10 + SHUTTLE_R;
        }

        // racket contact
        const paddleY = H - 34;
        if (
          s.vy > 0 &&
          s.y + SHUTTLE_R >= paddleY &&
          s.y + SHUTTLE_R <= paddleY + PADDLE_H + 10 &&
          Math.abs(s.x - s.px) <= PADDLE_W / 2 + SHUTTLE_R
        ) {
          s.rally += 1;
          setScore(s.rally);
          playSound("click", useOS.getState().config.audio);
          if (s.rally === 10)
            useAchievements.getState().unlock("smash-master");
          // smash: speed grows with the rally, angle follows contact point
          const speed = Math.min(6.5 + s.rally * 0.25, 13);
          const angle = ((s.x - s.px) / (PADDLE_W / 2)) * 0.9;
          s.vx = angle * 4 + (Math.random() - 0.5);
          s.vy = -speed;
          s.y = paddleY - SHUTTLE_R;
        }

        // floor: game over
        if (s.y > H - 12) {
          s.running = false;
          playSound("close", useOS.getState().config.audio);
          setPhase("over");
          setBest((b) => {
            const nb = Math.max(b, s.rally);
            localStorage.setItem(BEST_KEY, String(nb));
            return nb;
          });
        }
      }

      // shuttle (a little cork-and-feather triangle)
      ctx.fillStyle = "#f2d94e";
      ctx.beginPath();
      ctx.arc(state.current.x, state.current.y, SHUTTLE_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(242,217,78,0.5)";
      ctx.beginPath();
      ctx.moveTo(state.current.x, state.current.y);
      ctx.lineTo(
        state.current.x - state.current.vx * 3,
        state.current.y - state.current.vy * 3,
      );
      ctx.stroke();

      // racket
      ctx.fillStyle = "#63e7f0";
      ctx.fillRect(state.current.px - PADDLE_W / 2, H - 34, PADDLE_W, PADDLE_H);

      // scanlines
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const serve = () => {
    const s = state.current;
    s.x = s.px;
    s.y = H / 2;
    s.vx = (Math.random() - 0.5) * 3;
    s.vy = -6;
    s.rally = 0;
    s.running = true;
    setScore(0);
    setPhase("rally");
    playSound("open", audio);
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Badminton minigame"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[46] grid place-items-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm border-2 border-phosphor bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex min-h-11 items-center justify-between border-b border-phosphor pl-4">
          <h2 className="font-dot text-sm tracking-[0.25em] text-phosphor">
            BADMINTON.EXE
          </h2>
          <button
            type="button"
            aria-label="Close badminton"
            onClick={onClose}
            className="focus-brackets font-dot grid h-11 w-11 cursor-pointer place-items-center
              text-phosphor transition-colors duration-150 hover:bg-alert hover:text-ink"
          >
            ✕
          </button>
        </header>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block w-full touch-none"
            onPointerDown={phase !== "rally" ? serve : undefined}
          />
          {phase !== "rally" && (
            <button
              type="button"
              onClick={serve}
              className="focus-brackets absolute inset-0 grid w-full cursor-pointer place-items-center bg-black/60"
            >
              <span className="text-center">
                {phase === "over" && (
                  <span className="font-segment block text-3xl text-alert">
                    GAME OVER
                  </span>
                )}
                <span className="font-dot mt-3 block text-xs tracking-[0.3em] text-phosphor">
                  {phase === "over" ? "TAP TO SERVE AGAIN" : "TAP TO SERVE"}
                </span>
                <span className="font-dot mt-2 block text-[10px] tracking-[0.25em] text-phosphor-dim">
                  KEEP THE SHUTTLE UP · 10 RALLIES = SMASH MASTER
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-phosphor/40 px-4 py-2">
          <p className="font-dot text-xs tracking-[0.25em] text-ink">
            RALLY <span className="font-segment text-xl text-phosphor">{score}</span>
          </p>
          <p className="font-dot text-xs tracking-[0.25em] text-ink-muted">
            BEST <span className="font-segment text-xl text-memo">{best}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

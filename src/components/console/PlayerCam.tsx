"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playSound } from "@/lib/sound";
import { useOS } from "@/store/os";

type CamState = "connecting" | "live" | "nosignal";

// the console's eye: cyan-phosphor duotone, mirrored like a real selfie cam
const CAM_FILTER =
  "grayscale(1) contrast(1.15) brightness(0.95) sepia(1) hue-rotate(140deg) saturate(1.6)";

export default function PlayerCam({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<CamState>("connecting");
  const [flash, setFlash] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audio = useOS((s) => s.config.audio);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setState("live");
      } catch {
        if (!cancelled) setState("nosignal");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || state !== "live") return;
    playSound("open", audio);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 180);

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // bake the duotone when the browser supports canvas filters (Safari: raw)
    if ("filter" in ctx) ctx.filter = CAM_FILTER;
    ctx.translate(w, 0);
    ctx.scale(-1, 1); // keep the mirror
    ctx.drawImage(video, 0, 0, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = "none";
    // scanlines
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
    // frame label
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, h - 34, w, 34);
    ctx.fillStyle = "#63e7f0";
    ctx.font = "14px DotGothic16, monospace";
    ctx.fillText("SHRIVAS PS · PLAYER CAM", 12, h - 12);
    const stamp = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    ctx.fillText(stamp, w - 60, h - 12);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "shrivas-ps-player-cam.png";
    a.click();
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Player cam"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[46] grid place-items-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border-2 border-phosphor bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex min-h-11 items-center justify-between border-b border-phosphor pl-4">
          <h2 className="font-dot text-sm tracking-[0.25em] text-phosphor">
            PLAYER CAM
            <span className="ml-3 text-alert motion-safe:animate-[crt-blink_1.4s_steps(1)_infinite]">
              ● REC
            </span>
          </h2>
          <button
            type="button"
            aria-label="Close player cam"
            onClick={onClose}
            className="focus-brackets font-dot grid h-11 w-11 cursor-pointer place-items-center
              text-phosphor transition-colors duration-150 hover:bg-alert hover:text-ink"
          >
            ✕
          </button>
        </header>

        <div className="relative aspect-[4/3] overflow-hidden bg-crt-black">
          {/* the feed (mirrored, duotoned) */}
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-full w-full object-cover"
            style={{ filter: CAM_FILTER, transform: "scaleX(-1)" }}
          />
          {/* scanlines over the feed */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.22) 2px 3px)",
            }}
          />
          {flash && <div className="absolute inset-0 bg-white/80" aria-hidden="true" />}

          {state === "connecting" && (
            <p className="font-dot absolute inset-0 grid place-items-center text-xs tracking-[0.3em] text-phosphor">
              REQUESTING SIGNAL…
            </p>
          )}
          {state === "nosignal" && (
            <div className="absolute inset-0 grid place-items-center bg-crt-black p-6 text-center">
              <div>
                <p className="font-segment text-2xl text-alert">NO SIGNAL</p>
                <p className="font-zen mt-3 text-sm text-ink">
                  The machine cannot see you. It&apos;s probably shy. Check
                  camera permission and try again.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-4">
          <p className="font-dot text-[10px] tracking-[0.25em] text-phosphor-dim">
            YOU, IN PHOSPHOR. SAVES AS PNG.
          </p>
          <button
            type="button"
            onClick={capture}
            disabled={state !== "live"}
            className="focus-brackets font-dot min-h-11 cursor-pointer border border-phosphor
              bg-phosphor/15 px-5 text-xs tracking-[0.3em] text-phosphor transition-colors
              duration-150 hover:bg-phosphor hover:text-crt-black disabled:cursor-not-allowed
              disabled:opacity-40"
          >
            ◉ CAPTURE
          </button>
        </div>
      </div>
    </motion.div>
  );
}

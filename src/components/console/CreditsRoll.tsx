"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useOS } from "@/store/os";

const CREDITS: [string, string][] = [
  ["DIRECTED BY", "SHRIVAS VM"],
  ["DESIGN", "SHRIVAS"],
  ["CODE", "SHRIVAS"],
  ["QA DEPARTMENT", "ALSO SHRIVAS"],
  ["STUDIO", "ENTØ"],
  ["FIRST CLIENT", "MOM"],
  ["CATERING", "FILTER COFFEE"],
  ["MORALE", "ITACHI FIGURINE"],
  ["SOUNDTRACK", "SZA · A$AP ROCKY · BAD BUNNY · TV GIRL"],
  ["FILMED ON LOCATION IN", "COIMBATORE, SOUTH INDIA"],
  ["NEXT SEASON", "THE NETHERLANDS"],
  ["SPECIAL THANKS", "YOU, FOR CLICKING EVERYTHING"],
];

export default function CreditsRoll({ onClose }: { onClose: () => void }) {
  const reduced = useReducedMotion();
  const playerName = useOS((s) => s.playerName);

  return (
    <motion.div
      role="dialog"
      aria-label="Staff roll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[48] cursor-pointer overflow-hidden bg-black"
      onClick={onClose}
    >
      <div
        className={
          reduced
            ? "mx-auto max-w-md overflow-y-auto py-16 text-center"
            : "mx-auto max-w-md text-center motion-safe:animate-[credits-scroll_26s_linear_forwards]"
        }
      >
        <p className="font-segment text-4xl text-phosphor">SHRIVAS PS</p>
        <p className="font-dot mt-2 text-xs tracking-[0.35em] text-phosphor-dim">
          STAFF ROLL
        </p>

        <dl className="mt-16 space-y-10">
          {CREDITS.map(([role, name]) => (
            <div key={role}>
              <dt className="font-dot text-[11px] tracking-[0.35em] text-phosphor-dim">
                {role}
              </dt>
              <dd className="font-zen mt-1 text-lg font-bold text-ink">{name}</dd>
            </div>
          ))}
          <div>
            <dt className="font-dot text-[11px] tracking-[0.35em] text-phosphor-dim">
              PLAYED BY
            </dt>
            <dd className="font-segment mt-1 text-3xl text-memo">
              {playerName || "YOU"}
            </dd>
          </div>
        </dl>

        <p className="font-dot mt-24 pb-40 text-sm tracking-[0.35em] text-phosphor">
          THANK YOU FOR PLAYING
        </p>
      </div>

      <p className="font-dot absolute bottom-4 w-full text-center text-[10px] tracking-[0.3em] text-phosphor-dim">
        CLICK TO SKIP
      </p>
    </motion.div>
  );
}

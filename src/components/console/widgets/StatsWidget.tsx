"use client";

import { character } from "@/content/stats";
import { exportSaveCard } from "@/lib/shareCard";
import { useAchievements } from "@/store/achievements";
import { useOS, WIDGET_IDS } from "@/store/os";
import { playSound } from "@/lib/sound";

export default function StatsWidget() {
  const played = useOS((s) => s.played);
  const audio = useOS((s) => s.config.audio);
  const unlocked = useAchievements((s) => s.unlocked);
  const playedCount = Object.values(played).filter(Boolean).length;

  const share = () => {
    playSound("open", audio);
    void exportSaveCard({
      playedCount,
      totalCartridges: WIDGET_IDS.length,
      unlocked,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-segment text-3xl text-phosphor">{character.level}</p>
        <p className="font-dot text-right text-xs tracking-[0.2em] text-ink-muted">
          {character.className}
        </p>
      </div>

      <dl className="space-y-2">
        {character.stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-4">
            <dt className="font-dot text-xs tracking-[0.2em] text-ink">{s.label}</dt>
            <dd
              className="font-dot text-sm text-phosphor"
              aria-label={`${s.meter} out of 10`}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <p className="font-dot text-xs tracking-[0.3em] text-memo">INVENTORY</p>
        <ul className="font-zen mt-2 space-y-1 text-sm text-ink">
          {character.inventory.map((item) => (
            <li key={item}>▪ {item}</li>
          ))}
        </ul>
      </div>

      <p className="font-dot border-t border-phosphor-dim/40 pt-3 text-xs tracking-[0.2em] text-ink-muted">
        SAVE FILE: {character.saveFile}
      </p>

      <button
        type="button"
        onClick={share}
        className="focus-brackets font-dot min-h-11 w-full cursor-pointer border border-memo
          bg-memo/10 text-xs tracking-[0.25em] text-memo transition-colors duration-150
          hover:bg-memo hover:text-black"
      >
        ★ EXPORT YOUR SAVE FILE
      </button>
      <p className="font-dot -mt-3 text-center text-[9px] tracking-[0.2em] text-ink-muted">
        {playedCount}/{WIDGET_IDS.length} CARTRIDGES · YOUR RUN, AS AN IMAGE
      </p>
    </div>
  );
}

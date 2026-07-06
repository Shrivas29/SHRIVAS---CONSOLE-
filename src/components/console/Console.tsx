"use client";

import { useEffect } from "react";
import BootScreen from "./BootScreen";
import Desktop from "./Desktop";
import CrtOverlay from "./CrtOverlay";
import { useOS } from "@/store/os";
import { useAchievements } from "@/store/achievements";
import { prefetchAssets } from "@/lib/prefetchAssets";
import AchievementToast from "./AchievementToast";
import BezelFrame from "./BezelFrame";

export default function Console() {
  const phase = useOS((s) => s.phase);
  const crt = useOS((s) => s.config.crt);

  // Rehydrate persisted state after mount (skipHydration keeps SSR = boot);
  // then warm the image cache while the visitor is still on the boot screen.
  useEffect(() => {
    void useOS.persist.rehydrate();
    void useAchievements.persist.rehydrate();
    prefetchAssets();
  }, []);

  return (
    <>
      {phase === "boot" ? <BootScreen /> : <Desktop />}
      <AchievementToast />
      {crt && <CrtOverlay />}
      <BezelFrame />
    </>
  );
}

"use client";

import { useEffect } from "react";
import BootScreen from "./BootScreen";
import Desktop from "./Desktop";
import CrtOverlay from "./CrtOverlay";
import { useOS } from "@/store/os";
import { prefetchAssets } from "@/lib/prefetchAssets";

export default function Console() {
  const phase = useOS((s) => s.phase);
  const crt = useOS((s) => s.config.crt);

  // Rehydrate session config after mount (skipHydration keeps SSR = boot);
  // then warm the image cache while the visitor is still on the boot screen.
  useEffect(() => {
    void useOS.persist.rehydrate();
    prefetchAssets();
  }, []);

  return (
    <>
      {phase === "boot" ? <BootScreen /> : <Desktop />}
      {crt && <CrtOverlay />}
    </>
  );
}

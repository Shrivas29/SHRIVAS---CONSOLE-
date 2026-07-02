"use client";

import { useEffect } from "react";
import BootScreen from "./BootScreen";
import Desktop from "./Desktop";
import CrtOverlay from "./CrtOverlay";
import { useOS } from "@/store/os";

export default function Console() {
  const phase = useOS((s) => s.phase);
  const crt = useOS((s) => s.config.crt);

  // Rehydrate session config after mount (skipHydration keeps SSR = boot).
  useEffect(() => {
    void useOS.persist.rehydrate();
  }, []);

  return (
    <>
      {phase === "boot" ? <BootScreen /> : <Desktop />}
      {crt && <CrtOverlay />}
    </>
  );
}

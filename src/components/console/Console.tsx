"use client";

import { useEffect, useState } from "react";
import BootScreen from "./BootScreen";
import Desktop from "./Desktop";
import CrtOverlay from "./CrtOverlay";
import { useOS } from "@/store/os";

export default function Console() {
  const phase = useOS((s) => s.phase);
  const crt = useOS((s) => s.config.crt);
  // Avoid hydration mismatch: sessionStorage-persisted phase differs from SSR.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return <div className="min-h-dvh bg-crt-black" aria-hidden="true" />;
  }

  return (
    <>
      {phase === "boot" ? <BootScreen /> : <Desktop />}
      {crt && <CrtOverlay />}
    </>
  );
}

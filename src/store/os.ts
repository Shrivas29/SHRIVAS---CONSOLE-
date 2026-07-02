import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WidgetId = "story" | "ento" | "music" | "stats" | "contact";
export type Phase = "boot" | "desktop";

type WindowState = { open: boolean; z: number };

type OSState = {
  phase: Phase;
  config: { audio: boolean; crt: boolean };
  windows: Record<WidgetId, WindowState>;
  zCounter: number;
  start: () => void;
  toggleAudio: () => void;
  toggleCrt: () => void;
  openWindow: (id: WidgetId) => void;
  closeWindow: (id: WidgetId) => void;
  focusWindow: (id: WidgetId) => void;
  topWindow: () => WidgetId | null;
  openIds: () => WidgetId[];
  reset: () => void;
};

export const WIDGET_IDS: WidgetId[] = [
  "story",
  "ento",
  "music",
  "stats",
  "contact",
];

const initialWindows = (): Record<WidgetId, WindowState> =>
  Object.fromEntries(WIDGET_IDS.map((id) => [id, { open: false, z: 0 }])) as
    Record<WidgetId, WindowState>;

export const useOS = create<OSState>()(
  persist(
    (set, get) => ({
      phase: "boot",
      config: { audio: false, crt: true },
      windows: initialWindows(),
      zCounter: 0,

      start: () => set({ phase: "desktop" }),
      toggleAudio: () =>
        set((s) => ({ config: { ...s.config, audio: !s.config.audio } })),
      toggleCrt: () =>
        set((s) => ({ config: { ...s.config, crt: !s.config.crt } })),

      openWindow: (id) =>
        set((s) => ({
          zCounter: s.zCounter + 1,
          windows: {
            ...s.windows,
            [id]: { open: true, z: s.zCounter + 1 },
          },
        })),

      closeWindow: (id) =>
        set((s) => ({
          windows: { ...s.windows, [id]: { ...s.windows[id], open: false } },
        })),

      focusWindow: (id) => get().openWindow(id),

      topWindow: () => {
        const open = Object.entries(get().windows).filter(([, w]) => w.open);
        if (open.length === 0) return null;
        return open.sort((a, b) => b[1].z - a[1].z)[0][0] as WidgetId;
      },

      openIds: () =>
        (Object.entries(get().windows) as [WidgetId, WindowState][])
          .filter(([, w]) => w.open)
          .map(([id]) => id),

      reset: () =>
        set({
          phase: "boot",
          config: { audio: false, crt: true },
          windows: initialWindows(),
          zCounter: 0,
        }),
    }),
    {
      name: "shrivas64-os",
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? { getItem: () => null, setItem: () => {}, removeItem: () => {} }
          : sessionStorage,
      ),
      partialize: (s) => ({ phase: s.phase, config: s.config }),
      // SSR renders the boot phase; Console rehydrates after mount so the
      // server and first client render always match.
      skipHydration: true,
    },
  ),
);

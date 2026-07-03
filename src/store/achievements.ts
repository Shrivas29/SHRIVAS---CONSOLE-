import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AchievementId =
  | "first-boot"
  | "all-cartridges"
  | "void-diver"
  | "konami-kid"
  | "shell-hacker"
  | "caught-on-camera";

export const ACHIEVEMENTS: Record<AchievementId, string> = {
  "first-boot": "FIRST BOOT",
  "all-cartridges": "FULL COLLECTION",
  "void-diver": "VOID DIVER",
  "konami-kid": "KONAMI KID",
  "shell-hacker": "SHELL HACKER",
  "caught-on-camera": "CAUGHT ON CAMERA",
};

type AchievementsState = {
  unlocked: Partial<Record<AchievementId, boolean>>;
  queue: AchievementId[];
  unlock: (id: AchievementId) => void;
  shiftToast: () => void;
  count: () => number;
  reset: () => void;
};

export const useAchievements = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      queue: [],

      unlock: (id) => {
        if (get().unlocked[id]) return;
        set((s) => ({
          unlocked: { ...s.unlocked, [id]: true },
          queue: [...s.queue, id],
        }));
      },

      shiftToast: () => set((s) => ({ queue: s.queue.slice(1) })),

      count: () => Object.values(get().unlocked).filter(Boolean).length,

      reset: () => set({ unlocked: {}, queue: [] }),
    }),
    {
      name: "shrivas-ps-achievements",
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? { getItem: () => null, setItem: () => {}, removeItem: () => {} }
          : localStorage,
      ),
      partialize: (s) => ({ unlocked: s.unlocked }),
      skipHydration: true,
    },
  ),
);

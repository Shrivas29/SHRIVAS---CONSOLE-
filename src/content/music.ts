export type Track = {
  title: string;
  artist: string;
  note: string;
  /* typographic cover: two-letter mark + oklch hue pair (no copyrighted art) */
  mark: string;
  bg: string;
  fg: string;
};

export const rotation: Track[] = [
  {
    title: "SOS",
    artist: "SZA",
    note: "diving-board music",
    mark: "SZ",
    bg: "oklch(0.35 0.07 250)",
    fg: "oklch(0.92 0.02 250)",
  },
  {
    title: "Sloppy Joe",
    artist: "slayr",
    note: "chaos, hand-drawn",
    mark: "SJ",
    bg: "oklch(0.3 0.12 290)",
    fg: "oklch(0.88 0.16 95)",
  },
  {
    title: "TESTING",
    artist: "A$AP Rocky",
    note: "grain over everything",
    mark: "AR",
    bg: "oklch(0.22 0 0)",
    fg: "oklch(0.95 0.01 200)",
  },
];

export type Track = {
  title: string;
  artist: string;
  note: string;
  /** real album art when available */
  cover?: { src: string; alt: string };
  /* typographic fallback: two-letter mark + oklch hue pair */
  mark: string;
  bg: string;
  fg: string;
};

export const rotation: Track[] = [
  {
    title: "SOS",
    artist: "SZA",
    note: "diving-board music",
    cover: {
      src: "/images/cover-sos.webp",
      alt: "SOS album cover: SZA sitting on a diving board over open ocean",
    },
    mark: "SZ",
    bg: "oklch(0.35 0.07 250)",
    fg: "oklch(0.92 0.02 250)",
  },
  {
    title: "AT.LONG.LAST.A$AP",
    artist: "A$AP Rocky",
    note: "grain over everything",
    cover: {
      src: "/images/cover-alla.webp",
      alt: "AT.LONG.LAST.A$AP cover: grainy black-and-white close-up of A$AP Rocky",
    },
    mark: "AR",
    bg: "oklch(0.22 0 0)",
    fg: "oklch(0.95 0.01 200)",
  },
];

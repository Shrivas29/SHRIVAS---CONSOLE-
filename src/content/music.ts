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
  {
    title: "DTMF",
    artist: "Bad Bunny",
    note: "should've taken more photos",
    cover: {
      src: "/images/cover-chairs.webp",
      alt: "DTMF album cover: two white plastic chairs in front of banana trees",
    },
    mark: "BB",
    bg: "oklch(0.35 0.06 150)",
    fg: "oklch(0.94 0.02 150)",
  },
  {
    title: "French Exit",
    artist: "TV Girl",
    note: "volume up, lights off",
    cover: {
      src: "/images/cover-neon.webp",
      alt: "French Exit album cover: couple embracing lit in pink and blue",
    },
    mark: "TV",
    bg: "oklch(0.25 0.1 330)",
    fg: "oklch(0.9 0.1 330)",
  },
  {
    title: "GHOSTS HOLD HANDS",
    artist: "SHRIVAS PS MIXTAPE 01",
    note: "for night walks",
    cover: {
      src: "/images/cover-glow.webp",
      alt: "Two glowing overexposed figures holding hands in a dark field",
    },
    mark: "M1",
    bg: "oklch(0.3 0.05 210)",
    fg: "oklch(0.95 0.01 200)",
  },
];

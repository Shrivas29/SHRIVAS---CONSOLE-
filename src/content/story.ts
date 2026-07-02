export type StoryBeat = {
  speaker: string;
  line: string;
  img?: { src: string; alt: string };
};

export const storyBeats: StoryBeat[] = [
  {
    speaker: "SYSTEM",
    line: "MEMORY CARD DETECTED. LOADING PLAYER FILE…",
  },
  {
    speaker: "SHRIVAS",
    line: "Coimbatore, South India. I grew up here — filter coffee, badminton courts, a laptop that ran too hot.",
    img: {
      src: "/images/portrait-ento.webp",
      alt: "Shrivas, teal-toned portrait with ENTO lettering across his glasses",
    },
  },
  {
    speaker: "SHRIVAS",
    line: "I design and build websites end to end. Not as separate jobs — as one motion. The design is the code.",
  },
  {
    speaker: "SHRIVAS",
    line: "At 17 I started ENTØ, a creative studio. First client shipped in month one. The studio is small. The bar is not.",
  },
  {
    speaker: "SYSTEM",
    line: "NEW QUEST ACCEPTED: UNDERGRAD — THE NETHERLANDS. DEPARTURE: SOON.",
  },
  {
    speaker: "SHRIVAS",
    line: "New country, same rule: everything I ship has to be worth screenshotting. You're inside the proof right now.",
  },
];

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
    line: "Coimbatore, South India. Filter coffee strong enough to reboot a corpse, badminton before school, a laptop that ran too hot every single day.",
    img: {
      src: "/images/portrait-ento.webp",
      alt: "Shrivas, teal-toned portrait with ENTO lettering across his glasses",
    },
  },
  {
    speaker: "SHRIVAS",
    line: "I couldn't pick between design and code. So I refused to. I learned both until the line between them stopped existing.",
  },
  {
    speaker: "SHRIVAS",
    line: "Now every site I make is one motion — strategy, design, code, ship. No handoffs. Nothing lost between the sketch and the screen.",
  },
  {
    speaker: "SYSTEM",
    line: "NEW SAVE CREATED — ENTØ STUDIOS. EST. JUNE 2026.",
  },
  {
    speaker: "SHRIVAS",
    line: "At 17 I started ENTØ, a creative studio with the bar set stupidly high. It shipped its first client site in month one.",
    img: {
      src: "/images/poster-ento.webp",
      alt: "ENTØ poster: chrome hand reaching toward a warped racket, 'AI does it better' in warped type",
    },
  },
  {
    speaker: "SHRIVAS",
    line: "That first client? My mom — a digital marketing influencer who deserved a website that proves it. Family discount: zero. Standards: maximum.",
  },
  {
    speaker: "SYSTEM",
    line: "QUEST ACCEPTED — UNDERGRAD: THE NETHERLANDS. DEPARTURE: SOON.",
  },
  {
    speaker: "SHRIVAS",
    line: "New country, new map, same player. The Itachi figurine travels in the carry-on. The standards travel everywhere.",
  },
  {
    speaker: "SHRIVAS",
    line: "The rule stays the rule: if it isn't worth screenshotting, it doesn't ship. You're inside the proof right now.",
  },
  {
    speaker: "SYSTEM",
    line: "END OF PLAYER FILE. REPLAY — or go open the ENTØ cartridge.",
  },
];

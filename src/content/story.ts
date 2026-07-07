export type StoryBeat = {
  speaker: string;
  line: string;
  img?: { src: string; alt: string };
};

export const storyBeats: StoryBeat[] = [
  {
    speaker: "SYSTEM",
    line: "MEMORY CARD FOUND. LOADING PLAYER FILE…",
  },
  {
    speaker: "SHRIVAS",
    line: "Coimbatore, South India. That's the player. Filter coffee, badminton before school, a laptop that always ran too hot.",
    img: {
      src: "/images/story-baby.webp",
      alt: "Shrivas as a toddler, grinning in a hooded jacket",
    },
  },
  {
    speaker: "SHRIVAS",
    line: "Someone taught me to build one website. Then something caught fire on the inside, and it never went out.",
  },
  {
    speaker: "SHRIVAS",
    line: "Design or code? I refused to pick a side. I learned both until you couldn't find the seam between them.",
    img: {
      src: "/images/story-fork.webp",
      alt: "Three mirror reflections of Shrivas, each in a different outfit",
    },
  },
  {
    speaker: "SYSTEM",
    line: "NEW SAVE CREATED — ENTØ STUDIOS. FOUNDED AT 17.",
  },
  {
    speaker: "SHRIVAS",
    line: "A studio with the bar set stupidly high. The first client site shipped in month one.",
    img: {
      src: "/images/poster-ento.webp",
      alt: "ENTØ poster: chrome hand reaching toward a warped racket, 'AI does it better' in warped type",
    },
  },
  {
    speaker: "SHRIVAS",
    line: "Best Outgoing Student of the Year. I walked up, took the mic, and meant every word of it.",
    img: {
      src: "/images/story-award.webp",
      alt: "Shrivas on stage holding a microphone, accepting Best Outgoing Student of the Year",
    },
  },
  {
    speaker: "SYSTEM",
    line: "QUEST ACCEPTED — TECHNICAL COMPUTER SCIENCE, UNIVERSITY OF TWENTE.",
  },
  {
    speaker: "SHRIVAS",
    line: "New country, new map, same player. The Netherlands is just the next level.",
    img: {
      src: "/images/story-next.webp",
      alt: "Motion-blurred self-portrait of Shrivas, caught mid-movement",
    },
  },
  {
    speaker: "SHRIVAS",
    line: "The plan is not modest: go down in history as the biggest tech giant there is. Screenshot this one.",
    img: {
      src: "/images/portrait-ento.webp",
      alt: "Shrivas, teal-toned portrait with ENTO lettering across his glasses",
    },
  },
  {
    speaker: "SYSTEM",
    line: "END OF PLAYER FILE. NOW GO OPEN THE ENTØ CARTRIDGE.",
  },
];

// SHRIVAS PS sound chip: synthesized square-wave blips, no audio files.
// Every call gates on `enabled` (the boot-config AUDIO toggle).

export type SoundName = "boot" | "click" | "open" | "close" | "tick" | "hover";

type ContextFactory = () => AudioContext;

let audioContextFactory: ContextFactory = () =>
  new (window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)();

let ctx: AudioContext | null = null;

export function _setAudioContextFactory(factory: ContextFactory) {
  audioContextFactory = factory;
}

export function _resetAudio() {
  ctx = null;
}

// [frequency Hz, start offset s, duration s][]
const PATTERNS: Record<SoundName, [number, number, number][]> = {
  boot: [
    [523, 0, 0.09],
    [784, 0.1, 0.09],
    [1047, 0.2, 0.16],
  ],
  click: [[880, 0, 0.05]],
  open: [
    [660, 0, 0.06],
    [990, 0.06, 0.08],
  ],
  close: [
    [990, 0, 0.06],
    [660, 0.06, 0.08],
  ],
  tick: [[1320, 0, 0.014]],
  hover: [[740, 0, 0.028]],
};

// quieter voices for high-frequency UI chatter
const GAINS: Partial<Record<SoundName, number>> = {
  tick: 0.012,
  hover: 0.02,
};

/** shared context for other audio consumers (BGM); null when disabled */
export function getAudioContext(enabled: boolean): AudioContext | null {
  if (!enabled) return null;
  try {
    ctx ??= audioContextFactory();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function playSound(name: SoundName, enabled: boolean): void {
  if (!enabled) return;
  try {
    ctx ??= audioContextFactory();
    if (ctx.state === "suspended") void ctx.resume();
    const t0 = ctx.currentTime;
    const level = GAINS[name] ?? 0.04;
    for (const [freq, at, dur] of PATTERNS[name]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, t0 + at);
      gain.gain.setValueAtTime(level, t0 + at);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
      osc.connect(gain as unknown as AudioNode);
      gain.connect(ctx.destination);
      osc.start(t0 + at);
      osc.stop(t0 + at + dur + 0.02);
    }
  } catch {
    // Autoplay policy or missing WebAudio: the console stays silent, never crashes.
  }
}

// SHRIVAS PS background music: a small synthesized chiptune loop.
// No audio files — two square/triangle voices over an eight-step sequence.
import { getAudioContext } from "./sound";

const STEP_S = 0.24; // ~125bpm eighths
// pentatonic wander (lead) over a slow root pulse (bass)
const LEAD = [330, 392, 440, 392, 523, 440, 392, 349];
const BASS = [110, 110, 87.3, 87.3, 98, 98, 130.8, 98];

let timer: number | null = null;
let nextStepTime = 0;
let step = 0;

function scheduleStep(ctx: AudioContext, t: number, i: number) {
  const voice = (
    freq: number,
    type: OscillatorType,
    gainLevel: number,
    dur: number,
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(gainLevel, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  };
  voice(BASS[i % BASS.length], "square", 0.014, STEP_S * 0.9);
  if (i % 2 === 0) voice(LEAD[(i / 2) % LEAD.length], "triangle", 0.02, STEP_S * 1.6);
}

export function startBgm(audioEnabled: boolean): void {
  const ctx = getAudioContext(audioEnabled);
  if (!ctx || timer !== null) return;
  nextStepTime = ctx.currentTime + 0.1;
  step = 0;
  // lookahead scheduler: queue ~0.5s of steps every 200ms
  timer = window.setInterval(() => {
    while (nextStepTime < ctx.currentTime + 0.5) {
      scheduleStep(ctx, nextStepTime, step);
      nextStepTime += STEP_S;
      step = (step + 1) % 16;
    }
  }, 200);
}

export function stopBgm(): void {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

export function bgmRunning(): boolean {
  return timer !== null;
}

import { beforeEach, describe, expect, it, vi } from "vitest";
import { playSound, _setAudioContextFactory, _resetAudio } from "./sound";

const fakeContext = () => ({
  currentTime: 0,
  destination: {},
  state: "running",
  resume: vi.fn(),
  createOscillator: vi.fn(() => ({
    type: "square",
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  })),
  createGain: vi.fn(() => ({
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  })),
});

describe("playSound gating", () => {
  let factory: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    _resetAudio();
    factory = vi.fn(fakeContext);
    _setAudioContextFactory(factory as never);
  });

  it("never constructs AudioContext when disabled", () => {
    playSound("click", false);
    playSound("boot", false);
    expect(factory).not.toHaveBeenCalled();
  });

  it("constructs AudioContext once and reuses it when enabled", () => {
    playSound("click", true);
    playSound("open", true);
    playSound("close", true);
    expect(factory).toHaveBeenCalledTimes(1);
  });
});

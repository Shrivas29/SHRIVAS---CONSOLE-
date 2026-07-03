import { beforeEach, describe, expect, it } from "vitest";
import { useOS } from "./os";

const s = () => useOS.getState();

beforeEach(() => {
  useOS.getState().reset();
});

describe("boot", () => {
  it("starts at boot phase, audio off, crt on", () => {
    expect(s().phase).toBe("boot");
    expect(s().config.audio).toBe(false);
    expect(s().config.crt).toBe(true);
  });

  it("start() enters desktop", () => {
    s().start();
    expect(s().phase).toBe("desktop");
  });

  it("toggles flip config", () => {
    s().toggleAudio();
    s().toggleCrt();
    expect(s().config.audio).toBe(true);
    expect(s().config.crt).toBe(false);
  });
});

describe("windows", () => {
  it("openWindow opens with highest z", () => {
    s().openWindow("story");
    s().openWindow("ento");
    expect(s().windows.story.open).toBe(true);
    expect(s().windows.ento.z).toBeGreaterThan(s().windows.story.z);
    expect(s().topWindow()).toBe("ento");
  });

  it("focusWindow raises z above all open windows", () => {
    s().openWindow("story");
    s().openWindow("ento");
    s().focusWindow("story");
    expect(s().topWindow()).toBe("story");
  });

  it("closeWindow clears open; topWindow falls back", () => {
    s().openWindow("story");
    s().openWindow("ento");
    s().closeWindow("ento");
    expect(s().windows.ento.open).toBe(false);
    expect(s().topWindow()).toBe("story");
  });

  it("topWindow is null with nothing open", () => {
    expect(s().topWindow()).toBeNull();
  });

  it("reopening an open window just refocuses it", () => {
    s().openWindow("story");
    const z1 = s().windows.story.z;
    s().openWindow("ento");
    s().openWindow("story");
    expect(s().windows.story.z).toBeGreaterThan(z1);
    expect(s().openIds().filter((id) => id === "story")).toHaveLength(1);
  });

  it("openIds lists open windows", () => {
    s().openWindow("music");
    s().openWindow("stats");
    expect(s().openIds().sort()).toEqual(["music", "stats"]);
  });
});

describe("player name", () => {
  it("sanitizes to 3 uppercase chars", () => {
    s().setPlayerName("shri vas");
    expect(s().playerName).toBe("SHR");
    s().setPlayerName("a!1");
    expect(s().playerName).toBe("A1");
  });
});

describe("secret + closeAll + power", () => {
  it("secret starts locked; unlockSecret flips it", () => {
    expect(s().secretUnlocked).toBe(false);
    s().unlockSecret();
    expect(s().secretUnlocked).toBe(true);
  });

  it("closeAllWindows closes everything", () => {
    s().openWindow("story");
    s().openWindow("music");
    s().closeAllWindows();
    expect(s().openIds()).toEqual([]);
  });

  it("powerOff returns to boot but keeps progress", () => {
    s().start();
    s().openWindow("story");
    s().powerOff();
    expect(s().phase).toBe("boot");
    expect(s().played.story).toBe(true);
    expect(s().openIds()).toEqual([]);
  });
});

describe("completion", () => {
  it("marks widgets played on open, permanently", () => {
    expect(s().playedCount()).toBe(0);
    s().openWindow("story");
    s().closeWindow("story");
    expect(s().played.story).toBe(true);
    expect(s().playedCount()).toBe(1);
  });

  it("counts each widget once", () => {
    s().openWindow("story");
    s().openWindow("story");
    s().openWindow("ento");
    expect(s().playedCount()).toBe(2);
  });
});

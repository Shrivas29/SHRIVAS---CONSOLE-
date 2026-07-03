import { beforeEach, describe, expect, it } from "vitest";
import { useAchievements } from "./achievements";

const a = () => useAchievements.getState();

beforeEach(() => a().reset());

describe("achievements", () => {
  it("unlock adds to unlocked and toast queue once", () => {
    a().unlock("first-boot");
    a().unlock("first-boot");
    expect(a().unlocked["first-boot"]).toBe(true);
    expect(a().queue).toEqual(["first-boot"]);
    expect(a().count()).toBe(1);
  });

  it("shiftToast pops the queue without relocking", () => {
    a().unlock("void-diver");
    a().shiftToast();
    expect(a().queue).toEqual([]);
    expect(a().unlocked["void-diver"]).toBe(true);
  });
});

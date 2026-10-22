import { describe, it, expect } from "vitest";
import { emptyProgress, primaryState, bonusUnlocked, lettersCount } from "@/lib/progress";

describe("title screen progression rules", () => {
  it("no save → start", () => {
    expect(primaryState(emptyProgress())).toBe("start");
  });
  it("chapter 0 done, chapter 1 not → university", () => {
    expect(primaryState({ ...emptyProgress(), started: true, completed: ["chapter0"] })).toBe("university");
  });
  it("adventure started otherwise → continue", () => {
    expect(primaryState({ ...emptyProgress(), started: true })).toBe("continue");
    expect(primaryState({ ...emptyProgress(), completed: ["chapter0", "chapter1"] })).toBe("continue");
  });
  it("bonus only after chapter 5", () => {
    expect(bonusUnlocked(emptyProgress())).toBe(false);
    expect(bonusUnlocked({ ...emptyProgress(), completed: ["chapter5"] })).toBe(true);
  });
  it("letters counted out of 3", () => {
    expect(lettersCount({ ...emptyProgress(), lettersUnlocked: ["a", "b", "b"] })).toBe(2);
  });
});

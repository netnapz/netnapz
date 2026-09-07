import { describe, expect, it } from "vitest";
import { formatFixed } from "./units";

describe("formatFixed", () => {
  it("formats token units without floating point conversion", () => {
    expect(formatFixed(123456789n, 6, 2)).toBe("123.45");
    expect(formatFixed(-1250n, 3, 2)).toBe("-1.25");
  });

  it("handles precision larger than token decimals", () => {
    expect(formatFixed(5n, 0, 2)).toBe("5.00");
  });
});

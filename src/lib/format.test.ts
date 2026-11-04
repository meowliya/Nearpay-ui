import { describe, expect, it } from "vitest";
import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("formats rupee amounts with Indian digit grouping", () => {
    expect(formatCurrency(2500)).toBe("₹2,500");
    expect(formatCurrency(125000)).toBe("₹1,25,000");
  });
});

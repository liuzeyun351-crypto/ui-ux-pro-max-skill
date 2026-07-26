import { describe, expect, it } from "vitest";
import {
  formatCount,
  formatMoney,
  formatMoneyCompact,
  initials,
  slugify,
} from "@/lib/utils";

describe("money formatting", () => {
  it("renders whole-dollar currency", () => {
    expect(formatMoney(150_000_000)).toBe("$1,500,000");
    expect(formatMoney(0)).toBe("$0");
  });

  it("compacts to K and M", () => {
    expect(formatMoneyCompact(150_000_000)).toBe("$1.5M");
    expect(formatMoneyCompact(100_000_000)).toBe("$1M");
    expect(formatMoneyCompact(35_000_000)).toBe("$350K");
    expect(formatMoneyCompact(75_000)).toBe("$750");
  });
});

describe("formatCount", () => {
  it("compacts follower counts", () => {
    expect(formatCount(511_000_000)).toBe("511M");
    expect(formatCount(1_500_000)).toBe("1.5M");
    expect(formatCount(28_000)).toBe("28K");
    expect(formatCount(512)).toBe("512");
  });
});

describe("slugify / initials", () => {
  it("slugifies names", () => {
    expect(slugify("Chimamanda Ngozi Adichie")).toBe("chimamanda-ngozi-adichie");
    expect(slugify("  The  Weeknd! ")).toBe("the-weeknd");
  });

  it("takes at most two initials", () => {
    expect(initials("Taylor Swift")).toBe("TS");
    expect(initials("Oprah")).toBe("O");
    expect(initials("Chimamanda Ngozi Adichie")).toBe("CN");
  });
});

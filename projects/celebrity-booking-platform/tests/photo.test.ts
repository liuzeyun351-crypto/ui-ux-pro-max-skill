import { describe, expect, it } from "vitest";
import {
  cleanAuthor,
  evaluateLicence,
  hasUsableDimensions,
  isSupportedMime,
} from "../scripts/licence";
import { formatCredit, getPhoto, needsAttribution } from "@/lib/photo";

describe("licence gate", () => {
  it("accepts free licences", () => {
    for (const licence of [
      "CC0",
      "CC0 1.0",
      "Public domain",
      "PD-US",
      "CC BY 4.0",
      "CC BY-SA 3.0",
      "cc-by-sa-4.0",
      "Attribution",
    ]) {
      const v = evaluateLicence(licence);
      expect(v.allowed, `${licence} should be allowed`).toBe(true);
    }
  });

  it("requires attribution for CC BY and CC BY-SA but not CC0/PD", () => {
    expect(evaluateLicence("CC BY 4.0").attributionRequired).toBe(true);
    expect(evaluateLicence("CC BY-SA 4.0").attributionRequired).toBe(true);
    expect(evaluateLicence("CC0").attributionRequired).toBe(false);
    expect(evaluateLicence("Public domain").attributionRequired).toBe(false);
  });

  it("rejects non-commercial and no-derivatives, which merely look like CC BY", () => {
    for (const licence of ["CC BY-NC 4.0", "CC BY-NC-SA 3.0", "CC BY-ND 4.0"]) {
      const v = evaluateLicence(licence);
      expect(v.allowed, `${licence} must be rejected`).toBe(false);
    }
  });

  it("rejects fair use, all-rights-reserved, unknown and empty licences", () => {
    for (const licence of ["Fair use", "All rights reserved", "Non-free", "Unknown", "", null]) {
      expect(evaluateLicence(licence).allowed).toBe(false);
    }
  });

  it("gives a reason for every rejection so the log is actionable", () => {
    expect(evaluateLicence("Fair use").reason).toMatch(/non-free/);
    expect(evaluateLicence("").reason).toMatch(/no licence/);
    expect(evaluateLicence("Weird Custom Licence").reason).toMatch(/unrecognised/);
  });
});

describe("cleanAuthor", () => {
  it("reduces Commons HTML to plain text", () => {
    expect(cleanAuthor('<a href="/wiki/User:Bob" title="x">Bob Smith</a>')).toBe("Bob Smith");
    expect(cleanAuthor("Jane &amp; Co.")).toBe("Jane & Co.");
    expect(cleanAuthor("  spaced   out  ")).toBe("spaced out");
    expect(cleanAuthor(null)).toBe("");
  });

  it("truncates runaway credits", () => {
    expect(cleanAuthor("x".repeat(400)).length).toBe(160);
  });
});

describe("asset guards", () => {
  it("rejects images too small to crop into a portrait", () => {
    expect(hasUsableDimensions(1200, 1600)).toBe(true);
    expect(hasUsableDimensions(399, 2000)).toBe(false);
    expect(hasUsableDimensions(undefined, 900)).toBe(false);
  });

  it("accepts only formats sharp decodes reliably", () => {
    expect(isSupportedMime("image/jpeg")).toBe(true);
    expect(isSupportedMime("image/png")).toBe(true);
    expect(isSupportedMime("image/svg+xml")).toBe(false);
    expect(isSupportedMime("image/gif")).toBe(false);
    expect(isSupportedMime(null)).toBe(false);
  });
});

describe("getPhoto", () => {
  it("parses a stored photo record", () => {
    const photo = getPhoto({
      photo: JSON.stringify({
        portrait: "/talent/adele.jpg",
        wide: "/talent/adele-wide.jpg",
        credit: "Bob Smith",
        licence: "CC BY-SA 4.0",
        source: "wikimedia",
      }),
    });
    expect(photo?.portrait).toBe("/talent/adele.jpg");
    expect(photo?.licence).toBe("CC BY-SA 4.0");
  });

  it("falls back to null for missing, malformed or portrait-less records", () => {
    expect(getPhoto({ photo: null })).toBeNull();
    expect(getPhoto({})).toBeNull();
    expect(getPhoto({ photo: "not json" })).toBeNull();
    expect(getPhoto({ photo: JSON.stringify({ wide: "/x.jpg" }) })).toBeNull();
    expect(getPhoto({ photo: JSON.stringify({ portrait: "" }) })).toBeNull();
  });
});

describe("credit rendering", () => {
  const photo = {
    portrait: "/talent/x.jpg",
    credit: "Bob Smith",
    licence: "CC BY-SA 4.0",
    source: "wikimedia",
  };

  it("names the author, licence and platform", () => {
    expect(formatCredit(photo)).toBe("Bob Smith · CC BY-SA 4.0 (Wikimedia Commons)");
    expect(formatCredit({ ...photo, source: "tmdb" })).toContain("(TMDB)");
  });

  it("only claims attribution is needed when there is something to attribute", () => {
    expect(needsAttribution(photo)).toBe(true);
    expect(needsAttribution({ portrait: "/x.jpg" })).toBe(false);
  });
});

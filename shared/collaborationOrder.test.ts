import { describe, expect, it } from "vitest";
import { sortCollaborationsNewestFirst } from "./collaborationOrder";

describe("sortCollaborationsNewestFirst", () => {
  it("places the newest dated collaboration first", () => {
    const items = [
      { name: "Older", publishedAt: "2026-07-01" },
      { name: "Newest", publishedAt: "2026-08-14" },
      { name: "Undated legacy", publishedAt: null },
    ];

    expect(sortCollaborationsNewestFirst(items).map(item => item.name)).toEqual([
      "Newest",
      "Older",
      "Undated legacy",
    ]);
  });

  it("keeps the original order for equally undated legacy items", () => {
    const items = [
      { name: "First legacy", publishedAt: null },
      { name: "Second legacy", publishedAt: null },
    ];

    expect(sortCollaborationsNewestFirst(items).map(item => item.name)).toEqual([
      "First legacy",
      "Second legacy",
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { removeFilterPreset, upsertFilterPreset, type CollaborationFilterPreset } from "@shared/filterPresets";

const preset = (id: string, name: string): CollaborationFilterPreset => ({
  id,
  name,
  query: "fitness",
  status: "published",
  language: "all",
  category: "Beauty",
  fromDate: "2026-08-01",
  toDate: "2026-08-15",
  sortMode: "newest",
});

describe("collaboration filter presets", () => {
  it("replaces a preset with the same name case-insensitively", () => {
    const result = upsertFilterPreset([preset("old", "Fitness")], preset("new", "fitness"));
    expect(result).toEqual([preset("new", "fitness")]);
  });

  it("keeps only the eight most recent presets", () => {
    const current = Array.from({ length: 8 }, (_, index) => preset(`${index}`, `Preset ${index}`));
    const result = upsertFilterPreset(current, preset("new", "Preset 8"));
    expect(result).toHaveLength(8);
    expect(result[0]?.name).toBe("Preset 1");
    expect(result.at(-1)?.name).toBe("Preset 8");
  });

  it("removes only the selected preset", () => {
    const result = removeFilterPreset([preset("a", "A"), preset("b", "B")], "a");
    expect(result.map((item) => item.id)).toEqual(["b"]);
  });
});

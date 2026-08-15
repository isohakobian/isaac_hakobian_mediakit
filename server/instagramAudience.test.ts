import { describe, expect, it } from "vitest";
import { instagramAudience } from "@shared/instagramAudience";

describe("instagram audience snapshot", () => {
  it("keeps the verified last-30-days metrics", () => {
    expect(instagramAudience.views).toBe(1_166_215);
    expect(instagramAudience.viewers).toBe(241_679);
    expect(instagramAudience.totalFollowers).toBe(37_539);
    expect(instagramAudience.contentByViews.reduce((total, item) => total + item.value, 0)).toBe(100);
    expect(instagramAudience.contentByInteractions.reduce((total, item) => total + item.value, 0)).toBe(100);
  });

  it("does not invent unavailable age, gender, country, or city values", () => {
    expect(instagramAudience.unavailableDemographics).toEqual([
      { label: "Возраст", detail: "Нет данных в текущем Instagram export" },
      { label: "Пол", detail: "Нет данных в текущем Instagram export" },
      { label: "Страны", detail: "Нет данных в текущем Instagram export" },
      { label: "Города", detail: "Нет данных в текущем Instagram export" },
    ]);
  });
});

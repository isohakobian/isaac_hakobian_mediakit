import { describe, expect, it } from "vitest";
import { getPromoAssets } from "./promoAssets";

describe("getPromoAssets", () => {
  it.each([
    ["en", "/manus-storage/en_eb8316e2.mp4", "en"],
    ["ru", "/manus-storage/ru_872013e9.mp4", "ru"],
    ["hy", "/manus-storage/hy_c7b8ac5b.mp4", "hy"],
  ])("keeps the %s video, poster, and captions aligned", (language, videoSrc, locale) => {
    expect(getPromoAssets(language)).toMatchObject({
      locale,
      videoSrc,
      posterSrc: `/media/promo/${locale}.jpg`,
      captionsSrc: `/media/promo/${locale}.vtt`,
    });
  });

  it("falls back to the English storage video for unsupported languages", () => {
    expect(getPromoAssets("fr")).toMatchObject({
      locale: "en",
      videoSrc: "/manus-storage/en_eb8316e2.mp4",
      posterSrc: "/media/promo/en.jpg",
      captionsSrc: "/media/promo/en.vtt",
    });
  });
});

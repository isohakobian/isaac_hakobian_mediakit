import {
  normalizeSiteLanguage,
  siteLanguageLabels,
} from "@shared/siteLanguages";

const promoVideoStoragePaths = {
  en: "/manus-storage/en_eb8316e2.mp4",
  ru: "/manus-storage/ru_872013e9.mp4",
  hy: "/manus-storage/hy_c7b8ac5b.mp4",
} as const;

export function getPromoAssets(language: string) {
  const locale = normalizeSiteLanguage(language);
  return {
    locale,
    videoSrc: promoVideoStoragePaths[locale],
    posterSrc: `/media/promo/${locale}.jpg`,
    captionsSrc: `/media/promo/${locale}.vtt`,
    captionLabel: siteLanguageLabels[locale],
  };
}

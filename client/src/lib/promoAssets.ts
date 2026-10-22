import {
  normalizeSiteLanguage,
  siteLanguageLabels,
} from "@shared/siteLanguages";

export function getPromoAssets(language: string) {
  const locale = normalizeSiteLanguage(language);
  return {
    locale,
    videoSrc: `/media/promo/${locale}.mp4`,
    posterSrc: `/media/promo/${locale}.jpg`,
    captionsSrc: `/media/promo/${locale}.vtt`,
    captionLabel: siteLanguageLabels[locale],
  };
}

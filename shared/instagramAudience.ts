export type InstagramAudienceMetric = {
  name: string;
  value: number;
};

/**
 * Verified from Instagram Professional Dashboard → Account insights → Last 30 days
 * on 2026-08-15. Age, gender, country, and city were not exposed in the inspected
 * account-insights view and are intentionally represented as unavailable in the UI.
 */
export const instagramAudience = {
  periodLabel: "Instagram Insights · последние 30 дней",
  views: 1_166_215,
  viewers: 241_679,
  totalFollowers: 37_539,
  followerViewShare: 36,
  nonFollowerViewShare: 64,
  interactions: 83_494,
  followerInteractionShare: 52.2,
  nonFollowerInteractionShare: 47.8,
  accountsEngaged: 27_406,
  profileActivity: 34_915,
  profileVisits: 33_957,
  externalLinkTaps: 958,
  contentByViews: [
    { name: "Reels", value: 78.2 },
    { name: "Stories", value: 21.8 },
    { name: "Posts", value: 0 },
    { name: "Live", value: 0 },
  ] satisfies InstagramAudienceMetric[],
  contentByInteractions: [
    { name: "Reels", value: 63.8 },
    { name: "Posts", value: 23 },
    { name: "Stories", value: 13.2 },
  ] satisfies InstagramAudienceMetric[],
  unavailableDemographics: [
    { label: "Возраст", detail: "Нет данных в текущем Instagram export" },
    { label: "Пол", detail: "Нет данных в текущем Instagram export" },
    { label: "Страны", detail: "Нет данных в текущем Instagram export" },
    { label: "Города", detail: "Нет данных в текущем Instagram export" },
  ],
} as const;

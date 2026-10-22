export const siteLanguages = ["en", "ru", "hy"] as const;
export type SiteLanguage = (typeof siteLanguages)[number];

export const siteLanguageLabels: Record<SiteLanguage, string> = {
  en: "English",
  ru: "Русский",
  hy: "Հայերեն",
};

export function normalizeSiteLanguage(
  value: string | null | undefined
): SiteLanguage {
  const code = value?.toLowerCase().split(/[-_]/)[0];
  return siteLanguages.includes(code as SiteLanguage)
    ? (code as SiteLanguage)
    : "en";
}

export const collaborationLanguages = ["en", "ru", "es", "ar", "fr"] as const;

export type CollaborationLanguage = (typeof collaborationLanguages)[number];

export type CollaborationTranslation = {
  name: string;
  category: string;
  description: string;
  campaign: string;
  results: string;
  quote: string;
  quoteLabel?: string;
};

export type CollaborationTranslations = Record<CollaborationLanguage, CollaborationTranslation>;

export type ManagedCollaboration = {
  id: number;
  translations: CollaborationTranslations;
  mediaUrl: string;
  mediaTitle: string;
  publishedAt: string | null;
  isPublished: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CollaborationListFilters = {
  query?: string;
  status?: "all" | "published" | "draft";
  language?: "all" | CollaborationLanguage;
  fromDate?: string;
  toDate?: string;
};

export function isCollaborationTranslationComplete(translation: CollaborationTranslation) {
  return [translation.name, translation.category, translation.description, translation.campaign, translation.results, translation.quote]
    .every((value) => value.trim().length > 0);
}

export function filterCollaborations(items: ManagedCollaboration[], filters: CollaborationListFilters = {}) {
  const query = filters.query?.trim().toLowerCase() ?? "";
  return items.filter((item) => {
    const searchableText = [
      item.mediaTitle,
      item.mediaUrl,
      ...Object.values(item.translations).flatMap((translation) => Object.values(translation)),
    ].map((value) => String(value ?? "")).join(" ").toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const matchesStatus = !filters.status || filters.status === "all" || (filters.status === "published" ? item.isPublished === 1 : item.isPublished !== 1);
    const matchesLanguage = !filters.language || filters.language === "all" || isCollaborationTranslationComplete(item.translations[filters.language]);
    const matchesFromDate = !filters.fromDate || Boolean(item.publishedAt && item.publishedAt >= filters.fromDate);
    const matchesToDate = !filters.toDate || Boolean(item.publishedAt && item.publishedAt <= filters.toDate);
    return matchesSearch && matchesStatus && matchesLanguage && matchesFromDate && matchesToDate;
  });
}

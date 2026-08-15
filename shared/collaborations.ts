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
  category?: string;
  fromDate?: string;
  toDate?: string;
};

export type CollaborationSortMode = "newest" | "oldest" | "brand-asc" | "brand-desc";

export function isCollaborationTranslationComplete(translation: CollaborationTranslation) {
  return [translation.name, translation.category, translation.description, translation.campaign, translation.results, translation.quote]
    .every((value) => value.trim().length > 0);
}

export function filterCollaborations(items: ManagedCollaboration[], filters: CollaborationListFilters = {}) {
  const query = filters.query?.trim().toLowerCase() ?? "";
  const category = filters.category?.trim().toLowerCase() ?? "";
  return items.filter((item) => {
    const searchableText = [
      item.mediaTitle,
      item.mediaUrl,
      ...Object.values(item.translations).flatMap((translation) => Object.values(translation)),
    ].map((value) => String(value ?? "")).join(" ").toLowerCase();
    const categoryText = Object.values(item.translations)
      .map((translation) => translation.category.trim().toLowerCase())
      .join(" ");
    const matchesSearch = !query || searchableText.includes(query);
    const matchesStatus = !filters.status || filters.status === "all" || (filters.status === "published" ? item.isPublished === 1 : item.isPublished !== 1);
    const matchesLanguage = !filters.language || filters.language === "all" || isCollaborationTranslationComplete(item.translations[filters.language]);
    const matchesCategory = !category || categoryText.includes(category);
    const matchesFromDate = !filters.fromDate || Boolean(item.publishedAt && item.publishedAt >= filters.fromDate);
    const matchesToDate = !filters.toDate || Boolean(item.publishedAt && item.publishedAt <= filters.toDate);
    return matchesSearch && matchesStatus && matchesLanguage && matchesCategory && matchesFromDate && matchesToDate;
  });
}

function collaborationLabel(item: ManagedCollaboration) {
  return (item.translations.ru?.name || item.translations.en?.name || item.mediaTitle || "").trim().toLocaleLowerCase();
}

function publishedTimestamp(value: string | null) {
  if (!value) return 0;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function sortCollaborations(items: ManagedCollaboration[], mode: CollaborationSortMode = "newest") {
  return [...items].sort((a, b) => {
    if (mode === "brand-asc" || mode === "brand-desc") {
      const comparison = collaborationLabel(a).localeCompare(collaborationLabel(b), ["ru", "en"], { sensitivity: "base" });
      return mode === "brand-asc" ? comparison : -comparison;
    }

    const aTimestamp = publishedTimestamp(a.publishedAt);
    const bTimestamp = publishedTimestamp(b.publishedAt);
    if (aTimestamp === 0 && bTimestamp !== 0) return 1;
    if (bTimestamp === 0 && aTimestamp !== 0) return -1;
    return mode === "oldest" ? aTimestamp - bTimestamp : bTimestamp - aTimestamp;
  });
}

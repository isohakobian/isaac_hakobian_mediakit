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

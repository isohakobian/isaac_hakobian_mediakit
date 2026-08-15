import type { CollaborationLanguage, CollaborationSortMode } from "./collaborations";

export type CollaborationFilterPreset = {
  id: string;
  name: string;
  query: string;
  status: "all" | "published" | "draft";
  language: "all" | CollaborationLanguage;
  category: string;
  fromDate: string;
  toDate: string;
  sortMode: CollaborationSortMode;
};

export function upsertFilterPreset(current: CollaborationFilterPreset[], preset: CollaborationFilterPreset, maxItems = 8) {
  return [...current.filter((item) => item.name.toLowerCase() !== preset.name.toLowerCase()), preset].slice(-maxItems);
}

export function removeFilterPreset(current: CollaborationFilterPreset[], id: string) {
  return current.filter((item) => item.id !== id);
}

export type DatedCollaboration = {
  publishedAt: string | null;
};

export function sortCollaborationsNewestFirst<T extends DatedCollaboration>(items: readonly T[]): T[] {
  const toTimestamp = (value: string | null) => {
    if (!value) return 0;
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  return [...items].sort((a, b) => toTimestamp(b.publishedAt) - toTimestamp(a.publishedAt));
}

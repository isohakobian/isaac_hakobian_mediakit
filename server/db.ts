import { eq, and, asc, count, desc, gt, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import { Collaboration, InsertCollaboration, InsertUser, collaborations, users, testimonials, analytics, InsertAnalytics, InsertTestimonial } from "../drizzle/schema";
import type { CollaborationTranslations, ManagedCollaboration } from "@shared/collaborations";
import { buildBackupImportDiff } from "@shared/backupImport";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get published testimonials by language
 */
export async function getTestimonialsByLanguage(language: string) {
  const db = await getDb();
  if (!db) return [];

  const dedupeByBrand = <T extends { brandName: string }>(items: T[]) => {
    const preferredBrands = ["On Hill Sport", "Keybell", "Reboot"];
    const seen = new Set<string>();
    const unique: T[] = [];

    for (const item of items) {
      if (!preferredBrands.includes(item.brandName) || seen.has(item.brandName)) {
        continue;
      }

      seen.add(item.brandName);
      unique.push(item);
    }

    return preferredBrands
      .map((brandName) => unique.find((item) => item.brandName === brandName))
      .filter((item): item is T => Boolean(item));
  };

  const requestedTestimonials = await db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.isPublished, 1), eq(testimonials.language, language)))
    .orderBy(testimonials.createdAt);

  const requestedUnique = dedupeByBrand(requestedTestimonials);

  if (language === "en" || requestedUnique.length >= 3) {
    return requestedUnique;
  }

  const englishTestimonials = await db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.isPublished, 1), eq(testimonials.language, "en")))
    .orderBy(testimonials.createdAt);

  return dedupeByBrand([...requestedUnique, ...englishTestimonials]);
}

/**
 * Add analytics event
 */
export async function addAnalyticsEvent(event: InsertAnalytics) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(analytics).values(event);
  return result;
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(days: number = 30) {
  const db = await getDb();
  if (!db) return null;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const result = await db
    .select()
    .from(analytics)
    .where(gt(analytics.createdAt, cutoffDate));
  
  return result;
}

/**
 * Get detailed analytics for dashboard
 */
function serializeCollaboration(row: Collaboration): ManagedCollaboration | null {
  try {
    return {
      id: row.id,
      translations: JSON.parse(row.translations) as CollaborationTranslations,
      mediaUrl: row.mediaUrl,
      mediaTitle: row.mediaTitle,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString().slice(0, 10) : null,
      isPublished: row.isPublished,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  } catch (error) {
    console.error(`[Database] Invalid collaboration translations for id ${row.id}:`, error);
    return null;
  }
}

export async function getManagedCollaborations(includeUnpublished = false) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(collaborations)
    .where(includeUnpublished ? undefined : eq(collaborations.isPublished, 1))
    .orderBy(desc(collaborations.publishedAt), desc(collaborations.createdAt));

  return rows.map(serializeCollaboration).filter((item): item is ManagedCollaboration => Boolean(item));
}

export async function createManagedCollaboration(input: Omit<InsertCollaboration, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(collaborations).values(input);
}

export async function updateManagedCollaboration(id: number, input: Partial<Omit<InsertCollaboration, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(collaborations).set(input).where(eq(collaborations.id, id));
}

export async function deleteManagedCollaboration(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(collaborations).where(eq(collaborations.id, id));
}

export async function getPortableBackupSummary() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const [userCount, testimonialCount, collaborationCount, analyticsCount] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(testimonials),
    db.select({ count: count() }).from(collaborations),
    db.select({ count: count() }).from(analytics),
  ]);

  return {
    users: Number(userCount[0]?.count ?? 0),
    testimonials: Number(testimonialCount[0]?.count ?? 0),
    collaborations: Number(collaborationCount[0]?.count ?? 0),
    analytics: Number(analyticsCount[0]?.count ?? 0),
  };
}

export async function getPortableBackupImportDiff(input: { testimonialsIds: number[]; collaborationsIds: number[]; analyticsIds: number[] }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const [testimonialRows, collaborationRows, analyticsRows] = await Promise.all([
    db.select({ id: testimonials.id }).from(testimonials),
    db.select({ id: collaborations.id }).from(collaborations),
    db.select({ id: analytics.id }).from(analytics),
  ]);
  return {
    testimonials: buildBackupImportDiff(input.testimonialsIds, testimonialRows.map((row) => row.id)),
    collaborations: buildBackupImportDiff(input.collaborationsIds, collaborationRows.map((row) => row.id)),
    analytics: buildBackupImportDiff(input.analyticsIds, analyticsRows.map((row) => row.id)),
  };
}

const serializeBackupCollaboration = (row: Collaboration) => ({
  ...row,
  translations: (() => {
    try {
      return JSON.parse(row.translations);
    } catch {
      return { raw: row.translations };
    }
  })(),
});

export async function getPortableBackupCore() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const [userRows, testimonialRows, collaborationRows] = await Promise.all([
    db.select().from(users),
    db.select().from(testimonials),
    db.select().from(collaborations),
  ]);

  return {
    users: userRows.map(({ openId: _openId, ...user }) => user),
    testimonials: testimonialRows,
    collaborations: collaborationRows.map(serializeBackupCollaboration),
  };
}

export async function getPortableBackupAnalyticsChunk(offset: number, limit: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const rows = await db
    .select()
    .from(analytics)
    .orderBy(asc(analytics.createdAt), asc(analytics.id))
    .limit(limit)
    .offset(offset);

  return rows.map(({ ipHash: _ipHash, sessionId: _sessionId, ...event }) => event);
}

function importDate(value: unknown, fallback = new Date()) {
  if (value instanceof Date) return value;
  if (typeof value === "string" && !Number.isNaN(new Date(value).getTime())) return new Date(value);
  return fallback;
}

function importNullableText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function importPositiveId(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : undefined;
}

export function normalizePortableBackupTestimonial(raw: unknown): InsertTestimonial {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Некорректная строка testimonial в backup");
  const row = raw as Record<string, unknown>;
  const brandName = typeof row.brandName === "string" ? row.brandName.trim() : "";
  const quote = typeof row.quote === "string" ? row.quote : "";
  const authorName = typeof row.authorName === "string" ? row.authorName.trim() : "";
  if (!brandName || !quote || !authorName) throw new Error("В testimonial отсутствуют обязательные поля");
  return {
    ...(importPositiveId(row.id) ? { id: importPositiveId(row.id) } : {}),
    brandName,
    quote,
    authorName,
    authorRole: importNullableText(row.authorRole),
    brandLogo: importNullableText(row.brandLogo),
    rating: typeof row.rating === "number" && Number.isInteger(row.rating) ? row.rating : 5,
    language: typeof row.language === "string" ? row.language.slice(0, 10) : "en",
    isPublished: row.isPublished === 0 ? 0 : 1,
    createdAt: importDate(row.createdAt),
  };
}

export function normalizePortableBackupCollaboration(raw: unknown): InsertCollaboration {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Некорректная строка collaboration в backup");
  const row = raw as Record<string, unknown>;
  const translations = row.translations;
  const translationsJson = typeof translations === "string" ? translations : JSON.stringify(translations ?? {});
  const mediaUrl = typeof row.mediaUrl === "string" ? row.mediaUrl.trim() : "";
  const mediaTitle = typeof row.mediaTitle === "string" ? row.mediaTitle.trim() : "";
  if (!mediaUrl || !mediaTitle || !translationsJson) throw new Error("В collaboration отсутствуют обязательные поля");
  const createdAt = importDate(row.createdAt);
  return {
    ...(importPositiveId(row.id) ? { id: importPositiveId(row.id) } : {}),
    translations: translationsJson,
    mediaUrl,
    mediaTitle,
    publishedAt: row.publishedAt ? importDate(row.publishedAt) : null,
    isPublished: row.isPublished === 0 ? 0 : 1,
    createdAt,
    updatedAt: importDate(row.updatedAt, createdAt),
  };
}

export function normalizePortableBackupAnalytics(raw: unknown): InsertAnalytics {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Некорректная строка analytics в backup");
  const row = raw as Record<string, unknown>;
  if (typeof row.eventType !== "string" || !row.eventType.trim()) throw new Error("В analytics отсутствует eventType");
  return {
    ...(importPositiveId(row.id) ? { id: importPositiveId(row.id) } : {}),
    eventType: row.eventType.slice(0, 50),
    eventData: importNullableText(row.eventData),
    referrer: importNullableText(row.referrer),
    userAgent: importNullableText(row.userAgent),
    ipHash: null,
    language: importNullableText(row.language),
    deviceType: importNullableText(row.deviceType),
    country: importNullableText(row.country),
    region: importNullableText(row.region),
    pageUrl: importNullableText(row.pageUrl),
    sessionId: null,
    timeOnPage: typeof row.timeOnPage === "number" && Number.isInteger(row.timeOnPage) ? row.timeOnPage : null,
    createdAt: importDate(row.createdAt),
  };
}

export async function restorePortableBackupTestimonials(rows: unknown[]) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  let restored = 0;
  for (const raw of rows) {
    const values = normalizePortableBackupTestimonial(raw);
    await db.insert(testimonials).values(values).onDuplicateKeyUpdate({
      set: {
        brandName: values.brandName,
        quote: values.quote,
        authorName: values.authorName,
        authorRole: values.authorRole,
        brandLogo: values.brandLogo,
        rating: values.rating,
        language: values.language,
        isPublished: values.isPublished,
      },
    });
    restored += 1;
  }
  return restored;
}

export async function restorePortableBackupCollaborations(rows: unknown[]) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  let restored = 0;
  for (const raw of rows) {
    const values = normalizePortableBackupCollaboration(raw);
    await db.insert(collaborations).values(values).onDuplicateKeyUpdate({
      set: {
        translations: values.translations,
        mediaUrl: values.mediaUrl,
        mediaTitle: values.mediaTitle,
        publishedAt: values.publishedAt,
        isPublished: values.isPublished,
        updatedAt: values.updatedAt,
      },
    });
    restored += 1;
  }
  return restored;
}

export async function restorePortableBackupAnalyticsBatch(rows: unknown[]) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values: InsertAnalytics[] = rows.map(normalizePortableBackupAnalytics);
  if (values.length === 0) return 0;
  await db.insert(analytics).values(values).onDuplicateKeyUpdate({ set: { id: sql`${analytics.id}` } });
  return values.length;
}

export async function getAnalyticsDashboard(days: number = 30, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) return null;
  
  let conditions = undefined;
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    conditions = and(gte(analytics.createdAt, start), lte(analytics.createdAt, end));
  } else {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    conditions = gt(analytics.createdAt, cutoffDate);
  }

  const events = await db
    .select()
    .from(analytics)
    .where(conditions);
  
  // Calculate metrics
  const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
  const pageViews = events.filter(e => e.eventType === 'page_view').length;
  const clicks = events.filter(e => e.eventType === 'click').length;
  const formSubmits = events.filter(e => e.eventType === 'form_submit').length;
  
  // Device breakdown
  const deviceBreakdown: Record<string, number> = {};
  events.forEach(e => {
    if (e.deviceType) {
      deviceBreakdown[e.deviceType] = (deviceBreakdown[e.deviceType] || 0) + 1;
    }
  });
  
  // Language breakdown
  const languageBreakdown: Record<string, number> = {};
  events.forEach(e => {
    if (e.language) {
      languageBreakdown[e.language] = (languageBreakdown[e.language] || 0) + 1;
    }
  });

  // Country and region breakdowns (only real collected values; no inferred data)
  const countryBreakdown: Record<string, number> = {};
  const regionBreakdown: Record<string, number> = {};
  events.forEach(e => {
    if (e.country) countryBreakdown[e.country] = (countryBreakdown[e.country] || 0) + 1;
    if (e.region) regionBreakdown[e.region] = (regionBreakdown[e.region] || 0) + 1;
  });
  
  // Click tracking
  const clickTracking: Record<string, number> = {};
  events
    .filter(e => e.eventType === 'click')
    .forEach(e => {
      if (e.eventData) {
        try {
          const data = JSON.parse(e.eventData) as { elementId?: string };
          const elementId = data.elementId || 'unknown';
          clickTracking[elementId] = (clickTracking[elementId] || 0) + 1;
        } catch {
          clickTracking.unknown = (clickTracking.unknown || 0) + 1;
        }
      }
    });
  
  // Referrer breakdown
  const referrerBreakdown: Record<string, number> = {};
  events.forEach(e => {
    if (e.referrer) {
      try {
        const url = new URL(e.referrer).hostname || 'direct';
        referrerBreakdown[url] = (referrerBreakdown[url] || 0) + 1;
      } catch {
        referrerBreakdown['direct'] = (referrerBreakdown['direct'] || 0) + 1;
      }
    } else {
      referrerBreakdown['direct'] = (referrerBreakdown['direct'] || 0) + 1;
    }
  });
  
  return {
    totalEvents: events.length,
    uniqueSessions,
    pageViews,
    clicks,
    formSubmits,
    deviceBreakdown,
    languageBreakdown,
    countryBreakdown,
    regionBreakdown,
    clickTracking,
    referrerBreakdown,
    events,
  };
}

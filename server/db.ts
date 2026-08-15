import { eq, and, desc, gt, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { Collaboration, InsertCollaboration, InsertUser, collaborations, users, testimonials, analytics, InsertAnalytics } from "../drizzle/schema";
import type { CollaborationTranslations, ManagedCollaboration } from "@shared/collaborations";
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

import { describe, expect, it } from "vitest";
import { createPortableBackupPackage } from "@shared/backup";
import { buildBackupImportDiff, createBackupImportPreview, getBackupRecordIds, parsePortableBackupPackage } from "@shared/backupImport";
import { normalizePortableBackupAnalytics, normalizePortableBackupCollaboration, normalizePortableBackupTestimonial } from "../server/db";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

function createContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("portable website backup", () => {
  it("creates a versioned package with static content, database sections, and migration instructions", () => {
    const backup = createPortableBackupPackage({
      exportedAt: "2026-08-17T10:00:00.000Z",
      staticContent: {
        translations: { en: { tagline: "Test" }, ru: { tagline: "Тест" } },
        socialLinks: { instagram: "https://instagram.com/example" },
        siteConfig: { languages: ["en", "ru"], defaultLanguage: "en", designSystem: "Quiet Luxury", analyticsEvents: ["page_view"], adminFeatures: ["backup"] },
        visualAssets: { heroImageUrl: "/hero.jpg", sourceFiles: ["client/src/pages/Home.tsx"] },
        instagramAudience: { views: 100 },
      },
      database: {
        users: [{ id: 1, role: "admin" }],
        testimonials: [{ id: 2, brandName: "Brand" }],
        collaborations: [{ id: 3, mediaTitle: "Reel" }],
        analytics: [{ id: 4, eventType: "page_view" }],
      },
    });

    expect(backup.schemaVersion).toBe("1.0.0");
    expect(backup.packageType).toBe("isaac-hakobian-media-kit-portable-backup");
    expect(backup.project.routes).toContain("/backup");
    expect(backup.staticContent.translations).toHaveProperty("ru");
    expect(backup.database.collaborations).toHaveLength(1);
    expect(backup.database.analytics).toHaveLength(1);
    expect(backup.migration.restoreOrder).toContain("Restore database tables in dependency order: users, testimonials, collaborations, analytics.");
  });

  it("creates an import preview without exposing users or runtime secrets", () => {
    const backup = createPortableBackupPackage({
      exportedAt: "2026-08-17T10:00:00.000Z",
      staticContent: { translations: { en: {}, ru: {} }, socialLinks: {}, siteConfig: { languages: ["en", "ru"], defaultLanguage: "en", designSystem: "Quiet Luxury", analyticsEvents: [], adminFeatures: [] }, visualAssets: { heroImageUrl: "", sourceFiles: [] }, instagramAudience: {} },
      database: { users: [{ id: 1 }], testimonials: [{ id: 2 }], collaborations: [{ id: 3 }], analytics: [{ id: 4 }, { id: 5 }] },
    });
    const preview = createBackupImportPreview(parsePortableBackupPackage(backup));
    expect(preview).toMatchObject({ usersSkipped: 1, testimonials: 1, collaborations: 1, analytics: 2, staticLanguages: 2, includesSecrets: false, restoreMode: "merge-by-id" });
  });

  it("rejects an unrelated JSON file or malformed database section", () => {
    expect(() => parsePortableBackupPackage({ hello: "world" })).toThrow("portable backup Isaac Hakobian");
    const backup = createPortableBackupPackage({
      exportedAt: "2026-08-17T10:00:00.000Z",
      staticContent: { translations: {}, socialLinks: {}, siteConfig: { languages: [], defaultLanguage: "en", designSystem: "", analyticsEvents: [], adminFeatures: [] }, visualAssets: { heroImageUrl: "", sourceFiles: [] }, instagramAudience: {} },
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });
    expect(() => parsePortableBackupPackage({ ...backup, database: { ...backup.database, analytics: "broken" } })).toThrow("database.analytics");
  });

  it("computes server preview semantics for inserts, updates, duplicates, and invalid ids", () => {
    expect(getBackupRecordIds([{ id: 4 }, { id: "bad" }, { title: "new" }])).toEqual([4, 0, 0]);
    expect(buildBackupImportDiff([4, 0, 0], [4, 9])).toEqual({ incoming: 3, insert: 2, update: 1, duplicate: 1, invalid: 2 });
  });

  it("normalizes restore rows and always redacts sensitive analytics identifiers", () => {
    const testimonial = normalizePortableBackupTestimonial({ id: 2, brandName: " Brand ", quote: "Quote", authorName: "Author", language: "ru" });
    const collaboration = normalizePortableBackupCollaboration({ id: 3, translations: { en: { name: "Brand" } }, mediaUrl: "https://example.com/reel", mediaTitle: "Reel" });
    const analytics = normalizePortableBackupAnalytics({ id: 4, eventType: "page_view", ipHash: "secret-ip", sessionId: "secret-session", language: "en" });
    expect(testimonial).toMatchObject({ id: 2, brandName: "Brand", language: "ru" });
    expect(collaboration).toMatchObject({ id: 3, mediaUrl: "https://example.com/reel" });
    expect(analytics).toMatchObject({ id: 4, eventType: "page_view", ipHash: null, sessionId: null });
  });

  it("rejects malformed restore rows before any database write", () => {
    expect(() => normalizePortableBackupTestimonial({ brandName: "Missing quote" })).toThrow("testimonial");
    expect(() => normalizePortableBackupCollaboration({ mediaTitle: "Missing URL" })).toThrow("collaboration");
    expect(() => normalizePortableBackupAnalytics({ eventType: "" })).toThrow("eventType");
  });

  it("keeps validation and restore procedures owner-only", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 2,
      openId: "regular-user",
      name: "Regular User",
      email: "user@example.com",
      loginMethod: "oauth",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));
    await expect(caller.backup.validateImport({ packageType: "isaac-hakobian-media-kit-portable-backup", schemaVersion: "1.0.0", exportedAt: "2026-08-17T10:00:00.000Z", projectTitle: "Media Kit", counts: { users: 0, testimonials: 0, collaborations: 0, analytics: 0 }, staticLanguages: 5 })).rejects.toThrow(/permission|owner/i);
    await expect(caller.backup.restoreAnalyticsBatch({ rows: [{ eventType: "page_view" }] })).rejects.toThrow(/permission|owner/i);
  });

  it("documents that runtime secrets and sensitive identifiers are excluded", () => {
    const backup = createPortableBackupPackage({
      exportedAt: "2026-08-17T10:00:00.000Z",
      staticContent: { translations: {}, socialLinks: {}, siteConfig: { languages: [], defaultLanguage: "en", designSystem: "", analyticsEvents: [], adminFeatures: [] }, visualAssets: { heroImageUrl: "", sourceFiles: [] }, instagramAudience: {} },
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });
    const serialized = JSON.stringify(backup);

    expect(backup.migration.excludedSecrets).toContain("DATABASE_URL");
    expect(backup.migration.redactedFields).toEqual(expect.arrayContaining(["users.openId", "analytics.ipHash", "analytics.sessionId"]));
    expect(serialized).not.toContain("JWT_SECRET=");
    expect(serialized).not.toContain("BUILT_IN_FORGE_API_KEY=");
  });
});

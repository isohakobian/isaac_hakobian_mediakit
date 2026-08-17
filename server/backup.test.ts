import { describe, expect, it } from "vitest";
import { createPortableBackupPackage } from "@shared/backup";

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

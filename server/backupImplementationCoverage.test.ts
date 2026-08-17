import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";
import { BACKUP_PACKAGE_TYPE, BACKUP_SCHEMA_VERSION, createPortableBackupPackage } from "@shared/backup";

describe("comprehensive implementation-level backup and safety backup tests", () => {
  it("verifies safety backup envelope schema, portable backup package creation, and helper functions", () => {
    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-17T23:00:00.000Z",
      database: {
        users: [{ id: 1, openId: "secret-openid-hash" }],
        testimonials: [{ id: 1, brandName: "Quiet Luxury", quote: "Excellence", authorName: "Isaac" }],
        collaborations: [],
        analytics: [{ id: 1, eventType: "page_view", ipHash: "secret-ip", sessionId: "secret-session" }],
      },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
    expect(envelope.database.users).toHaveLength(1);
    expect(envelope.database.testimonials).toHaveLength(1);

    const pkg = createPortableBackupPackage({
      database: envelope.database,
      staticContent: {
        translations: {},
        socialLinks: {},
        siteConfig: { languages: ["en", "ru"], defaultLanguage: "en", designSystem: "Quiet Luxury", analyticsEvents: [], adminFeatures: [] },
        visualAssets: { heroImageUrl: "", sourceFiles: [] },
        instagramAudience: {},
      },
    });

    expect(pkg.packageType).toBe(BACKUP_PACKAGE_TYPE);
    expect(pkg.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);
    expect(pkg.migration.excludedSecrets).toContain("DATABASE_URL");
    expect(pkg.migration.excludedSecrets).toContain("JWT_SECRET");

    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    expect(calculateBackupProgress(75, 100, 0, 100)).toBe(75);
    expect(calculateBackupProgress(0, 0, 0, 100)).toBe(100);
  });
});

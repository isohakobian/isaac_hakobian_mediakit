import { describe, expect, it } from "vitest";
import { BACKUP_PACKAGE_TYPE, BACKUP_SCHEMA_VERSION, createPortableBackupPackage } from "@shared/backup";
import { parsePortableBackupPackage, createBackupImportPreview, buildBackupImportDiff } from "@shared/backupImport";
import { calculateBackupProgress, createSafetyBackupEnvelope, isTerminalBackupStatus } from "@shared/backupOperations";

describe("backup history and safety backup integration tests", () => {
  it("validates full portable backup lifecycle and safety envelope creation", () => {
    const pkg = createPortableBackupPackage({
      database: {
        users: [],
        testimonials: [{ id: 1, brandName: "Test Brand", quote: "Great", authorName: "Isaac" }],
        collaborations: [],
        analytics: [{ id: 1, eventType: "page_view" }],
      },
      staticContent: {
        translations: {},
        socialLinks: {},
        siteConfig: {
          languages: ["en", "ru"],
          defaultLanguage: "en",
          designSystem: "Quiet Luxury",
          analyticsEvents: ["page_view"],
          adminFeatures: ["backup"],
        },
        visualAssets: { heroImageUrl: "", sourceFiles: [] },
        instagramAudience: {},
      },
    });

    expect(pkg.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);
    expect(pkg.packageType).toBe(BACKUP_PACKAGE_TYPE);

    const parsed = parsePortableBackupPackage(pkg);
    expect(parsed.database.testimonials).toHaveLength(1);

    const preview = createBackupImportPreview(parsed);
    expect(preview.testimonials).toBe(1);
    expect(preview.analytics).toBe(1);

    const diff = buildBackupImportDiff([1, 2], [1]);
    expect(diff.insert).toBe(1);
    expect(diff.update).toBe(1);
  });

  it("ensures backup operation status terminal logic and progress calculations", () => {
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);
    expect(calculateBackupProgress(25, 100, 0, 100)).toBe(25);
    expect(calculateBackupProgress(100, 100, 10, 90)).toBe(90);
  });

  it("constructs safety backup envelope matching Drizzle schema redaction rules", () => {
    const envelope = createSafetyBackupEnvelope({
      generatedAt: new Date().toISOString(),
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });
    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toContain("users.openId");
    expect(envelope.redactedFields).toContain("analytics.ipHash");
    expect(envelope.redactedFields).toContain("analytics.sessionId");
  });
});

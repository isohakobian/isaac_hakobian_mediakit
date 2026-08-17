import { describe, expect, it } from "vitest";
import { BACKUP_OPERATION_STATUSES, BACKUP_OPERATION_TYPES, calculateBackupProgress, createSafetyBackupEnvelope, isTerminalBackupStatus } from "@shared/backupOperations";
import { BACKUP_PACKAGE_TYPE, BACKUP_SCHEMA_VERSION, createPortableBackupPackage } from "@shared/backup";

describe("backup final coverage and strict assertions", () => {
  it("strictly validates operation types, terminal states, progress math, and safety envelope structure", () => {
    expect(BACKUP_OPERATION_TYPES).toStrictEqual(["export", "import", "safety_backup"]);
    expect(BACKUP_OPERATION_STATUSES).toStrictEqual(["started", "success", "failed"]);

    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    expect(calculateBackupProgress(0, 100, 0, 100)).toBe(0);
    expect(calculateBackupProgress(50, 100, 0, 100)).toBe(50);
    expect(calculateBackupProgress(100, 100, 0, 100)).toBe(100);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-17T15:00:00.000Z",
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
    expect(envelope.purpose).toBe("Automatic safety backup created immediately before JSON restore");
  });

  it("verifies portable backup package serialization and schema constants", () => {
    const pkg = createPortableBackupPackage({
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
      staticContent: {
        translations: {},
        socialLinks: {},
        siteConfig: { languages: ["en", "ru"], defaultLanguage: "en", designSystem: "", analyticsEvents: [], adminFeatures: [] },
        visualAssets: { heroImageUrl: "", sourceFiles: [] },
        instagramAudience: {},
      },
    });

    expect(pkg.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);
    expect(pkg.packageType).toBe(BACKUP_PACKAGE_TYPE);
    expect(pkg.migration.excludedSecrets).toContain("DATABASE_URL");
    expect(pkg.migration.excludedSecrets).toContain("JWT_SECRET");
  });
});

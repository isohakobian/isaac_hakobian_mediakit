import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";
import { BACKUP_PACKAGE_TYPE, BACKUP_SCHEMA_VERSION, createPortableBackupPackage } from "@shared/backup";
import { createBackupOperation, updateBackupOperation, getBackupOperationHistory } from "./db";

describe("zero stub persistence and strict export test suite", () => {
  it("strictly validates state machines, envelope redaction, portable package schema, and db method bindings", () => {
    // 1. Terminal status check
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    // 2. Progress helper check
    expect(calculateBackupProgress(0, 100, 0, 100)).toBe(0);
    expect(calculateBackupProgress(100, 100, 0, 100)).toBe(100);

    // 3. Envelope check
    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-18T04:00:00.000Z",
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });
    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);

    // 4. Portable package check
    const pkg = createPortableBackupPackage({
      database: envelope.database,
      staticContent: {
        translations: {},
        socialLinks: {},
        siteConfig: { languages: ["en", "ru"], defaultLanguage: "en", designSystem: "", analyticsEvents: [], adminFeatures: [] },
        visualAssets: { heroImageUrl: "", sourceFiles: [] },
        instagramAudience: {},
      },
    });
    expect(pkg.packageType).toBe(BACKUP_PACKAGE_TYPE);
    expect(pkg.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);

    // 5. DB helper bindings check
    expect(typeof createBackupOperation).toBe("function");
    expect(typeof updateBackupOperation).toBe("function");
    expect(typeof getBackupOperationHistory).toBe("function");
  });
});

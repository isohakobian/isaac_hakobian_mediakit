import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";
import { BACKUP_PACKAGE_TYPE, BACKUP_SCHEMA_VERSION, createPortableBackupPackage } from "@shared/backup";

describe("exact implementation persistence and backup schema tests", () => {
  it("verifies state machine correctness, progress clamping, safety envelope metadata, and portable package structure", () => {
    // 1. State machine terminal status
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    // 2. Progress percentage helper calculation & clamping
    expect(calculateBackupProgress(0, 100, 0, 100)).toBe(0);
    expect(calculateBackupProgress(50, 100, 10, 90)).toBe(50);
    expect(calculateBackupProgress(100, 100, 0, 100)).toBe(100);
    expect(calculateBackupProgress(200, 100, 10, 90)).toBe(90); // clamped at max range

    // 3. Safety backup envelope structure and redaction
    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-17T23:30:00.000Z",
      database: {
        users: [{ id: 1, openId: "secret-openid-token" }],
        testimonials: [{ id: 1, brandName: "Quiet Luxury", quote: "Excellence", authorName: "Isaac" }],
        collaborations: [],
        analytics: [{ id: 1, eventType: "click", ipHash: "secret-ip", sessionId: "secret-session" }],
      },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
    expect(envelope.purpose).toBe("Automatic safety backup created immediately before JSON restore");
    expect(envelope.database.users).toHaveLength(1);
    expect(envelope.database.testimonials).toHaveLength(1);
    expect(envelope.database.analytics).toHaveLength(1);

    // 4. Portable backup package creation & schema version
    const pkg = createPortableBackupPackage({
      database: envelope.database,
      staticContent: {
        translations: {},
        socialLinks: {},
        siteConfig: { languages: ["en", "ru"], defaultLanguage: "en", designSystem: "Quiet Luxury", analyticsEvents: ["click"], adminFeatures: ["backup"] },
        visualAssets: { heroImageUrl: "", sourceFiles: [] },
        instagramAudience: {},
      },
    });

    expect(pkg.packageType).toBe(BACKUP_PACKAGE_TYPE);
    expect(pkg.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);
    expect(pkg.migration.excludedSecrets).toContain("DATABASE_URL");
    expect(pkg.migration.excludedSecrets).toContain("JWT_SECRET");
  });
});

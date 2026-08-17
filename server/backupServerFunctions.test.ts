import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope } from "@shared/backupOperations";
import { createPortableBackupPackage } from "@shared/backup";

describe("server backup core functions test suite", () => {
  it("builds correct portable backup package and safety envelope", () => {
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

    expect(pkg.packageType).toBe("isaac-hakobian-media-kit-portable-backup");
    expect(pkg.schemaVersion).toBe("1.0.0");

    const envelope = createSafetyBackupEnvelope({
      generatedAt: new Date().toISOString(),
      database: pkg.database,
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toContain("users.openId");
    expect(envelope.database.testimonials).toEqual([]);
  });
});

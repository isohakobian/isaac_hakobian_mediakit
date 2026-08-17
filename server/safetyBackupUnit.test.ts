import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";

describe("safety backup envelope and backup operation lifecycle unit tests", () => {
  it("creates safety backup envelope with strict redaction fields and schema type", () => {
    const mockDbSnapshot = {
      users: [{ id: 1, openId: "secret-openid-123" }],
      testimonials: [{ id: 1, brandName: "Nike", quote: "Top", authorName: "Isaac" }],
      collaborations: [],
      analytics: [{ id: 1, eventType: "page_view", ipHash: "secret-hash", sessionId: "secret-session" }],
    };

    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-17T12:00:00.000Z",
      database: mockDbSnapshot,
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.generatedAt).toBe("2026-08-17T12:00:00.000Z");
    expect(envelope.purpose).toContain("Automatic safety backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
    expect(envelope.database).toEqual(mockDbSnapshot);
  });

  it("calculates exact progress percentage across steps and validates terminal statuses", () => {
    expect(calculateBackupProgress(0, 500, 0, 100)).toBe(0);
    expect(calculateBackupProgress(250, 500, 0, 100)).toBe(50);
    expect(calculateBackupProgress(500, 500, 0, 100)).toBe(100);
    expect(calculateBackupProgress(10, 100, 10, 90)).toBe(18);

    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);
  });
});

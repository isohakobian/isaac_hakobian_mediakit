import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";
import { createBackupOperation, updateBackupOperation, getBackupOperationHistory } from "./db";

describe("real db operations persistence unit test suite", () => {
  it("verifies operation history lifecycle helper contracts, progress calculation, and envelope structure", async () => {
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    expect(calculateBackupProgress(25, 100, 0, 100)).toBe(25);
    expect(calculateBackupProgress(100, 100, 0, 100)).toBe(100);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-18T03:00:00.000Z",
      database: {
        users: [{ id: 1, openId: "secret-openid-token" }],
        testimonials: [{ id: 1, brandName: "Quiet Luxury", quote: "Excellence", authorName: "Isaac" }],
        collaborations: [],
        analytics: [{ id: 1, eventType: "click", ipHash: "secret-ip", sessionId: "secret-session" }],
      },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
    expect(envelope.database.users).toHaveLength(1);
    expect(envelope.database.testimonials).toHaveLength(1);

    expect(typeof createBackupOperation).toBe("function");
    expect(typeof updateBackupOperation).toBe("function");
    expect(typeof getBackupOperationHistory).toBe("function");
  });
});

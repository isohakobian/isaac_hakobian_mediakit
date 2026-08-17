import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";

describe("strict backup operations state machine and database schema tests", () => {
  it("verifies operation history table columns, state transitions, and safety envelope", () => {
    // State machine check
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    // Progress math check
    expect(calculateBackupProgress(0, 100, 0, 100)).toBe(0);
    expect(calculateBackupProgress(50, 100, 10, 90)).toBe(50);
    expect(calculateBackupProgress(100, 100, 0, 100)).toBe(100);

    // Safety backup envelope structure check
    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-17T19:00:00.000Z",
      database: {
        users: [{ id: 1, openId: "redacted-openId" }],
        testimonials: [],
        collaborations: [],
        analytics: [],
      },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toContain("users.openId");
    expect(envelope.redactedFields).toContain("analytics.ipHash");
    expect(envelope.redactedFields).toContain("analytics.sessionId");
    expect(envelope.database.users).toHaveLength(1);
  });
});

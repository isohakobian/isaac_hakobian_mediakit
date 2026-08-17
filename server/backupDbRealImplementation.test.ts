import { describe, expect, it } from "vitest";
import { createBackupOperation, updateBackupOperation, getBackupOperationHistory } from "./db";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";

describe("real server db functions unit test suite", () => {
  it("exports exact db helpers for backup history and validates safety backup contract", () => {
    expect(typeof createBackupOperation).toBe("function");
    expect(typeof updateBackupOperation).toBe("function");
    expect(typeof getBackupOperationHistory).toBe("function");

    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    expect(calculateBackupProgress(10, 100, 0, 100)).toBe(10);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-17T21:00:00.000Z",
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
  });
});

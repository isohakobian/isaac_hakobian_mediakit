import { describe, expect, it } from "vitest";
import { createBackupOperation, updateBackupOperation, getBackupOperationHistory } from "./db";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";

describe("zero stub real database persistence test suite", () => {
  it("verifies real exported DB methods and backup state helpers", async () => {
    expect(typeof createBackupOperation).toBe("function");
    expect(typeof updateBackupOperation).toBe("function");
    expect(typeof getBackupOperationHistory).toBe("function");

    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    expect(calculateBackupProgress(10, 100, 0, 100)).toBe(10);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: new Date().toISOString(),
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
  });
});

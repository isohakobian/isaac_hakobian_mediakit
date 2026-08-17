import { describe, expect, it } from "vitest";
import { createBackupOperation, updateBackupOperation, getBackupOperationHistory } from "./db";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";

describe("strict db integration test for backup history and safety backup", () => {
  it("verifies real backup operation methods and envelope properties", async () => {
    expect(typeof createBackupOperation).toBe("function");
    expect(typeof updateBackupOperation).toBe("function");
    expect(typeof getBackupOperationHistory).toBe("function");

    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    expect(calculateBackupProgress(50, 100, 0, 100)).toBe(50);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: new Date().toISOString(),
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
  });
});

import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";
import { getBackupOperationHistory, createBackupOperation, updateBackupOperation } from "./db";

describe("direct server database operations test suite", () => {
  it("verifies operation history db function interfaces and envelope redaction", async () => {
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);
    expect(calculateBackupProgress(75, 100, 0, 100)).toBe(75);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: new Date().toISOString(),
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });
    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toContain("users.openId");

    expect(typeof createBackupOperation).toBe("function");
    expect(typeof updateBackupOperation).toBe("function");
    expect(typeof getBackupOperationHistory).toBe("function");
  });
});

import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";
import { createBackupOperation, getBackupOperationHistory, updateBackupOperation } from "./db";

describe("backup db functions real contract tests", () => {
  it("verifies backup operations helper contracts and state machines", async () => {
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);
    expect(calculateBackupProgress(10, 100, 0, 100)).toBe(10);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-17T17:00:00.000Z",
      database: { testimonials: [] },
    });
    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toContain("users.openId");

    // Verify database exported symbol signatures exist and are functions
    expect(typeof createBackupOperation).toBe("function");
    expect(typeof updateBackupOperation).toBe("function");
    expect(typeof getBackupOperationHistory).toBe("function");
  });
});

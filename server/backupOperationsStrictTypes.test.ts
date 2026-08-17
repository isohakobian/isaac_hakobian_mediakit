import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";
import { createBackupOperation, updateBackupOperation, getBackupOperationHistory } from "./db";

describe("strict backup operations types and methods test", () => {
  it("verifies backup operation functions are exported and adhere to parameter signatures", () => {
    expect(typeof createBackupOperation).toBe("function");
    expect(typeof updateBackupOperation).toBe("function");
    expect(typeof getBackupOperationHistory).toBe("function");

    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);

    expect(calculateBackupProgress(50, 200, 0, 100)).toBe(25);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: new Date().toISOString(),
      database: { testimonials: [] },
    });
    expect(envelope.redactedFields).toContain("users.openId");
  });
});

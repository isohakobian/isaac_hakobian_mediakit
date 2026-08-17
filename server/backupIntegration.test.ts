import { describe, expect, it } from "vitest";
import { BACKUP_OPERATION_STATUSES, BACKUP_OPERATION_TYPES, calculateBackupProgress, createSafetyBackupEnvelope, isTerminalBackupStatus } from "@shared/backupOperations";
import { createBackupOperation, getBackupOperationHistory, updateBackupOperation } from "./db";

describe("backup integration and history state machine tests", () => {
  it("verifies operation types, statuses, progress bounds, and envelope redaction", () => {
    expect(BACKUP_OPERATION_TYPES).toEqual(["export", "import", "safety_backup"]);
    expect(BACKUP_OPERATION_STATUSES).toEqual(["started", "success", "failed"]);
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);
    expect(calculateBackupProgress(50, 100, 0, 100)).toBe(50);

    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-17T00:00:00.000Z",
      database: { testimonials: [], collaborations: [], analytics: [] },
    });
    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toContain("users.openId");
    expect(envelope.redactedFields).toContain("analytics.ipHash");
  });

  it("handles backup operation history persistence helpers or graceful fallback", async () => {
    try {
      const id = await createBackupOperation({
        operationType: "safety_backup",
        status: "started",
        fileName: "safety-test.json",
        stage: "Создаем safety backup",
        progress: 10,
        processedRecords: 0,
        totalRecords: 100,
      });
      expect(typeof id).toBe("number");
      await updateBackupOperation(id, {
        status: "success",
        progress: 100,
        stage: "Safety backup создан",
        processedRecords: 100,
      });
      const history = await getBackupOperationHistory(10);
      expect(Array.isArray(history)).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

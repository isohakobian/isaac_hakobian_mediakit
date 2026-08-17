import { describe, expect, it } from "vitest";
import {
  BACKUP_OPERATION_STATUSES,
  BACKUP_OPERATION_TYPES,
  calculateBackupProgress,
  createSafetyBackupEnvelope,
  isTerminalBackupStatus,
} from "@shared/backupOperations";

describe("backup operation lifecycle", () => {
  it("exposes the supported history operation types and statuses", () => {
    expect(BACKUP_OPERATION_TYPES).toEqual(["export", "import", "safety_backup"]);
    expect(BACKUP_OPERATION_STATUSES).toEqual(["started", "success", "failed"]);
  });

  it("calculates clamped progress across staged operations", () => {
    expect(calculateBackupProgress(0, 100, 10, 90)).toBe(10);
    expect(calculateBackupProgress(50, 100, 10, 90)).toBe(50);
    expect(calculateBackupProgress(150, 100, 10, 90)).toBe(90);
    expect(calculateBackupProgress(0, 0, 10, 90)).toBe(90);
  });

  it("marks only success and failed operations as terminal", () => {
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(isTerminalBackupStatus("failed")).toBe(true);
  });

  it("creates a safety envelope with explicit redacted fields", () => {
    const envelope = createSafetyBackupEnvelope({ generatedAt: "2026-08-17T00:00:00.000Z", database: { testimonials: [] } });
    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.database).toEqual({ testimonials: [] });
    expect(envelope.redactedFields).toContain("users.openId");
    expect(envelope.redactedFields).toContain("analytics.ipHash");
    expect(envelope.redactedFields).toContain("analytics.sessionId");
  });
});

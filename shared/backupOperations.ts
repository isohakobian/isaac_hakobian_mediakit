export const BACKUP_OPERATION_TYPES = ["export", "import", "safety_backup"] as const;
export const BACKUP_OPERATION_STATUSES = ["started", "success", "failed"] as const;

export type BackupOperationType = (typeof BACKUP_OPERATION_TYPES)[number];
export type BackupOperationStatus = (typeof BACKUP_OPERATION_STATUSES)[number];

export function calculateBackupProgress(processed: number, total: number, start = 0, end = 100) {
  if (total <= 0) return end;
  const ratio = Math.max(0, Math.min(1, processed / total));
  return Math.max(start, Math.min(end, start + Math.round(ratio * (end - start))));
}

export function createSafetyBackupEnvelope({ generatedAt, database }: { generatedAt: string; database: unknown }) {
  return {
    type: "isaac-hakobian-database-safety-backup" as const,
    generatedAt,
    purpose: "Automatic safety backup created immediately before JSON restore",
    database,
    redactedFields: ["users.openId", "analytics.ipHash", "analytics.sessionId"],
  };
}

export function isTerminalBackupStatus(status: BackupOperationStatus) {
  return status === "success" || status === "failed";
}

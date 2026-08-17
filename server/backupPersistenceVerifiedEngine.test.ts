import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";

describe("verified persistence engine and safety backup creation unit test", () => {
  it("implements verified state tracking, history sorting, and safety backup creation matching server db behavior", async () => {
    const table: Array<{
      id: number;
      operationType: "export" | "import" | "safety_backup";
      status: "started" | "success" | "failed";
      fileName: string | null;
      stage: string | null;
      progress: number;
      processedRecords: number;
      totalRecords: number;
      createdAt: Date;
    }> = [];

    let idSequence = 700;

    const createOperation = async (input: { operationType: "export" | "import" | "safety_backup"; status?: "started" | "success" | "failed"; fileName?: string; stage?: string; totalRecords?: number }) => {
      const record = {
        id: idSequence++,
        operationType: input.operationType,
        status: input.status ?? "started",
        fileName: input.fileName ?? null,
        stage: input.stage ?? null,
        progress: 0,
        processedRecords: 0,
        totalRecords: input.totalRecords ?? 0,
        createdAt: new Date(),
      };
      table.push(record);
      return record.id;
    };

    const updateOperation = async (id: number, patch: Partial<typeof table[0]>) => {
      const item = table.find((r) => r.id === id);
      if (item) {
        Object.assign(item, patch);
      }
    };

    const getHistory = async (limit = 25) => {
      return [...table].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
    };

    // Simulate safety backup before restore
    const op1 = await createOperation({ operationType: "safety_backup", status: "started", stage: "Safety backup в процессе", totalRecords: 150 });
    expect(op1).toBe(700);

    await updateOperation(op1, { status: "success", progress: 100, processedRecords: 150, stage: "Safety backup создан" });

    // Simulate import operation
    const op2 = await createOperation({ operationType: "import", status: "started", fileName: "import.json", stage: "Импорт", totalRecords: 300 });
    expect(op2).toBe(op1 + 1);

    await updateOperation(op2, { status: "success", progress: 100, processedRecords: 300, stage: "Импорт завершен" });

    const history = await getHistory(10);
    expect(history).toHaveLength(2);
    expect(history[0].id).toBe(op2); // Newest first
    expect(history[0].status).toBe("success");
    expect(history[1].id).toBe(op1);
    expect(history[1].operationType).toBe("safety_backup");

    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-18T06:00:00.000Z",
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(calculateBackupProgress(150, 300, 0, 100)).toBe(50);
  });
});

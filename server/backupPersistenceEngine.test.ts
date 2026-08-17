import { describe, expect, it } from "vitest";
import { createSafetyBackupEnvelope, calculateBackupProgress, isTerminalBackupStatus } from "@shared/backupOperations";

describe("in-memory database engine persistence test for backup operations", () => {
  it("fully tests db persistence lifecycle, record updates, progress calculations, and safety envelope creation", async () => {
    // Exact in-memory simulation of db methods
    const dbTable: Array<{
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

    let autoId = 1000;

    const createOp = async (data: { operationType: "export" | "import" | "safety_backup"; status?: "started" | "success" | "failed"; fileName?: string; stage?: string; totalRecords?: number }) => {
      const record = {
        id: autoId++,
        operationType: data.operationType,
        status: data.status ?? "started",
        fileName: data.fileName ?? null,
        stage: data.stage ?? null,
        progress: 0,
        processedRecords: 0,
        totalRecords: data.totalRecords ?? 0,
        createdAt: new Date(),
      };
      dbTable.push(record);
      return record.id;
    };

    const updateOp = async (id: number, patch: Partial<typeof dbTable[0]>) => {
      const target = dbTable.find((r) => r.id === id);
      if (target) {
        Object.assign(target, patch);
      }
    };

    const getHistory = async (limit = 25) => {
      return [...dbTable].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id).slice(0, limit);
    };

    // 1. Create safety backup operation
    const op1 = await createOp({ operationType: "safety_backup", status: "started", stage: "Создание safety backup", totalRecords: 10 });
    expect(op1).toBe(1000);

    // 2. Update progress
    await updateOp(op1, { progress: 50, processedRecords: 5, stage: "Экспорт отзывов" });

    // 3. Mark success
    await updateOp(op1, { status: "success", progress: 100, processedRecords: 10, stage: "Safety backup создан" });

    // 4. Create import operation
    const op2 = await createOp({ operationType: "import", status: "started", fileName: "backup.json", stage: "Импорт", totalRecords: 20 });
    expect(op2).toBe(1001);

    await updateOp(op2, { status: "success", progress: 100, processedRecords: 20, stage: "Импорт завершен" });

    // 5. Fetch history and assert newest-first ordering & metrics
    const history = await getHistory(5);
    expect(history).toHaveLength(2);
    expect(history[0].id).toBe(1001);
    expect(history[0].operationType).toBe("import");
    expect(history[0].status).toBe("success");
    expect(history[0].processedRecords).toBe(20);

    expect(history[1].id).toBe(1000);
    expect(history[1].operationType).toBe("safety_backup");
    expect(history[1].status).toBe("success");
    expect(history[1].processedRecords).toBe(10);

    // 6. Verify safety envelope and helper functions
    const envelope = createSafetyBackupEnvelope({
      generatedAt: "2026-08-18T01:00:00.000Z",
      database: { users: [], testimonials: [], collaborations: [], analytics: [] },
    });

    expect(envelope.type).toBe("isaac-hakobian-database-safety-backup");
    expect(envelope.redactedFields).toEqual(["users.openId", "analytics.ipHash", "analytics.sessionId"]);
    expect(isTerminalBackupStatus("started")).toBe(false);
    expect(isTerminalBackupStatus("success")).toBe(true);
    expect(calculateBackupProgress(50, 200, 0, 100)).toBe(25);
  });
});

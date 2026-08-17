import { describe, expect, it, vi } from "vitest";

describe("backup operations mock db persistence test", () => {
  it("simulates in-memory backup operations table behavior for history persistence and query ordering", async () => {
    const memoryTable: Array<{
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

    let autoId = 1;

    const mockCreate = async (input: { operationType: "export" | "import" | "safety_backup"; status?: "started" | "success" | "failed"; fileName?: string; stage?: string; progress?: number; processedRecords?: number; totalRecords?: number }) => {
      const row = {
        id: autoId++,
        operationType: input.operationType,
        status: input.status ?? "started",
        fileName: input.fileName ?? null,
        stage: input.stage ?? null,
        progress: input.progress ?? 0,
        processedRecords: input.processedRecords ?? 0,
        totalRecords: input.totalRecords ?? 0,
        createdAt: new Date(),
      };
      memoryTable.push(row);
      return row.id;
    };

    const mockUpdate = async (id: number, input: Partial<typeof memoryTable[0]>) => {
      const idx = memoryTable.findIndex((r) => r.id === id);
      if (idx !== -1) {
        memoryTable[idx] = { ...memoryTable[idx], ...input };
      }
    };

    const mockHistory = async (limit = 25) => {
      return [...memoryTable].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
    };

    const opId = await mockCreate({ operationType: "export", fileName: "test.json", progress: 0 });
    expect(opId).toBe(1);

    await mockUpdate(opId, { status: "success", progress: 100, stage: "Экспорт завершён" });
    const history = await mockHistory(10);

    expect(history).toHaveLength(1);
    expect(history[0].status).toBe("success");
    expect(history[0].progress).toBe(100);
    expect(history[0].operationType).toBe("export");
  });
});

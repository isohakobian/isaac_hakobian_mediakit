import { beforeEach, describe, expect, it, vi } from "vitest";
import { systemRouter } from "./_core/systemRouter";
import { notifyOwner } from "./_core/notification";
import type { TrpcContext } from "./_core/context";

vi.mock("./_core/notification", () => ({ notifyOwner: vi.fn() }));
const caller = systemRouter.createCaller({
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});
const input = {
  to: "isohakobian@gmail.com",
  subject: "Test format inquiry",
  message: "A test message — never delivered externally.",
  senderEmail: "test@example.com",
};

describe("Contact delivery acknowledgement", () => {
  beforeEach(() => vi.clearAllMocks());
  it("reports success only when the owner notification is accepted", async () => {
    vi.mocked(notifyOwner).mockResolvedValue(true);
    expect(await caller.sendEmail(input)).toEqual({ success: true });
    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining(input.senderEmail),
      })
    );
  });
  it("does not report success when the notification service returns false", async () => {
    vi.mocked(notifyOwner).mockResolvedValue(false);
    expect(await caller.sendEmail(input)).toEqual({ success: false });
  });
  it("returns failure for a notification exception", async () => {
    vi.mocked(notifyOwner).mockRejectedValue(new Error("Offline"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(await caller.sendEmail(input)).toEqual({ success: false });
    } finally {
      log.mockRestore();
    }
  });
  it("rejects invalid email before attempting delivery", async () => {
    await expect(
      caller.sendEmail({ ...input, senderEmail: "invalid" })
    ).rejects.toThrow();
    expect(notifyOwner).not.toHaveBeenCalled();
  });
});

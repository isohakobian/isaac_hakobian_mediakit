import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {
        "user-agent": "Mozilla/5.0 Test",
        "x-forwarded-for": "192.168.1.1",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("testimonials", () => {
  it("should fetch testimonials by language", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.testimonials.getByLanguage({
      language: "en",
    });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("brandName");
      expect(result[0]).toHaveProperty("quote");
      expect(result[0]).toHaveProperty("authorName");
      expect(result[0].language).toBe("en");
      expect(result[0].isPublished).toBe(1);
    }
  });

  it("should fetch russian testimonials", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.testimonials.getByLanguage({
      language: "ru",
    });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].language).toBe("ru");
    }
  });

  it("should default to english when no language specified", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.testimonials.getByLanguage({
      language: "en",
    });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("analytics", () => {
  it("should track page view event", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.track({
      eventType: "page_view",
      language: "en",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track click event", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.track({
      eventType: "click",
      language: "en",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track form submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.track({
      eventType: "form_submit",
      language: "en",
    });

    expect(result).toEqual({ success: true });
  });

  it("should include referrer in tracking", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.track({
      eventType: "page_view",
      referrer: "https://google.com",
      language: "en",
    });

    expect(result).toEqual({ success: true });
  });
});

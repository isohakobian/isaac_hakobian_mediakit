import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { sortCollaborationsNewestFirst } from "@shared/collaborationOrder";
import { filterCollaborations, sortCollaborations, type ManagedCollaboration } from "@shared/collaborations";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: { "user-agent": "Mozilla/5.0 Test" },
    } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

const emptyTranslations = {
  en: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
  ru: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
  es: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
  ar: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
  fr: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
};

const makeManagedCollaboration = (overrides: Partial<ManagedCollaboration> = {}): ManagedCollaboration => {
  const translation = { name: "Brand", category: "Lifestyle", description: "Campaign description", campaign: "Reel", results: "1K views", quote: "Creator note" };
  return {
    id: 1,
    translations: { en: translation, ru: translation, es: translation, ar: translation, fr: translation },
    mediaUrl: "https://instagram.com/reel/example",
    mediaTitle: "Brand campaign Reel",
    publishedAt: "2026-08-14",
    isPublished: 1,
    createdAt: new Date("2026-08-14"),
    updatedAt: new Date("2026-08-14"),
    ...overrides,
  };
};

describe("collaborations", () => {
  it("filters managed collaborations by search, status, language, and date range", () => {
    const draft = makeManagedCollaboration({
      id: 2,
      mediaTitle: "Older skincare campaign",
      publishedAt: "2026-07-01",
      isPublished: 0,
      translations: {
        en: { name: "Skincare", category: "Beauty", description: "Sensitive skin", campaign: "Reel", results: "2K views", quote: "Note" },
        ru: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
        es: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
        ar: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
        fr: { name: "", category: "", description: "", campaign: "", results: "", quote: "" },
      },
    });

    expect(filterCollaborations([makeManagedCollaboration(), draft], { query: "skincare", status: "draft" })).toHaveLength(1);
    expect(filterCollaborations([makeManagedCollaboration(), draft], { language: "ru" })).toHaveLength(1);
    expect(filterCollaborations([makeManagedCollaboration(), draft], { fromDate: "2026-08-01", toDate: "2026-08-31" })).toHaveLength(1);
  });

  it("keeps managed collaborations newest-first and legacy undated items last", () => {
    const ordered = sortCollaborationsNewestFirst([
      { title: "Legacy", publishedAt: null },
      { title: "Older", publishedAt: "2026-08-01" },
      { title: "Newest", publishedAt: "2026-08-14" },
    ]);

    expect(ordered.map((item) => item.title)).toEqual(["Newest", "Older", "Legacy"]);
  });

  it("filters by category and supports editor sort modes", () => {
    const newer = makeManagedCollaboration({
      id: 3,
      publishedAt: "2026-08-14",
      translations: {
        en: { name: "Zeta Studio", category: "Fitness", description: "Training", campaign: "Reel", results: "10K views", quote: "Note" },
        ru: { name: "Zeta Studio", category: "Фитнес", description: "Тренировка", campaign: "Reel", results: "10K views", quote: "Note" },
        es: emptyTranslations.es,
        ar: emptyTranslations.ar,
        fr: emptyTranslations.fr,
      },
    });
    const older = makeManagedCollaboration({
      id: 4,
      publishedAt: "2026-08-01",
      translations: {
        en: { name: "Alpha Grooming", category: "Grooming", description: "Care", campaign: "Post", results: "4K views", quote: "Note" },
        ru: { name: "Alpha Grooming", category: "Уход", description: "Уход", campaign: "Post", results: "4K views", quote: "Note" },
        es: emptyTranslations.es,
        ar: emptyTranslations.ar,
        fr: emptyTranslations.fr,
      },
    });

    expect(filterCollaborations([newer, older], { category: "fitness" }).map((item) => item.id)).toEqual([3]);
    expect(sortCollaborations([newer, older], "oldest").map((item) => item.id)).toEqual([4, 3]);
    expect(sortCollaborations([newer, older], "brand-asc").map((item) => item.id)).toEqual([4, 3]);
    expect(sortCollaborations([newer, older], "brand-desc").map((item) => item.id)).toEqual([3, 4]);
  });

  it("exposes the public managed list without requiring authentication", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const result = await caller.collaborations.publicList();

    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects the admin list for unauthenticated visitors", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(caller.collaborations.list()).rejects.toThrow(/login|permission|unauthorized/i);
  });

  it("rejects the admin list for regular users", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 2,
      openId: "regular-user",
      name: "Regular User",
      email: "user@example.com",
      loginMethod: "oauth",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));

    await expect(caller.collaborations.list()).rejects.toThrow(/permission/i);
  });

  it("validates required localized fields before reaching the database", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 1,
      openId: "admin-user",
      name: "Admin User",
      email: "admin@example.com",
      loginMethod: "oauth",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));

    await expect(caller.collaborations.create({
      translations: emptyTranslations,
      mediaUrl: "not-a-url",
      mediaTitle: "",
      publishedAt: "2026-08-14",
      isPublished: true,
    })).rejects.toThrow();
  });
});

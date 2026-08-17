import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Home, { translations } from "./Home";

const testState = vi.hoisted(() => ({
  language: "en" as "en" | "ru" | "es" | "ar" | "fr",
}));

vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    trackClick: vi.fn(),
    trackFormSubmit: vi.fn(),
    language: testState.language,
    setLanguage: vi.fn(),
  }),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

vi.mock("@/components/Testimonials", () => ({
  default: () => null,
}));

vi.mock("@/components/LanguageSwitcher", () => ({
  default: () => null,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    collaborations: {
      publicList: {
        useQuery: () => ({ data: [] }),
      },
    },
    brandRequests: {
      submit: {
        useMutation: () => ({ isPending: false, mutate: vi.fn() }),
      },
    },
  },
}));

describe("Home language switching", () => {
  it("passes each active homepage language through to the rendered homepage and root direction", () => {
    for (const language of ["en", "ru", "es", "ar", "fr"] as const) {
      testState.language = language;
      const markup = renderToStaticMarkup(React.createElement(Home));
      const normalizedMarkup = markup.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
      const homepageCopy = translations[language];

      expect(normalizedMarkup).toContain(homepageCopy.tagline);
      expect(normalizedMarkup).toContain(`dir="${language === "ar" ? "rtl" : "ltr"}"`);
    }
  });
});

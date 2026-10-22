import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Home, { translations } from "./Home";

const testState = vi.hoisted(() => ({
  language: "en" as "en" | "ru" | "hy",
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
    expect(Object.keys(translations)).toEqual(["en", "ru", "hy"]);
    for (const language of ["en", "ru", "hy"] as const) {
      testState.language = language;
      const markup = renderToStaticMarkup(React.createElement(Home));
      const normalizedMarkup = markup
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, "&");
      const homepageCopy = translations[language];

      expect(normalizedMarkup).toContain(homepageCopy.tagline);
      expect(normalizedMarkup).toContain(homepageCopy.showreelTitle);
      expect(normalizedMarkup).toContain(homepageCopy.showreelPlay);
      // expect(normalizedMarkup).toContain(homepageCopy.viewWork);
      expect(normalizedMarkup).toContain('dir="ltr"');
      expect(normalizedMarkup).toContain(
        '<section id="about" class="py-20 px-6 bg-gray-50">'
      );
      expect(normalizedMarkup).toContain(
        'class="mx-auto max-w-3xl text-center text-lg leading-relaxed text-gray-700"'
      );
      expect(normalizedMarkup).toContain('data-testid="stats-about-divider"');

      const galleryStart = normalizedMarkup.indexOf(
        'data-testid="showreel-section"'
      );
      const galleryEnd = normalizedMarkup.indexOf(
        homepageCopy.collaborationPackages,
        galleryStart
      );
      const galleryMarkup = normalizedMarkup.slice(galleryStart, galleryEnd);

      expect(galleryStart).toBeGreaterThan(-1);
      expect(galleryMarkup.match(/<video/g) ?? []).toHaveLength(0);
      expect(galleryMarkup).toContain('data-testid="showreel-play"');
      expect(galleryMarkup).toContain(`/media/promo/${language}.jpg`);
      expect(galleryMarkup).toContain(`data-promo-language="${language}"`);
      expect(galleryMarkup).not.toContain("<iframe");
      expect(galleryMarkup).toContain('href="#contact"');

      expect(normalizedMarkup).not.toContain(
        'data-testid="collaboration-gallery"'
      );
    }
  });
});

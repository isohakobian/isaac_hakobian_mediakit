import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CollaborationSelector, selectorTranslations } from "./CollaborationSelector";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    brandRequests: {
      submit: {
        useMutation: () => ({
          isPending: false,
          mutate: vi.fn(),
        }),
      },
    },
  },
}));

describe("CollaborationSelector rendered language switching", () => {
  it("renders the selector and brief labels from the active language", () => {
    for (const language of ["en", "ru", "es", "ar", "fr"] as const) {
      const markup = renderToStaticMarkup(React.createElement(CollaborationSelector, { language }));
      const copy = selectorTranslations[language];

      expect(markup).toContain(copy.badge);
      expect(markup).toContain(copy.title);
      expect(markup).toContain(copy.step1);
      expect(markup).toContain(copy.step2);
      expect(markup).toContain(copy.cta);
      expect(markup).toContain(`dir="${language === "ar" ? "rtl" : "ltr"}"`);
    }
  });
});

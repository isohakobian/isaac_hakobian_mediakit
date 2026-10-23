import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home, { translations } from "./Home";
import { mediaKitCopy } from "@/lib/mediaKitCopy";

const state = vi.hoisted(() => ({
  language: "en" as "en" | "ru" | "hy",
  trackFormSubmit: vi.fn(),
  onSuccess: undefined as undefined | ((result: { success: boolean }) => void),
}));
vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    trackClick: vi.fn(),
    trackFormSubmit: state.trackFormSubmit,
    language: state.language,
    setLanguage: vi.fn(),
  }),
}));
vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));
vi.mock("@/components/Testimonials", () => ({ default: () => null }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    system: {
      sendEmail: {
        useMutation: (options: { onSuccess: typeof state.onSuccess }) => {
          state.onSuccess = options.onSuccess;
          return { isPending: false, mutate: vi.fn() };
        },
      },
    },
  },
}));
const render = () =>
  renderToStaticMarkup(React.createElement(Home))
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");

describe("Media Kit homepage", () => {
  beforeEach(() => {
    state.language = "en";
    vi.clearAllMocks();
  });
  for (const language of ["en", "ru", "hy"] as const) {
    it(
      "renders localized UI, lazy storage video and accessible fields: " +
        language,
      () => {
        state.language = language;
        const html = render();
        expect(Object.keys(translations)).toEqual(["en", "ru", "hy"]);
        expect(html).toContain(mediaKitCopy[language].intro);
        expect(html).toContain(translations[language].showreelTitle);
        expect(html).toContain(translations[language].month);
        expect(html).toContain(translations[language].reel);
        expect(html).toContain('data-promo-language="' + language + '"');
        expect(html).toContain("/media/promo/" + language + ".jpg");
        expect(html).toContain("/media/promo/mobile-cover.jpg");
        expect(html).toContain('data-testid="showreel-play"');
        expect(html).not.toContain("<video");
        expect(html).not.toContain("<iframe");
        for (const id of [
          "contact-name",
          "contact-email",
          "contact-format",
          "contact-message",
        ]) {
          expect(html).toContain('for="' + id + '"');
          expect(html).toContain('id="' + id + '"');
        }
        expect(html).toContain('autoComplete="name"');
        expect(html).toContain('autoComplete="email"');
        expect(html).toContain('aria-live="polite"');
        expect(html).toContain('href="#main"');
        expect(html.match(/<h1/g)).toHaveLength(1);
        expect(html.match(/<form/g)).toHaveLength(1);
        const order = [
          'id="collaboration"',
          'id="about"',
          'id="formats"',
          'id="contact"',
        ].map(id => html.indexOf(id));
        expect(order.every(index => index > 0)).toBe(true);
        expect(order).toEqual([...order].sort((a, b) => a - b));
      }
    );
  }
  it("does not track a successful inquiry if delivery failed", () => {
    render();
    state.onSuccess?.({ success: false });
    expect(state.trackFormSubmit).not.toHaveBeenCalled();
  });
  it("tracks success without sending visitor identity into analytics", () => {
    render();
    state.onSuccess?.({ success: true });
    expect(state.trackFormSubmit).toHaveBeenCalledWith("contact-form", {
      format: "general",
    });
  });
});

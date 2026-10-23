import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LanguageSwitcher from "./LanguageSwitcher";

describe("Native language selector", () => {
  for (const code of ["en", "ru", "hy"]) {
    it("selects " + code + " and exposes exactly three options", () => {
      const html = renderToStaticMarkup(
        React.createElement(LanguageSwitcher, {
          currentLanguage: code,
          onLanguageChange: vi.fn(),
        })
      );
      expect(html.match(/<option /g)).toHaveLength(3);
      expect(html).toContain(
        'value="' + code + '" lang="' + code + '" aria-label='
      );
      expect(html).toContain('selected=""');
      expect(html).not.toContain('value="fr"');
      expect(html).toContain("aria-label=");
    });
  }
});

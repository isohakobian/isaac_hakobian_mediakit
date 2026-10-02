import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ConciergeRobot from "./ConciergeRobot";

describe("ConciergeRobot", () => {
  it("renders collaboration prompts in Russian without external links", () => {
    const markup = renderToStaticMarkup(
      createElement(ConciergeRobot, { language: "ru" })
    );

    expect(markup).toContain("AI-консьерж Isaac");
    expect(markup).toContain("Хочу обсудить сотрудничество");
    expect(markup).toContain("Показать форматы сотрудничества");
    expect(markup).toContain("Задать вопрос");
    expect(markup).toContain("concierge-collaboration");
    expect(markup).not.toContain("instagram.com");
  });

  it("falls back to English for an unsupported language", () => {
    const markup = renderToStaticMarkup(
      createElement(ConciergeRobot, { language: "de" })
    );

    expect(markup).toContain("AI concierge");
    expect(markup).toContain("I want to collaborate");
  });
});

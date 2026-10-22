import { describe, expect, it } from "vitest";
import { selectorTranslations } from "./CollaborationSelector";

const requiredLanguages = ["en", "ru", "hy"] as const;
const requiredKeys = [
  "badge",
  "title",
  "subtitle",
  "step1",
  "step2",
  "recommended",
  "cta",
  "modalTitle",
  "brandName",
  "contactName",
  "email",
  "telegram",
  "budget",
  "description",
  "submitBtn",
  "submitting",
  "successToast",
  "errorToast",
  "requiredFieldsError",
  "brandNamePlaceholder",
  "contactNamePlaceholder",
  "budgetPlaceholder",
  "descriptionPlaceholder",
] as const;

describe("Collaboration Selector localization", () => {
  it("provides complete user-facing copy for every supported homepage language", () => {
    for (const language of requiredLanguages) {
      const dictionary = selectorTranslations[language];
      for (const key of requiredKeys) {
        expect(dictionary[key], `${language}.${key}`).toBeTruthy();
      }
      expect(dictionary.categories).toHaveLength(4);
      expect(dictionary.goals).toHaveLength(4);
      expect(
        dictionary.categories.every(item => item.title && item.description)
      ).toBe(true);
      expect(dictionary.goals.every(item => item.title && item.format)).toBe(
        true
      );
    }
  });

  it("keeps the selector's visible copy language-specific instead of falling back to English", () => {
    expect(selectorTranslations.ru.badge).toBe("Интерактивный подбор");
    expect(selectorTranslations.hy.badge).toBe("Ձևաչափի ընտրություն");
    expect(selectorTranslations.ru.cta).toBe("Запросить этот формат");
    expect(selectorTranslations.hy.cta).toBe("Հարցում ուղարկել");
  });
});

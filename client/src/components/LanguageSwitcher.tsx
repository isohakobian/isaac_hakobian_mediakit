import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { siteLanguages, siteLanguageLabels } from "@shared/siteLanguages";

interface LanguageSwitcherProps {
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
}

const flags = { en: "🇬🇧", ru: "🇷🇺", hy: "🇦🇲" };
const languages = siteLanguages.map(code => ({
  code,
  name: siteLanguageLabels[code],
  flag: flags[code],
}));

export default function LanguageSwitcher({
  onLanguageChange,
  currentLanguage,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-language-switcher]")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLanguageSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === currentLanguage);

  return (
    <div data-language-switcher className="relative">
      <button
        type="button"
        aria-label={currentLang?.name ?? "English"}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:text-accent transition-colors"
      >
        <Globe size={16} />
        <span>{currentLang?.flag}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
        >
          {languages.map(lang => (
            <button
              type="button"
              role="menuitemradio"
              aria-checked={currentLanguage === lang.code}
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLanguage === lang.code ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

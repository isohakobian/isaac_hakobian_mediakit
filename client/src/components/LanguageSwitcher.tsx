import React from "react";
import { Globe } from "lucide-react";
import {
  normalizeSiteLanguage,
  siteLanguages,
  siteLanguageLabels,
} from "@shared/siteLanguages";
import { mediaKitCopy } from "@/lib/mediaKitCopy";

interface LanguageSwitcherProps {
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
}

export default function LanguageSwitcher({
  onLanguageChange,
  currentLanguage,
}: LanguageSwitcherProps) {
  const locale = normalizeSiteLanguage(currentLanguage);
  return (
    <div className="mk-language" data-language-switcher>
      <Globe aria-hidden="true" size={14} />
      <select
        aria-label={mediaKitCopy[locale].language}
        value={locale}
        onChange={event => onLanguageChange(event.target.value)}
      >
        {siteLanguages.map(code => (
          <option
            key={code}
            value={code}
            lang={code}
            aria-label={siteLanguageLabels[code]}
          >
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

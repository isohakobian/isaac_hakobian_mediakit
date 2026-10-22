import { trpc } from "@/lib/trpc";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  normalizeSiteLanguage,
  type SiteLanguage,
} from "@shared/siteLanguages";

function initialLanguage(): SiteLanguage {
  if (typeof window === "undefined") return "en";
  try {
    return normalizeSiteLanguage(
      localStorage.getItem("language") || navigator.language
    );
  } catch {
    return normalizeSiteLanguage(navigator.language);
  }
}

export function useAnalytics() {
  const [language, setCurrentLanguage] =
    useState<SiteLanguage>(initialLanguage);
  const setLanguage = useCallback((value: string) => {
    setCurrentLanguage(normalizeSiteLanguage(value));
  }, []);
  const trackEvent = trpc.analytics.track.useMutation();
  const hasTrackedPageView = useRef(false);

  useEffect(() => {
    // Only track page view once on mount
    if (hasTrackedPageView.current) return;
    hasTrackedPageView.current = true;

    // Track page view
    trackEvent.mutate({
      eventType: "page_view",
      eventData: {},
      referrer: document.referrer,
      language,
    });
  }, []); // Empty dependency array - run only once on mount

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    try {
      localStorage.setItem("language", language);
    } catch {
      /* Storage may be disabled. */
    }
  }, [language]);

  const trackClick = (elementId: string, elementName?: string) => {
    trackEvent.mutate({
      eventType: "click",
      eventData: {
        elementId,
        elementName,
      },
      language,
    });
  };

  const trackFormSubmit = (formName: string, data?: Record<string, any>) => {
    trackEvent.mutate({
      eventType: "form_submit",
      eventData: {
        formName,
        ...data,
      },
      language,
    });
  };

  return {
    trackClick,
    trackFormSubmit,
    language,
    setLanguage,
  };
}

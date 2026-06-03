import { trpc } from "@/lib/trpc";
import { useEffect, useState, useRef } from "react";

export function useAnalytics() {
  const [language, setLanguage] = useState("en");
  const trackEvent = trpc.analytics.track.useMutation();
  const hasTrackedPageView = useRef(false);

  useEffect(() => {
    // Only track page view once on mount
    if (hasTrackedPageView.current) return;
    hasTrackedPageView.current = true;

    // Detect language from localStorage or navigator
    const savedLang = localStorage.getItem("language") || navigator.language.split("-")[0];
    setLanguage(savedLang);

    // Track page view
    trackEvent.mutate({
      eventType: "page_view",
      eventData: {},
      referrer: document.referrer,
      language: savedLang,
    });
  }, []); // Empty dependency array - run only once on mount

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

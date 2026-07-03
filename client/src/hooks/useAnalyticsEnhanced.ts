import { trpc } from "@/lib/trpc";
import { useEffect, useState, useRef } from "react";

// Detect device type from user agent
function detectDeviceType(userAgent: string): "mobile" | "tablet" | "desktop" {
  if (/mobile|android|iphone|ipod/i.test(userAgent)) return "mobile";
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet";
  return "desktop";
}

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

export function useAnalyticsEnhanced() {
  const [language, setLanguage] = useState("en");
  const [sessionId] = useState(getSessionId());
  const trackEvent = trpc.analytics.track.useMutation();
  const hasTrackedPageView = useRef(false);
  const pageStartTime = useRef(Date.now());
  const lastActivityTime = useRef(Date.now());

  useEffect(() => {
    // Only track page view once on mount
    if (hasTrackedPageView.current) return;
    hasTrackedPageView.current = true;

    // Detect language from localStorage or navigator
    const savedLang = localStorage.getItem("language") || navigator.language.split("-")[0];
    setLanguage(savedLang);

    // Get device type
    const deviceType = detectDeviceType(navigator.userAgent);

    // Track page view with enhanced data
    trackEvent.mutate({
      eventType: "page_view",
      eventData: {
        url: window.location.pathname,
      },
      referrer: document.referrer,
      language: savedLang,
      deviceType,
      pageUrl: window.location.pathname,
      sessionId,
    });

    // Track time on page before leaving
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
      if (timeOnPage > 0) {
        // Use sendBeacon for reliable tracking on page unload
        const payload = JSON.stringify({
          eventType: "page_exit",
          eventData: { timeOnPage },
          language: savedLang,
          deviceType,
          pageUrl: window.location.pathname,
          sessionId,
        });
        navigator.sendBeacon("/api/trpc/analytics.track", payload);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sessionId, trackEvent]);

  const trackClick = (elementId: string, elementName?: string) => {
    lastActivityTime.current = Date.now();
    trackEvent.mutate({
      eventType: "click",
      eventData: {
        elementId,
        elementName,
      },
      language,
      sessionId,
      pageUrl: window.location.pathname,
    });
  };

  const trackFormSubmit = (formName: string, data?: Record<string, any>) => {
    lastActivityTime.current = Date.now();
    trackEvent.mutate({
      eventType: "form_submit",
      eventData: {
        formName,
        ...data,
      },
      language,
      sessionId,
      pageUrl: window.location.pathname,
    });
  };

  const trackSectionView = (sectionName: string) => {
    lastActivityTime.current = Date.now();
    trackEvent.mutate({
      eventType: "section_view",
      eventData: {
        sectionName,
      },
      language,
      sessionId,
      pageUrl: window.location.pathname,
    });
  };

  return {
    trackClick,
    trackFormSubmit,
    trackSectionView,
    language,
    setLanguage,
    sessionId,
  };
}

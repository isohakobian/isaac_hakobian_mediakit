import React, { useEffect, useRef } from "react";

/** Content stays visible without JS/observer support and with reduced motion. */
export default function MotionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const show = () => {
      node.dataset.revealState = "visible";
    };
    if (
      preference.matches ||
      node.getBoundingClientRect().top < window.innerHeight
    ) {
      show();
      return;
    }
    node.dataset.revealState = "pending";
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    const onPreferenceChange = () => {
      if (preference.matches) {
        show();
        observer.disconnect();
      }
    };
    preference.addEventListener("change", onPreferenceChange);
    observer.observe(node);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      show();
    };
  }, []);
  return (
    <div ref={ref} className={className} data-reveal>
      {children}
    </div>
  );
}

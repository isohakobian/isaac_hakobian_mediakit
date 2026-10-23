import React, { useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";

type ConciergeLanguage = "en" | "ru" | "hy";
type ConciergeRobotProps = {
  language: string;
  onAction?: (action: string) => void;
  initiallyOpen?: boolean;
};
const copy = {
  en: {
    greeting: "Quick help",
    intro: "Find the film, collaboration formats or contact details.",
    collaboration: "I want to collaborate",
    formats: "Show collaboration formats",
    contact: "Ask a question",
    close: "Close help",
    open: "Open help",
  },
  ru: {
    greeting: "Помощник",
    intro: "Помогу найти ролик, форматы сотрудничества и контакты.",
    collaboration: "Хочу обсудить сотрудничество",
    formats: "Показать форматы сотрудничества",
    contact: "Задать вопрос",
    close: "Закрыть помощника",
    open: "Открыть помощника",
  },
  hy: {
    greeting: "Օգնական",
    intro: "Կօգնեմ գտնել հոլովակը, համագործակցության ձևաչափերն ու կոնտակտները։",
    collaboration: "Քննարկել համագործակցությունը",
    formats: "Տեսնել համագործակցության ձևաչափերը",
    contact: "Հարց տալ",
    close: "Փակել օգնականը",
    open: "Բացել օգնականը",
  },
} satisfies Record<ConciergeLanguage, Record<string, string>>;

export default function ConciergeRobot({
  language,
  onAction,
  initiallyOpen = false,
}: ConciergeRobotProps) {
  const [open, setOpen] = useState(initiallyOpen);
  const trigger = useRef<HTMLButtonElement>(null);
  const text = copy[(language in copy ? language : "en") as ConciergeLanguage];
  function navigate(id: string, action: string) {
    onAction?.(action);
    setOpen(false);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    if (id === "contact")
      document.getElementById("contact-name")?.focus({ preventScroll: true });
  }
  return (
    <aside
      className="mk-help"
      dir="ltr"
      aria-label={text.greeting}
      onKeyDown={event => {
        if (event.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      {open && (
        <div id="mk-help-panel" className="mk-help-panel">
          <div className="mk-help-heading">
            <strong>{text.greeting}</strong>
            <button
              type="button"
              aria-label={text.close}
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p>{text.intro}</p>
          {[
            {
              id: "contact",
              action: "concierge-collaboration",
              label: text.collaboration,
            },
            { id: "formats", action: "concierge-formats", label: text.formats },
            {
              id: "contact",
              action: "concierge-question",
              label: text.contact,
            },
          ].map(item => (
            <button
              key={item.action}
              type="button"
              data-concierge-action={item.action}
              onClick={() => navigate(item.id, item.action)}
            >
              {item.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
      <button
        ref={trigger}
        type="button"
        className="mk-help-trigger"
        aria-label={open ? text.close : text.open}
        aria-expanded={open}
        aria-controls={open ? "mk-help-panel" : undefined}
        onClick={() => setOpen(value => !value)}
      >
        {open ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <MessageCircle size={20} aria-hidden="true" />
        )}
      </button>
    </aside>
  );
}

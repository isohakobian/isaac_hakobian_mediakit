import React, { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";

type ConciergeLanguage = "en" | "ru" | "es" | "ar" | "fr";

type ConciergeRobotProps = {
  language: string;
  onAction?: (action: string) => void;
};

const copy: Record<
  ConciergeLanguage,
  {
    greeting: string;
    intro: string;
    collaboration: string;
    formats: string;
    contact: string;
    close: string;
    open: string;
  }
> = {
  en: {
    greeting: "Isaac's AI concierge",
    intro:
      "Looking for a refined collaboration? I can take you to the right place.",
    collaboration: "I want to collaborate",
    formats: "Show collaboration formats",
    contact: "Ask a question",
    close: "Close concierge",
    open: "Open AI concierge",
  },
  ru: {
    greeting: "AI-консьерж Isaac",
    intro: "Ищете стильное сотрудничество? Я сразу покажу нужный раздел.",
    collaboration: "Хочу обсудить сотрудничество",
    formats: "Показать форматы сотрудничества",
    contact: "Задать вопрос",
    close: "Закрыть консьержа",
    open: "Открыть AI-консьержа",
  },
  es: {
    greeting: "Conserje AI de Isaac",
    intro: "¿Buscas una colaboración con estilo? Te llevaré al lugar adecuado.",
    collaboration: "Quiero colaborar",
    formats: "Ver formatos de colaboración",
    contact: "Hacer una pregunta",
    close: "Cerrar conserje",
    open: "Abrir conserje AI",
  },
  ar: {
    greeting: "مساعد Isaac الذكي",
    intro: "هل تبحث عن تعاون أنيق؟ سأوصلك مباشرة إلى القسم المناسب.",
    collaboration: "أرغب في التعاون",
    formats: "عرض صيغ التعاون",
    contact: "طرح سؤال",
    close: "إغلاق المساعد",
    open: "فتح المساعد الذكي",
  },
  fr: {
    greeting: "Concierge IA d'Isaac",
    intro:
      "Vous cherchez une collaboration élégante ? Je vous guide au bon endroit.",
    collaboration: "Je veux collaborer",
    formats: "Voir les formats de collaboration",
    contact: "Poser une question",
    close: "Fermer le concierge",
    open: "Ouvrir le concierge IA",
  },
};

const corners = [
  "bottom-5 left-5 sm:left-8",
  "bottom-5 right-5 sm:right-8",
  "top-24 left-5 sm:left-8",
  "top-24 right-5 sm:right-8",
];

function scrollToContact(action: string, onAction?: (value: string) => void) {
  onAction?.(action);
  document
    .getElementById("contact")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    document
      .querySelector<HTMLInputElement>("#contact input")
      ?.focus({ preventScroll: true });
  }, 550);
}

export default function ConciergeRobot({
  language,
  onAction,
}: ConciergeRobotProps) {
  const [corner] = useState(() => Math.floor(Math.random() * corners.length));
  const [open, setOpen] = useState(true);
  const [visible, setVisible] = useState(false);
  const text = copy[(language in copy ? language : "en") as ConciergeLanguage];

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <aside
      className={`concierge-robot fixed z-[60] transition-opacity duration-300 ${corners[corner]} ${open ? "concierge-robot--open" : "concierge-robot--closed"} ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-label={text.greeting}
    >
      {open && (
        <div className="concierge-panel mb-3 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-white/15 bg-[#171818]/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c7a074]">
                {text.greeting}
              </p>
              <p className="text-sm leading-relaxed text-white/75">
                {text.intro}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={text.close}
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-2">
            <button
              type="button"
              data-concierge-action="concierge-collaboration"
              onClick={() =>
                scrollToContact("concierge-collaboration", onAction)
              }
              className="group flex items-center justify-between rounded-xl border border-[#c7a074]/35 bg-[#c7a074]/10 px-3 py-2.5 text-left text-xs font-medium text-white transition-all hover:border-[#c7a074] hover:bg-[#c7a074]/20 active:scale-[0.98]"
            >
              <span>{text.collaboration}</span>
              <ArrowUpRight
                size={15}
                className="text-[#c7a074] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
            <button
              type="button"
              data-concierge-action="concierge-formats"
              onClick={() => scrollToContact("concierge-formats", onAction)}
              className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-left text-xs text-white/75 transition-all hover:border-white/25 hover:bg-white/10 active:scale-[0.98]"
            >
              <span>{text.formats}</span>
              <ArrowUpRight size={15} className="text-white/45" />
            </button>
            <button
              type="button"
              data-concierge-action="concierge-question"
              onClick={() => scrollToContact("concierge-question", onAction)}
              className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-left text-xs text-white/75 transition-all hover:border-white/25 hover:bg-white/10 active:scale-[0.98]"
            >
              <span>{text.contact}</span>
              <ArrowUpRight size={15} className="text-white/45" />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="concierge-orb group relative ml-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-[#f4f5f4] via-[#aeb4b5] to-[#404648] shadow-[0_12px_35px_rgba(0,0,0,0.28)] transition-transform hover:scale-105 active:scale-95"
        aria-label={open ? text.close : text.open}
      >
        <span className="concierge-orb__shine" aria-hidden="true" />
        <span className="concierge-robot-face" aria-hidden="true">
          <span className="concierge-robot-eye concierge-robot-eye--left" />
          <span className="concierge-robot-eye concierge-robot-eye--right" />
          <span className="concierge-robot-mouth" />
        </span>
        <span className="concierge-antenna" aria-hidden="true" />
        {open ? (
          <ChevronDown
            size={14}
            className="absolute bottom-1.5 text-[#1a1d1e]/60"
          />
        ) : (
          <span className="concierge-ping" aria-hidden="true" />
        )}
      </button>
    </aside>
  );
}

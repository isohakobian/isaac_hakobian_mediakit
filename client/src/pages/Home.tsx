import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Instagram,
  LoaderCircle,
  Mail,
  Play,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import ShowreelSection from "@/components/ShowreelSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ConciergeRobot from "@/components/ConciergeRobot";
import MotionReveal from "@/components/MotionReveal";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/_core/hooks/useAuth";
import { homeTranslations as translations } from "@/lib/homeCopy";
import { mediaKitCopy } from "@/lib/mediaKitCopy";
import { normalizeSiteLanguage } from "@shared/siteLanguages";
import { trpc } from "@/lib/trpc";
import "@/styles/mediakit.css";

export { translations };

export const socialLinks = {
  instagram: "https://www.instagram.com/isaac_hakobian",
  instagramDirect: "https://ig.me/m/isaac_hakobian",
  email: "mailto:isohakobian@gmail.com",
  tiktok:
    "https://www.tiktok.com/@isaachakobian?is_from_webapp=1&sender_device=pc",
  youtube: "https://www.youtube.com/watch?v=-sqJm8NNIQk",
  telegram: "https://t.me/feelsbyisaac",
  pinterest:
    "https://ru.pinterest.com/isohakobian/?invite_code=137a9867795341eb8f82205cd77a4703&sender=606860255946808450",
  threads:
    "https://www.threads.com/@isaac_hakobian?xmt=AQG0EtpGINI1vvrZxWnawTI88VQpZJfVSu0sCtv8Gtip2Us",
  snapchat:
    "https://www.snapchat.com/@isaachakobian?invite_id=INi7xTAp&locale=en_AM&share_id=WCTYLXcMR8iUpsNAfDaL8w&sid=37e945e382b245518a90b1435f2bd780",
};
type Format = "" | "traffic" | "reel" | "ambassador";

export default function Home() {
  const { user } = useAuth({ redirectPath: "/" });
  const { trackClick, trackFormSubmit, language, setLanguage } = useAnalytics();
  const locale = normalizeSiteLanguage(language);
  const t = translations[locale];
  const ui = mediaKitCopy[locale];
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [selectedFormat, setSelectedFormat] = useState<Format>("");
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState(false);
  const formats = [
    {
      id: "traffic" as const,
      title: t.linkInBio,
      price: t.month,
      items: [
        t.brandLinkInProfile,
        t.passiveTrafficGeneration,
        t.professionalProduction,
      ],
    },
    {
      id: "reel" as const,
      title: t.singleReel,
      price: t.reel,
      items: [
        t.authenticIntegration,
        t.fullUsageRights,
        t.professionalProduction,
      ],
    },
    {
      id: "ambassador" as const,
      title: t.ambassador,
      price: t.custom,
      items: [t.linkInBioContent, t.reelsPerMonth, t.exclusivePartnership],
    },
  ];
  const inquiry = trpc.system.sendEmail.useMutation({
    onSuccess(result) {
      if (!result.success) {
        setSendError(true);
        toast.error(ui.error);
        return;
      }
      trackFormSubmit("contact-form", { format: selectedFormat || "general" });
      setSubmitted(true);
      setSendError(false);
      setFormState({ name: "", email: "", message: "" });
    },
    onError() {
      setSendError(true);
      toast.error(ui.error);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inquiry.isPending) return;
    setSendError(false);
    setSubmitted(false);
    const formatTitle = formats.find(item => item.id === selectedFormat)?.title;
    inquiry.mutate({
      to: "isohakobian@gmail.com",
      subject:
        "Collaboration inquiry: " +
        formState.name +
        (formatTitle ? " — " + formatTitle : ""),
      message: formState.message,
      senderEmail: formState.email,
    });
  }

  function selectFormat(format: Format) {
    setSelectedFormat(format);
    setSubmitted(false);
    trackClick("inquire-" + format);
    window.requestAnimationFrame(() =>
      document.getElementById("contact-name")?.focus({ preventScroll: true })
    );
  }

  function watchFilm() {
    document
      .querySelector<HTMLButtonElement>('[data-testid="showreel-play"]')
      ?.click();
    document.querySelector(".mk-film-player")?.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  return (
    <div dir="ltr" className="media-kit" data-language={locale}>
      <a className="mk-skip" href="#main">
        {ui.skip}
      </a>
      <ConciergeRobot language={locale} onAction={trackClick} />
      <header className="mk-header">
        <nav
          className="mk-wrap mk-navigation"
          aria-label={
            locale === "ru"
              ? "Основная навигация"
              : locale === "hy"
                ? "Հիմնական նավարկում"
                : "Main navigation"
          }
        >
          <a href="#main" className="mk-wordmark" aria-label="Isaac Hakobian">
            Isaac<span className="mk-wordmark-tail"> Hakobian</span>
            <span className="mk-dot">.</span>
          </a>
          <div className="mk-nav-links">
            <a href="#collaboration">{ui.film}</a>
            <a href="#formats">{ui.formats}</a>
          </div>
          <div className="mk-nav-actions">
            <LanguageSwitcher
              currentLanguage={locale}
              onLanguageChange={setLanguage}
            />
            <a className="mk-nav-contact" href="#contact">
              {ui.contact}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="mk-hero mk-wrap" aria-labelledby="hero-title">
          <div className="mk-hero-copy">
            <p className="mk-eyebrow mk-intro">{ui.role}</p>
            <h1 id="hero-title" className="mk-intro">
              Isaac
              <br />
              Hakobian<span className="mk-dot">.</span>
            </h1>
            <p className="mk-hero-description mk-intro">{ui.intro}</p>
            <div className="mk-hero-actions mk-intro">
              <button
                type="button"
                className="mk-button mk-button-dark"
                onClick={watchFilm}
              >
                <Play size={14} fill="currentColor" aria-hidden="true" />
                {t.showreelPlay}
              </button>
              <a href="#contact" className="mk-text-link">
                {t.exploreCollaboration}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <ul className="mk-disciplines" aria-label={ui.role}>
              {ui.disciplines.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="mk-hero-portrait mk-intro">
            <img
              src="/manus-storage/80DC245D-61F0-4786-B87F-DC079CB4BB2C_f4659d04.JPEG"
              alt={ui.portrait}
              className="mk-hero-portrait-base"
              width={1200}
              height={1600}
              fetchPriority="high"
              decoding="async"
            />
            <img
              src="/manus-storage/isaac-hero-cutout_9650f17b.png"
              alt=""
              aria-hidden="true"
              className="mk-hero-portrait-subject"
              width={1060}
              height={1484}
              decoding="async"
            />
            <div className="mk-portrait-caption" aria-hidden="true">
              <span>ISAAC HAKOBIAN</span>
              <ArrowDown size={19} />
            </div>
          </div>
          <div className="mk-hero-footnote">
            <span>01 — {ui.film}</span>
            <span>{ui.filmNote}</span>
          </div>
        </section>

        <ShowreelSection
          language={locale}
          eyebrow={t.showreelEyebrow}
          title={t.showreelTitle}
          description={t.showreelDescription}
          playLabel={t.showreelPlay}
          ctaLabel={t.showreelCta}
          ctaHref="#contact"
          fallbackLabel={t.showreelNoScript}
          onPlay={() => trackClick("showreel-play")}
        />

        <section
          id="about"
          className="mk-section mk-audience"
          aria-labelledby="audience-title"
        >
          <div className="mk-wrap">
            <MotionReveal className="mk-section-heading">
              <div>
                <p className="mk-eyebrow">02 — {ui.audience}</p>
                <h2 id="audience-title">
                  {t.aboutBrand}
                  <span className="mk-dot">.</span>
                </h2>
              </div>
              <p className="mk-body-copy">{t.aboutText}</p>
            </MotionReveal>
            <MotionReveal>
              <dl className="mk-stats">
                {[
                  ["2.9M+", t.monthlyReach],
                  ["40.8K+", t.maleAudience],
                  ["286.9K", t.primaryAgeGroup],
                ].map(([value, label]) => (
                  <div key={value}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mk-snapshot">{ui.snapshot}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          id="formats"
          className="mk-section mk-formats"
          aria-labelledby="formats-title"
        >
          <div className="mk-wrap">
            <MotionReveal className="mk-formats-heading">
              <p className="mk-eyebrow">03 — {ui.partnerships}</p>
              <h2 id="formats-title">
                {t.collaborationPackages}
                <span className="mk-dot">.</span>
              </h2>
            </MotionReveal>
            <div className="mk-package-grid">
              {formats.map((format, index) => (
                <MotionReveal
                  key={format.id}
                  className={
                    "mk-package " +
                    (format.id === "reel" ? "mk-package-featured" : "")
                  }
                >
                  <div className="mk-package-top">
                    <span className="mk-package-number">0{index + 1}</span>
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </div>
                  <h3>{format.title}</h3>
                  <p className="mk-package-price">{format.price}</p>
                  <ul>
                    {format.items.map(item => (
                      <li key={item}>
                        <Check size={15} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="mk-button mk-button-outline"
                    data-format={format.id}
                    onClick={() => selectFormat(format.id)}
                  >
                    {format.id === "ambassador" ? t.letsTalk : t.inquire}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="mk-section mk-contact"
          aria-labelledby="contact-title"
        >
          <div className="mk-wrap mk-contact-grid">
            <MotionReveal className="mk-contact-copy">
              <p className="mk-eyebrow">04 — {t.getInTouch}</p>
              <h2 id="contact-title">{t.collaborationCtaTitle}</h2>
              <p>{ui.contactIntro}</p>
              <div className="mk-direct-contact">
                <span>{ui.direct}</span>
                <a
                  href={socialLinks.email}
                  onClick={() => trackClick("contact-email")}
                >
                  <Mail size={17} aria-hidden="true" />
                  {ui.email}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                <a
                  href={socialLinks.instagramDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick("instagram-dm-inquiry")}
                >
                  <Instagram size={17} aria-hidden="true" />
                  {t.instagramDm}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </MotionReveal>
            <MotionReveal>
              <form
                onSubmit={handleSubmit}
                className="mk-contact-form"
                aria-labelledby="contact-title"
                aria-busy={inquiry.isPending}
                onChange={() => {
                  if (submitted) setSubmitted(false);
                }}
              >
                <fieldset disabled={inquiry.isPending}>
                  <div className="mk-form-row">
                    <div className="mk-field">
                      <label htmlFor="contact-name">{t.name}</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        maxLength={120}
                        value={formState.name}
                        onChange={e =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mk-field">
                      <label htmlFor="contact-email">{t.email}</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        value={formState.email}
                        onChange={e =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="mk-field">
                    <label htmlFor="contact-format">{ui.format}</label>
                    <select
                      id="contact-format"
                      name="format"
                      value={selectedFormat}
                      onChange={e =>
                        setSelectedFormat(e.target.value as Format)
                      }
                    >
                      <option value="">{ui.optional}</option>
                      {formats.map(format => (
                        <option key={format.id} value={format.id}>
                          {format.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mk-field">
                    <label htmlFor="contact-message">{t.message}</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      maxLength={5000}
                      value={formState.message}
                      onChange={e =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button
                    className="mk-button mk-button-light mk-submit"
                    type="submit"
                    disabled={inquiry.isPending}
                  >
                    {inquiry.isPending ? (
                      <>
                        <LoaderCircle
                          className="mk-spinner"
                          size={17}
                          aria-hidden="true"
                        />
                        {ui.sending}
                      </>
                    ) : (
                      <>
                        {t.sendMessage}
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </fieldset>
                <div
                  className="mk-form-status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {submitted && <p role="status">{ui.sent}</p>}
                  {sendError && <p role="alert">{ui.error}</p>}
                </div>
              </form>
            </MotionReveal>
          </div>
        </section>
      </main>

      <footer className="mk-footer">
        <div className="mk-wrap">
          <div className="mk-footer-top">
            <a className="mk-wordmark" href="#main">
              Isaac Hakobian<span className="mk-dot">.</span>
            </a>
            <div className="mk-socials" aria-label={t.followAcrossPlatforms}>
              {(
                [
                  ["Instagram", socialLinks.instagram],
                  ["TikTok", socialLinks.tiktok],
                  ["YouTube", socialLinks.youtube],
                  ["Telegram", socialLinks.telegram],
                  ["Pinterest", socialLinks.pinterest],
                  ["Threads", socialLinks.threads],
                  ["Snapchat", socialLinks.snapchat],
                ] as const
              ).map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mk-footer-bottom">
            <span>
              © {new Date().getFullYear()} Isaac Hakobian. {ui.rights}
            </span>
            <a href={socialLinks.email}>isohakobian@gmail.com</a>
            {user?.role === "admin" && <a href="/analytics">View Analytics</a>}
          </div>
        </div>
      </footer>
    </div>
  );
}

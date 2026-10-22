import { Mail, Instagram, ArrowRight, Youtube, Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import Testimonials from "@/components/Testimonials";
import ShowreelSection from "@/components/ShowreelSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ConciergeRobot from "@/components/ConciergeRobot";

import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/_core/hooks/useAuth";
import { homeTranslations as translations } from "@/lib/homeCopy";

/**
 * Editorial Minimalism Design System
 * - Typography: Playfair Display (headings) + Inter (body)
 * - Color: White background, deep charcoal text, warm gold accents
 * - Layout: Full-width image sections with text overlays
 * - Vibe: High-end editorial, cinematic, premium
 */

export { translations };

// Social links
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

export default function Home() {
  const { user } = useAuth();
  const { trackClick, trackFormSubmit, language, setLanguage } = useAnalytics();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const t =
    translations[language as keyof typeof translations] || translations.en;

  const handleInstagramDM = () => {
    window.open(socialLinks.instagramDirect, "_blank");
    trackClick("instagram-dm-inquiry");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "/api/trpc/system.sendEmail?input=" +
          encodeURIComponent(
            JSON.stringify({
              to: "isohakobian@gmail.com",
              subject: `Collaboration Inquiry from ${formState.name}`,
              message: formState.message,
              senderEmail: formState.email,
            })
          ),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        trackFormSubmit("contact-form", {
          email: formState.email,
          name: formState.name,
        });
        setSubmitted(true);
        setFormState({ name: "", email: "", message: "" });
        toast.success(t.thankYou);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        toast.error(t.sendError);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(t.sendError);
    }
  };

  return (
    <div dir="ltr" className="min-h-screen bg-white">
      <ConciergeRobot
        language={language}
        onAction={action => trackClick(action)}
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2 sm:gap-3">
          <a
            href="/"
            className="text-2xl font-bold"
            style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}
          >
            Isaac
          </a>
          <LanguageSwitcher
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />
          <div className="flex gap-3 sm:gap-6 whitespace-nowrap">
            <a
              href="#collaboration"
              onClick={() => trackClick("nav-collaboration")}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {t.collaboration}
            </a>
            <a
              href="#contact"
              onClick={() => trackClick("nav-contact")}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {t.contact}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-20">
        <div
          className="editorial-drift absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/manus-storage/80DC245D-61F0-4786-B87F-DC079CB4BB2C_f4659d04.JPEG)",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div
            className="editorial-glow pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#aa7942]/20 via-transparent to-transparent"
            aria-hidden="true"
          ></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-4 leading-none break-words"
            style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}
          >
            ISAAC HAKOBIAN
          </h1>
          <p className="text-lg sm:text-2xl lg:text-3xl text-white/95 mb-6 font-light">
            {t.tagline}
          </p>
          {t.taglineSupport && (
            <p className="text-base sm:text-lg text-white/80 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
              {t.taglineSupport}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <a
              href="#collaboration"
              onClick={() => trackClick("explore-collaboration-btn")}
              className="inline-flex items-center gap-2 bg-accent text-white px-6 sm:px-8 py-3 hover:opacity-90 transition-opacity font-medium"
            >
              {t.exploreCollaboration} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-16">
            <div className="text-center">
              <div
                className="text-5xl sm:text-6xl font-bold mb-2"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#8B4513",
                }}
              >
                2.9M+
              </div>
              <p className="text-lg text-gray-600">{t.monthlyReach}</p>
            </div>
            <div className="text-center">
              <div
                className="text-5xl sm:text-6xl font-bold mb-2"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#8B4513",
                }}
              >
                40.8K+
              </div>
              <p className="text-lg text-gray-600">{t.maleAudience}</p>
            </div>
            <div className="text-center">
              <div
                className="text-5xl sm:text-6xl font-bold mb-2"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#8B4513",
                }}
              >
                286.9K
              </div>
              <p className="text-lg text-gray-600">{t.primaryAgeGroup}</p>
            </div>
          </div>
        </div>
        <div
          data-testid="stats-about-divider"
          aria-hidden="true"
          className="mx-auto flex max-w-6xl items-center justify-center gap-4 pt-2"
        >
          <span className="h-px w-16 bg-[#d8d0c6] sm:w-28" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[#aa7942]" />
          <span className="h-px w-16 bg-[#d8d0c6] sm:w-28" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="mx-auto flex max-w-5xl justify-center">
          <div className="w-full text-center">
            <h2
              className="mx-auto mb-8 max-w-4xl text-4xl font-bold sm:text-5xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t.aboutBrand}
            </h2>
            <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-gray-700">
              {t.aboutText}
            </p>
          </div>
        </div>
      </section>

      {/* Showreel — verified real brand integrations */}
      <ShowreelSection
        language={language}
        eyebrow={t.showreelEyebrow}
        title={t.showreelTitle}
        description={t.showreelDescription}
        playLabel={t.showreelPlay}
        ctaLabel={t.showreelCta}
        ctaHref="#contact"
        fallbackLabel={t.showreelNoScript}
        onPlay={() => trackClick("showreel-play")}
      />

      {/* Testimonials Section */}
      <Testimonials language={language} />

      {/* Collaboration Packages */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-16"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t.collaborationPackages}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Link in Bio */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t.linkInBio}
              </h3>
              <p className="text-gray-600 mb-6">{t.month}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.brandLinkInProfile}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">
                    {t.passiveTrafficGeneration}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">
                    {t.professionalProduction}
                  </span>
                </li>
              </ul>
              <button
                onClick={handleInstagramDM}
                className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium"
              >
                {t.inquire}
              </button>
            </div>

            {/* Single Reel */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t.singleReel}
              </h3>
              <p className="text-gray-600 mb-6">{t.reel}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">
                    {t.authenticIntegration}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.fullUsageRights}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">
                    {t.professionalProduction}
                  </span>
                </li>
              </ul>
              <button
                onClick={handleInstagramDM}
                className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium"
              >
                {t.inquire}
              </button>
            </div>

            {/* Ambassador Partnership */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t.ambassador}
              </h3>
              <p className="text-gray-600 mb-6">{t.custom}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.linkInBioContent}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.reelsPerMonth}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">
                    {t.exclusivePartnership}
                  </span>
                </li>
              </ul>
              <button
                onClick={handleInstagramDM}
                className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium"
              >
                {t.letsTalk}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Collaboration CTA Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t.collaborationCtaTitle}
          </h2>
          <p className="text-xl text-gray-700 mb-12">
            {t.collaborationCtaText}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleInstagramDM}
              className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-3 hover:opacity-90 transition-opacity font-medium"
            >
              <Instagram size={18} /> {t.instagramDm}
            </button>
            <a
              href={socialLinks.email}
              className="inline-flex items-center justify-center gap-2 border-2 border-accent text-accent px-8 py-3 hover:bg-accent hover:text-white transition-colors font-medium"
            >
              <Mail size={18} /> {t.emailMe}
            </a>
          </div>

          {/* Social Icons Grid */}
          <div>
            <p className="text-sm text-gray-600 mb-6">
              {t.followAcrossPlatforms}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-full transition-colors"
                title="TikTok"
              >
                <span className="text-sm font-medium text-gray-700">
                  TikTok
                </span>
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-full transition-colors"
                title="YouTube"
              >
                <Youtube size={20} className="text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  YouTube
                </span>
              </a>
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Telegram"
              >
                <Send size={20} className="text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  Telegram
                </span>
              </a>
              <a
                href={socialLinks.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Pinterest"
              >
                <span className="text-sm font-medium text-gray-700">
                  Pinterest
                </span>
              </a>
              <a
                href={socialLinks.threads}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Threads"
              >
                <span className="text-sm font-medium text-gray-700">
                  Threads
                </span>
              </a>
              <a
                href={socialLinks.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Snapchat"
              >
                <span className="text-sm font-medium text-gray-700">
                  Snapchat
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-12 text-center"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t.getInTouch}
          </h2>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.name}
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={e =>
                  setFormState({ ...formState, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.email}
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={e =>
                  setFormState({ ...formState, email: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.message}
              </label>
              <textarea
                value={formState.message}
                onChange={e =>
                  setFormState({ ...formState, message: e.target.value })
                }
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
            >
              {submitted ? t.thankYou : t.sendMessage}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-8">
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#aa7942",
                }}
              >
                Isaac Hakobian
              </h3>
              <p className="text-gray-400">{t.footerDescription}</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t.contact}</h4>
              <div className="space-y-2 text-gray-400">
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-accent"
                >
                  <Instagram size={16} /> Instagram
                </a>
                <a
                  href={socialLinks.email}
                  className="flex items-center gap-2 hover:text-accent"
                >
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t.followAcrossPlatforms}</h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <span>TikTok</span>
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <Youtube size={20} /> <span>YouTube</span>
                </a>
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <Send size={20} /> <span>Telegram</span>
                </a>
                <a
                  href={socialLinks.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <span>Pinterest</span>
                </a>
                <a
                  href={socialLinks.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <span>Threads</span>
                </a>
                <a
                  href={socialLinks.snapchat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <span>Snapchat</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 Isaac Hakobian. {t.allRightsReserved}</p>
            {user && (
              <a
                href="/analytics"
                className="mt-4 inline-block text-accent hover:underline"
              >
                View Analytics
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

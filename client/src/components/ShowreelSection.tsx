import { ArrowRight, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { getPromoAssets } from "@/lib/promoAssets";

type ShowreelSectionProps = {
  language: string;
  eyebrow: string;
  title: string;
  description: string;
  playLabel: string;
  ctaLabel: string;
  ctaHref: string;
  fallbackLabel: string;
  onPlay?: () => void;
};

export default function ShowreelSection(props: ShowreelSectionProps) {
  const assets = getPromoAssets(props.language);
  // A language change stops the old film and returns to the new localized poster.
  return <LocalizedShowreel key={assets.locale} {...props} />;
}

function LocalizedShowreel({
  language,
  eyebrow,
  title,
  description,
  playLabel,
  ctaLabel,
  ctaHref,
  fallbackLabel,
  onPlay,
}: ShowreelSectionProps) {
  const { locale, videoSrc, posterSrc, captionsSrc, captionLabel } =
    getPromoAssets(language);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (isPlaying) video?.focus();
    return () => video?.pause();
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };

  return (
    <section
      id="collaboration"
      data-testid="showreel-section"
      data-promo-language={locale}
      aria-labelledby="showreel-title"
      className="bg-[#f4f1ec] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="space-y-9">
          <div className="max-w-3xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#aa7942]">
              {eyebrow}
            </p>
            <h2
              id="showreel-title"
              className="text-4xl font-normal leading-[0.98] text-[#211d19] sm:text-6xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {title}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#615b55] sm:text-lg">
              {description}
            </p>
            <a
              href={ctaHref}
              className="mt-8 inline-flex items-center gap-2 border-b border-[#aa7942] pb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#211d19] transition-colors hover:text-[#aa7942]"
            >
              {ctaLabel}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="w-full">
            <div className="overflow-hidden rounded-2xl border border-[#d8d0c6] bg-[#101011] shadow-[0_18px_60px_rgba(33,29,25,0.16)] sm:rounded-3xl">
              {isPlaying ? (
                <video
                  ref={videoRef}
                  lang={locale}
                  tabIndex={0}
                  width={1920}
                  height={1080}
                  className="aspect-video w-full bg-[#101011] object-contain focus-visible:outline-2 focus-visible:outline-[#aa7942]"
                  autoPlay
                  controls
                  playsInline
                  preload="metadata"
                  poster={posterSrc}
                  aria-label={title}
                  onError={() => setHasError(true)}
                >
                  <source src={videoSrc} type="video/mp4" />
                  <track
                    kind="captions"
                    src={captionsSrc}
                    srcLang={locale}
                    label={captionLabel}
                  />
                  <a href={videoSrc}>{fallbackLabel}</a>
                </video>
              ) : (
                <button
                  type="button"
                  data-testid="showreel-play"
                  onClick={handlePlay}
                  className="group relative block aspect-video w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#aa7942]"
                  aria-label={title + ": " + playLabel}
                >
                  <img
                    src={posterSrc}
                    alt=""
                    width={1920}
                    height={1080}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full object-contain transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transform-none motion-reduce:transition-none"
                  />
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-black/50 backdrop-blur-sm transition-colors group-hover:bg-black/70 sm:h-20 sm:w-20">
                      <Play size={24} fill="currentColor" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-black/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-xs">
                      {playLabel}
                    </span>
                  </span>
                </button>
              )}
            </div>

            {hasError && (
              <p role="alert" className="mt-4 text-sm text-[#615b55]">
                <a href={videoSrc} className="underline">
                  {fallbackLabel}
                </a>
              </p>
            )}
          </div>
        </div>

        <noscript>
          <a href={videoSrc} className="mt-8 inline-block underline">
            {fallbackLabel}
          </a>
        </noscript>
      </div>
    </section>
  );
}

import { ArrowUpRight, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { getPromoAssets } from "@/lib/promoAssets";
import MotionReveal from "./MotionReveal";

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
  return (
    <LocalizedShowreel key={getPromoAssets(props.language).locale} {...props} />
  );
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
    if (isPlaying) video?.focus({ preventScroll: true });
    return () => video?.pause();
  }, [isPlaying]);

  return (
    <section
      id="collaboration"
      data-testid="showreel-section"
      data-promo-language={locale}
      aria-labelledby="showreel-title"
      className="mk-film"
    >
      <div className="mk-wrap">
        <MotionReveal className="mk-film-heading">
          <div>
            <p className="mk-eyebrow">{eyebrow}</p>
            <h2 id="showreel-title">{title}</h2>
          </div>
          <div>
            <p className="mk-film-description">{description}</p>
            <a href={ctaHref} className="mk-text-link">
              {ctaLabel}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </MotionReveal>
        <MotionReveal>
          <div className="mk-film-player">
            {isPlaying ? (
              <video
                key={locale}
                ref={videoRef}
                lang={locale}
                tabIndex={0}
                width={1920}
                height={1080}
                className="mk-film-video"
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
                onClick={() => {
                  setIsPlaying(true);
                  onPlay?.();
                }}
                className="mk-film-trigger"
                aria-label={title + ": " + playLabel}
              >
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet="/media/promo/mobile-cover.jpg"
                  />
                  <img
                    src={posterSrc}
                    alt=""
                    width={1920}
                    height={1080}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <span className="mk-play-overlay">
                  <span className="mk-play-circle">
                    <Play size={25} fill="currentColor" aria-hidden="true" />
                  </span>
                  <span className="mk-play-label">{playLabel}</span>
                </span>
              </button>
            )}
          </div>
          {hasError && (
            <p role="alert" className="mk-film-error">
              <a href={videoSrc}>{fallbackLabel}</a>
            </p>
          )}
        </MotionReveal>
        <noscript>
          <a href={videoSrc}>{fallbackLabel}</a>
        </noscript>
      </div>
    </section>
  );
}

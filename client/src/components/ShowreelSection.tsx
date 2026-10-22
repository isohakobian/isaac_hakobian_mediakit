import { ArrowRight, Play } from "lucide-react";
import { useState } from "react";

type ShowreelSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  playLabel: string;
  ctaLabel: string;
  ctaHref: string;
  fallbackLabel: string;
  onPlay?: () => void;
};

const videoSrc = "/manus-storage/isaac-showreel.mp4";
const posterSrc = "/manus-storage/isaac-showreel-poster.jpg";
const captionsSrc = "/showreel-captions.vtt";

export default function ShowreelSection({
  eyebrow,
  title,
  description,
  playLabel,
  ctaLabel,
  ctaHref,
  fallbackLabel,
  onPlay,
}: ShowreelSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };

  return (
    <section
      id="collaboration"
      data-testid="showreel-section"
      aria-labelledby="showreel-title"
      className="bg-[#f4f1ec] px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,440px)] lg:gap-20">
          <div className="max-w-2xl">
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

          <div className="w-full max-w-[440px] justify-self-center lg:justify-self-end">
            <div className="overflow-hidden border border-[#d8d0c6] bg-[#171512] shadow-[0_18px_60px_rgba(33,29,25,0.16)]">
              {isPlaying ? (
                <video
                  className="aspect-[9/16] w-full bg-[#171512] object-cover"
                  autoPlay
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  playsInline
                  preload="metadata"
                  poster={posterSrc}
                  aria-label={title}
                >
                  <source src={videoSrc} type="video/mp4" />
                  <track
                    kind="captions"
                    src={captionsSrc}
                    srcLang="en"
                    label="English"
                    default
                  />
                  {fallbackLabel}
                </video>
              ) : (
                <button
                  type="button"
                  data-testid="showreel-play"
                  onClick={handlePlay}
                  className="group relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#aa7942] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4f1ec]"
                  aria-label={title + ": " + playLabel}
                >
                  <img
                    src={posterSrc}
                    alt=""
                    width={1080}
                    height={1920}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[9/16] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/15 text-white transition-colors group-hover:bg-black/25">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/80 bg-black/25 backdrop-blur-sm">
                      <Play size={24} fill="currentColor" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                      {playLabel}
                    </span>
                  </span>
                </button>
              )}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#8a8178]">
              36.5 sec · 1080×1920 · captions available
            </p>
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

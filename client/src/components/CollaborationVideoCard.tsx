import React, { type SyntheticEvent } from "react";

type CollaborationVideoCardProps = {
  brand: string;
  projectTitle: string;
  partnershipType: string;
  videoUrl: string;
  posterUrl?: string;
  collaborationLabel: string;
  formatLabel: string;
  onPlay?: () => void;
};

export default function CollaborationVideoCard({
  brand,
  projectTitle,
  partnershipType,
  videoUrl,
  posterUrl,
  collaborationLabel,
  formatLabel,
  onPlay,
}: CollaborationVideoCardProps) {
  const handlePlay = (_event: SyntheticEvent<HTMLVideoElement>) => {
    onPlay?.();
  };

  return (
    <article className="overflow-hidden border border-[#d8d0c6] bg-[#f8f6f2]">
      <div className="bg-[#171512]">
        <video
          className="aspect-[9/16] w-full bg-[#171512] object-cover"
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          playsInline
          preload="metadata"
          poster={posterUrl}
          aria-label={`${brand}: ${projectTitle}`}
          onPlay={handlePlay}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="space-y-5 p-6 sm:p-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#aa7942]">
            {collaborationLabel}
          </p>
          <h3
            className="mt-2 text-3xl font-normal leading-tight text-[#211d19]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {brand}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#615b55]">
            {projectTitle}
          </p>
        </div>

        <div className="border-t border-[#d8d0c6] pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a8178]">
            {formatLabel}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#211d19]">
            {partnershipType}
          </p>
        </div>
      </div>
    </article>
  );
}

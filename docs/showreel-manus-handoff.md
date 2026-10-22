# Isaac Hakobian — promo v2

36-second landscape promo with animated typography, masked title reveals,
moving portrait panels, editorial split screens and an original synthesized score.

## Files included in this PR

- `client/public/media/isaac-promo-v2.mp4` — 1280×720, H.264/AAC, approximately 9.2 MiB.
- `client/public/media/isaac-promo-v2-poster.jpg` — 1920×1080 JPEG poster.
- `client/public/showreel-captions.vtt` — Russian on-screen text and music captions.
- `client/src/components/ShowreelSection.tsx` — responsive 16:9 poster-first player.
- `tools/promo/` — editable render and original-score sources for macOS.

The web MP4 and poster are committed with the code. Manus storage upload is no
longer required. The 1920×1080 master remains a local review artifact.

## Portfolio footage

The edit uses existing Media Kit integrations: SWDR.BY, Maqoor, Abib,
Limber Life Armenia × Pravilo, Ya Kapitan and Dream Beach Club. The film
does not introduce new partnerships, testimonials or performance claims.
Original clip audio is removed; the score and transitions are synthesized
from scratch without music samples. Apple is a motion-design reference only;
no Apple footage, logos or soundtrack are included.

## Verification

- TypeScript check and frontend production build.
- Homepage language-switching and native-video regression tests.
- Local Chrome: no MP4 request before Play; playback, duration, dimensions,
  captions loading and mobile overflow.
- No merge or production deployment performed.

## Manus instructions after Isaac approves

1. Check out the latest `feat/isaac-showreel` branch from PR #1.
2. Install with the project lockfile, run `pnpm check`, the affected tests and `pnpm build`.
3. Create a preview using the committed media files. Preserve `/media/isaac-promo-v2.mp4`,
   `/media/isaac-promo-v2-poster.jpg` and `/showreel-captions.vtt` paths.
4. Verify desktop/mobile, full-screen playback, captions, playback controls and the
   CTA to `#contact`. Keep analytics and storage environment settings from the host.
5. Show Isaac the preview. Merge and production publication require his explicit approval.

## Rebuilding the promo on macOS

Download the six source MP4s from the existing Media Kit into `scratch/`, preserving
their filenames listed in `sources.json`. From the repository root, compile and run
`render.swift` with argument `render`; run `score.swift`; encode `original-score.wav`
to `score-final.m4a` with `afconvert -f m4af -d aac -b 192000`; then run `mux.swift`
and `web.swift`. Outputs go to `scratch/promo-v2/`. Use a fresh output directory
for a rebuild; renderers refuse to overwrite an existing final MP4.

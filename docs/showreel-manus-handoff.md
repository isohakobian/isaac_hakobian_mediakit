# Isaac Hakobian showreel handoff

## Deliverable

- Runtime: 36.5 seconds
- Format: vertical MP4, 1080×1920, H.264 with audio
- Cut: real brand integrations only; no invented partnerships
- Categories: lifestyle, fashion, fitness, grooming, travel
- Captions: `client/public/showreel-captions.vtt`
- UI: `client/src/components/ShowreelSection.tsx`

## Verified source integrations used

- Dr. Karen Petrosyan — personal transformation / clinic collaboration
- Maqoor — dry-cleaning service integration
- Orsis Arms — shooting range experience integration
- Limber Life Armenia × Pravilo — bungee fitness experience
- Dream Beach Club — lifestyle / product integration
- Abib — skincare / product integration
- Ya Kapitan — private yacht experience
- Swdr.by — menswear / product integration

## Manus storage contract

Upload the approved local files to the existing Manus storage layer using these exact public keys:

- `/manus-storage/isaac-showreel.mp4`
- `/manus-storage/isaac-showreel-poster.jpg`

The PR intentionally does not commit the 44 MB MP4: the current site already serves collaboration media from Manus storage, and the production upload is a separate approval-gated step.

## Publish checklist after Isaac approves

1. Upload the MP4 and poster under the exact keys above.
2. Deploy the PR branch to a preview environment only.
3. Verify the poster-first state, click-to-play behavior, captions track, controls, mobile layout, and CTA link to `#contact`.
4. Confirm no “Recent Collaborations” gallery remains on the page.
5. Wait for explicit approval before merging or publishing to production.

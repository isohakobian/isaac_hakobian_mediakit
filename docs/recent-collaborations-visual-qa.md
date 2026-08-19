# Recent Collaborations — visual QA

## Desktop

The Recent Collaborations section renders as a consistent three-column grid. Every item uses the same 4:5 preview treatment, numbering, play affordance, brand title, category, campaign label, result line, and arrow cue. The section header, thin divider, warm neutral palette, and serif typography align with the Quiet Luxury editorial system.

## Mobile

The layout collapses to a single column without horizontal overflow. The first card keeps the same preview-to-metadata hierarchy as desktop, long brand names wrap within the card, and the header remains readable at a 390px viewport.

## Interaction and accessibility

Each work is a keyboard-focusable button with a localized accessible label. Activating a card opens one shared viewer with the Instagram embed, campaign details, results, quote, and a direct Instagram link. Escape closes the viewer, clicking the backdrop closes it, and body scrolling is locked while the viewer is open. Arabic layout uses the existing RTL direction and mirrored directional icon treatment.

## Verification artifacts

- Desktop focused screenshot: `/home/ubuntu/screenshots/collaboration-grid-focused.png`
- Mobile focused screenshot: `/home/ubuntu/screenshots/collaboration-grid-mobile.png`
- TypeScript check: passed
- Vitest suite: 81 tests passed
- Production build: passed

## Viewer interaction

A real click on the first card opened the shared viewer successfully. The viewer showed the Marina Traveling Agency Instagram Reel, localized metadata, campaign type, results, brand context, quote, close control, and direct Instagram CTA. The interaction check returned `opened: true` and the expected title `Marina Traveling Agency`.

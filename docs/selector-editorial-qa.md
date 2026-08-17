# Collaboration Selector — Editorial QA

## Scope

The selector was redesigned to follow the media kit's existing **Editorial Minimalism / Quiet Luxury** system rather than appearing as an unrelated dashboard widget.

## Visual verification

| Viewport | Verification outcome |
|---|---|
| Desktop — 1440 × 1100 | The selector uses the same white canvas, thin warm-gray dividers, warm-gold micro-labels, Playfair Display hierarchy, and deep-charcoal accent treatment as the surrounding media kit. The left editorial introduction and right selection flow establish a deliberate magazine-like composition. The recommendation is the sole dark inset, creating a controlled premium contrast rather than a competing card style. |
| Mobile — 390 × 844 | The two-column layout stacks cleanly into a single reading flow. The headline, selection rows, numeric markers, and dividers remain legible; no overlaps, clipped text, or horizontally overflowing controls were observed. |
| Arabic / RTL | The title, steps, selection rows, numeric flow, and CTA follow the RTL reading direction. The visual hierarchy remains intact without mixed-direction helper labels. |

## Interaction and accessibility checks

The selection rows remain native buttons with `aria-pressed` state. Keyboard-visible focus rings use the project warm-gold accent. The recommended format panel is announced through `aria-live="polite"` when a selection changes. The primary CTA uses the same restrained warm-gold treatment as the hero and package actions.

## Regression checks

TypeScript check, production build, and the full Vitest suite all passed after the redesign. The suite includes selector localization and homepage-level language-switching render tests.

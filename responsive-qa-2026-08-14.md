# Responsive QA — 2026-08-14

## Mobile — 390 × 844

The fixed navigation fits on one line without horizontal overflow. The language control, Collaboration, and Contact links remain readable. The hero title wraps cleanly into two lines, the supporting copy remains inside the viewport, the CTA button fits without clipping, and the background image preserves its intended cover crop without visible stretching.

## Tablet — 768 × 1024

The navigation remains aligned and readable. The hero title, tagline, supporting copy, and CTA remain centered with no clipping. The hero image keeps the intended cover treatment and does not deform. The desktop two-column content breakpoint has not yet been inspected in the lower sections.

## Interactive preview

The rendered page content confirmed that Recent Collaborations begins with Limber Life Armenia × Pravilo, followed by Dream Beach Club, Abib, Ya Kapitan, Swdr.by, and Rooms Project. The interactive browser extension timed out while refreshing the lower-section screenshot, so the remaining lower-page checks rely on deterministic source inspection and the rendered page extraction.

## Final mobile pass — 390 × 844

After refinement, the navigation still fits on one line, the editorial title wraps into two balanced lines, the tagline and supporting copy remain inside the viewport, and the CTA button has comfortable horizontal margins. No text, image, or control is clipped in the final mobile hero screenshot.

## Tablet and desktop pass — 768 × 1024 and 1440 × 1000

The current development preview was captured at both tablet and desktop widths. The navigation remains on one line, the hero title and supporting copy stay within the viewport, and the CTA remains centered with clear margins. At tablet width, the hero composition scales cleanly without clipping; at desktop width, the editorial title, body copy, and CTA retain balanced hierarchy.

## Five-locale mobile verification — 390 × 844

A deterministic mobile run loaded English, Russian, Spanish, Arabic, and French through the existing local-language preference. Each locale rendered its localized section headings and the Limber Life Armenia × Pravilo case study, with `document.documentElement.scrollWidth` equal to the 390px viewport width and every section bounded from 0 to 390px. The Arabic screenshot was also inspected visually: the Arabic navigation labels, hero copy, and collaboration CTA wrap cleanly without clipping or horizontal overflow.

## Live publication check

The published URL `https://isaacmedia-wzfdvfuk.manus.space` loads successfully, but it is behind the current development preview: it still starts Recent Collaborations with Dream Beach Club and does not include the newer Limber Life Armenia × Pravilo case study. The current development preview at `https://3000-iy2rtr5f7c9r0kstdtjp8-336febed.us2.manus.computer` correctly starts with Limber Life Armenia × Pravilo. Publishing the latest checkpoint remains a Management UI action.

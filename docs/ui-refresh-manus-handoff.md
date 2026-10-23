# Media Kit UI refresh — implementation handoff

Branch: `feat/mediakit-ui-refresh`.
Base: `main` at `c44afd9c0057e263acce05f887f11a27041fc0e2`.

This is an implementation in the actual application, not a standalone prototype. Import this branch as a whole. Do not rebuild the design from a prompt and do not reintroduce the old collaboration gallery.

## Scope and publication boundary

- The user requested the redesigned source in GitHub and a later Manus update.
- Work in an isolated preview branch. Do not merge the PR, push to `main`, publish, or change the current production site without Isaac's separate approval.
- A previous PR is already marked merged on GitHub by the Manus connector. Do not assume that a checkpoint or GitHub synchronization is preview-only: if it writes to `main` or merges a PR, stop and ask Isaac before that action.
- Show the preview and validation results first. Saving a checkpoint is allowed only when its operation does not cross the above boundary.

## Implemented

- One public design system: warm off-white, graphite, restrained warm accent; Inter with Noto Sans Armenian glyph fallback. The Latin wordmark stays visually consistent across EN/RU/HY.
- Separate typography and portrait in the hero; the first-screen film button starts the existing inline film and brings the player into view.
- Page progression: hero, film, audience/figures, collaboration formats, existing published testimonials, one contact block and compact footer.
- Native three-language selector, one-row narrow navigation, skip link, correct anchor offset, bound field labels, autocomplete and unrestricted page zoom.
- Quiet, one-time intro/reveal motion with `prefers-reduced-motion` support. Content is not hidden by default if reveal JavaScript is unavailable.
- The package selection is carried to the contact form and inquiry subject. Pending, failure and success states are localized; failure retains visitor input.
- Contact submission uses the project's typed tRPC mutation. The server reports notification acceptance honestly instead of returning success when `notifyOwner` returns false. This remains Manus owner notification, not a newly added email delivery service.
- No personal form fields are added to form-success analytics.
- The decorative robot is replaced by a compact quick-help control on the left; its formats action now points to `#formats`, separate from the platform badge.
- Admin pages are lazy-loaded rather than included in the initial public-page JavaScript. The existing admin routes are retained.
- Optional Umami deployment analytics still load when both existing environment variables are configured, and are skipped otherwise.

## Media: retain these exact storage mappings

| Locale | Existing video | Existing poster | Existing captions |
| --- | --- | --- | --- |
| EN | `/manus-storage/en_eb8316e2.mp4` | `/media/promo/en.jpg` | `/media/promo/en.vtt` |
| RU | `/manus-storage/ru_872013e9.mp4` | `/media/promo/ru.jpg` | `/media/promo/ru.vtt` |
| HY | `/manus-storage/hy_c7b8ac5b.mp4` | `/media/promo/hy.jpg` | `/media/promo/hy.vtt` |

`client/src/lib/promoAssets.ts` is unchanged from the current storage-backed main. No MP4/MOV/WebM files have been added to `client/public`. Do not download videos into the checkpoint or re-render them.

The only new media file is `client/public/media/promo/mobile-cover.jpg` (~147 KiB). It is a frame at 27 seconds from Isaac's previously used `swdr_1a75350f.mp4`, not a generated likeness or a newly claimed collaboration. It is a text-free shared mobile poster; the actual film, play label and captions remain localized. The hero retains Isaac's existing `/manus-storage/80DC245D-61F0-4786-B87F-DC079CB4BB2C_f4659d04.JPEG` image.

Keep the site's existing storage proxy and its environment configuration. Do not replace storage paths with temporary signed links.

## Content intentionally preserved

- All existing prices, currencies and package deliverables. EN/HY and RU prices differ in the source; do not silently normalize them without Isaac's decision.
- Existing published metrics: 2.9M+, 40.8K+, 286.9K. A note now makes clear these are published snapshot figures, not live counters. No unverified current period/date has been added.
- Existing testimonial records; no brands, quotes, ratings, results or partnerships were invented. The presentation no longer displays decorative rating stars. Confirm publication permission/attribution with Isaac if reviewing testimonial content.
- Three languages only: EN/RU/HY. Russian interface wording was made more natural without changing commercial values.
- Existing social destinations and administration/data capabilities. No schema migration or data replacement is needed.

## Checks performed locally

```sh
pnpm check
pnpm exec vitest run client/src server/collaborations.test.ts server/contactDelivery.test.ts
pnpm build
git diff --check
```

- TypeScript, frontend production build and server bundle pass.
- Nine focused test files / 32 tests pass. No live database integration suite was run.
- The production frontend was inspected in the browser at 320, 390, 768 and 1280 px in all three languages: no horizontal overflow. The header stays one row and contact headings are not covered by it.
- EN/RU/HY films play at 1280×720, 36 seconds, using the matching storage path and caption source; switching languages removes the old player and restores the poster. No video element exists before Play.
- Package choice reaches the form; input labels, autocomplete, the skip link and current language state were inspected.
- The form's retained-input failure and cleared-input success states were verified against an isolated local responder. No real inquiry or notification was sent during browser testing. Backend acceptance/failure/exception paths were unit-tested with a mocked notifier.
- The actual remote Manus notification service is not verified by these local tests. Check its configuration; obtain approval before sending a real end-to-end test notification.
- Reduced-motion branches are implemented in CSS and reveal logic; an OS-level preference toggle was not performed locally. Include reduced-motion emulation in preview QA.

## Manus preview acceptance

1. Import the feature branch into an isolated preview; retain storage/notification configuration, database, secrets, user data and domain settings.
2. Repeat the checks above. Verify all three languages at narrow and wide sizes; fonts and hero/film images should load correctly.
3. Verify the first-screen play action, native controls/captions, language-change reset and no early MP4 loading.
4. Verify package selection, keyboard navigation, field labels, reduced motion and that quick help does not overlap the Manus badge.
5. Do not send real inquiries or modify production data as part of visual QA.
6. Return a preview link and any remaining environment-dependent limitations. No merge, `main` synchronization or production publication without separate confirmation.

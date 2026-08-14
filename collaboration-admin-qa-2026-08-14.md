# Collaboration Admin QA — 2026-08-14

## Access guard

The `/collaborations` route correctly blocks unauthenticated visitors and presents two clear actions: `Войти как владелец` and `Вернуться на сайт`.

## Responsive access screen

The access card was captured at 390 × 844 and 1440 × 1000. Both layouts keep the card centered, readable, and comfortably spaced. The primary owner-login action is full-width on mobile and desktop, and no text or controls are clipped.

## Public regression check

The public preview continues to load normally after the managed-collaboration query was added. Recent Collaborations still starts with Limber Life Armenia × Pravilo when the managed table is empty, followed by the existing static records.

## Automated validation

Production build passed. Vitest passed with 12 tests across three files, including public list access, admin-only access denial, required localized field validation, existing testimonial/analytics checks, and auth logout.

## Owner verification still required

The sandbox preview session is not authenticated, so the full editor form and authenticated CRUD interaction should be opened once by Isaac after signing in through `Войти как владелец`. No production or customer data was changed during QA.

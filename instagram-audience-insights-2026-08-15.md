# Instagram Audience Insights — 2026-08-15

Source: Instagram Professional Dashboard → Account insights → Last 30 days, viewed in Isaac's authenticated browser session.

## Confirmed metrics

- Views: 1,166,215.
- Viewers: 241,679.
- View split: 36% followers and 64% non-followers.
- Interactions: 83,494.
- Interaction split: 52.2% followers and 47.8% non-followers.
- Accounts engaged: 27,406.
- Content mix by views: Reels 78.2%, Stories 21.8%, Posts 0.0%, Live 0.0%.
- Content mix by interactions: Reels 63.8%, Posts 23.0%, Stories 13.2%.
- Profile activity: 34,915.
- Profile visits: 33,957.
- External link taps: 958.
- Total followers: 37,539.
- Instagram also exposed most-active follower time buckets; the currently selected Monday view showed 12a 7,105, 3a 8,545, 6a 9,718, 9a 10,046, 12p 9,505, 3p 6,931, 6p 5,527, and 9p 6,156.

## Not available on the inspected screen

The current Account insights page did not expose age, gender, top countries, or top cities. These fields must remain marked as unavailable rather than inferred or fabricated. The website should distinguish verified Instagram metrics from unavailable demographic categories.

## Website QA after integration

The authenticated Analytics preview rendered the new Russian audience block with 1,166,215 views, 241,679 viewers, 37,539 followers, content-by-views and content-by-interactions charts, and explicit unavailable states for age, gender, countries, and cities. The existing site-activity chart still rendered all four series, including total events. The Analytics page also showed the soft `Обновляем данные…` refresh indicator when query data refreshed.

The Collaboration Editor route opened with the new pulsing `Проверяем доступ…` loading state. The public home preview continued to render the hero composition with the restrained editorial motion layer; no layout regressions were visible in the captured desktop viewport.

## Collaboration filter QA

The authenticated Collaboration Editor rendered the search field, Published/Draft status buttons, language-completeness selector, and start/end date inputs together in the saved-collaborations panel. The current database has zero managed records, so the honest empty state shows `Показано 0 из 0` and prompts creation of the first record. The filter controls remain visible and aligned on desktop.

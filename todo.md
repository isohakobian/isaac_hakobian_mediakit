- [x] Add category filter tabs (Grooming, Lifestyle, Travel) for Recent Collaborations with smooth animations and prominent view/reach metrics on cards
- [x] Fix collaborations query failure on the homepage caused by the collaborations database table/query mismatch
- [x] Add regression coverage for the collaborations query and verify the collaboration section renders without an API error
- [x] Re-run build, tests, and browser verification after the database fix

## Verification — 2026-09-20
- Live database contains the `collaborations` table with the expected 8 columns.
- `collaborations.publicList` returns HTTP 200 and an empty array without a query error.
- Full homepage screenshot shows the Recent Collaborations section rendering correctly from the static fallback data.
- Vitest: 44 test files / 81 tests passed.
- Production build: passed.

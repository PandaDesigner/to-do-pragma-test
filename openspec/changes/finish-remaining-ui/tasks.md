## 1. Behavior

- [x] 1.1 Pointer swipe reveal on `TaskItemComponent` with `[SWIPE-02.1]` (not `ion-item-sliding`; `SWIPE-01.1` already names the sliding option)
- [x] 1.2 Shopping notes header and note rows with `[TODO-04.2]`
- [x] 1.3 TODAY reset with `[TODO-01.3]`
- [x] 1.4 Locale keys for rail, shell, categories, sheet, row, and editor

## 2. Verification

- [x] 2.1 `npx jest --runInBand --coverage` — 48 suites, 417 tests, thresholds held (statements 93.28%, branches 85.26%)
- [x] 2.2 `node scripts/trace-check.mjs` passed
- [x] 2.3 Prettier on the touched templates and specs; stylelint on the task-item stylesheet
- [ ] 2.4 Visual captures at 375x812 light/dark es/en — no simulator run in this session
- [ ] 2.5 Notion row — no Notion connection in this session
- [ ] 2.6 Browser pass of TODAY, shopping notes, and swipe — `ng serve` compiled, Chrome stable is not installed, so the click path was not exercised

## 3. Delivery

- [ ] 3.1 PR to `develop` — not requested

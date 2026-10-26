# Homework 1 — Task Decomposition

Project: Production Studio Drum Kit
Stack: React 19 + Vite
Accessibility target: WCAG 2.2 AA
Lighthouse target: 100

## M0 — Planning and Contracts
- [x] Initialize React 19 + Vite.
- [x] Review original DrumKit assets and behavior.
- [x] Create project-rules.md.
- [x] Define JSDoc contracts.
- [x] Establish isolated Git branch.
Acceptance: contracts exist before implementation.

## M1 — React Drum Pads and Audio
- [x] Create seven stable pad definitions.
- [x] Build DrumPad and DrumMachine components.
- [x] Reuse original audio assets.
- [x] Support mouse/touch interaction.
- [x] Handle audio failures and cleanup.
Acceptance: all seven pads play the correct sounds.

## M2 — Keyboard Hook
- [x] Implement useDrumKeyboard.
- [x] Use event.code with KeyW/A/S/D/J/K/L.
- [x] Ignore repeat, modifiers and editable targets.
- [x] Preserve native Enter/Space behavior.
- [x] Implement keyup and blur handling.
- [x] Clean up listeners.
Acceptance: all seven shortcuts work without duplication.

## M3 — Accessibility and Visual Feedback
- [x] Add aria-pressed and accessible pad names.
- [x] Add latest-hit output with aria-live.
- [x] Add recent hit history with stable IDs.
- [x] Add illustrative visual sound meter.
- [x] Test keyboard focus and input suppression.
Acceptance: accessible feedback works for every hit.

## M4 — Production Verification
- [x] Check responsive layout at 375px and desktop.
- [x] Verify keyboard and audio lifecycle.
- [x] Run lint and production build.
- [x] Run production Lighthouse audits.
- [x] Record actual results and remaining issues.
Acceptance: checks are completed and documented.

## Git Policy
- One focused commit per verified milestone.
- Do not rewrite existing commit history.
- Do not mark unperformed tests as passed.
- Keep changes within Homework 1.


## Production Verification — 26 October 2026

Environment: Node.js 24.22.1, npm 11.9.0, React/React DOM 19.3.1,
Vite 8.3.5, Chromium Headless 153.0.8010.0, Lighthouse 13.5.0.
Target tested: local production Vite Preview at http://127.0.0.1:4173/.

| Lighthouse category | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

The extracted measurements and exact audit timestamps are in
`verification/lighthouse-results.json`. Scores are measured on a local
headless browser; deployment, hardware, network and browser extensions
can change the results. These are not Vercel or Windows Chrome results.

### Completed checks
- `npm run lint` and `npm run build`: passed.
- Seven real WAV `playing` events after clicking the seven pads; no audio/page errors.
- Seven audio assets are byte-identical to Lab 1 `hw-atomic-rebuild` assets.
- Physical W/A/S/D/J/K/L mapping; held-key suppression; release and repress;
  Ctrl/Alt/Meta/Shift modifiers; native Enter/Space activation: passed.
- Input suppression and keyboard-shortcut toggle: passed.
- Blur recovery, six-hit history cap, repeated-hit live output and meter reset: passed.
- No horizontal overflow at 320, 375, 768, 1024 and 1440 CSS pixels.
- Mobile 375px touch activation and desktop/mobile visual inspection: passed.
- Reduced-motion styles: passed.
- axe automated checks tagged WCAG 2 A/AA, 2.1 AA and 2.2 AA: no violations.
- StrictMode mount/unmount repeated three times: no residual app window listeners;
  active voices paused on unmount; remount did not multiply listeners.
- Simulated audio request failure: alert displayed; next successful pad cleared it.
- Final Lighthouse `label-content-name-mismatch` and `robots-txt`: passed.

### Remaining manual verification
- Windows UniKey interaction was not tested in this Linux/headless environment.
- Human screen-reader testing and listening through the user's speakers remain to be done.
- Automated checks and Lighthouse 100 do not certify full WCAG 2.2 AA conformance.

### Repeat the production audit
1. Run `npm ci`, `npm run lint`, `npm run build`, then `npm run preview`.
2. Open the preview URL in Chrome, then DevTools > Lighthouse.
3. Run Navigation audits with all four categories for Mobile, then Desktop.
4. Repeat keyboard, touch, focus, typing suppression and audio tests.

The correction audit is recorded in `AI_FAILURE_AUDIT.md`.


---

# Exercise 2 — Interactive Scientist & Pioneer Directory

## Planning
- [x] Review existing React 19 project.
- [x] Protect Homework 1 on a separate branch.
- [x] Define data and component contracts.
- [x] Define acceptance tests for four milestones.

## M1 — Stable Data Schema
- [x] Define ScientistPerson JSDoc schema.
- [x] Create six sample records with fixed IDs.
- [x] Keep source data separate from UI.
- [x] Verify unique IDs and field types.
Commit: feat(ex2): normalize smartPeople schema with stable IDs

## M2 — Search, Filter and Sort
- [x] Create ScientistDirectory component.
- [x] Add controlled search input.
- [x] Add controlled minimum IQ input.
- [x] Add IQ descending and age ascending sorting.
- [x] Compute visiblePeople during render.
- [x] Use toSorted without mutating source data.
Commit: feat(ex2): add search, IQ filter & toSorted

## M3 — Delete, Reset and Feedback
- [x] Delete by stable ID.
- [x] Preserve keyboard focus after deletion.
- [x] Reset source data and independent filter inputs.
- [x] Add accessible live status.
- [x] Handle empty results and empty directory.
Commit: feat(ex2): add delete/reset & live status

## M4 — Accessible Insert Form
- [x] Add controlled Name, Age and IQ fields.
- [x] Generate field IDs with useId.
- [x] Validate names and positive integer values.
- [x] Generate unique IDs on successful submission.
- [x] Insert immutably using functional updates.
- [x] Explain when a new record is hidden by filters.
- [x] Clear form errors on Reset.
Commit: feat(ex2): add accessible person insertion form

## Final Verification
- [x] Validate search, filters and sorting.
- [x] Test duplicate names with different IDs.
- [x] Test all invalid insertion cases.
- [x] Test focus and keyboard navigation.
- [ ] Inspect Chrome React DevTools Components and Profiler tabs on Windows.
- [x] Measure a search update with the React Profiler API (separate automated evidence).
- [x] Test 375px and desktop layouts.
- [x] Run npm run lint and npm run build.
- [x] Record actual outcomes.
- [x] Record a demonstration shorter than 60 seconds.

Note: Mark a task complete only after verification.


## Data and component contracts (before implementation)
- ScientistPerson: stable unique string id; nonempty string name; positive integer age and iq.
- ScientistDirectory: optional readonly initialData array, copied once as the Reset snapshot.
- Pipeline: query and minimum IQ filter, followed by non-mutating toSorted.
- Delete: receive an ID, remove only that record, restore focus after DOM commit.
- Insert: trim name, validate whole positive numbers, create UUID once, append immutably.
- Reset: restore initial data and all independent form/filter defaults.


## Exercise 2 — Actual verification (26 October 2026)

Target: Vite production preview at http://127.0.0.1:4173/.
Runtime: Node 24.22.1, npm 11.9.0, React/React DOM 19.3.1,
Vite 8.3.5 and Chromium Headless 153.0.8010.0.

- M1: six unique fixed IDs and correct string/integer schema; lint/build passed.
- M2: trimmed, case-insensitive search; combined IQ filtering; clearing Minimum IQ to 0;
  both sort modes including the IQ 190 tie; no-match state; lint/build passed.
- M3: deleting while searching and sorting removes the intended stable ID; next, previous
  and Reset focus targets passed; deleting all records and Reset passed; lint/build passed.
- M4: default demo record inserted with the IQ-hidden reason; search-hidden and combined
  reasons passed; duplicate names have independent UUIDs and can be deleted separately;
  native Enter submission passed; whitespace names, empty/zero/negative/decimal Age/IQ
  values were rejected with linked field errors; Reset clears form/errors; lint/build passed.
- A 200-character unbroken name does not overflow at 375px after the status wrapping fix.
- Responsive widths 320, 375, 768, 1024 and 1440px: no horizontal overflow.
- axe WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags: no violations on the final directory.
- Drum Kit button playback feedback and switching between activities passed.
- Desktop and 375px screenshots were visually inspected; no uncaught browser page errors.
- React Profiler API in a temporary development StrictMode harness: one update commit
  for changing Search to E; actualDuration about 3.2ms in this run. Original dataset
  remained six records. See verification/ex2-profiler.json for the measured events.

### Evidence and remaining user steps

`verification/ex2-demo.mp4` records actual automated UI interactions in the production
browser: insertion, hidden-record status, filters, sorting, deletion, reset and validation.
It has no narration and does not show the React DevTools extension.

Chrome React DevTools Components/Profiler tabs were not available in the automated browser.
On Windows, run `npm run dev`, select Exercise 2, inspect ScientistDirectory in Components,
then record typing E in Profiler. Use that view if the teacher requires the extension
in the submitted video; the API measurement is supporting evidence, not a substitute
for an extension screenshot. Full screen-reader testing remains manual.

All directory data is in memory. Switching activities remounts the component and resets
its state. No deployment or database was added.

Recorded automated demonstration duration: 24.72 seconds (ffprobe).
Original seven DrumMachine source files were SHA-checked against the Homework 1 branch and remain identical.


---

# Exercise 3 — KRAFTON PUBG Vietnam Series Telemetry

## Planning and Contracts
- [x] Review Lab 03 and preserve previous activities.
- [x] Define TelemetryData and machine-state contracts.
- [x] Define HTTP, abort and simulation behavior.
- [x] Define isolated acceptance tests.

## M1 — Four-State Telemetry and Cancellation
- [x] Create three local JSON datasets.
- [x] Implement abortable telemetry service.
- [x] Configure normal failure probability as 35%.
- [x] Validate squad ID and response data.
- [x] Implement IDLE/LOADING/SUCCESS/ERROR machine.
- [x] Use AbortController inside useEffect.
- [x] Cancel old requests on squad change/unmount.
- [x] Add CES/TE/GE selector with TE default.
- [x] Render minimal status/data/error UI.
- [x] Verify switching and cleanup.

Commit: feat(ex3): implement PUBG VN 4-state telemetry & AbortController

## M2 — Skeleton, Error and Retry
- [x] Add 220px Blue-Zone radar skeleton.
- [x] Add loading announcement and aria-busy.
- [x] Support prefers-reduced-motion.
- [x] Add role=alert error section.
- [x] Add Reconnect Satellite button.
- [x] Use functional retryTick update.
- [x] Preserve selector availability while loading.
- [x] Show SUCCESS using semantic article and dl.
- [x] Verify focus, contrast and 375px layout.
- [x] Verify retry success and repeated errors.

Commit: feat(ex3): add skeleton UI & retry alert

## Final Verification
- [x] Verify CES, TE and GE data.
- [x] Verify simulated errors and retry.
- [x] Verify rapid squad switching and stale-response prevention.
- [x] Verify abort during pending HTTP fetch.
- [x] Verify abort during simulated delay.
- [x] Verify unmount cleanup and StrictMode behavior.
- [ ] Capture Chrome Network and React DevTools tabs on Windows.
- [x] Observe native HTTP cancellation through Chromium CDP network events.
- [x] Check mobile 375px and desktop layout.
- [x] Check Console, lint and production build.
- [x] Record actual test results and remaining issues.

Only mark tests as completed after running them.



## Exercise 3 — Final Verification

Date: 26 October 2026
Browser: Chromium Headless 153.0.8010.0 (local automated browser)
Production target: http://127.0.0.1:4173/
Development target: http://127.0.0.1:4174/
Runtime: Node.js 24.22.1, npm 11.9.0, React/React DOM 19.3.1, Vite 8.3.5.

### Automated service checks
- `node --test verification/ex3-service.test.mjs`: 11 passed, 0 failed.
- Actual pending fetch and already-aborted signal: AbortError passed through correctly.
- Active simulated delay: aborted after its listener was installed; listener removed.
- HTTP 404, malformed JSON, wrong-squad/invalid data and invalid options: rejected.
- Default 35% failure boundary checked deterministically at random values 0.349 and 0.35.
- `npm run lint` and `npm run build`: passed.

### Browser checks
- TE was selected by default; CES/TE/GE JSON data and transitions passed.
- Previous data is removed during LOADING; obsolete work never replaced the latest squad.
- HTTP cancellation: observed on actual native fetch while CDP network latency was enabled.
  The browser emitted a canceled loadingFailed event before the response completed.
- Simulated-delay cancellation: observed separately after HTTP 200, before the 1400ms work finished.
- Unmount/remount cleanup: passed. Development StrictMode produced its expected repeated
  setup/cleanup cycle; all six observed request controllers were aborted after final unmount.
- ERROR, repeated simulated errors, offline errors, repeated Retry, online recovery and
  squad switching during Retry: passed. Randomness was overridden only in the test browser.
- Production source retains delayMs=1400 and failureRate=0.35. No test mode was added to the UI.
- Loading skeleton min-height >=220px; selector stays enabled; aria-busy and reduced-motion passed.
- One error alert without a competing error live-status message; semantic article/dl stats passed.
- Retry Enter/Space activation and native select keyboard navigation passed. Focus stays on a
  stable main element while Retry disappears, avoiding a drop to the document body.
- SUCCESS, ERROR and LOADING: no horizontal overflow at 320/375/768/1024/1440px.
- axe tags WCAG 2 A/AA, 2.1 A/AA, 2.2 AA: no reported violations in these three states.
- Desktop/mobile success, loading and error screenshots were visually inspected.
- No uncaught page errors. Expected network errors during intentional Offline tests are distinct
  from application exceptions.

### Existing activity regression
- All seven original WAVs emitted real playing events.
- Drum shortcuts, hold suppression, modifiers, Enter/Space, editable targets and blur recovery passed.
- Exercise 2 search/filter/sort, Delete/Reset, focus, insertion, duplicate names, validation,
  long names and responsive/accessibility checks passed again.
- Ten previous activity source files and seven original WAVs (17 files) are byte-identical
  to the pre-Exercise-3 snapshot. main and the earlier activity branches were not updated.

### Evidence and remaining manual checks
- `verification/ex3-browser-checks.json`: actual network cancellation records and browser checks.
- `verification/ex3-strictmode.json`: actual development lifecycle observations.
- Chrome React DevTools Components/Network tab screenshots were not captured in the user's
  Windows browser. CDP observations are machine evidence, not a screenshot of those tabs.
- A Chrome Performance layout-shift trace and human screen-reader review remain manual.
  No numeric CLS score or full WCAG certification is claimed.
- No video was requested for Exercise 3, so no Exercise 3 video was created.

The two required implementation commits were completed in order, followed by a separate
verification documentation commit. No new observed product defect required an AI failure
entry for Exercise 3; the earlier audit remains unchanged.

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
- [ ] Review existing React 19 project.
- [ ] Protect Homework 1 on a separate branch.
- [ ] Define data and component contracts.
- [ ] Define acceptance tests for four milestones.

## M1 — Stable Data Schema
- [ ] Define ScientistPerson JSDoc schema.
- [ ] Create six sample records with fixed IDs.
- [ ] Keep source data separate from UI.
- [ ] Verify unique IDs and field types.
Commit: feat(ex2): normalize smartPeople schema with stable IDs

## M2 — Search, Filter and Sort
- [ ] Create ScientistDirectory component.
- [ ] Add controlled search input.
- [ ] Add controlled minimum IQ input.
- [ ] Add IQ descending and age ascending sorting.
- [ ] Compute visiblePeople during render.
- [ ] Use toSorted without mutating source data.
Commit: feat(ex2): add search, IQ filter & toSorted

## M3 — Delete, Reset and Feedback
- [ ] Delete by stable ID.
- [ ] Preserve keyboard focus after deletion.
- [ ] Reset source data and independent filter inputs.
- [ ] Add accessible live status.
- [ ] Handle empty results and empty directory.
Commit: feat(ex2): add delete/reset & live status

## M4 — Accessible Insert Form
- [ ] Add controlled Name, Age and IQ fields.
- [ ] Generate field IDs with useId.
- [ ] Validate names and positive integer values.
- [ ] Generate unique IDs on successful submission.
- [ ] Insert immutably using functional updates.
- [ ] Explain when a new record is hidden by filters.
- [ ] Clear form errors on Reset.
Commit: feat(ex2): add accessible person insertion form

## Final Verification
- [ ] Validate search, filters and sorting.
- [ ] Test duplicate names with different IDs.
- [ ] Test all invalid insertion cases.
- [ ] Test focus and keyboard navigation.
- [ ] Inspect React DevTools Components and Profiler.
- [ ] Test 375px and desktop layouts.
- [ ] Run npm run lint and npm run build.
- [ ] Record actual outcomes.
- [ ] Record a demonstration shorter than 60 seconds.

Note: Mark a task complete only after verification.


## Data and component contracts (before implementation)
- ScientistPerson: stable unique string id; nonempty string name; positive integer age and iq.
- ScientistDirectory: optional readonly initialData array, copied once as the Reset snapshot.
- Pipeline: query and minimum IQ filter, followed by non-mutating toSorted.
- Delete: receive an ID, remove only that record, restore focus after DOM commit.
- Insert: trim name, validate whole positive numbers, create UUID once, append immutably.
- Reset: restore initial data and all independent form/filter defaults.

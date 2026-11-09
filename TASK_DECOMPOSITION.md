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
- [x] Preserve native Enter/Space behavior.q
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

## M2 Follow-up — Pad Release Contract

- [x] A mapped keydown plays one sound and adds one history entry.
- [x] A shortcut pad stays pressed until its matching keyup or window blur.
- [x] Releasing one shortcut leaves other held pads pressed.
- [x] Repeated keydown events and editable targets do not trigger shortcuts.
- [x] Disabling shortcuts clears held pads.
- [x] Click, tap, Enter and Space use the same button activation path.
- [x] Holding Enter or Space does not add repeat hits.
- [x] The visual meter shows a short illustrative pulse for each hit.

Verification: test rapid release, two simultaneous shortcuts, window blur,
editable focus, and native button activation. Re-run production checks.

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

## Follow-up Verification — Windows

Lighthouse was run in Chrome against the Vite production preview.

| Lighthouse category | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

## Lab 03 Homework 2 — 88-Key Polyphonic Piano & Concurrent FIFO Sequencer

### M1 — Piano Note Data and Keyboard UI

- [x] Generate notes in ascending MIDI order from 21 (A0) through 108 (C8).
- [x] Derive the note name, octave, key type, and frequency from MIDI.
- [x] Verify 88 notes total: 52 white keys and 36 black keys.
- [x] Verify A0 = MIDI 21, A4 = MIDI 69 and 440 Hz, and C8 = MIDI 108.
- [x] Render each note as a button with its MIDI value as the React key.
- [x] Verify visible focus, pressed state, and keyboard access at 375px.

### M2 — Web Audio

- Chord and independent release: Passed in reference Chromium. Two notes were held together, and releasing one left the other active. Audible playback on Windows is pending.
- Ninth note steals the oldest held voice: Passed in reference Chromium. The ninth note released A0, the oldest held note, and the other eight voices stayed active.
- Window blur releases active voices: Passed in reference Chromium. A simulated window blur cleared the remaining active voice.

### M3 — FIFO Sequencer

- Recorded notes replay in start order with overlap: Passed. The scheduler started the second note while the first was still active.
- Playback at 0.5x, 1x, and 2x: Passed in automated tests. All three speeds scaled both the gap between note starts and the held duration.
- Stop cancels pending notes and preserves the recording: Passed in reference Chromium. After Stop, the pending note did not start, and the same recording could be played again.

### M4 — Verification

- Generated keys: 88 total, 52 white, 36 black.
- Piano scroll and page overflow at 375px: Passed in reference Chromium. The piano scrolled from A0 to C8 within its container without horizontal page overflow.
- React DevTools Profiler, PianoKey renders on press: Pending on Windows. Reference render instrumentation showed that only the A0 PianoKey updated on press.
- React DevTools Profiler, PianoKey renders on release: Pending on Windows. Reference render instrumentation showed that only the A0 PianoKey updated on release.
- Lint and production build: Both passed on the reference implementation.

## Lab 03 Homework 3 — KRAFTON × PUBG Vietnam Championship & Airdrop Arena

### M1 — Airdrop Countdown and Status

- [x] Verify demo item prices, stock, and opening and closing deadlines.
- [x] Verify WARMUP, AIRDROP_LIVE, LOOTED_OUT, and EXPIRED.
- [x] Verify Claim is available only during an in-stock live drop.
- [x] Verify countdown resynchronization after returning to the tab.
- [x] Verify keyboard focus, the 375px layout, lint, and production build.

### M2 — Optimistic Claim and Conflict Rollback

- [x] Verify success, 409 rollback, and service error rollback.
- [x] Verify rapid clicks create only one claim per pending item.
- [x] Verify a lost response retries with the same claim ID.
- [x] Verify confirmed stock and sold-out behavior.

### M3 — Championship Leaderboard and Kill Feed

- [x] Verify sorting by WWCD, Placement Points, and Kill Points.
- [x] Verify team filtering and the empty feed state.
- [x] Verify filter labels, keyboard focus, and the 375px layout.

### M4 — Production Verification and Submission Evidence

- [x] Verify countdown resynchronization after switching tabs.
- [x] Capture claim success, pending stock, and mock 409 rollback.
- [x] Capture leaderboard sorting, team filtering, and the empty feed state.
- [x] Verify the 375px layout and keyboard focus on production preview.
- [x] Verify lint, build, and all three homework entry pages.
- [x] Review the AI failure audit, Git log, and shared conversation link.
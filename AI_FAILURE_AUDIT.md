# Homework 1 — Verified correction audit

## Request context
Implement the supplied Production Studio Drum Kit guide, using React 19, WCAG 2.2 AA and measured Lighthouse results, in separate milestones.

## 1. Accessible name did not contain the visible label
- Original generated code in `DrumPad.jsx`: `aria-label={`${pad.name}, keyboard shortcut ${pad.keyLabel}`}`.
- Evidence: Lighthouse 13.5.0 `label-content-name-mismatch` reported all seven buttons. Example visible text: `W Kick Play`; original name: `Kick, keyboard shortcut W`. This audit did not reduce the reported Accessibility category score, so a score of 100 alone missed the defect.
- Correction: remove the overriding `aria-label`; let the visible button content supply its native accessible name, and describe the shortcut through `aria-keyshortcuts`.
- Verification: the final Mobile/Desktop reports no longer flag `label-content-name-mismatch`; keyboard activation still passes.

## 2. Missing robots.txt
- Evidence: the initial Vite Preview response for `/robots.txt` fell back to index.html. Lighthouse `robots-txt` failed with 17 parsing errors; SEO scored 91.
- Correction: add `public/robots.txt` with `User-agent: *` and `Allow: /`.
- Verification: the final Mobile/Desktop SEO scores are 100.

Correction commit: `fix(hw1): align pad names and provide crawl rules`.

## Audit environment correction
The first Mobile Performance run had `NO_SCREENSHOTS`, so its displayed score was not accepted as a valid measurement. Removing Chromium's `--single-process` launch flag allowed a complete run. Browser security-disabling launch flags were also excluded from the final Lighthouse runs. The final reports contain measured results, not substituted scores.

## Homework 2 — Focused white key overlapped a black key

- Reproduction: Focus A0 and inspect the left side of the adjacent A#0 key.
- Evidence: In the draft Chromium build, `document.elementFromPoint` inside the overlapping area returned A0 instead of A#0.
- Fix: Keep the white key's inset focus outline and raise only the focused black key.
- Verification: The corrected Chromium build returned A#0 at the same point while A0 retained a visible outline.

## Homework 3 — AI Failure Audit

### 1. Claim ID generation failed on an HTTP network origin

- Reproduction: Open the draft Arena on a non-localhost HTTP origin, wait
  for VIP Tickets to go live, then click Claim.
- Evidence: Chromium reported `crypto.randomUUID is not a function`.
  Stock stayed at 2 and the claim did not start.
- Fix: Generate request IDs with a per-mount counter. The mock request
  log is scoped to the demo session, and retries reuse the original ID.
- Verification: Claim success, 409 rollback, and same-ID retry passed
  on the same HTTP test origin after the fix.
- Fix commit: <M2_SHA>.

### 2. A temporary verification bundle was picked up by ESLint

- Reproduction: Build the draft to a custom `dist-arena-dev` directory
  inside the repo, then run `npm run lint`.
- Evidence: ESLint scanned generated files under `dist-arena-dev/assets`
  and reported 239 errors from bundled JavaScript.
- Fix: Move the temporary verification output outside the repo and use
  the default build output for the student workflow.
- Verification: Lint and build passed after the temporary output was moved.
- Commit reference: `docs(hw3): record arena verification and failure audit`.
  This entry documents a verification workflow correction.

### Remaining audit evidence

- Two failures have verified evidence. One additional verified failure is
  required to reach the three-entry target.
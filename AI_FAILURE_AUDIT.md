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


# Exercise 2 — Verified corrections

## Local M3 integration scope error
- Request: extend the existing directory with Delete/Reset after the sorting pipeline.
- Fault: an automated insertion matched the comparator's first `return (` and placed
  handleDelete/handleReset inside the age-sort branch instead of the component body.
- Evidence: ESLint reported two unused handler errors and two `no-undef` errors at the
  JSX button handlers. This was caught before publishing the M3 feature commit.
- Correction: move both handlers outside the toSorted comparator, before the component JSX return.
- Verification: lint/build passed; filtered/sorted deletion, focus restoration and Reset passed.

## Local M4 status overflow
- Request: validate insertion and responsive 375px layout, including long names.
- Fault: the live status interpolated an unbroken 200-character name without wrapping.
- Evidence: the Playwright assertion `scrollWidth <= clientWidth` failed after adding that
  name at 375px; ordinary sample names had passed.
- Correction: apply `overflow-wrap: anywhere` to the status output.
- Verification: the 200-character test and all responsive widths passed before publishing M4.

No failures were fabricated for this audit.

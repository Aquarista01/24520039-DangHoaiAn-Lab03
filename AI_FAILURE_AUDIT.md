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

# Lab 03 — React Activities

Đặng Hoài An · 24520039 · Web Application Development

This branch includes Homework 1 (Production Studio Drum Kit) and Exercise 2
(Interactive Scientist & Pioneer Directory). Use the activity buttons at the top.

## Run locally

Use Node.js 24 and npm. From this project folder:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. To check the production build:

```sh
npm run lint
npm run build
npm run preview
```

No API key, environment file or database is required.

## Exercise 2

- Seven initial records (six historical examples and Đặng Hoài An) with fixed string IDs and JSDoc contracts in `src/components/smartPeople.js`.
- Controlled Search, Minimum IQ (default 0) and IQ-descending/age-ascending sorting.
- Results are derived with filter() and ES2024 toSorted(); no synchronized results state.
- Delete by ID, keyboard focus restoration, Reset and one polite live status.
- Blank controlled Add a Person form for new records. Đặng Hoài An / 20 / 123 is already part of the initial directory.
- Validation rejects empty names and nonpositive/noninteger Age/IQ values. useId links labels/errors.
- Successful insertions receive UUIDs. Identical names are allowed and can be deleted independently.
- Hidden insertions explain the active search/IQ filters; the total count still changes.
- IQ values are exercise data, not independently verified measurements.
- Data is in memory; switching activities remounts them and resets their state.

The branch `ex2-scientist-directory` inherits Homework 1 and has separate planning,
data, filtering/sorting, deletion/reset, insertion and final-verification commits.

## Homework 1

The original DrumMachine source and seven Lab 1 sounds are preserved. Click/tap pads
or use W/A/S/D/J/K/L. Enter/Space activate focused buttons; typing in the test field
does not trigger shortcuts. A checkbox disables character shortcuts.

## Verification

- `TASK_DECOMPOSITION.md`: per-milestone acceptance tests and actual outcomes.
- `verification/ex2-profiler.json`: real React Profiler API events for one search update.
- `verification/ex2-demo.mp4`: short, actual automated browser demonstration.
- `verification/lighthouse-results.json`: earlier Homework 1 measurements, not an Exercise 2 audit.
- `AI_FAILURE_AUDIT.md`: actual defects caught and corrected during implementation.

Chrome React DevTools Components/Profiler tab screenshots remain to be captured on Windows.
The JSON API measurement does not claim to be an extension recording.


## Exercise 2 correction — 26 October 2026

Đặng Hoài An (age 20, exercise IQ 123, stable ID sp-7) now appears in the initial
seven-record directory. Minimum IQ starts and resets at 0 so this record is visible.
The Add a Person fields start and reset empty; Reset restores the seven seeded records.
Earlier demonstration/profile files document the previous six-record defaults.

# Lab 03 — Homework 1

Đặng Hoài An · 24520039 · Web Application Development

Production Studio Drum Kit using React 19, Vite, functional components,
custom hooks and CSS Modules. Seven original Lab 1 sounds are reused.

## Run locally

Use Node.js 24 and npm. From the project folder:

```sh
npm ci
npm run dev
```

For production verification:

```sh
npm run lint
npm run build
npm run preview
```

Open the local URL printed by Vite. No database, API key or environment file is needed.

## Controls

| Key | Instrument |
| --- | --- |
| W | Kick |
| A | Snare |
| S | Clap |
| D | Closed Hat |
| J | Rimshot |
| K | Shaker |
| L | Crash |

Click or tap a pad, or use its shortcut. Tab focuses controls; Enter and Space
activate buttons. Shortcuts ignore editable fields, modifiers and held-key repeats.
The checkbox can disable character shortcuts. Recent Hits keeps the last six hits;
the meter shows illustrative intensity, not measured decibels.

## Implementation and evidence

- `src/homeworks/DrumMachine/`: pad component, audio hook, keyboard hook and feedback.
- `project-rules.md` and `TASK_DECOMPOSITION.md`: contracts-first milestones and checks.
- `verification/lighthouse-results.json`: measured local production audit extracts.
- `AI_FAILURE_AUDIT.md`: evidenced defects and corrections found during verification.

The branch `hw1-production-drum-kit` contains M0–M4 plus a separate correction commit.

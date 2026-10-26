# Homework 1 — Task Decomposition

Project: Production Studio Drum Kit
Stack: React 19 + Vite
Accessibility target: WCAG 2.2 AA
Lighthouse target: 100

## M0 — Planning and Contracts
- [ ] Initialize React 19 + Vite.
- [ ] Review original DrumKit assets and behavior.
- [ ] Create project-rules.md.
- [ ] Define JSDoc contracts.
- [ ] Establish isolated Git branch.
Acceptance: contracts exist before implementation.

## M1 — React Drum Pads and Audio
- [ ] Create seven stable pad definitions.
- [ ] Build DrumPad and DrumMachine components.
- [ ] Reuse original audio assets.
- [ ] Support mouse/touch interaction.
- [ ] Handle audio failures and cleanup.
Acceptance: all seven pads play the correct sounds.

## M2 — Keyboard Hook
- [ ] Implement useDrumKeyboard.
- [ ] Use event.code with KeyW/A/S/D/J/K/L.
- [ ] Ignore repeat, modifiers and editable targets.
- [ ] Preserve native Enter/Space behavior.
- [ ] Implement keyup and blur handling.
- [ ] Clean up listeners.
Acceptance: all seven shortcuts work without duplication.

## M3 — Accessibility and Visual Feedback
- [ ] Add aria-pressed and accessible pad names.
- [ ] Add latest-hit output with aria-live.
- [ ] Add recent hit history with stable IDs.
- [ ] Add illustrative visual sound meter.
- [ ] Test keyboard focus and input suppression.
Acceptance: accessible feedback works for every hit.

## M4 — Production Verification
- [ ] Check responsive layout at 375px and desktop.
- [ ] Verify keyboard and audio lifecycle.
- [ ] Run lint and production build.
- [ ] Run production Lighthouse audits.
- [ ] Record actual results and remaining issues.
Acceptance: checks are completed and documented.

## Git Policy
- One focused commit per verified milestone.
- Do not rewrite existing commit history.
- Do not mark unperformed tests as passed.
- Keep changes within Homework 1.

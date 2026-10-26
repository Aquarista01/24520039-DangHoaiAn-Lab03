# Lab 03 — Project Rules

## Scope
- Implement Homework 1 using React 19 and Vite.
- Reuse audio assets from the original Lab 1 DrumKit.
- Keep Lab 1, Lab 02, and other assignments unchanged.
- Work in an isolated Git branch.

## Architecture
- Use functional components and React Hooks only.
- Mount with createRoot and StrictMode.
- Use ES6 default parameters instead of defaultProps.
- Use semantic JSX, CSS Modules, and CSS custom properties.
- Do not use class components, ReactDOM.render, keyCode,
  window.alert, or dangerouslySetInnerHTML.
- Use stable IDs and immutable state updates.
- Avoid unnecessary state and effects.

## Keyboard and Audio
- Use event.code for seven shortcuts.
- Ignore repeated keys, modifiers, and editable targets.
- Keep native Enter and Space button activation.
- Clean up listeners, timers, and audio resources.
- Show playback failures in the UI.

## Accessibility
- Target WCAG 2.2 AA.
- All controls must be keyboard accessible.
- Provide visible focus indicators and adequate contrast.
- Include a concise live output, hit history, and visual meter.
- Never present illustrative intensity as measured dB.
- Test mobile layouts at 375px.

## Workflow
1. Functional decomposition.
2. Contract-first specification.
3. Atomic implementation.
4. Independent verification.
5. Focused Git commit.

## Evidence
- Run browser tests, lint, and production build.
- Measure Lighthouse rather than assuming a perfect score.
- Record only actual results.
- Use AI_FAILURE_AUDIT.md only for genuine, evidenced AI failures.
- Do not introduce unrequested deployment or reporting tasks.


## Exercise 2 — Scientist Directory

- Preserve Homework 1 and its audio assets.
- Use React 19 functional components and automatic JSX runtime.
- Implement ScientistDirectory in src/components/.
- Define JSDoc data and component contracts before implementation.
- Use stable string IDs, never array indexes as list keys.
- Keep source data immutable.
- Derive visiblePeople using filter() and toSorted().
- Never use useEffect to synchronize filtered or sorted results.
- Use controlled search, number, select and insertion inputs.
- Read numeric fields with valueAsNumber and handle NaN.
- Use useId for accessible form labels.
- Restore keyboard focus after deleting a record.
- Use one polite live status output for list changes.
- Keep form errors in the page, not window.alert.
- Support 375px and desktop layouts.
- Run lint, build and manual checks before each commit.
- Preserve the required Exercise 2 commit sequence.
- Record only actual AI failures with supporting evidence.



## Exercise 3 — PUBG VN Live Telemetry

- Preserve Homework 1 and Exercise 2.
- Use React 19, functional components and StrictMode.
- Use one state-machine object with IDLE, LOADING,
  SUCCESS and ERROR states.
- Define JSDoc contracts before implementation.
- Use local simulated JSON, not official KRAFTON APIs.
- Default to The Expendables (TE).
- Keep a single selected squad state in App.
- Use AbortController for every telemetry request.
- Abort previous requests when switching teams or unmounting.
- Never display stale responses or aborted requests as errors.
- Use an abortable delay and configurable 35% failure simulation.
- Do not use independent loading/success/error booleans.
- Provide semantic, keyboard-accessible UI.
- Use CSS Modules, custom properties and reduced-motion styles.
- Display a 220px radar skeleton while loading.
- Provide an in-page error alert and Retry control.
- Keep the squad selector usable during loading.
- Verify Network cancellation only while HTTP is pending.
- Distinguish actual HTTP requests from simulated delays.
- Run lint/build and inspect changes before each commit.
- Use only the two required Exercise 3 implementation commits.
- Document genuine AI failures only; never invent evidence.


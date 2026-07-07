# Frailty Coach v2 Mockups

Date saved: 2026-07-07

These boards are the current visual reference for the simplified, daily-use Frailty Coach app direction. Use them when comparing implementation fidelity or planning UI changes.

## Boards

- [Core Screens](core-screens.png): Today, Assess, Workout, Progress, and Coach at the primary mobile app level.
- [Guided Assessment](guided-assessment.png): step-by-step assessment flow, including safety checks, Timed Up and Go, results, and update-plan states.
- [Workout Session](workout-session.png): workout overview, active exercise, setup detail, rest, and completion states.
- [Details + Presenter](details-and-presenter.png): hidden detail surfaces, walkthrough, evidence, stop-exercise guidance, and presenter tooling.

## Design Intent

- Treat Today as the daily command center: one primary workout action, a high-level plan, safety state, and concise score interpretation.
- Keep Assess clean and guided, with large timer controls and clear instructions only when needed.
- Move exercise details into the workout session instead of crowding the Today screen.
- Keep Progress interpretive and actionable first, with detailed trends available on demand.
- Keep Coach as the place for walkthrough, score explanation, stop-exercise guidance, evidence, and presenter/demo tools.

## Implementation Notes

- These boards are visual references, not production assets.
- Match the hierarchy, spacing, color direction, and progressive disclosure behavior before chasing pixel-perfect image details.
- Safety and evidence access should be easy to find but quiet on the first screen unless a blocking red flag is active.
- Presenter tooling should not appear in the normal audience-facing app mode.

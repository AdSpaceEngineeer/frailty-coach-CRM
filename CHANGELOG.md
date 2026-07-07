# Changelog

All notable product, design, and implementation changes to Frailty Coach are tracked here.

This project currently uses cache-busting app URLs such as `?v=65`; those are build/demo references, not semantic release versions.

## Unreleased

- Add future changes here before or during implementation.

## 2026-07-08 - Flexible Assessment Timing

### Changed

- Reframed assessment as a flexible check-in: weekly is suggested, but users can save assessments anytime.
- Added last-assessment status to Today, with a check-in prompt only when the latest assessment is over 7 days old.
- Saving an assessment now records a dated Progress point; saving again on the same day updates that point.
- Progress now plots dated assessment points over the last 3 months instead of fixed weekly buckets.
- Updated Progress copy and change labels to compare against the earliest saved point in the last 3 months.
- Bumped the running demo reference to `?v=65`.

## 2026-07-08 - Safety Copy Clarity Pass

### Changed

- Added **Before you start** context to the TUG setup checklist so users know why stable chair, clear path, and support nearby are shown.
- Clarified similar safety notes in Fall risk, Balance, Workout overview, active exercise, and paused workout states.
- Renamed the progress action **Do easy plan** to **Do today's easy plan**.
- Bumped the running demo reference to `?v=63`.

## 2026-07-08 - Working Header Back Button

### Changed

- Replaced decorative header back arrows with a real **Back to Today** button.
- The button is hidden on Today and available on secondary app screens.
- Bumped the running demo reference to `?v=62`.

## 2026-07-08 - Assessment TUG Label

### Changed

- Renamed the assessment title **Timed Up and Go** to **Timed Up and Go (TUG)** for clarity.
- Bumped the running demo reference to `?v=61`.

## 2026-07-07 - Score More Info Modal

### Changed

- Simplified the Today **Function score** explanation so detailed copy is hidden behind **More info**.
- Added a small closeable score-information modal with the explanation, score meaning, and best next step.
- The modal can be closed with the close button, backdrop click, or Escape, then returns focus to the original button.
- Bumped the running demo reference to `?v=60`.

## 2026-07-07 - Progress Score Clarity

### Changed

- Progress insight now shows the current **Function score** by itself, without combining it with a delta.
- Added a separate **Score change** row with plain-language wording such as `3 points lower`.
- Renamed detailed progress deltas so they read as changes, not current values.
- Tightened the collapsed **View detailed trend** disclosure so it no longer leaves a large blank area.
- Bumped the running demo reference to `?v=59`.

## 2026-07-07 - Workout Completion State Fix

### Fixed

- Fixed the Today screen showing **Workout reminder** after the user completed the final workout exercise.
- Final exercise completion now immediately records the workout as done for today.
- Changed the completion screen primary action from **Mark workout done** to **Back to Today** because completion is now automatic.
- Bumped the running demo reference to `?v=56`.

## 2026-07-07 - Progress Steps Delta Fix

### Fixed

- Fixed Progress screen **Steps** change rendering `NaN`.
- Steps now compare the current wearable step count against the selected profile's seeded baseline.
- Bumped the running demo reference to `?v=55`.

## 2026-07-07 - Workout Pause and Stop Controls

### Added

- Added **Pause workout** controls to active exercise, setup/safety, and rest screens.
- Added a paused workout state with a saved exercise, rep/set progress, and resume action.
- Added **Stop if unwell** / **Stop workout today** controls that return to Today without marking the workout complete.
- Today now shows a paused-workout status and a **Resume workout** primary action when a workout is paused.
- Bumped the running demo reference to `?v=54`.

## 2026-07-07 - Workout Completion Artwork Framing

### Fixed

- Fixed the workout completion illustration so the full person is visible and the head is no longer cropped.
- Clipped the source artwork corners cleanly while preserving the full figure.
- Bumped the running demo reference to `?v=53`.

## 2026-07-07 - Plain-Language Score Coaching

### Added

- Added a score interpretation panel below the Today screen Function score.
- The panel explains that the score represents movement reserve across walking, standing strength, balance, daily activity, and recovery.
- Added band-specific encouragement and a clear next step focused on the user's weakest domain.
- Bumped the running demo reference to `?v=51`.

## 2026-07-07 - Set-Aware Workout Counter

### Fixed

- Fixed exercise counters so doses like `2 sets of 6` require both sets before moving to rest or the next exercise.
- Changed **Reps complete** to complete the current set first; it only advances after the final set is complete.
- Added set labels to the workout counter, such as `Set 1 of 2` and `Set 2 of 2`.
- Bumped the running demo reference to `?v=49`.

## 2026-07-07 - Fresh Startup Defaults

### Changed

- Moved mutable app/profile numbers out of persistent browser storage.
- Fresh app startups now always start from the fixed seeded profile defaults.
- Changes made during a running demo, including saved assessments, completed workouts, and four-week simulation, still persist in memory while the app remains open.
- Refreshing or reopening the app resets profile numbers back to the default seeds.
- Kept coach avatar preference in persistent local storage as a user preference.
- Bumped the running demo reference to `?v=48`.

## 2026-07-07 - Assessment Stepper Icon Polish

### Changed

- Replaced abstract assessment-step glyphs with clearer inline SVG icons for Safety, Fall risk, Walk, Strength, and Save.
- Bumped the running demo reference to `?v=46`.

## 2026-07-07 - Daily-Use Workout Flow and v2 UI Refinement

### Added

- Added Today-screen workout completion state:
  - Before completion, Today shows a workout reminder.
  - After completion, Today shows "Workout done today", an encouragement note, and a **View progress** primary action.
  - Workout completion is recorded once per local day to avoid duplicate adherence, step, or active-minute inflation.
- Added a guided workout-session flow:
  - Workout overview.
  - Active exercise screen.
  - Setup and safety detail view.
  - Rest screen.
  - Completion screen.
- Added separate rep actions:
  - **Mark rep** increments one rep.
  - **Reps complete** immediately fills the required rep count.
  - Rep controls disable once reps are complete.
  - **Reset counter** allows the user to restart the current exercise counter.
- Added automatic rest after exercise completion:
  - Completing the required reps immediately opens the rest screen.
  - Default rest is now 60 seconds.
  - **Add 1 min rest** extends rest by one minute per tap.
  - **Skip rest and start next** moves directly to the next exercise.
- Added guarded storage helpers so the app can still render in embedded/private contexts where `localStorage` may be unavailable.
- Added regression coverage for once-per-day workout completion.

### Changed

- Reworked Today around the daily habit loop:
  - Daily workout is the primary action.
  - Assessment is positioned as weekly or as-needed.
  - Non-critical score and wearable details are hidden behind disclosures.
- Improved workout-completion artwork framing so the completion screen no longer shows an awkward tall crop.
- Updated rest behavior from a short 45-second timer to a more conservative 60-second starting rest for older/frail users.
- Versioned `logic.js` through the service-worker cache list to avoid stale module exports during demo testing.
- Bumped the running demo reference to `?v=45`.

### Fixed

- Fixed the workflow where **Mark workout done** stayed on the completion screen instead of returning to Today.
- Fixed repeated workout-completion taps double-counting adherence/activity for the same day.
- Fixed stale service-worker/module caching issues that could cause newly added logic exports to be unavailable.
- Fixed rest timer behavior so it starts immediately after exercise completion instead of requiring an extra **Start rest** tap.

## 2026-07-07 - Assessment, Score, and Mockup Alignment

### Added

- Added guided assessment steps aligned to the saved v2 mockups:
  - Safety check.
  - Fall-risk questions.
  - Timed Up and Go.
  - Chair stands and balance.
  - Save assessment.
- Added function-score breakdown with interpretable domains:
  - Mobility.
  - Leg strength.
  - Balance.
  - Daily activity.
  - Recovery.
- Added clear assessment instructions, setup checks, timers, counters, confidence selection, and save/update-plan flow.
- Added hidden Coach walkthrough sections for users who want app guidance without forcing onboarding.
- Added design QA notes comparing implemented screens against the saved mockups.

### Changed

- Simplified the app for older adults by reducing dense always-visible information and moving secondary detail behind disclosures.
- Reworked Today, Assess, Workout, Progress, and Coach toward the Frailty Coach v2 mockup direction.
- Made workout cards more actionable and moved detailed exercise instructions into the workout session.
- Made progress more interpretive and actionable, with summary guidance before detailed trends.
- Reduced prominence of safety/evidence messaging so it is still accessible without dominating the first screen.
- Standardized stat typography for TUG, chair stands, and balance score tiles.
- Improved bottom navigation icon consistency and sizing.

### Fixed

- Fixed assessment timer startup display so it no longer shows stale/random time before a new run.
- Fixed assessment stepper and screen-header mismatches.
- Fixed oversized text and layout issues on assessment save and score detail screens.

## 2026-07-06 - Frailty Coach v2 Design Direction

### Added

- Added saved v2 design mockups under `design/mockups/frailty-coach-v2/`:
  - Core Screens.
  - Guided Assessment.
  - Workout Session.
  - Details and Presenter.
- Added product-design audit artifacts and screenshots for mockup comparison.
- Added v2 UI direction focused on simple daily use:
  - Today as a high-level daily command center.
  - Assess as a guided weekly/as-needed flow.
  - Workout as the detailed daily session.
  - Progress as interpretation plus action.
  - Coach as support, walkthrough, safety, and evidence.

### Changed

- Chose the simplified Today direction with elements of the companion concept.
- Chose the cleaner guided-assessment direction with larger primary timer controls.
- Reframed the product around daily workouts and less frequent assessments.
- Clarified that demo/presenter controls should be hidden from the normal app experience.

## 2026-07-06 - Presenter Modes, Scenarios, and Documentation

### Added

- Added normal app mode for audience-facing demos.
- Added presenter mode with hidden controls:
  - Scenario selection.
  - Four-week simulation.
  - Scenario reset.
  - `Shift + D` toggle.
- Added four seeded presenter scenarios:
  - Grace, 84: frail with fall-risk precautions.
  - Daniel, 76: pre-frail and mostly independent.
  - Mei, 69: robust and active.
  - Alex, 72: advanced and very active.
- Added README documentation for:
  - Presentation modes.
  - Presenter scenarios.
  - Four-week simulation purpose and limitations.
  - Suggested demo flow.

### Changed

- Repositioned four-week simulation as a presenter tool, not a normal user-facing control.
- Clarified that the simulation is a product-story shortcut, not a clinical promise.

## 2026-07-06 - Guided Companion Redesign

### Added

- Added warm, elder-friendly visual direction:
  - Deep green navigation.
  - Ivory surfaces.
  - Larger tap targets.
  - Softer home-health illustration style.
- Added generated app illustrations:
  - Coach avatars.
  - Progress success.
  - Supported sit-to-stand.
  - Weight shifts.
  - Wall push-ups.
  - Hallway walk.
- Added male and female East Asian coach avatar options.
- Added avatar preference control in Coach.

### Changed

- Reworked the UI away from a clinical dashboard toward a closer-to-real wellness app experience.
- Made the safety disclaimer and evidence link less intrusive while keeping them discoverable.
- Updated Coach to support user/caregiver summaries, walkthrough, safety guidance, and evidence sources.

## 2026-07-05 - Evidence, Safety, and User Guide

### Added

- Added evidence and sources section.
- Added evidence-backed user guide.
- Added plain-language safety positioning:
  - Wellness guidance only.
  - Not a diagnosis.
  - Stop-exercise guidance for red-flag symptoms.
- Added README scientific positioning for the Function Resilience Score.

### Changed

- Clarified that the Function Resilience Score is a product composite based on validated domains, not a validated diagnostic frailty score.
- Made evidence and trust information available on demand rather than as the first thing users see.

## 2026-07-04 - Mobile UI Polish

### Added

- Added mobile-first polish for app-like presentation.
- Added bottom tab navigation styling.
- Added improved card, panel, and metric presentation.

### Changed

- Improved responsive mobile layout and readability.
- Improved visual hierarchy for score, assessment, workout, progress, and coach content.

## Initial Build - Frailty Coach PWA

### Added

- Created the Frailty Coach progressive web app scaffold.
- Added core app screens:
  - Today.
  - Assess.
  - Workout.
  - Progress.
  - Coach.
- Added seeded persona data and deterministic demo state.
- Added assessment inputs:
  - Timed Up and Go.
  - Chair stands.
  - Balance stage and hold time.
  - Gait speed.
  - Safety and fall-risk questions.
  - Measurement confidence.
- Added scoring logic for:
  - Mobility.
  - Strength.
  - Balance.
  - Activity.
  - Recovery.
  - Fall-risk and safety modifiers.
- Added adaptive workout-plan logic by function band.
- Added four-week progress simulation logic.
- Added unit tests for scoring, safety routing, progress simulation, and workout completion.
- Added service-worker and manifest support for PWA behavior.

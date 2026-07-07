# Design QA: Frailty Coach v2 v35

source visual truth:

- Core Screens: `design/mockups/frailty-coach-v2/core-screens.png`
- Guided Assessment: `design/mockups/frailty-coach-v2/guided-assessment.png`
- Workout Session: `design/mockups/frailty-coach-v2/workout-session.png`
- Details + Presenter: `design/mockups/frailty-coach-v2/details-and-presenter.png`

implementation URL: `http://localhost:5175/?v=35`

implementation screenshots:

- Assessment strength: `product-design-audit/frailty-coach-v35-qa/01-assess-strength.png`
- Assessment save: `product-design-audit/frailty-coach-v35-qa/02-assess-save.png`
- Workout overview: `product-design-audit/frailty-coach-v35-qa/03-workout-overview.png`
- Workout active: `product-design-audit/frailty-coach-v35-qa/04-workout-active.png`
- Coach: `product-design-audit/frailty-coach-v35-qa/05-coach.png`
- Broader pass screenshots: `product-design-audit/frailty-coach-v34-qa/`

viewport: 390 x 844 mobile

state coverage:

- Guided assessment Strength and Save steps
- Workout overview and active exercise
- Coach tab after hierarchy and header changes
- Progress and Today were checked in the v34 screenshot pass

## Findings

- No actionable P0/P1/P2 findings remain for this pass.

## Fidelity Surface Review

- Screen headers: passed for this iteration. Workout, Progress, and Coach now use screen-specific top bars instead of the generic brand header.
- Assessment Strength: passed. Native-select feel was replaced with touch-friendly balance tiles and a hold-time stepper.
- Assessment Save: passed. The score card hierarchy is compact, the save action is visible, and the plan name no longer overwhelms the screen.
- Workout overview: passed. The overview now uses a plan intro, right-sized coach artwork, clear exercise rows, and visible primary/secondary actions.
- Workout active: passed. The exercise image no longer pushes the rep counter and primary action below the first viewport.
- Coach: passed. The screen now leads with avatar preference, audience toggle, concise coaching message, and help/evidence disclosures.

## Remaining P3 Polish

- Icons are more consistent and better sized, but not a true installed icon-library match to the mockups.
- The app is closer to the boards but still not pixel-perfect on exact typography, pictogram style, and some illustration crops.
- Workout duration still reflects current seeded plan length (`20 min`) rather than the mockup's simplified `15 min` copy.

## Verification

- `node --check src/app.js`: passed
- `npm test`: passed
- `git diff --check`: passed
- Served HTML check: `styles.css?v=35` and `src/app.js?v=35`

final result: passed

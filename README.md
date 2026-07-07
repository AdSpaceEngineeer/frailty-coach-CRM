# Frailty Coach

Frailty Coach is a mobile-first wellness app that helps older adults safely assess physical resilience, understand frailty and fall-risk signals, and follow adaptive exercise plans that improve strength, balance, and mobility over time.

The app is designed for the Healthy Longevity hackathon theme, especially **Physical health and frailty** and **Longevity data and insights**. It is not a diagnostic or regulated medical-device implementation. It presents a wellness-oriented coaching layer with safety prompts and clinician/caregiver escalation cues.

## One-Sentence Pitch

Frailty Coach helps older adults safely assess their physical resilience, understand frailty and fall-risk signals, and follow adaptive exercise plans that improve strength, balance, and mobility over time.

## Key Features

- **Function Resilience Score**: a simple 0-100 wellness score summarizing mobility, strength, balance, activity, recovery, and fall-risk signals.
- **Score interpretation and breakdown**: explains the 0-100 score in plain language, gives encouragement, and shows which domains are pulling the score up or down.
- **Guided frailty and fall-risk checks**: safety screen, fall-risk questions, Timed Up and Go (TUG), chair stands, balance stage, gait speed, and measurement confidence.
- **Adaptive daily workout sessions**: a simple overview leads into a guided exercise session with setup, action, rest, and safety cues.
- **Guided Companion visual design**: a warm elder-friendly interface with deep green navigation, ivory surfaces, large controls, and app-ready wellness illustrations.
- **Coach avatar preference**: users can choose a female or male East Asian coach avatar, with the selected visual style applied to the hero and workout artwork.
- **Wearable-style insights**: uses steps, active minutes, sleep, resting heart rate, walking speed, and recovery signals to adjust recommendations.
- **Safety-aware coaching**: flags red-flag symptoms, fall-risk concerns, poor recovery, and missed sessions, then recommends supervision or deloading when needed.
- **Progress tracking**: saves each assessment check-in, plots irregular assessment points over the last 3 months, interprets changes in score, TUG time, chair stands, and balance stage, then points the user back to the next useful action.
- **Plain-language coach summaries**: separate explanations for the older adult and for a caregiver or physiotherapist.
- **Hidden walkthrough**: a collapsed Coach section explains daily use, periodic assessments, and progress review without forcing first-time onboarding.
- **Evidence & Sources section**: compact source panel explaining the clinical and scientific basis behind the assessments and workouts.
- **Presentation-safe default mode**: hides demo mechanics so the app can be presented as a close-to-real patient/caregiver experience.
- **Presenter controls**: optional hidden controls for switching scenarios, simulating four weeks of progress, and resetting the current scenario.

## Daily Use Model

The app is designed to be used every day, with the daily workout as the main habit. Assessments are intentionally less frequent and flexible: the app suggests a weekly check-in, but users can assess every few days, after 1-2 busy weeks, or whenever mobility, confidence, symptoms, or support needs change.

The intended loop is:

1. Open **Today** to see the high-level plan, safety state, and why the plan matters.
2. Tap **Do today's workout** and complete the guided **Workout** session.
3. Use **Assess** when useful to refresh the score and adapt the plan. The app shows when the last assessment was saved and prompts a check-in if it has been over a week.
4. Review **Progress** for a plain-language interpretation first, with detailed last-3-month trends available on demand.
5. Open **Coach** for avatar preference, plain-language summaries, the optional app walkthrough, safety guidance, and evidence details.

## App Screens

- **Today**: simplified daily command center with one primary workout action, high-level plan summary, safety state, plain-language score coaching, and collapsed score/wearable details.
- **Assess**: one-step-at-a-time safety, fall-risk, TUG, chair-stand, balance, gait-speed, confidence, and save/update-plan flow.
- **Workout**: guided daily session with overview, active exercise, setup/safety detail, rest state, and completion state.
- **Progress**: plain-language interpretation and next action first, with detailed last-3-month assessment trends tucked behind disclosure.
- **Coach**: plain-language summaries for the older adult and caregiver/PT, coach avatar preference, optional walkthrough, stop-exercise guidance, and Evidence & Sources disclosure.

## Scientific Positioning

The individual assessment domains and exercise categories are evidence-informed. The app draws from CDC STEADI-style fall-risk screening, functional measures such as Timed Up and Go (TUG), chair stands, balance testing, Vivifrail-style exercise levels, and broader older-adult exercise guidance.

The `Function Resilience Score` is a product composite for coaching and visualization. It should be described as a wellness score based on validated domains, not as a validated diagnostic frailty score.

## Visual Design

The current app targets the **Frailty Coach v2** boards in `design/mockups/frailty-coach-v2/`. These are the source of truth for the simplified daily-use direction: a clearer Today screen, guided assessment, workout-session flow, progressive detail disclosure, and quiet presenter tooling.

The earlier **Guided Companion** concept directions remain in `design/mockups/frailty-coach-2026-07-06/` for historical reference.

Generated app assets live in `assets/illustrations/`:

- `coach-avatar.png`
- `coach-avatar-female-east-asian.png`
- `coach-avatar-male-east-asian.png`
- `progress-success.png`
- `supported-sit-to-stand.png`
- `weight-shifts.png`
- `wall-pushups.png`
- `hallway-walk.png`
- `male-progress-success.png`
- `male-supported-sit-to-stand.png`
- `male-weight-shifts.png`
- `male-wall-pushups.png`
- `male-hallway-walk.png`

These are project assets used by the app, not just design references. Keep future exercise artwork consistent with this style: warm ivory background, deep green clothing/actions, soft home setting, rounded digital-health illustration, and no diagnostic claims inside the image.

## Presenter Scenarios

Presenter mode includes four seeded scenarios. They are not real patients; they are deterministic profiles chosen to show how the app adapts across the frailty and physical-resilience spectrum.

| Scenario | What it represents | Why it is included |
| --- | --- | --- |
| **Grace, 84** | Frail, recent fall, low activity, cane user, low recovery signals. | Demonstrates safety-first behavior: fall-risk flags, supervision guidance, deloading, and a supported Level B+ plan. |
| **Daniel, 76** | Pre-frail, mostly independent, some balance concern. | Shows early-risk prevention: moderate function, some fall concern, and a plan that supports strength and balance before decline worsens. |
| **Mei, 69** | Robust, active, wants to stay strong. | Shows healthy-aging maintenance: higher function, strong wearable signals, and a more progressive workout prescription. |
| **Alex, 72** | Very active, advanced program. | Shows the upper range: the app can scale beyond gentle exercise and prescribe advanced robust training when function and recovery support it. |

Together, these scenarios let presenters move from high-risk frailty to advanced function without editing assessment fields live. They cover the intended range of app behavior: fall-risk precautions, pre-frail coaching, robust maintenance, and advanced progression.

### Four-Week Simulation

The **Simulate 4 weeks** control is a presenter tool for showing the app's longitudinal loop. It applies deterministic improvements to the selected scenario, including faster TUG time, more chair stands, better balance, higher gait speed, more steps and active minutes, lower sedentary time, improved sleep/recovery signals, and fewer missed sessions.

The simulation is not a clinical promise that every user will improve this way in four weeks. It is a product-story shortcut for demonstrating the intended loop:

1. Assess current function.
2. Generate an adaptive plan.
3. Track adherence and wearable signals.
4. Reassess over time.
5. Show progress in plain language.
6. Adjust the plan based on safety, function, and recovery.

## Run Locally

```bash
npm start
```

Then open the normal audience-facing app:

```text
http://localhost:5173/?v=65
```

This mode hides demo controls and starts as a realistic enrolled-user experience.

Profile numbers reset to the fixed seeded defaults on every fresh app startup. Changes made during a running demo, such as saved assessments, completed workouts, or simulated progress, are kept in memory while the app remains open so the current demo flow stays coherent. Refreshing or reopening the app starts again from the default seeded numbers.

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/pages.yml` that publishes the static app to GitHub Pages whenever `main` is pushed.

For this repo, the public URL should be:

```text
https://cst-labs.github.io/frailty-coach/
```

To enable it in GitHub:

1. Open the repository on GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or run the **Deploy GitHub Pages** workflow manually from the **Actions** tab.

The workflow runs `npm test`, prepares a small static artifact with only the app runtime files, and deploys that artifact to Pages.

## Presentation Modes

Frailty Coach has two presentation modes:

### Normal App Mode

Use this for the polished app walkthrough:

```text
http://localhost:5173/?v=65
```

Normal mode hides:

- Scenario/profile switching
- Four-week simulation controls
- Scenario reset controls

The app still uses deterministic seeded data for the MVP, but the UI does not expose prototype controls to the audience.

### Presenter Mode

Use this when you need live demo controls:

```text
http://localhost:5173/?demo=1&v=65
```

Presenter mode shows a **Presenter controls** panel in the sidebar with:

- **Scenario**: switch between Grace, Daniel, Mei, and Alex.
- **Simulate 4 weeks**: applies the four-week improvement scenario and jumps to Progress.
- **Reset scenario**: restores the selected scenario to its starting state.

You can also press:

```text
Shift + D
```

This toggles Presenter controls on or off without changing the URL. Use this during a live pitch if you want the normal app URL on screen but still need temporary control access.

### Suggested Demo Flow

1. Start at `http://localhost:5173/?v=65` for the audience-facing walkthrough.
2. Show Today, Assess, Workout, Progress, and Coach as the real app experience.
3. Press `Shift + D` or switch to `http://localhost:5173/?demo=1&v=65` when you need presenter tools.
4. Choose a scenario if needed.
5. Select **Simulate 4 weeks** to show improvement over time.
6. Use **Reset scenario** before rehearsing or starting the next demo.

## Test

```bash
npm test
```

## Documentation Maintenance

Keep this README and [CHANGELOG.md](/Users/tanchorseng/Desktop/Main%20Projects/Healthcare/Codex%20for%20Healthcare/CHANGELOG.md) updated whenever product behavior, screens, scoring logic, evidence positioning, or demo flow changes. At minimum, update the **Key Features**, **App Screens**, **Scientific Positioning**, and changelog sections when those areas change.

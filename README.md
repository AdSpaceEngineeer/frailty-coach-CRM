# Frailty Coach

Built with OpenAI Codex as a rapid prototype for the Codex for Healthcare: From Prototype to Production hackathon.

Frailty Coach is a mobile-first wellness app that helps older adults monitor physical resilience, understand frailty and fall-risk signals, and follow adaptive daily exercise plans that improve strength, balance, mobility, and confidence over time.

It is built for the [Codex for Healthcare: From Prototype to Production](https://luma.com/6s8sbqep) hackathon. The submission is specifically based on the **Physical Health and Frailty** build direction under the broader **Healthy Longevity** theme. It also connects to **Care for older adults**, **Longevity data and insights**, **Preventive care and early intervention**, and **Patient engagement**.

Frailty Coach is not a diagnostic or regulated medical-device implementation. It is a wellness-oriented coaching prototype with safety prompts, evidence-informed functional domains, and clinician/caregiver escalation cues.

## Hackathon Submission

| Field | Submission summary |
| --- | --- |
| **Event** | [Codex for Healthcare: From Prototype to Production](https://luma.com/6s8sbqep) |
| **Hackathon umbrella theme** | Healthy Longevity |
| **Submission theme / build direction** | Physical Health and Frailty |
| **Primary health domain** | Mobility, strength, balance, gait, activity, recovery, and fall-risk support for older adults |
| **Secondary domains** | Care for older adults; patient engagement; preventive care and early intervention; longevity data and insights |
| **Target users** | Older adults who want to stay steady and independent; caregivers, physiotherapists, and community health teams supporting them |
| **Prototype URL** | https://cst-labs.github.io/frailty-coach/ |
| **Presenter mode** | https://cst-labs.github.io/frailty-coach/?demo=1 |
| **Current status** | High-fidelity static web prototype with deterministic seeded scenarios, in-memory demo state, and GitHub Pages deployment |

## Problem

Frailty risk often becomes visible only after a fall, hospitalisation, or loss of independence. Many older adults know they should stay active, but they may not know what movements are safe, whether they are improving, or when to ask for support.

Clinical functional checks such as Timed Up and Go (TUG), chair stands, balance testing, and gait speed are useful, but they are not normally translated into a simple daily habit. Wearable and lifestyle signals can also be hard to interpret without a clear next action.

## Solution

Frailty Coach turns periodic functional check-ins into a daily movement loop:

1. **Assess periodically** using simple, guided checks for safety, fall risk, TUG, chair stands, balance, optional gait speed, and confidence.
2. **Generate a safe daily plan** based on the latest function score, fall-risk signals, recovery, and activity data.
3. **Guide the workout** with clear setup, action, rest, pause, and stop-if-unwell states.
4. **Track progress** using irregular assessment points over the last 3 months, not a rigid weekly-only chart.
5. **Explain what changed** in plain language for the older adult and, optionally, a caregiver.

The product goal is not to replace clinical judgement. It is to make healthy-ageing behaviours easier to understand, safer to perform, and more likely to become a daily habit.

## Physical Health and Frailty Alignment

| Hackathon direction | How Frailty Coach addresses it |
| --- | --- |
| **Physical Health and Frailty** | The core submission theme. Frailty Coach focuses directly on mobility, leg strength, balance, gait, activity, recovery, and fall-risk precautions. |
| **Preventive care and early intervention** | Screens for fall-risk signals and guides low-risk daily movement before decline becomes a crisis. |
| **Patient engagement** | Prioritises one clear daily action, plain-language score interpretation, encouragement after completion, and caregiver-friendly summaries. |
| **Longevity data and insights** | Combines functional checks, fall-risk answers, wearable-style activity, sleep, heart-rate recovery, and adherence into actionable coaching. |
| **Healthy ageing assistants** | Provides an app-like companion that explains what to do today, when to reassess, and how to adapt movement safely. |
| **Care for older adults** | Designs around safety, independence, support needs, caregiver visibility, and an elder-friendly interface. |

## One-Sentence Pitch

Frailty Coach helps older adults turn frailty and fall-risk monitoring into a simple daily loop: check function periodically, move safely every day, and understand progress without needing a clinician beside them for every step.

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

## What Is Implemented

- Fully navigable mobile-first app with Today, Assess, Workout, Progress, and Coach screens.
- Four fixed presenter scenarios spanning frail/fall-risk, pre-frail, robust, and advanced users.
- Flexible assessment timing: weekly is suggested, but users can save an assessment anytime.
- Dated assessment history for Progress, including irregular points over the last 3 months.
- Workout session flow with active exercise counters, set completion, rest timers, pause/resume, stop-if-unwell, and completion state.
- GitHub Pages deployment through GitHub Actions.

## Prototype Boundaries

- Uses deterministic seeded profiles and in-memory session state rather than user accounts or a backend database.
- Uses wearable-style mock data rather than a live wearable integration.
- Provides wellness coaching only; it does not diagnose frailty, prescribe medical rehabilitation, or replace clinical assessment.
- The Function Resilience Score is a product composite for coaching and visualisation, not a validated diagnostic frailty instrument.

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

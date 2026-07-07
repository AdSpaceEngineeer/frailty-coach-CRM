# Frailty Coach Demo Guide

Use this for a 3-5 minute live demo. The goal is to show Frailty Coach as a close-to-real daily wellness app, not as a technical prototype.

## Demo Link

Audience-facing app:

```text
https://cst-labs.github.io/frailty-coach/
```

Presenter mode, only if you need scenario controls:

```text
https://cst-labs.github.io/frailty-coach/?demo=1
```

You can also press `Shift + D` to reveal or hide presenter controls.

## Core Message

Frailty Coach helps older adults turn periodic functional checks into a safe daily exercise habit. The app keeps the daily experience simple, explains risk and progress in plain language, and adapts workouts based on function, fall-risk signals, and recovery.

## 3-5 Minute Demo Flow

### 0:00-0:30 - Opening

Show: **Today**

Say:

> Frailty Coach is a mobile-first wellness app for older adults who want to stay steady, strong, and independent. The daily habit is simple: open Today, understand the plan, and complete a safe guided workout. Assessments are done weekly or when mobility changes, not every day.

Point out:

- The plan is immediately visible.
- The main button is **Do today's workout**.
- Safety/support status is clear.
- The function score is present but not overwhelming.

Avoid:

- Starting with presenter controls.
- Explaining every score component upfront.

### 0:30-1:20 - Score and Daily Plan

Show: **Today**, Function Score card

Say:

> The Function Score is a coaching score, not a diagnosis. It summarizes movement reserve across mobility, standing strength, balance, daily activity, recovery, and fall-risk signals. The important design choice is that the app explains what to do next, rather than forcing the user to interpret raw numbers.

Click:

- Tap **More info** in the Function Score card.
- Briefly show the pop-up.
- Close it.

Point out:

- Detailed explanation is available but hidden by default.
- The user returns to the same screen after closing the pop-up.
- This keeps the app simple for daily use while preserving transparency.

### 1:20-2:05 - Guided Assessment

Show: **Assess**

Say:

> The assessment is guided step by step. It starts with safety, then fall-risk questions, then simple function checks like Timed Up and Go (TUG), chair stands, and balance. This is meant to be understandable without external instructions.

Click:

- Go to **Assess**.
- Show the stepper.
- Move to the **Walk** step if needed.

Point out:

- The app explains how to run the TUG check.
- The timer starts at zero.
- Large buttons support older users.
- Assessment is periodic, not daily.

Avoid:

- Completing the whole assessment live unless asked.
- Overstating clinical validation of the composite score.

### 2:05-3:05 - Daily Workout

Show: **Workout**

Say:

> The workout is the daily behavior change. Today only gives a high-level plan; the detailed instructions live inside the workout session. Each exercise has setup, safety, rep tracking, rest, pause, and stop options.

Click:

- Go to **Workout** or tap **Do today's workout** from Today.
- Show the workout overview.
- Start an exercise.
- Show **Show setup and safety**.
- Return to the counter.

Point out:

- Users can mark reps or complete a set.
- Rep buttons disable when complete.
- Users can pause and resume later.
- Users can stop if they feel unwell.
- Rest starts automatically between exercises and can be extended.

Optional if time allows:

- Complete the workout quickly using **Set complete** / **Reps complete**.
- Show that Today changes to **Workout done today**.

### 3:05-4:05 - Progress

Show: **Progress**

Say:

> Progress is framed in plain language first. Instead of showing a dense dashboard, the app starts with an interpretation: what changed, what it means, and what to do next.

Click:

- Go to **Progress**.
- Show the summary card.
- Open **View detailed trend** only if useful.

Point out:

- Current score is separated from score change.
- TUG, chair stands, balance, and steps are explained as changes.
- Detailed trend data is hidden until requested.

### 4:05-4:45 - Coach and Evidence

Show: **Coach**

Say:

> The Coach screen supports trust and shared decision-making. It has plain-language guidance for the older adult, a caregiver view, a hidden walkthrough, stop-exercise guidance, and evidence sources.

Click:

- Go to **Coach**.
- Toggle **For caregiver** if relevant.
- Open **How to use this app** or **Evidence & Sources** briefly.

Point out:

- Evidence is easy to find but not the first thing the user sees.
- Safety guidance is available without dominating the daily experience.

### 4:45-5:00 - Close

Say:

> The core loop is: assess periodically, do a safe daily workout, and review progress in plain language. The current version is demo-ready as a high-fidelity wellness prototype. It is not yet a production clinical product or diagnostic tool.

## Optional Presenter Segment: Four-Week Simulation

Use this only if you need to show longitudinal progress quickly.

Setup:

1. Open presenter mode: `?demo=1`, or press `Shift + D`.
2. Keep the default profile, or choose another scenario.
3. Click **Simulate 4 weeks**.

Say:

> This is a deterministic demo shortcut. It shows the intended longitudinal loop: safer daily movement, improved adherence, better functional checks, and clearer progress. It is not a promise that every user improves this way in four weeks.

Then show:

- **Progress** summary.
- Score change and functional changes.
- The next recommended action.

## Scenario Selection

Default recommendation: use **Grace, 84**.

Why:

- Shows fall-risk precautions.
- Demonstrates supported exercise.
- Makes the value proposition clear for frailty prevention.
- Produces a more compelling safety and daily-plan story.

Other scenarios:

- **Daniel, 76**: use for pre-frail prevention.
- **Mei, 69**: use for healthy-aging maintenance.
- **Alex, 72**: use to show the app can scale to advanced users.

## Short Version: 3 Minutes

Use this if time is tight:

1. **Today**: daily plan, support status, simple score.
2. **Assess**: step-by-step safety and TUG check.
3. **Workout**: guided exercise with setup, reps, rest, pause, stop.
4. **Progress**: plain-language interpretation.
5. **Coach**: caregiver/evidence/safety support.

Skip:

- Full assessment completion.
- Full workout completion.
- Scenario switching.
- Deep score breakdown.

## What To Emphasize

- Daily use is simple.
- Assessment is periodic.
- Exercise is the main habit.
- Safety is integrated but not intrusive.
- Details are available on demand.
- Progress is interpretive and actionable.
- The app is a wellness coaching prototype, not a diagnosis.

## What Not To Say

Avoid saying:

- "This diagnoses frailty."
- "This clinically validates improvement."
- "This replaces a physiotherapist or doctor."
- "Four weeks guarantees improvement."
- "The score is a validated medical score."

Say instead:

- "This is a wellness coaching score based on evidence-informed domains."
- "The app supports safer self-monitoring and daily movement."
- "Users should stop if unwell and seek professional advice for concerning symptoms."

## Backup Plan

If the live site is slow or the workflow is updating:

1. Use local app: `http://localhost:5173/?v=62`.
2. Start at **Today**.
3. Avoid presenter mode unless needed.
4. Use the saved mockups in `design/mockups/frailty-coach-v2/` as visual backup.

## Final One-Liner

Frailty Coach turns frailty and fall-risk monitoring into a simple daily loop: check function periodically, move safely every day, and understand progress without needing a clinician beside you for every step.

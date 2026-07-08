# Frailty Coach - Kampong

Frailty Coach - Kampong is a hackathon-grade CRM and operations dashboard for care teams using the Frailty Coach elder-facing app. It turns frailty, fall-risk, adherence, and reassessment signals into a practical kampong workflow: who needs attention, who should contact them, and which care teams are carrying the most risk.

The word **kampong** means village. Here it represents any care network: a clinic group, hospital group, community provider, or group of doctors coordinating support for older adults.

## Live Prototype

- CRM dashboard: https://adspaceengineeer.github.io/frailty-coach-CRM/crm.html
- Demo 1: https://adspaceengineeer.github.io/frailty-coach-CRM/crm.html#journey-kampong-lead
- Demo 2: https://adspaceengineeer.github.io/frailty-coach-CRM/crm.html#journey-outreach

## What It Does

- Shows population-level frailty trends for enrolled residents.
- Flags residents needing follow-up due to fall risk, low function score, missed sessions, or reassessment timing.
- Gives a practical outreach queue with recommended actions.
- Shows provider/care-team caseload and risk burden.
- Tracks interventions such as caregiver calls, reassessments, and progression reviews.
- Exports a simple CSV for handoff or judging demos.

## Demo User Journeys

### Journey 1: Kampong Lead Risk Review

Use this when showing how a care-network lead reviews the whole population.

Start link:

```text
https://adspaceengineeer.github.io/frailty-coach-CRM/crm.html#journey-kampong-lead
```

Script:

1. Land on **Population** and point out the four top metrics.
2. Show the follow-up-filtered resident registry.
3. Let the demo auto-jump to **Providers**.
4. Explain which care teams have the highest follow-up load.

Expected takeaway: the kampong can see risk concentration and provider load in seconds.

### Journey 2: Care Coordinator Outreach

Use this when showing how a coordinator turns risk signals into action.

Start link:

```text
https://adspaceengineeer.github.io/frailty-coach-CRM/crm.html#journey-outreach
```

Script:

1. Land on **Outreach**.
2. Review residents needing contact today.
3. Click **Log action** on a resident.
4. Open **Interventions** to show the action-tracking concept.

Expected takeaway: the CRM is not just analytics; it supports daily operations.

## Screens

- **Population**: metrics, trend chart, priority queue, resident registry, filters.
- **Outreach**: recommended calls, nudges, caregiver checks, and reassessment prompts.
- **Providers**: care-team caseload, average score, and follow-up load.
- **Interventions**: simple action tracking for demo handoff.

## Prototype Boundaries

- Uses deterministic seeded demo residents from the Frailty Coach prototype.
- No real patient data is stored.
- No backend database or authentication is included yet.
- Clinical values are for product storytelling and workflow demonstration.

## Local Review

If running locally:

```bash
npm start
```

Then open:

```text
http://localhost:5173/crm.html
```

## Deployment

GitHub Pages deploys from `main` using `.github/workflows/pages.yml`.

Public URL:

```text
https://adspaceengineeer.github.io/frailty-coach-CRM/crm.html
```

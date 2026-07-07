import { workoutLibrary } from "./data.js";

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const interpolate = (value, low, high, lowScore, highScore) => {
  if (value <= low) return lowScore;
  if (value >= high) return highScore;
  const ratio = (value - low) / (high - low);
  return lowScore + ratio * (highScore - lowScore);
};

export const countTrue = (obj = {}) => Object.values(obj).filter(Boolean).length;

export function scoreMobility(assessment) {
  const tug = Number(assessment.tugSeconds);
  const gait = Number(assessment.gaitSpeed || 0);
  let tugScore;

  if (tug <= 8) tugScore = 100;
  else if (tug <= 10) tugScore = interpolate(tug, 8, 10, 100, 88);
  else if (tug <= 13.5) tugScore = interpolate(tug, 10, 13.5, 88, 68);
  else if (tug <= 20) tugScore = interpolate(tug, 13.5, 20, 68, 40);
  else tugScore = interpolate(Math.min(tug, 35), 20, 35, 40, 15);

  if (!gait) return Math.round(tugScore);

  const gaitScore = clamp(interpolate(gait, 0.45, 1.35, 25, 100));
  return Math.round(tugScore * 0.72 + gaitScore * 0.28);
}

export function scoreStrength(assessment) {
  const stands = Number(assessment.chairStands);
  if (stands >= 18) return 100;
  if (stands >= 14) return Math.round(interpolate(stands, 14, 18, 82, 100));
  if (stands >= 10) return Math.round(interpolate(stands, 10, 14, 63, 82));
  if (stands >= 5) return Math.round(interpolate(stands, 5, 10, 38, 63));
  return Math.round(interpolate(Math.max(stands, 0), 0, 5, 12, 38));
}

export function scoreBalance(assessment) {
  const stage = Number(assessment.balanceStage);
  const seconds = Number(assessment.balanceSeconds);
  const stageBase = [0, 25, 45, 70, 88][stage] || 20;
  const holdBonus = clamp(seconds / 30, 0, 1) * 18;
  return Math.round(clamp(stageBase + holdBonus));
}

export function scoreActivity(wearable) {
  const steps = Number(wearable.steps);
  const active = Number(wearable.activeMinutes);
  const sedentary = Number(wearable.sedentaryHours);
  const stepScore = clamp(interpolate(steps, 1500, 9000, 20, 100));
  const activeScore = clamp(interpolate(active, 10, 60, 25, 100));
  const sedentaryScore = clamp(interpolate(12 - sedentary, 0, 7, 25, 100));
  return Math.round(stepScore * 0.45 + activeScore * 0.4 + sedentaryScore * 0.15);
}

export function scoreRecovery(wearable) {
  const sleep = Number(wearable.sleepHours);
  const regularity = Number(wearable.sleepRegularity);
  const rhr = Number(wearable.restingHeartRate);
  const recovery = Number(wearable.heartRecovery);
  const sleepScore = clamp(interpolate(sleep, 5, 7.5, 35, 100));
  const regularityScore = clamp(regularity);
  const rhrScore = clamp(interpolate(90 - rhr, 0, 35, 25, 100));
  const hrRecoveryScore = clamp(interpolate(recovery, 8, 28, 35, 100));
  return Math.round(sleepScore * 0.35 + regularityScore * 0.25 + rhrScore * 0.2 + hrRecoveryScore * 0.2);
}

export function getSafetyStatus(safety = {}, fallRisk = {}) {
  const blocking = ["chestPain", "newWeakness", "sharpPain"].filter((key) => safety[key]);
  const supervision = ["unsafeSetup", "needsAid"].filter((key) => safety[key]);
  const fallCount = countTrue(fallRisk);
  const fallRiskHigh = fallRisk.fellYear || fallCount >= 2;

  return {
    blocking,
    supervision,
    fallCount,
    fallRiskHigh,
    shouldBlockExercise: blocking.length > 0,
    shouldSupervise: supervision.length > 0 || fallRiskHigh
  };
}

export function getAbilityBand(score, status, assessment) {
  if (status.shouldBlockExercise) return "seated";
  if (Number(assessment.chairStands) <= 2 || Number(assessment.tugSeconds) >= 30) return "seated";
  if (status.fallRiskHigh && score < 58) return "frailFallRisk";
  if (score < 42) return "frail";
  if (score < 64) return "prefrail";
  if (score < 84) return "robust";
  return "advanced";
}

export function computeFunctionScore(state) {
  const mobility = scoreMobility(state.assessment);
  const strength = scoreStrength(state.assessment);
  const balance = scoreBalance(state.assessment);
  const activity = scoreActivity(state.wearable);
  const recovery = scoreRecovery(state.wearable);
  const status = getSafetyStatus(state.safety, state.fallRisk);

  let total = mobility * 0.25 + strength * 0.22 + balance * 0.22 + activity * 0.18 + recovery * 0.13;
  total -= status.fallRiskHigh ? 6 : 0;
  total -= status.supervision.length ? 3 : 0;
  total -= state.assessment.confidence === "low" ? 4 : state.assessment.confidence === "medium" ? 1 : 0;
  total = Math.round(clamp(total));

  const band = getAbilityBand(total, status, state.assessment);
  const alerts = buildAlerts(state, status);

  return {
    total,
    band,
    bandLabel: workoutLibrary[band].label,
    subScores: { mobility, strength, balance, activity, recovery },
    status,
    alerts,
    explanation: buildScoreExplanation(total, band, { mobility, strength, balance, activity, recovery }, status)
  };
}

export function getWorkoutPlan(scoreResult, state) {
  const base = workoutLibrary[scoreResult.band];
  const deload = shouldDeload(state, scoreResult);
  const progression = deload
    ? "Deload today: reduce one set from standing work and keep all effort easy."
    : "Progress only one variable this week: reps, sets, hold time, walking duration, or reduced support.";

  return {
    ...base,
    deload,
    progression,
    exercises: base.exercises.map(([name, dose, coaching]) => ({
      name,
      dose: deload ? makeDeloadDose(dose) : dose,
      coaching
    }))
  };
}

export function applyFourWeekProgress(state) {
  const next = structuredClone(state);
  next.assessment.tugSeconds = round1(Math.max(5.8, next.assessment.tugSeconds * 0.88));
  next.assessment.chairStands = Math.min(28, next.assessment.chairStands + 3);
  next.assessment.balanceStage = Math.min(4, next.assessment.balanceStage + (next.assessment.balanceSeconds >= 18 ? 1 : 0));
  next.assessment.balanceSeconds = Math.min(30, next.assessment.balanceSeconds + 8);
  next.assessment.gaitSpeed = round2(Math.min(1.7, Number(next.assessment.gaitSpeed || 0.5) + 0.12));
  next.wearable.steps = Math.round(next.wearable.steps * 1.28);
  next.wearable.activeMinutes = Math.min(90, next.wearable.activeMinutes + 14);
  next.wearable.sedentaryHours = round1(Math.max(4.5, next.wearable.sedentaryHours - 1.1));
  next.wearable.sleepHours = round1(Math.min(8, next.wearable.sleepHours + 0.5));
  next.wearable.sleepRegularity = Math.min(95, next.wearable.sleepRegularity + 8);
  next.wearable.heartRecovery = Math.min(40, next.wearable.heartRecovery + 4);
  next.adherence.completedThisWeek = Math.min(6, next.adherence.completedThisWeek + 2);
  next.adherence.missedSessions = 0;
  next.fallRisk.worriesFall = false;
  return next;
}

export function completeWorkout(state) {
  const today = localDateKey();
  const next = structuredClone(state);
  if (next.adherence.lastWorkoutDate === today) return next;
  next.adherence.completedThisWeek = Math.min(7, next.adherence.completedThisWeek + 1);
  next.adherence.missedSessions = Math.max(0, next.adherence.missedSessions - 1);
  next.adherence.lastWorkoutDate = today;
  next.wearable.activeMinutes = Math.min(90, next.wearable.activeMinutes + 8);
  next.wearable.steps = Math.round(next.wearable.steps + 450);
  return next;
}

export function isWorkoutCompleteToday(state, now = new Date()) {
  return state?.adherence?.lastWorkoutDate === localDateKey(now);
}

function localDateKey(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function makeHistoryWithCurrent(state, scoreResult) {
  const history = state.history.map((entry) => ({ ...entry }));
  const last = history[history.length - 1];
  last.score = scoreResult.total;
  last.tugSeconds = state.assessment.tugSeconds;
  last.chairStands = state.assessment.chairStands;
  last.balanceStage = state.assessment.balanceStage;
  return history;
}

export function buildCoachCopy(state, scoreResult, plan) {
  const lowest = Object.entries(scoreResult.subScores).sort((a, b) => a[1] - b[1])[0][0];
  const safety = scoreResult.status.shouldSupervise
    ? "Use support and consider having someone nearby during standing exercises."
    : "Your current plan can be done independently if the space is clear and you feel well.";

  const elder = `Your current score is ${scoreResult.total}. The main area to work on is ${labelDomain(lowest)}. Today is a ${plan.label.replace(" - ", ": ")} session. ${safety} Keep the effort comfortable and stop if symptoms appear.`;

  const caregiver = `Current band: ${scoreResult.bandLabel}. Recent TUG ${state.assessment.tugSeconds}s, chair stands ${state.assessment.chairStands}, balance stage ${state.assessment.balanceStage}. ${scoreResult.alerts.length ? `Attention: ${scoreResult.alerts.map((alert) => alert.title).join(", ")}.` : "No blocking safety flags are active."} Recommended support: ${plan.support}`;

  return { elder, caregiver };
}

function buildAlerts(state, status) {
  const alerts = [];
  if (status.blocking.length) {
    alerts.push({
      tone: "danger",
      title: "Pause exercise",
      body: "A red-flag symptom is selected. Skip workout guidance and contact a clinician or emergency service if symptoms are acute."
    });
  }
  if (status.shouldSupervise && !status.blocking.length) {
    alerts.push({
      tone: "warning",
      title: "Use supervision or support",
      body: "Fall-risk or support needs are present. Keep a stable chair or counter within reach."
    });
  }
  if (state.wearable.sleepHours < 6 || state.wearable.restingHeartRate >= 82) {
    alerts.push({
      tone: "warning",
      title: "Recovery is low",
      body: "Keep today easy because sleep or resting heart rate suggests reduced recovery."
    });
  }
  if (state.adherence.missedSessions >= 2) {
    alerts.push({
      tone: "info",
      title: "Restart gently",
      body: "Two or more sessions were missed. Resume with the current level instead of progressing."
    });
  }
  return alerts;
}

function buildScoreExplanation(total, band, subScores, status) {
  const weakest = Object.entries(subScores).sort((a, b) => a[1] - b[1])[0];
  const phrase = {
    seated: "Begin with seated or heavily supported movement.",
    frail: "Build strength and walking tolerance with supported work.",
    frailFallRisk: "Prioritize fall-risk precautions and supported balance.",
    prefrail: "Progress strength and balance while keeping support nearby.",
    robust: "Maintain momentum with harder strength and gait intervals.",
    advanced: "Use advanced training while monitoring recovery."
  }[band];
  const safety = status.shouldSupervise ? " Supervision or stable support is recommended." : "";
  return `${phrase} ${labelDomain(weakest[0])} is the lowest sub-score at ${weakest[1]}/100.${safety}`;
}

function shouldDeload(state, scoreResult) {
  return (
    scoreResult.status.shouldBlockExercise ||
    state.wearable.sleepHours < 6 ||
    state.wearable.restingHeartRate >= 82 ||
    state.adherence.missedSessions >= 2
  );
}

function makeDeloadDose(dose) {
  return dose
    .replace("3 sets", "2 sets")
    .replace("4 rounds", "3 rounds")
    .replace("8 rounds", "5 rounds")
    .replace("6 rounds", "4 rounds")
    .replace("5 rounds", "3 rounds");
}

function labelDomain(key) {
  return {
    mobility: "mobility",
    strength: "lower-body strength",
    balance: "balance",
    activity: "activity consistency",
    recovery: "recovery"
  }[key] || key;
}

const round1 = (value) => Math.round(value * 10) / 10;
const round2 = (value) => Math.round(value * 100) / 100;

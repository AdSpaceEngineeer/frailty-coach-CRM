import assert from "node:assert/strict";
import {
  applyFourWeekProgress,
  completeWorkout,
  computeFunctionScore,
  getWorkoutPlan,
  recordAssessment
} from "../src/logic.js";
import { personas } from "../src/data.js";

const clone = (value) => structuredClone(value);

function testPersonaOrdering() {
  const grace = computeFunctionScore(clone(personas.grace));
  const daniel = computeFunctionScore(clone(personas.daniel));
  const mei = computeFunctionScore(clone(personas.mei));
  const alex = computeFunctionScore(clone(personas.alex));

  assert.ok(grace.total < daniel.total, "frail persona should score below pre-frail persona");
  assert.ok(daniel.total < mei.total, "pre-frail persona should score below robust persona");
  assert.ok(mei.total < alex.total, "robust persona should score below advanced persona");
  assert.equal(grace.band, "frailFallRisk");
  assert.equal(alex.band, "advanced");
}

function testBlockingSafetyRoutesToSeatedPlan() {
  const state = clone(personas.mei);
  state.safety.chestPain = true;
  const score = computeFunctionScore(state);
  const plan = getWorkoutPlan(score, state);

  assert.equal(score.band, "seated");
  assert.equal(score.status.shouldBlockExercise, true);
  assert.equal(plan.deload, true);
}

function testProgressImprovesScore() {
  const state = clone(personas.daniel);
  const before = computeFunctionScore(state);
  const afterState = applyFourWeekProgress(state);
  const after = computeFunctionScore(afterState);

  assert.ok(after.total > before.total, "progress demo should improve score");
  assert.ok(afterState.assessment.tugSeconds < state.assessment.tugSeconds, "TUG should improve");
  assert.ok(afterState.assessment.chairStands > state.assessment.chairStands, "chair stands should improve");
}

function testWorkoutCompletionUpdatesActivity() {
  const state = clone(personas.grace);
  const afterState = completeWorkout(state);

  assert.equal(afterState.adherence.completedThisWeek, state.adherence.completedThisWeek + 1);
  assert.ok(afterState.wearable.steps > state.wearable.steps);
  assert.ok(afterState.wearable.activeMinutes > state.wearable.activeMinutes);

  const repeatedState = completeWorkout(afterState);
  assert.equal(repeatedState.adherence.completedThisWeek, afterState.adherence.completedThisWeek);
  assert.equal(repeatedState.wearable.steps, afterState.wearable.steps);
}

function testAssessmentRecordingUpdatesSameDay() {
  const state = clone(personas.grace);
  const score = computeFunctionScore(state);
  const firstSave = recordAssessment(state, score, new Date(2026, 6, 8));
  const secondSave = recordAssessment(firstSave, score, new Date(2026, 6, 8));
  const todayEntries = secondSave.history.filter((entry) => entry.date === "2026-07-08");

  assert.equal(todayEntries.length, 1);
  assert.equal(todayEntries[0].score, score.total);
}

testPersonaOrdering();
testBlockingSafetyRoutesToSeatedPlan();
testProgressImprovesScore();
testWorkoutCompletionUpdatesActivity();
testAssessmentRecordingUpdatesSameDay();

console.log("logic tests passed");

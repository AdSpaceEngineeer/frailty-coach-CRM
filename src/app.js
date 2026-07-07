import {
  applyFourWeekProgress,
  buildCoachCopy,
  completeWorkout,
  computeFunctionScore,
  getWorkoutPlan,
  isWorkoutCompleteToday,
  makeHistoryWithCurrent
} from "./logic.js?v=62";
import { fallQuestions, personas, safetyQuestions } from "./data.js?v=62";

const AVATAR_STORAGE_KEY = "frailty-coach-avatar-preference-v1";
const ASSET_SETS = {
  female: {
    coach: "./assets/illustrations/coach-avatar-female-east-asian.png",
    progress: "./assets/illustrations/progress-success.png",
    stand: "./assets/illustrations/supported-sit-to-stand.png",
    balance: "./assets/illustrations/weight-shifts.png",
    upper: "./assets/illustrations/wall-pushups.png",
    walk: "./assets/illustrations/hallway-walk.png"
  },
  male: {
    coach: "./assets/illustrations/coach-avatar-male-east-asian.png",
    progress: "./assets/illustrations/male-progress-success.png",
    stand: "./assets/illustrations/male-supported-sit-to-stand.png",
    balance: "./assets/illustrations/male-weight-shifts.png",
    upper: "./assets/illustrations/male-wall-pushups.png",
    walk: "./assets/illustrations/male-hallway-walk.png"
  }
};
const ASSESSMENT_STEPS = [
  { id: "safety", label: "Safety", icon: "shield" },
  { id: "fall", label: "Fall risk", icon: "list" },
  { id: "walk", label: "Walk", icon: "walk" },
  { id: "strength", label: "Strength", icon: "chair" },
  { id: "save", label: "Save", icon: "check" }
];
const urlParams = new URLSearchParams(window.location.search);
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const DEFAULT_REST_SECONDS = 60;
const REST_INCREMENT_SECONDS = 60;

let presenterMode = urlParams.get("demo") === "1";
let appState = loadState();
let avatarPreference = loadAvatarPreference();
let activeTimer = null;
let timerStart = 0;
let restTimer = null;
let assessmentStepIndex = 0;
let workoutState = initialWorkoutState();
let modalReturnTarget = null;

init();

function init() {
  renderPersonaOptions();
  setPresenterMode(presenterMode, { announce: false });
  renderQuestionLists();
  bindEvents();
  render();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

function bindEvents() {
  $("#personaSelect").addEventListener("change", (event) => {
    appState = clonePersona(event.target.value);
    saveState();
    resetFlowState();
    render();
    toast(`Loaded ${appState.name}`);
  });

  $$(".tab").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  $("#startCheckBtn").addEventListener("click", handleTodayPrimaryAction);
  $("#todayWorkoutBtn").addEventListener("click", handleTodayPrimaryAction);
  $("#screenBackBtn").addEventListener("click", () => showView("today"));
  $("#evidenceLinkBtn").addEventListener("click", () => showEvidenceSources());
  $("#assessmentBackBtn").addEventListener("click", () => moveAssessmentStep(-1));
  $("#assessmentNextBtn").addEventListener("click", () => moveAssessmentStep(1));
  $("#reviewAnswersBtn").addEventListener("click", () => {
    assessmentStepIndex = 0;
    renderAssessmentStep();
    resetScrollPosition();
  });

  $$(".summary-toggle").forEach((button) => {
    button.addEventListener("click", () => showSummary(button.dataset.summary));
  });
  $$(".avatar-toggle").forEach((button) => {
    button.addEventListener("click", () => setAvatarPreference(button.dataset.avatar));
  });

  $("#saveAssessmentBtn").addEventListener("click", () => {
    readAssessmentForm();
    saveState();
    render();
    toast("Assessment saved and plan updated");
    showView("today");
  });

  $("#demoProgressBtn").addEventListener("click", () => {
    appState = applyFourWeekProgress(appState);
    saveState();
    render();
    toast("Four-week progress simulated");
    showView("progress");
  });

  $("#completeWorkoutBtn").addEventListener("click", markWorkoutDone);
  $("#scoreInfoCloseBtn").addEventListener("click", closeScoreInfoModal);
  $("#scoreInfoModal").addEventListener("click", (event) => {
    if (event.target.id === "scoreInfoModal") closeScoreInfoModal();
  });

  $("#resetPersonaBtn").addEventListener("click", () => {
    appState = clonePersona(appState.id);
    saveState();
    resetFlowState();
    render();
    toast("Scenario reset");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#scoreInfoModal").hidden) {
      event.preventDefault();
      closeScoreInfoModal();
      return;
    }
    if (!event.shiftKey || event.key.toLowerCase() !== "d") return;
    if (event.target?.matches?.("input, select, textarea")) return;
    event.preventDefault();
    setPresenterMode(!presenterMode);
  });

  $("#startTimerBtn").addEventListener("click", () => {
    timerStart = performance.now();
    clearInterval(activeTimer);
    activeTimer = setInterval(updateTimerReadout, 100);
    $("#timerReadout").textContent = "00.0s";
  });

  $("#stopTimerBtn").addEventListener("click", () => {
    if (!timerStart) return;
    clearInterval(activeTimer);
    const seconds = Math.round(((performance.now() - timerStart) / 1000) * 10) / 10;
    $("#tugInput").value = seconds;
    $("#timerReadout").textContent = `${seconds.toFixed(1)}s`;
    timerStart = 0;
  });

  $("#addRepBtn").addEventListener("click", () => {
    const input = $("#chairInput");
    input.value = Number(input.value || 0) + 1;
    renderAssessmentSummary();
  });

  $("#chairTimerBtn").addEventListener("click", () => toast("Count full stands for 30 seconds, then add reps"));
  $("[data-balance-hold='decrease']").addEventListener("click", () => adjustBalanceHold(-1));
  $("[data-balance-hold='increase']").addEventListener("click", () => adjustBalanceHold(1));
  $$("[data-balance-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#balanceStageInput").value = button.dataset.balanceStage;
      renderBalanceControls();
      renderAssessmentSummary();
    });
  });

  $$("[data-confidence]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#confidenceInput").value = button.dataset.confidence;
      renderConfidenceToggle();
      renderAssessmentSummary();
    });
  });

  $("#copySummaryBtn").addEventListener("click", async () => {
    const summary = `${$("#elderSummary").textContent}\n\n${$("#caregiverSummary").textContent}`;
    try {
      await navigator.clipboard.writeText(summary);
      toast("Summary copied");
    } catch {
      toast("Summary ready to copy");
    }
  });
}

function render() {
  const score = computeFunctionScore(appState);
  const plan = getWorkoutPlan(score, appState);
  const history = makeHistoryWithCurrent(appState, score);
  const coach = buildCoachCopy(appState, score, plan);

  $("#personaSelect").value = appState.id;
  $(".app-shell")?.setAttribute("data-presenter-mode", presenterMode ? "true" : "false");
  $(".app-shell")?.setAttribute("data-avatar", avatarPreference);
  updateScreenHeader();
  renderAvatarPreference();
  renderHero(score, plan);
  renderToday(score, plan);
  renderScore(score);
  renderAssessmentForm();
  renderAssessmentStepper();
  renderAssessmentStep();
  renderAlerts(score.alerts);
  renderWearable(score);
  renderWorkout(plan);
  renderProgress(history);
  renderProgressInsight(history, score, plan);
  renderCoach(coach);
}

function renderHero(score, plan) {
  const firstName = appState.name.split(",")[0];
  const weakest = weakestDomain(score);
  const workoutDone = isWorkoutCompleteToday(appState);
  const workoutPaused = isWorkoutPaused();
  const supervised = score.status.shouldSupervise ? "Keep a chair or counter nearby." : "Move at a steady, comfortable pace.";
  $("#headerGreeting").textContent = `Good morning, ${firstName}`;
  $("#greetingEyebrow").textContent = `Good morning, ${firstName}`;
  $("#heroTitle").textContent = workoutDone ? "Workout done today." : workoutPaused ? "Workout paused." : getDailyPlanTitle(score.band);
  $("#heroMessage").textContent = workoutDone
    ? "Nice work. You built strength and balance today."
    : workoutPaused
      ? "Your place is saved. Resume when you feel ready."
      : `${planShortName(score.band)}. ${supervised}`;
  $("#heroIllustration").src = currentAssets().coach;
  $("#scoreReason").textContent = `${labelDomainTitle(weakest[0])} needs the most attention today.`;
  $("#startCheckBtn").textContent = workoutDone ? "View progress" : workoutPaused ? "Resume workout" : "Do today's workout";
}

function renderToday(score, plan) {
  const weakest = weakestDomain(score);
  const workoutDone = isWorkoutCompleteToday(appState);
  const workoutPaused = isWorkoutPaused();
  $("#todayPlanTitle").textContent = planShortName(score.band);
  $("#todayPlanMeta").textContent = `${workoutDuration(plan)} · ${score.status.shouldSupervise ? "Support nearby" : "Move independently"}`;
  $("#todayPlanImage").src = exerciseImageFor(plan.exercises[0]?.name || "");
  $("#todaySafetyStatus").innerHTML = `
    <strong>${score.status.shouldSupervise ? "Ready with support nearby" : "Ready for today's plan"}</strong>
    <span>${score.status.shouldSupervise ? "Use a stable chair, counter, or caregiver support." : "Keep the space clear and effort comfortable."}</span>
  `;
  $("#scoreExplanation").textContent = score.status.shouldSupervise
    ? `Use support today. ${labelDomainTitle(weakest[0])} is the focus.`
    : `On track today. ${labelDomainTitle(weakest[0])} is the focus.`;
  $("#todayWorkoutStatus").className = `daily-workout-status ${workoutDone ? "is-complete" : workoutPaused ? "is-paused" : "is-due"}`;
  $("#todayWorkoutStatus").innerHTML = workoutDone
    ? `
      <span class="status-badge-icon" aria-hidden="true"></span>
      <div><strong>Workout done today</strong><span>Great job showing up. Keep movement gentle for the rest of the day.</span></div>
    `
    : workoutPaused
      ? `
        <span class="status-badge-icon" aria-hidden="true"></span>
        <div><strong>Workout paused</strong><span>Your place is saved. Continue only when you feel well and steady.</span></div>
      `
    : `
      <span class="status-badge-icon" aria-hidden="true"></span>
      <div><strong>Workout reminder</strong><span>Do this short plan today to keep building strength and balance.</span></div>
    `;
  $("#todayWorkoutBtn").textContent = workoutDone ? "View progress" : workoutPaused ? "Resume workout" : "Do today's workout";
  $("#completeWorkoutBtn").textContent = workoutDone ? "Done today" : "Mark done";
  $("#completeWorkoutBtn").disabled = workoutDone;
  $("#todayFocus").innerHTML = `
    <div><strong>Next check</strong><span>Update assessment weekly, or sooner if mobility changes.</span></div>
  `;
}

function renderScore(score) {
  const interpretation = scoreInterpretation(score);
  $("#scoreValue").textContent = score.total;
  $("#scoreBand").textContent = score.bandLabel;
  $("#scoreFill").style.width = `${score.total}%`;
  $("#ringValue").textContent = score.total;
  $("#scoreRing").setAttribute("aria-label", `Function score ${score.total}. ${score.bandLabel}.`);
  $("#scoreRing").style.setProperty("--score", `${score.total * 3.6}deg`);
  $("#statTug").textContent = `${appState.assessment.tugSeconds}s`;
  $("#statChair").textContent = appState.assessment.chairStands;
  $("#statBalance").textContent = appState.assessment.balanceStage;
  $("#scoreInterpretation").innerHTML = `
    <strong>${interpretation.title}</strong>
    <button id="scoreMoreInfoBtn" class="secondary-action compact-more-info" type="button">More info</button>
  `;
  $("#scoreMoreInfoBtn").addEventListener("click", () => openScoreInfoModal(interpretation));
  $("#scoreBreakdown").innerHTML = scoreBreakdownRows(score)
    .map(
      ({ label, value, help }) => `
        <div class="score-breakdown-row">
          <div>
            <strong>${label}</strong>
            <span>${help}</span>
          </div>
          <div class="breakdown-meter" aria-hidden="true"><span style="width:${value}%"></span></div>
          <b>${value}</b>
        </div>
      `
    )
    .join("");
}

function renderWearable(score) {
  $("#stepsMetric").textContent = appState.wearable.steps.toLocaleString();
  $("#activeMetric").textContent = appState.wearable.activeMinutes;
  $("#sleepMetric").textContent = `${appState.wearable.sleepHours}h`;
  $("#rhrMetric").textContent = appState.wearable.restingHeartRate;
  $("#wearableInsight").textContent =
    score.subScores.activity < 55
      ? "Activity is low, so the plan favors short walking intervals and supported strength."
      : score.subScores.recovery < 60
        ? "Recovery is the limiting signal today, so progression should stay conservative."
        : "Wearable trend supports the current progression level.";
}

function renderAlerts(alerts) {
  $("#alerts").innerHTML = alerts.length
    ? alerts
        .map(
          (alert) => `
            <div class="alert ${alert.tone}">
              <strong>${alert.title}</strong>
              <span>${alert.body}</span>
            </div>
          `
        )
        .join("")
    : "";
}

function renderAssessmentStepper() {
  $("#assessmentSteps").innerHTML = ASSESSMENT_STEPS.map(
    (step, index) => `
      <button class="step-dot ${index === assessmentStepIndex ? "is-active" : ""}" type="button" data-assessment-step="${index}">
        <span class="step-icon step-icon-${step.icon}" aria-hidden="true">${stepIconSvg(step.icon)}</span>
        <strong>${step.label}</strong>
      </button>
    `
  ).join("");
  $$("#assessmentSteps [data-assessment-step]").forEach((button) => {
    button.addEventListener("click", () => {
      assessmentStepIndex = Number(button.dataset.assessmentStep);
      renderAssessmentStep();
    });
  });
}

function stepIconSvg(icon) {
  const icons = {
    shield: `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M12 3.5 18.5 6v5.1c0 4.2-2.5 7.9-6.5 9.4-4-1.5-6.5-5.2-6.5-9.4V6L12 3.5Z" />
      </svg>
    `,
    list: `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M8.6 7h10.1" />
        <path d="M8.6 12h10.1" />
        <path d="M8.6 17h10.1" />
        <path d="M5.2 7h.1" />
        <path d="M5.2 12h.1" />
        <path d="M5.2 17h.1" />
      </svg>
    `,
    walk: `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M12.3 5.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z" />
        <path d="m10.5 8.1 2.4 1.6 2.6.7" />
        <path d="m12.8 9.8-1 4.2 3.3 5.2" />
        <path d="m11.8 14-3 5.2" />
        <path d="m10.5 8.1-2.1 2.7" />
      </svg>
    `,
    chair: `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M7.3 4.5h8.8v7.1H8.7a1.4 1.4 0 0 1-1.4-1.4V4.5Z" />
        <path d="M7.3 11.6h9.8a1.8 1.8 0 0 1 1.8 1.8v1.8H7.3v-3.6Z" />
        <path d="M8.2 15.2v5" />
        <path d="M17.4 15.2v5" />
      </svg>
    `,
    check: `
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="m5.2 12.6 4.2 4.2 9.4-9.6" />
      </svg>
    `
  };
  return icons[icon] || icons.check;
}

function renderAssessmentStep() {
  const activeStep = ASSESSMENT_STEPS[assessmentStepIndex].id;
  $(".app-shell")?.setAttribute("data-assessment-panel", activeStep);
  $$(".assessment-step-panel").forEach((panel) => {
    panel.classList.toggle("is-visible", panel.dataset.assessmentPanel === activeStep);
  });
  $$(".step-dot").forEach((button, index) => {
    button.classList.toggle("is-active", index === assessmentStepIndex);
  });
  $("#assessmentBackBtn").disabled = assessmentStepIndex === 0;
  $("#assessmentNextBtn").textContent = assessmentStepIndex === ASSESSMENT_STEPS.length - 1 ? "Review" : `Next: ${ASSESSMENT_STEPS[Math.min(assessmentStepIndex + 1, ASSESSMENT_STEPS.length - 1)].label}`;
  renderAssessmentSummary();
}

function moveAssessmentStep(delta) {
  assessmentStepIndex = Math.max(0, Math.min(ASSESSMENT_STEPS.length - 1, assessmentStepIndex + delta));
  renderAssessmentStep();
  resetScrollPosition();
}

function renderQuestionLists() {
  $("#safetyChecks").innerHTML = safetyQuestions.map(renderCheck("safety")).join("");
  $("#fallChecks").innerHTML = fallQuestions.map(renderCheck("fallRisk")).join("");

  $$("#safetyChecks input, #fallChecks input").forEach((input) => {
    input.addEventListener("change", () => {
      appState[input.dataset.group][input.name] = input.checked;
      saveState();
      render();
    });
  });
}

function renderCheck(group) {
  const isFallRisk = group === "fallRisk";
  return (question) => `
    <label class="check-row assessment-check-row assessment-check-row-${group}">
      <span class="assessment-row-icon assessment-row-icon-${question.id}" aria-hidden="true"></span>
      <span class="check-copy">${question.label}</span>
      <input type="checkbox" data-group="${group}" name="${question.id}" />
      ${
        isFallRisk
          ? `<span class="yes-no-toggle" aria-hidden="true"><span>No</span><span>Yes</span></span>`
          : `<span class="switch-ui" aria-hidden="true"></span>`
      }
    </label>
  `;
}

function renderAssessmentForm() {
  $("#tugInput").value = appState.assessment.tugSeconds;
  $("#chairInput").value = appState.assessment.chairStands;
  $("#balanceStageInput").value = appState.assessment.balanceStage;
  $("#balanceSecondsInput").value = appState.assessment.balanceSeconds;
  $("#gaitInput").value = appState.assessment.gaitSpeed || "";
  $("#confidenceInput").value = appState.assessment.confidence;

  $$("#safetyChecks input, #fallChecks input").forEach((input) => {
    input.checked = Boolean(appState[input.dataset.group][input.name]);
  });
  $("#timerReadout").textContent = "00.0s";
  renderBalanceControls();
  renderConfidenceToggle();
}

function renderBalanceControls() {
  const stage = String($("#balanceStageInput").value || appState.assessment.balanceStage);
  $$("[data-balance-stage]").forEach((button) => {
    const isActive = button.dataset.balanceStage === stage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  $("#balanceHoldValue").textContent = `${Number($("#balanceSecondsInput").value || 0)} seconds`;
}

function adjustBalanceHold(delta) {
  const input = $("#balanceSecondsInput");
  input.value = Math.max(0, Math.min(30, Number(input.value || 0) + delta));
  renderBalanceControls();
  renderAssessmentSummary();
}

function renderConfidenceToggle() {
  const confidence = $("#confidenceInput").value || appState.assessment.confidence;
  $$("[data-confidence]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.confidence === confidence);
  });
}

function renderAssessmentSummary() {
  const score = computeFunctionScore({ ...appState, assessment: assessmentFromForm() });
  const plan = getWorkoutPlan(score, { ...appState, assessment: assessmentFromForm() });
  $("#assessmentSummary").innerHTML = `
    <div class="assessment-score-summary">
      <span class="summary-star" aria-hidden="true">★</span>
      <div>
        <span>Function score</span>
        <strong>${score.total}</strong>
        <em>Plan: ${planShortName(score.band)}</em>
      </div>
    </div>
  `;
}

function assessmentFromForm() {
  return {
    tugSeconds: Number($("#tugInput").value || appState.assessment.tugSeconds),
    chairStands: Number($("#chairInput").value || appState.assessment.chairStands),
    balanceStage: Number($("#balanceStageInput").value || appState.assessment.balanceStage),
    balanceSeconds: Number($("#balanceSecondsInput").value || appState.assessment.balanceSeconds),
    gaitSpeed: Number($("#gaitInput").value || 0),
    confidence: $("#confidenceInput").value || appState.assessment.confidence
  };
}

function readAssessmentForm() {
  appState.assessment = assessmentFromForm();
}

function renderWorkout(plan) {
  $(".app-shell")?.setAttribute("data-workout-mode", workoutState.mode);
  $("#planLevel").textContent = plan.label;
  $("#workoutSubtitle").textContent = `${planShortName(computeFunctionScore(appState).band)} · ${workoutDuration(plan)}`;
  if (workoutState.mode !== "rest") stopRestCountdown();
  if (workoutState.mode === "overview") {
    renderWorkoutOverview(plan);
  } else if (workoutState.mode === "active") {
    renderWorkoutActive(plan);
  } else if (workoutState.mode === "guidance") {
    renderWorkoutGuidance(plan);
  } else if (workoutState.mode === "rest") {
    renderWorkoutRest(plan);
  } else if (workoutState.mode === "paused") {
    renderWorkoutPaused(plan);
  } else {
    renderWorkoutComplete();
  }
}

function renderWorkoutOverview(plan) {
  $("#workoutPlan").innerHTML = `
    <article class="panel workout-overview">
      <div class="workout-overview-intro">
        <div>
          <p class="eyebrow">Your plan</p>
          <h3>${planShortName(computeFunctionScore(appState).band)}</h3>
          <p>Safe, simple movements to keep you steady and strong.</p>
        </div>
        <img src="${currentAssets().coach}" alt="" width="512" height="512" />
      </div>
      <div class="today-plan-main">
        <div>
          <p class="eyebrow">Overview</p>
          <h3>Safe, steady, supported.</h3>
          <p class="muted">${plan.support}</p>
        </div>
        <img src="${exerciseImageFor(plan.exercises[0]?.name || "")}" alt="" width="512" height="512" />
      </div>
      <div class="exercise-list">
        ${plan.exercises
          .slice(0, 4)
          .map(
            (exercise, index) => `
              <button class="exercise-row" type="button" data-start-exercise="${index}">
                <img src="${exerciseImageFor(exercise.name)}" alt="" width="512" height="512" />
                <span><strong>${exercise.name}</strong><small>${exercise.dose}</small></span>
              </button>
            `
          )
          .join("")}
      </div>
      <button id="startWorkoutSessionBtn" class="primary-action full-action" type="button">Start workout</button>
      <button id="makeWorkoutEasierBtn" class="text-link inline-link" type="button">Make easier</button>
      <div class="support-note">Use support nearby.</div>
    </article>
  `;
  $("#startWorkoutSessionBtn").addEventListener("click", () => setWorkoutMode("active", 0));
  $("#makeWorkoutEasierBtn").addEventListener("click", () => toast("Use the support cues and reduce one set today"));
  $$("[data-start-exercise]").forEach((button) => {
    button.addEventListener("click", () => setWorkoutMode("active", Number(button.dataset.startExercise)));
  });
}

function renderWorkoutActive(plan) {
  const exercise = currentExercise(plan);
  const dose = parseExerciseDose(exercise);
  const target = dose.total;
  const guidance = exerciseGuidance(exercise.name, plan.support);
  const repsComplete = workoutState.repCount >= target;
  const currentSet = Math.min(dose.sets, Math.floor(workoutState.repCount / dose.unitTarget) + 1);
  const currentUnitCount = Math.min(dose.unitTarget, workoutState.repCount % dose.unitTarget);
  const counterLabel = dose.sets > 1 ? `Set ${currentSet} of ${dose.sets}` : dose.counterLabel;
  const actionLabel = dose.unitLabel === "rep" ? "Mark rep" : `Mark ${dose.unitLabel}`;
  $("#workoutPlan").innerHTML = `
    <article class="panel workout-active">
      ${workoutProgressMarkup(plan)}
      <div class="active-exercise-layout">
        <img class="session-illustration" src="${exerciseImageFor(exercise.name)}" alt="" width="512" height="512" />
        <div>
          <p class="eyebrow">${exercise.dose}</p>
          <h3>${exercise.name}</h3>
          <p>${guidance.action}</p>
        </div>
      </div>
      <button id="openGuidanceBtn" class="secondary-action full-action" type="button">Show setup and safety</button>
      <div class="rep-counter">
        <small>${counterLabel}</small>
        <strong>${currentUnitCount}</strong><span>/ ${dose.unitTarget}</span>
      </div>
      <div class="rep-actions">
        <button id="markRepBtn" class="primary-action" type="button" ${repsComplete ? "disabled" : ""}>${actionLabel}</button>
        <button id="completeRepsBtn" class="secondary-action" type="button" ${repsComplete ? "disabled" : ""}>${dose.sets > 1 ? "Set complete" : "Reps complete"}</button>
      </div>
      <div class="support-note">Move slowly. Rest any time.</div>
      ${workoutControlActions()}
      <button id="resetRepCounterBtn" class="text-link inline-link reset-counter" type="button">Reset counter</button>
    </article>
  `;
  $("#markRepBtn").addEventListener("click", () => markRep(plan));
  $("#completeRepsBtn").addEventListener("click", () => completeReps(plan));
  $("#openGuidanceBtn").addEventListener("click", () => setWorkoutMode("guidance", workoutState.exerciseIndex));
  $("#resetRepCounterBtn").addEventListener("click", () => resetRepCounter(plan));
  bindWorkoutControlActions();
}

function renderWorkoutGuidance(plan) {
  const exercise = currentExercise(plan);
  const guidance = exerciseGuidance(exercise.name, plan.support);
  $("#workoutPlan").innerHTML = `
    <article class="panel workout-active">
      ${workoutProgressMarkup(plan)}
      <h3>${exercise.name}</h3>
      <dl class="action-list">
        <div><dt>Set up</dt><dd>${guidance.setup}</dd></div>
        <div><dt>Do</dt><dd>${guidance.action}</dd></div>
        <div><dt>Watch</dt><dd>${guidance.watch}</dd></div>
      </dl>
      <button id="readyExerciseBtn" class="primary-action full-action" type="button">I'm ready</button>
      ${workoutControlActions()}
      <button id="needEasierBtn" class="text-link inline-link" type="button">Need easier option</button>
    </article>
  `;
  $("#readyExerciseBtn").addEventListener("click", () => setWorkoutMode("active", workoutState.exerciseIndex));
  $("#needEasierBtn").addEventListener("click", () => toast("Try fewer reps and keep both hands near support"));
  bindWorkoutControlActions();
}

function renderWorkoutRest(plan) {
  const nextIndex = workoutState.exerciseIndex + 1;
  const next = plan.exercises[nextIndex];
  $("#workoutPlan").innerHTML = `
    <article class="panel rest-card">
      <p class="eyebrow">Rest</p>
      <h3>Nice work. Take a short rest.</h3>
      <div id="restTimerReadout" class="timer-display" aria-live="polite">${formatRestTime(currentRestSeconds())}</div>
      ${
        next
          ? `<div class="next-exercise"><img src="${exerciseImageFor(next.name)}" alt="" width="512" height="512" /><span><strong>Next: ${next.name}</strong><small>${next.dose}</small></span></div>`
          : `<p class="muted">That was the last exercise.</p>`
      }
      <button id="startNextExerciseBtn" class="primary-action full-action" type="button">${next ? "Skip rest and start next" : "Finish workout"}</button>
      <button id="restLongerBtn" class="secondary-action full-action" type="button">Add 1 min rest</button>
      ${workoutControlActions()}
    </article>
  `;
  $("#startNextExerciseBtn").addEventListener("click", () => {
    if (next) setWorkoutMode("active", nextIndex);
    else finishWorkoutSession();
  });
  $("#restLongerBtn").addEventListener("click", () => {
    workoutState.restEndsAt = Math.max(Date.now(), workoutState.restEndsAt || Date.now()) + REST_INCREMENT_SECONDS * 1000;
    updateRestTimerReadout();
    toast("Added 1 minute");
  });
  bindWorkoutControlActions();
  startRestCountdown();
}

function renderWorkoutPaused(plan) {
  const exercise = currentExercise(plan);
  const dose = parseExerciseDose(exercise);
  const progress = Math.min(dose.total, workoutState.repCount);
  $("#workoutPlan").innerHTML = `
    <article class="panel workout-paused">
      ${workoutProgressMarkup(plan)}
      <p class="eyebrow">Paused</p>
      <h3>Take the time you need.</h3>
      <p class="muted">Your place is saved at ${exercise.name}. Resume only if you feel well and steady.</p>
      <div class="paused-summary">
        <span>Current exercise</span>
        <strong>${exercise.name}</strong>
        <small>${progress} of ${dose.total} ${dose.unitLabel === "rep" ? "reps" : dose.unitLabel + "s"} completed</small>
      </div>
      <button id="resumeWorkoutBtn" class="primary-action full-action" type="button">Resume workout</button>
      <button id="stopPausedWorkoutBtn" class="secondary-action full-action" type="button">Stop workout today</button>
      <div class="support-note">If you feel unwell, rest and contact your health professional if symptoms continue.</div>
    </article>
  `;
  $("#resumeWorkoutBtn").addEventListener("click", resumeWorkout);
  $("#stopPausedWorkoutBtn").addEventListener("click", stopWorkout);
}

function workoutControlActions() {
  return `
    <div class="workout-control-actions">
      <button id="pauseWorkoutBtn" class="secondary-action" type="button">Pause workout</button>
      <button id="stopWorkoutBtn" class="text-link inline-link" type="button">Stop if unwell</button>
    </div>
  `;
}

function bindWorkoutControlActions() {
  $("#pauseWorkoutBtn")?.addEventListener("click", pauseWorkout);
  $("#stopWorkoutBtn")?.addEventListener("click", stopWorkout);
}

function renderWorkoutComplete() {
  $("#workoutPlan").innerHTML = `
    <article class="panel completion-card">
      <div class="completion-illustration-frame">
        <img class="completion-illustration" src="${currentAssets().progress}" alt="" width="512" height="512" />
      </div>
      <p class="eyebrow">Workout complete</p>
      <h3>You completed today's light balance plan.</h3>
      <dl class="change-list">
        <div><dt>Exercises</dt><dd>Done</dd></div>
        <div><dt>Time</dt><dd>About 15 min</dd></div>
        <div><dt>Support</dt><dd>Used nearby</dd></div>
      </dl>
      <button id="backToTodayAfterWorkoutBtn" class="primary-action full-action" type="button">Back to Today</button>
      <button id="viewProgressFromWorkoutBtn" class="secondary-action full-action" type="button">View progress</button>
      <p class="muted">Recheck assessment in 5 days.</p>
    </article>
  `;
  $("#backToTodayAfterWorkoutBtn").addEventListener("click", () => {
    render();
    showView("today");
  });
  $("#viewProgressFromWorkoutBtn").addEventListener("click", () => showView("progress"));
}

function workoutProgressMarkup(plan) {
  const progress = ((workoutState.exerciseIndex + 1) / plan.exercises.length) * 100;
  return `
    <div class="session-progress">
      <span>${workoutState.exerciseIndex + 1} of ${plan.exercises.length}</span>
      <div><b style="width:${progress}%"></b></div>
    </div>
  `;
}

function markRep(plan) {
  const exercise = currentExercise(plan);
  const target = parseExerciseDose(exercise).total;
  workoutState.repCount = Math.min(target, workoutState.repCount + 1);
  if (workoutState.repCount >= target) {
    continueAfterReps(plan);
    return;
  }
  renderWorkout(plan);
}

function completeReps(plan) {
  const dose = parseExerciseDose(currentExercise(plan));
  const nextSetTotal = Math.min(dose.total, Math.ceil((workoutState.repCount + 1) / dose.unitTarget) * dose.unitTarget);
  workoutState.repCount = nextSetTotal;
  if (workoutState.repCount >= dose.total) {
    continueAfterReps(plan);
    return;
  }
  renderWorkout(plan);
}

function resetRepCounter(plan) {
  workoutState.repCount = 0;
  renderWorkout(plan);
  toast("Counter reset");
}

function continueAfterReps(plan) {
  if (workoutState.exerciseIndex >= plan.exercises.length - 1) {
    finishWorkoutSession();
  } else {
    setWorkoutMode("rest", workoutState.exerciseIndex);
  }
}

function currentExercise(plan) {
  return plan.exercises[Math.min(workoutState.exerciseIndex, plan.exercises.length - 1)];
}

function isWorkoutPaused() {
  return workoutState.mode === "paused";
}

function pauseWorkout() {
  const pausedFrom = workoutState.mode === "paused" ? workoutState.pausedFrom : workoutState.mode;
  if (workoutState.mode === "rest") {
    updateRestTimerReadout();
    workoutState.restEndsAt = 0;
  }
  stopRestCountdown();
  workoutState = {
    ...workoutState,
    mode: "paused",
    pausedFrom: ["active", "guidance", "rest"].includes(pausedFrom) ? pausedFrom : "active"
  };
  render();
  showView("today");
  toast("Workout paused");
}

function resumeWorkout() {
  const mode = ["active", "guidance", "rest"].includes(workoutState.pausedFrom) ? workoutState.pausedFrom : "active";
  workoutState = {
    ...workoutState,
    mode,
    restEndsAt: mode === "rest" ? Date.now() + (workoutState.restSeconds || DEFAULT_REST_SECONDS) * 1000 : 0
  };
  render();
  showView("plan");
}

function stopWorkout() {
  stopRestCountdown();
  workoutState = initialWorkoutState();
  render();
  showView("today");
  toast("Workout stopped. Rest and resume another time.");
}

function setWorkoutMode(mode, exerciseIndex = workoutState.exerciseIndex) {
  stopRestCountdown();
  const sameExercise = exerciseIndex === workoutState.exerciseIndex;
  const keepCounter =
    sameExercise &&
    ["active", "guidance"].includes(mode) &&
    ["active", "guidance"].includes(workoutState.mode);
  workoutState = {
    mode,
    exerciseIndex,
    repCount: keepCounter ? workoutState.repCount : 0,
    pausedFrom: "active",
    restSeconds: mode === "rest" ? DEFAULT_REST_SECONDS : workoutState.restSeconds || DEFAULT_REST_SECONDS,
    restEndsAt: mode === "rest" ? Date.now() + DEFAULT_REST_SECONDS * 1000 : 0
  };
  render();
  resetScrollPosition();
}

function startWorkoutFlow() {
  stopRestCountdown();
  workoutState = initialWorkoutState();
  showView("plan");
  render();
}

function handleTodayPrimaryAction() {
  if (isWorkoutCompleteToday(appState)) {
    showView("progress");
    return;
  }
  if (isWorkoutPaused()) {
    resumeWorkout();
    return;
  }
  startWorkoutFlow();
}

function markWorkoutDone() {
  const wasAlreadyDone = isWorkoutCompleteToday(appState);
  appState = completeWorkout(appState);
  saveState();
  stopRestCountdown();
  workoutState = { ...initialWorkoutState(), mode: "complete", exerciseIndex: workoutState.exerciseIndex };
  render();
  showView("today");
  toast(wasAlreadyDone ? "Workout already done today" : "Workout marked done");
}

function finishWorkoutSession() {
  appState = completeWorkout(appState);
  saveState();
  stopRestCountdown();
  workoutState = { ...initialWorkoutState(), mode: "complete", exerciseIndex: workoutState.exerciseIndex };
  render();
  resetScrollPosition();
}

function initialWorkoutState() {
  return {
    mode: "overview",
    exerciseIndex: 0,
    repCount: 0,
    pausedFrom: "active",
    restSeconds: DEFAULT_REST_SECONDS,
    restEndsAt: 0
  };
}

function renderProgress(history) {
  const max = Math.max(...history.map((entry) => entry.score), 100);
  $("#scoreChart").innerHTML = history
    .map(
      (entry) => `
        <div class="bar-item">
          <span>${entry.score}</span>
          <div style="height:${Math.max(12, (entry.score / max) * 100)}%"></div>
          <small>${entry.week}</small>
        </div>
      `
    )
    .join("");

  const first = history[0];
  const last = history[history.length - 1];
  const baselineSteps = Number(personas[appState.id]?.wearable?.steps ?? appState.wearable.steps);
  const stepDelta = Number(appState.wearable.steps) - baselineSteps;
  const changes = [
    ["Function score change", formatPointChange(last.score - first.score)],
    ["TUG change", formatTimeChange(first.tugSeconds - last.tugSeconds)],
    ["Chair-stand change", formatRepChange(last.chairStands - first.chairStands)],
    ["Balance-stage change", formatStageChange(last.balanceStage - first.balanceStage)],
    ["Steps change today", formatStepChange(stepDelta)]
  ];

  $("#changeList").innerHTML = changes
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
}

function renderProgressInsight(history, score, plan) {
  const first = history[0];
  const last = history[history.length - 1];
  const scoreDelta = last.score - first.score;
  const tugGain = round1(first.tugSeconds - last.tugSeconds);
  const chairGain = last.chairStands - first.chairStands;
  const weakest = weakestDomain(score);
  const progressLead = chairGain > 0
    ? `Chair stands improved by ${formatUnit(chairGain, "rep")}.`
    : tugGain > 0
      ? `TUG is ${formatTimeChange(tugGain).toLowerCase()}.`
      : "The score has not moved yet, so consistency matters more than progression.";
  const scoreDeltaCopy = scoreDelta === 0
    ? "Function score is unchanged from 4 weeks ago."
    : `Function score is ${formatPointChange(scoreDelta).toLowerCase()} than 4 weeks ago.`;

  $("#progressInsight").innerHTML = `
    <div>
      <p class="eyebrow">What this means</p>
      <h3>${scoreDelta > 0 ? "You are improving slowly." : "Keep building consistency."}</h3>
      <p>${progressLead} ${scoreDeltaCopy} Keep doing today's plan. Recheck next week.</p>
      <div class="metric-rows">
        <div><span>Function score</span><strong>${score.total}</strong><small>Current score</small></div>
        <div><span>Score change</span><strong>${formatPointChange(scoreDelta)}</strong><small>Compared with 4 weeks ago</small></div>
        <div><span>TUG</span><strong>${appState.assessment.tugSeconds}s</strong><small>Current timed walk</small></div>
        <div><span>Chair stands</span><strong>${appState.assessment.chairStands}</strong><small>Current reps</small></div>
        <div><span>Focus</span><strong>${labelDomainTitle(weakest[0])}</strong><small>Today's priority</small></div>
      </div>
    </div>
    <button class="secondary-action story-action" type="button" data-view-target="plan">${plan.deload ? "Do easy plan" : "Do today's plan"}</button>
  `;
  $("#progressInsight .story-action").addEventListener("click", () => showView("plan"));
}

function renderCoach(coach) {
  const coachImage = $("#coachAvatarImage");
  coachImage.src = currentAssets().coach;
  coachImage.alt = `${avatarPreference === "male" ? "Male" : "Female"} East Asian coach avatar`;
  $("#elderSummary").innerHTML = `<strong>${appState.name.split(",")[0]}, keep focusing on safe balance and leg strength.</strong><span>Rest is part of progress. Today's plan is enough.</span>`;
  $("#caregiverSummary").innerHTML = `<strong>Caregiver summary</strong><span>${coach.caregiver}</span>`;
}

function renderAvatarPreference() {
  $$(".avatar-toggle").forEach((button) => {
    const isActive = button.dataset.avatar === avatarPreference;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setAvatarPreference(value) {
  avatarPreference = value === "male" ? "male" : "female";
  preferenceSet(AVATAR_STORAGE_KEY, avatarPreference);
  render();
  toast(`${avatarPreference === "male" ? "Male" : "Female"} coach avatar selected`);
}

function showSummary(target) {
  $$(".summary-toggle").forEach((button) => button.classList.toggle("is-active", button.dataset.summary === target));
  $$(".summary-panel").forEach((panel) => panel.classList.remove("is-visible"));
  $(`#${target === "caregiver" ? "caregiverSummary" : "elderSummary"}`).classList.add("is-visible");
}

function renderPersonaOptions() {
  $("#personaSelect").innerHTML = Object.values(personas)
    .map((persona) => `<option value="${persona.id}">${persona.name} - ${persona.description}</option>`)
    .join("");
}

function showView(view) {
  $(".app-shell")?.setAttribute("data-view", view);
  updateScreenHeader();
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  $$(".view").forEach((panel) => panel.classList.toggle("is-visible", panel.id === `view-${view}`));
  $("#main").focus({ preventScroll: true });
  resetScrollPosition();
}

function updateScreenHeader() {
  const shell = $(".app-shell");
  if (!shell) return;
  const sidebar = $(".sidebar");
  const view = shell.dataset.view || "today";
  const score = computeFunctionScore(appState);
  const plan = getWorkoutPlan(score, appState);
  const firstName = appState.name.split(",")[0];
  const titleMap = {
    plan: "Today's workout",
    progress: "This week: safer and steadier",
    coach: "Your coach"
  };
  const subtitleMap = {
    plan: `${planShortName(score.band)} · ${workoutDuration(plan).replace("About ", "").replace("minutes", "min")}`,
    progress: "Keep doing today's plan",
    coach: "Wellness support for safe movement."
  };
  const title = titleMap[view] || `Good morning, ${firstName}`;
  const subtitle = subtitleMap[view] || "";
  shell.dataset.screenTitle = title;
  shell.dataset.screenSubtitle = subtitle;
  if (sidebar) {
    sidebar.dataset.screenTitle = title;
    sidebar.dataset.screenSubtitle = subtitle;
  }
}

function showEvidenceSources() {
  showView("coach");
  const evidence = $("#evidenceSources");
  evidence.open = true;
  requestAnimationFrame(() => evidence.scrollIntoView({ behavior: "smooth", block: "start" }));
}

function openScoreInfoModal(interpretation) {
  modalReturnTarget = document.activeElement;
  $("#scoreInfoTitle").textContent = interpretation.title;
  $("#scoreInfoContent").innerHTML = `
    <p>${interpretation.body}</p>
    <div class="modal-info-grid">
      <div>
        <span>What this score means</span>
        <strong>${interpretation.meaning}</strong>
      </div>
      <div>
        <span>Best next step</span>
        <strong>${interpretation.nextStep}</strong>
      </div>
    </div>
  `;
  $("#scoreInfoModal").hidden = false;
  document.body.classList.add("modal-open");
  $(".modal-card")?.focus({ preventScroll: true });
}

function closeScoreInfoModal() {
  $("#scoreInfoModal").hidden = true;
  document.body.classList.remove("modal-open");
  modalReturnTarget?.focus?.({ preventScroll: true });
  modalReturnTarget = null;
}

function loadState() {
  return clonePersona("grace");
}

function loadAvatarPreference() {
  return preferenceGet(AVATAR_STORAGE_KEY) === "male" ? "male" : "female";
}

function saveState() {
  // App/profile numbers are intentionally in-memory only for demo stability.
  // A fresh app startup returns to the fixed seeded profile defaults.
}

function preferenceGet(key) {
  try {
    return window.localStorage?.getItem(key) || null;
  } catch {
    return null;
  }
}

function preferenceSet(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch {}
}

function clonePersona(id) {
  return structuredClone(personas[id] || personas.grace);
}

function setPresenterMode(enabled, options = {}) {
  const { announce = true } = options;
  presenterMode = Boolean(enabled);
  document.body.classList.toggle("presenter-mode", presenterMode);
  $(".app-shell")?.setAttribute("data-presenter-mode", presenterMode ? "true" : "false");
  $("#presenterControls").hidden = !presenterMode;
  $("#personaSelect").value = appState.id;

  if (announce) toast(`Presenter controls ${presenterMode ? "shown" : "hidden"}`);
}

function resetFlowState() {
  assessmentStepIndex = 0;
  stopRestCountdown();
  workoutState = initialWorkoutState();
}

function resetScrollPosition() {
  $(".phone-screen")?.scrollTo({ top: 0, behavior: "auto" });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function updateTimerReadout() {
  const seconds = Math.round(((performance.now() - timerStart) / 1000) * 10) / 10;
  $("#timerReadout").textContent = `${seconds.toFixed(1)}s`;
}

function startRestCountdown() {
  stopRestCountdown();
  if (!workoutState.restEndsAt) workoutState.restEndsAt = Date.now() + (workoutState.restSeconds || DEFAULT_REST_SECONDS) * 1000;
  updateRestTimerReadout();
  restTimer = setInterval(() => {
    updateRestTimerReadout();
    if (currentRestSeconds() === 0) {
      stopRestCountdown();
      $("#startNextExerciseBtn")?.focus({ preventScroll: true });
    }
  }, 1000);
}

function stopRestCountdown() {
  clearInterval(restTimer);
  restTimer = null;
}

function updateRestTimerReadout() {
  const readout = $("#restTimerReadout");
  const seconds = currentRestSeconds();
  workoutState.restSeconds = seconds;
  if (readout) readout.textContent = formatRestTime(seconds);
}

function currentRestSeconds() {
  if (!workoutState.restEndsAt) return workoutState.restSeconds || 0;
  return Math.max(0, Math.ceil((workoutState.restEndsAt - Date.now()) / 1000));
}

function formatRestTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("is-visible");
  clearTimeout(node.hideTimer);
  node.hideTimer = setTimeout(() => node.classList.remove("is-visible"), 2200);
}

function signed(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function formatUnit(value, singular, plural = `${singular}s`) {
  return `${value} ${Math.abs(value) === 1 ? singular : plural}`;
}

function formatPointChange(value) {
  if (value === 0) return "0 points";
  return `${Math.abs(value)} ${Math.abs(value) === 1 ? "point" : "points"} ${value > 0 ? "higher" : "lower"}`;
}

function formatRepChange(value) {
  if (value === 0) return "0 reps";
  return `${Math.abs(value)} ${Math.abs(value) === 1 ? "rep" : "reps"} ${value > 0 ? "more" : "fewer"}`;
}

function formatStageChange(value) {
  if (value === 0) return "No change";
  return `${Math.abs(value)} ${Math.abs(value) === 1 ? "stage" : "stages"} ${value > 0 ? "higher" : "lower"}`;
}

function formatStepChange(value) {
  if (value === 0) return "0 steps";
  return `${Math.abs(value).toLocaleString()} ${value > 0 ? "more" : "fewer"} steps`;
}

function formatTimeChange(value) {
  const rounded = round1(value);
  if (rounded === 0) return "No change";
  return `${Math.abs(rounded)}s ${rounded > 0 ? "faster" : "slower"}`;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function weakestDomain(score) {
  return Object.entries(score.subScores).sort((a, b) => a[1] - b[1])[0];
}

function secondaryWeakestDomain(score) {
  const domain = Object.entries(score.subScores).sort((a, b) => a[1] - b[1])[1]?.[0];
  return labelDomainTitle(domain || "balance").toLowerCase();
}

function getDailyPlanTitle(band) {
  return {
    seated: "Today is a seated strength day",
    frail: "Today is a supported strength day",
    frailFallRisk: "Today is a light balance day",
    prefrail: "Today is a steady movement day",
    robust: "Today is a strength and balance day",
    advanced: "Today is a progression day"
  }[band];
}

function planShortName(band) {
  return {
    seated: "Seated mobility + strength",
    frail: "Supported strength + balance",
    frailFallRisk: "Light balance + leg strength",
    prefrail: "Steady mobility + strength",
    robust: "Strength + balance",
    advanced: "Advanced strength + intervals"
  }[band];
}

function workoutDuration(plan) {
  return plan.exercises.length > 5 ? "About 20 minutes" : "About 15 minutes";
}

function parseExerciseDose(exercise) {
  const dose = exercise.dose.toLowerCase();
  const setMatch = dose.match(/(\d+)\s*(?:sets?|holds?|rounds?)/);
  const sets = Number(setMatch?.[1] || 1);
  const repMatch = dose.match(/(?:sets?|set)\s+(?:of\s+)?(\d+)/) || dose.match(/(\d+)\s*(?:reps?|each)/);
  const timeMatch = dose.match(/(\d+)\s*(?:seconds?|minutes?)/);
  const sideMultiplier = /\beach\s+(?:side|direction)\b/.test(dose) ? 2 : 1;

  if (repMatch) {
    const reps = Math.min(Math.max(Number(repMatch[1]), 1), 20) * sideMultiplier;
    return {
      counterLabel: "Reps",
      sets: Math.max(sets, 1),
      total: Math.max(sets, 1) * reps,
      unitLabel: "rep",
      unitTarget: reps
    };
  }

  const rounds = Math.max(sets, 1);
  return {
    counterLabel: dose.includes("hold") ? "Hold" : "Round",
    sets: rounds,
    total: rounds,
    unitLabel: dose.includes("hold") ? "hold" : "round",
    unitTarget: 1,
    timeLabel: timeMatch ? timeMatch[0] : ""
  };
}

function labelDomainTitle(key) {
  return {
    mobility: "Mobility",
    strength: "Leg strength",
    balance: "Balance",
    activity: "Daily activity",
    recovery: "Recovery"
  }[key] || key;
}

function scoreInterpretation(score) {
  const weakest = weakestDomain(score);
  const focus = labelDomainTitle(weakest[0]).toLowerCase();
  const support = score.status.shouldSupervise
    ? "Keep a stable chair, counter, or caregiver nearby while you move."
    : "Keep the space clear and move at a comfortable pace.";
  const range = {
    seated: {
      title: "Start safely and build from here.",
      meaning: "Your body needs seated or heavily supported movement right now.",
      nextStep: `Do the short supported plan and practice ${focus} gently.`
    },
    frail: {
      title: "You are in a rebuilding phase.",
      meaning: "The score reflects lower movement reserve, but steady practice can improve it.",
      nextStep: `Use support and focus on ${focus} today.`
    },
    frailFallRisk: {
      title: "Build strength with fall-risk precautions.",
      meaning: "Your score includes fall-risk signals, so safer supported movement matters most.",
      nextStep: `Keep support nearby and train ${focus} without rushing.`
    },
    prefrail: {
      title: "You have a base to build on.",
      meaning: "The score shows useful independence, with one area ready for improvement.",
      nextStep: `Complete today's plan to strengthen ${focus}.`
    },
    robust: {
      title: "You are maintaining strong function.",
      meaning: "The score suggests good movement reserve for daily activities.",
      nextStep: `Keep progressing gradually, especially ${focus}.`
    },
    advanced: {
      title: "You are training from a strong base.",
      meaning: "The score suggests high movement reserve; consistency protects it.",
      nextStep: `Challenge yourself safely while monitoring ${focus}.`
    }
  }[score.band];

  return {
    ...range,
    body: `This is your movement-reserve score. It combines walking, standing strength, balance, daily activity, and recovery. It is not a diagnosis or a grade. Small safe workouts can move the score upward over time. ${support}`
  };
}

function scoreBreakdownRows(score) {
  const help = {
    mobility: "Timed walk and walking speed",
    strength: "Chair-stand ability",
    balance: "Balance stage and hold time",
    activity: "Steps, active minutes, sitting time",
    recovery: "Sleep and heart-rate recovery"
  };

  return Object.entries(score.subScores).map(([key, value]) => ({
    label: labelDomainTitle(key),
    value,
    help: help[key]
  }));
}

function exerciseGuidance(name, support) {
  const normalized = name.toLowerCase();
  const supportCue = support.toLowerCase().includes("chair") || support.toLowerCase().includes("counter")
    ? "Keep a stable chair or counter within reach."
    : "Use clear floor space and keep support nearby if balance feels uncertain.";

  if (normalized.includes("walk") || normalized.includes("march")) {
    return {
      setup: supportCue,
      action: "Walk or march at a pace where you can still talk. Rest fully between rounds.",
      watch: "Slow down or stop if your steps become uneven or you feel breathless."
    };
  }
  if (normalized.includes("sit-to-stand") || normalized.includes("squat")) {
    return {
      setup: "Chair behind you. Feet flat. Hands on armrests if needed.",
      action: "Stand up, then sit down slowly.",
      watch: "Stop before leg fatigue changes your form or makes you drop into the chair."
    };
  }
  if (normalized.includes("balance") || normalized.includes("tandem") || normalized.includes("weight") || normalized.includes("tap")) {
    return {
      setup: "Stand beside a counter or chair. Keep fingertips close enough to catch yourself.",
      action: "Move slowly and reset posture between holds or taps.",
      watch: "Do not practice balance in open space without support nearby."
    };
  }
  if (normalized.includes("heel") || normalized.includes("toe") || normalized.includes("calf")) {
    return {
      setup: "Face a counter or hold the back of a stable chair.",
      action: "Rise and lower slowly. Keep pressure even through both feet.",
      watch: "Stop if ankle, knee, or calf pain appears."
    };
  }
  if (normalized.includes("push") || normalized.includes("row")) {
    return {
      setup: "Stand tall with feet planted and shoulders relaxed.",
      action: "Move through a comfortable range and breathe normally.",
      watch: "Stop if shoulder, chest, or back pain appears."
    };
  }
  return {
    setup: supportCue,
    action: "Move slowly, breathe normally, and keep the effort comfortable.",
    watch: "Stop if pain, dizziness, or unsteady balance appears."
  };
}

function exerciseImageFor(name) {
  const assets = currentAssets();
  const normalized = name.toLowerCase();
  if (normalized.includes("push") || normalized.includes("row")) return assets.upper;
  if (normalized.includes("walk") || normalized.includes("march") || normalized.includes("step")) return assets.walk;
  if (normalized.includes("balance") || normalized.includes("tandem") || normalized.includes("weight") || normalized.includes("tap")) {
    return assets.balance;
  }
  if (normalized.includes("heel") || normalized.includes("toe") || normalized.includes("calf")) {
    return assets.balance;
  }
  return assets.stand;
}

function currentAssets() {
  return ASSET_SETS[avatarPreference] || ASSET_SETS.female;
}

import {
  applyFourWeekProgress,
  buildCoachCopy,
  completeWorkout,
  computeFunctionScore,
  getWorkoutPlan,
  makeHistoryWithCurrent
} from "./logic.js";
import { fallQuestions, personas, safetyQuestions } from "./data.js?v=13";

const NORMAL_STORAGE_KEY = "frailty-coach-state-v2";
const PRESENTER_STORAGE_KEY = "frailty-coach-presenter-state-v1";
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
const urlParams = new URLSearchParams(window.location.search);
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

let presenterMode = urlParams.get("demo") === "1";
let appState = loadState();
let avatarPreference = loadAvatarPreference();
let activeTimer = null;
let timerStart = 0;

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
    render();
    toast(`Loaded ${appState.name}`);
  });

  $$(".tab").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  $("#startCheckBtn").addEventListener("click", () => showView("assess"));
  $("#evidenceLinkBtn").addEventListener("click", () => showEvidenceSources());
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
    toast("Assessment saved");
  });

  $("#demoProgressBtn").addEventListener("click", () => {
    appState = applyFourWeekProgress(appState);
    saveState();
    render();
    toast("Four-week progress simulated");
    showView("progress");
  });

  $("#completeWorkoutBtn").addEventListener("click", () => {
    appState = completeWorkout(appState);
    saveState();
    render();
    toast("Workout marked done");
  });

  $("#resetPersonaBtn").addEventListener("click", () => {
    appState = clonePersona(appState.id);
    saveState();
    render();
    toast("Scenario reset");
  });

  document.addEventListener("keydown", (event) => {
    if (!event.shiftKey || event.key.toLowerCase() !== "d") return;
    if (event.target?.matches?.("input, select, textarea")) return;
    event.preventDefault();
    setPresenterMode(!presenterMode);
  });

  $("#startTimerBtn").addEventListener("click", () => {
    timerStart = performance.now();
    clearInterval(activeTimer);
    activeTimer = setInterval(updateTimerReadout, 100);
    $("#timerReadout").textContent = "Timer running";
  });

  $("#stopTimerBtn").addEventListener("click", () => {
    if (!timerStart) return;
    clearInterval(activeTimer);
    const seconds = Math.round(((performance.now() - timerStart) / 1000) * 10) / 10;
    $("#tugInput").value = seconds;
    $("#timerReadout").textContent = `TUG timer stopped at ${seconds}s`;
    timerStart = 0;
  });

  $("#addRepBtn").addEventListener("click", () => {
    const input = $("#chairInput");
    input.value = Number(input.value || 0) + 1;
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
  renderAvatarPreference();
  renderHero(score);
  renderScore(score);
  renderAssessmentForm();
  renderAlerts(score.alerts);
  renderWearable(score);
  renderTodayFocus(score, plan);
  renderWorkout(plan);
  renderProgress(history);
  renderProgressStory(history, score);
  renderProgressInsight(history, score, plan);
  renderCoach(coach);
}

function renderHero(score) {
  const firstName = appState.name.split(",")[0];
  const lowest = Object.entries(score.subScores).sort((a, b) => a[1] - b[1])[0][0];
  const supervised = score.status.shouldSupervise ? "with support nearby" : "at your own pace";
  $("#greetingEyebrow").textContent = `Good morning, ${firstName}`;
  $("#heroTitle").textContent = getHeroTitle(score.band);
  $("#heroMessage").textContent = `Do today's workout ${supervised}. It focuses on ${labelDomain(lowest)}, using your latest movement checks and wearable trend.`;
  $("#heroIllustration").src = currentAssets().progress;
}

function renderScore(score) {
  $("#scoreValue").textContent = score.total;
  $("#scoreBand").textContent = score.bandLabel;
  $("#scoreFill").style.width = `${score.total}%`;
  $("#ringValue").textContent = score.total;
  $("#scoreRing").setAttribute("aria-label", `Function score ${score.total}. ${score.bandLabel}.`);
  $("#scoreRing").style.setProperty("--score", `${score.total * 3.6}deg`);
  $("#scoreTitle").textContent = score.bandLabel;
  $("#scoreExplanation").textContent = score.explanation;
  $("#statTug").textContent = `${appState.assessment.tugSeconds}s`;
  $("#statChair").textContent = appState.assessment.chairStands;
  $("#statBalance").textContent = `Stage ${appState.assessment.balanceStage}`;
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
      ? "Wearable trend suggests low daily activity. The plan favors short walking intervals and supported strength."
      : score.subScores.recovery < 60
        ? "Recovery is the limiting signal today, so progression should stay conservative."
        : "Wearable trend supports the current progression level.";
}

function renderTodayFocus(score, plan) {
  const focus = [
    ["Today", "Do the workout plan and keep the effort comfortable."],
    ["Next check", "Update Assess weekly, or sooner if mobility changes."],
    ["Safety posture", score.status.shouldSupervise ? "Use support or supervision" : "Independent with clear space"],
    ["Workout rule", plan.progression]
  ];
  $("#todayFocus").innerHTML = focus
    .map(([label, value]) => `<div><strong>${label}</strong><span>${value}</span></div>`)
    .join("");
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
    : `<div class="alert success"><strong>Ready for today's plan</strong><span>No blocking safety flags are active.</span></div>`;
}

function renderWorkout(plan) {
  $("#planLevel").textContent = plan.label;
  $("#workoutPlan").innerHTML = `
    <article class="panel workout-intro">
      <div class="exercise-visual featured-visual ${visualClassFor(plan.exercises[0]?.name || "")}" aria-hidden="true">
        <img src="${exerciseImageFor(plan.exercises[0]?.name || "")}" alt="" loading="lazy" width="512" height="512" />
      </div>
      <span class="exercise-kicker">Daily plan</span>
      <h3>${plan.label}</h3>
      <p>${plan.support}</p>
      <p class="muted">${plan.progression}</p>
      <dl class="action-list compact-action-list">
        <div><dt>How hard</dt><dd>Comfortable effort. You should be able to speak in short sentences.</dd></div>
        <div><dt>Stop if</dt><dd>Chest pain, faintness, severe breathlessness, new weakness, or sharp pain appears.</dd></div>
      </dl>
    </article>
    ${plan.exercises
      .map((exercise) => {
        const guidance = exerciseGuidance(exercise.name, plan.support);
        return `
          <article class="panel exercise-card">
            <div class="exercise-visual ${visualClassFor(exercise.name)}" aria-hidden="true">
              <img src="${exerciseImageFor(exercise.name)}" alt="" loading="lazy" width="512" height="512" />
            </div>
            <span class="exercise-kicker">${exercise.dose}</span>
            <h3>${exercise.name}</h3>
            <p>${exercise.coaching}</p>
            <dl class="action-list">
              <div><dt>Set up</dt><dd>${guidance.setup}</dd></div>
              <div><dt>Do</dt><dd>${guidance.action}</dd></div>
              <div><dt>Watch</dt><dd>${guidance.watch}</dd></div>
            </dl>
          </article>
        `;
      })
      .join("")}
  `;
}

function renderProgressStory(history, score) {
  const first = history[0];
  const last = history[history.length - 1];
  const scoreDelta = last.score - first.score;
  const tugGain = round1(first.tugSeconds - last.tugSeconds);
  const chairGain = last.chairStands - first.chairStands;
  $("#progressStory").innerHTML = `
    <div>
      <p class="eyebrow">Coach insight</p>
      <h3>${scoreDelta > 0 ? `${signed(scoreDelta)} points over the last four weeks` : "Build momentum safely this week"}</h3>
      <p>${tugGain > 0 ? `Movement is trending better: TUG is ${tugGain}s faster and chair stands are ${signed(chairGain)} reps.` : score.explanation}</p>
    </div>
    <button class="secondary-action story-action" type="button" data-view-target="progress">View trend</button>
  `;
  $("#progressStory .story-action").addEventListener("click", () => showView("progress"));
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
  const changes = [
    ["Score", signed(last.score - first.score)],
    ["TUG time", `${signed(round1(first.tugSeconds - last.tugSeconds))}s faster`],
    ["Chair stands", `${signed(last.chairStands - first.chairStands)} reps`],
    ["Balance stage", signed(last.balanceStage - first.balanceStage)]
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
  const balanceGain = last.balanceStage - first.balanceStage;
  const weakest = Object.entries(score.subScores).sort((a, b) => a[1] - b[1])[0];
  const bestChange =
    chairGain >= Math.max(tugGain, balanceGain)
      ? `${signed(chairGain)} chair stands`
      : tugGain >= balanceGain
        ? `${tugGain}s faster TUG`
        : `${signed(balanceGain)} balance stage`;

  $("#progressInsight").innerHTML = `
    <div>
      <p class="eyebrow">What this means</p>
      <h3>${scoreDelta > 0 ? `Trending up: ${signed(scoreDelta)} score points` : "Keep building consistency"}</h3>
      <p>${scoreDelta > 0 ? `Biggest visible change: ${bestChange}.` : "The score has not moved yet, so consistency matters more than progression."} The next focus is ${labelDomain(weakest[0])}, which is currently ${weakest[1]}/100.</p>
    </div>
    <button class="secondary-action story-action" type="button" data-view-target="plan">${plan.deload ? "Do easy plan" : "Do today's plan"}</button>
  `;
  $("#progressInsight .story-action").addEventListener("click", () => showView("plan"));
}

function renderCoach(coach) {
  const coachImage = $("#coachAvatarImage");
  coachImage.src = currentAssets().coach;
  coachImage.alt = `${avatarPreference === "male" ? "Male" : "Female"} East Asian coach avatar`;
  $("#elderSummary").textContent = coach.elder;
  $("#caregiverSummary").textContent = coach.caregiver;
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
  localStorage.setItem(AVATAR_STORAGE_KEY, avatarPreference);
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
  return (question) => `
    <label class="check-row">
      <input type="checkbox" data-group="${group}" name="${question.id}" />
      <span>${question.label}</span>
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
}

function readAssessmentForm() {
  appState.assessment = {
    tugSeconds: Number($("#tugInput").value),
    chairStands: Number($("#chairInput").value),
    balanceStage: Number($("#balanceStageInput").value),
    balanceSeconds: Number($("#balanceSecondsInput").value),
    gaitSpeed: Number($("#gaitInput").value || 0),
    confidence: $("#confidenceInput").value
  };
}

function showView(view) {
  $(".app-shell")?.setAttribute("data-view", view);
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  $$(".view").forEach((panel) => panel.classList.toggle("is-visible", panel.id === `view-${view}`));
  $("#main").focus({ preventScroll: true });
  resetScrollPosition();
}

function showEvidenceSources() {
  showView("coach");
  const evidence = $("#evidenceSources");
  evidence.open = true;
  requestAnimationFrame(() => evidence.scrollIntoView({ behavior: "smooth", block: "start" }));
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(currentStorageKey()));
    if (stored?.id && personas[stored.id]) return stored;
  } catch {
    localStorage.removeItem(currentStorageKey());
  }
  return clonePersona("grace");
}

function loadAvatarPreference() {
  return localStorage.getItem(AVATAR_STORAGE_KEY) === "male" ? "male" : "female";
}

function saveState() {
  localStorage.setItem(currentStorageKey(), JSON.stringify(appState));
}

function clonePersona(id) {
  return structuredClone(personas[id] || personas.grace);
}

function currentStorageKey() {
  return presenterMode ? PRESENTER_STORAGE_KEY : NORMAL_STORAGE_KEY;
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

function resetScrollPosition() {
  $(".phone-screen")?.scrollTo({ top: 0, behavior: "auto" });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function updateTimerReadout() {
  const seconds = Math.round(((performance.now() - timerStart) / 1000) * 10) / 10;
  $("#timerReadout").textContent = `${seconds}s`;
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

function round1(value) {
  return Math.round(value * 10) / 10;
}

function getHeroTitle(band) {
  return {
    seated: "Start with steady seated movement",
    frail: "Build confidence with supported strength",
    frailFallRisk: "Balance work, safely supported",
    prefrail: "A short session to move better today",
    robust: "Keep strength and balance moving up",
    advanced: "Train hard, recover smart"
  }[band];
}

function labelDomain(key) {
  return {
    mobility: "mobility",
    strength: "leg strength",
    balance: "balance",
    activity: "daily activity",
    recovery: "recovery"
  }[key] || key;
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

function scoreBreakdownRows(score) {
  const help = {
    mobility: "TUG and walking speed",
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
      setup: "Use a firm chair that will not slide. Place feet flat and hip-width apart.",
      action: "Stand tall, then sit with control. Use hands if needed for safety.",
      watch: "Stop before leg fatigue changes your form or makes you drop into the chair."
    };
  }
  if (normalized.includes("balance") || normalized.includes("tandem") || normalized.includes("weight shift") || normalized.includes("tap")) {
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
      watch: "Keep the effort smooth. Stop if shoulder, chest, or back pain appears."
    };
  }
  if (normalized.includes("carry")) {
    return {
      setup: "Choose light, even weights and clear the walking path.",
      action: "Walk tall with shoulders level and short, steady steps.",
      watch: "Put the weights down if grip, posture, or balance changes."
    };
  }
  return {
    setup: supportCue,
    action: "Move slowly, breathe normally, and keep the effort comfortable.",
    watch: "Stop if pain, dizziness, or unsteady balance appears."
  };
}

function visualClassFor(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("walk") || normalized.includes("march") || normalized.includes("step")) return "visual-walk";
  if (normalized.includes("balance") || normalized.includes("tandem") || normalized.includes("weight")) return "visual-balance";
  if (normalized.includes("push") || normalized.includes("row")) return "visual-upper";
  if (normalized.includes("carry")) return "visual-carry";
  return "visual-stand";
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

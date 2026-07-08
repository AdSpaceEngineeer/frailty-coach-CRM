import { personas } from "./data.js?v=65";
import { computeFunctionScore, daysSinceAssessment, makeHistoryWithCurrent } from "./logic.js?v=65";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
let activeFilter = "all";
let activeView = "population";
const providerRoster = [
  { name: "Queenstown Polyclinic", lead: "Dr Tan", residents: ["grace", "daniel"] },
  { name: "Bukit Merah Care Team", lead: "Nurse Lim", residents: ["mei"] },
  { name: "Tampines Active Ageing Hub", lead: "Care Coach Ravi", residents: ["alex"] }
];
const interventionLog = [
  { resident: "Grace, 84", action: "Caregiver call", owner: "Nurse Lim", status: "Due today" },
  { resident: "Daniel, 76", action: "Balance reassessment", owner: "Dr Tan", status: "Booked" },
  { resident: "Mei, 69", action: "Progression review", owner: "Care Coach Ravi", status: "Monitor" }
];

init();

function init() {
  renderCrm();
  bindEvents();
}

function bindEvents() {
  $$(".filters button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      $$(".filters button").forEach((item) => item.classList.toggle("is-active", item === button));
      renderRegistry();
    });
  });
  $$(".crm-sidebar [data-view]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });
  $("#copyBriefBtn").addEventListener("click", copyBriefing);
  $("#exportCsvBtn").addEventListener("click", exportCsv);
}

function renderCrm() {
  renderMetrics();
  renderTrendChart();
  renderRiskQueue();
  renderRegistry();
  renderOutreach();
  renderProviders();
  renderInterventions();
  showView(activeView);
}

function cohort() {
  return Object.values(personas).map((persona) => {
    const score = computeFunctionScore(persona);
    const history = makeHistoryWithCurrent(persona, score);
    const first = history[0] || {};
    const last = history[history.length - 1] || {};
    const trend = Number(last.score || score.total) - Number(first.score || score.total);
    const reassessmentDays = daysSinceAssessment(persona.history);
    const falls = Object.values(persona.fallRisk || {}).filter(Boolean).length;
    const adherence = persona.adherence.completedThisWeek - persona.adherence.missedSessions;
    const followUp = score.status.shouldSupervise || score.total < 45 || persona.adherence.missedSessions >= 2;
    return { persona, score, history, trend, reassessmentDays, falls, adherence, followUp };
  });
}

function summary() {
  const rows = cohort();
  const total = rows.length;
  const avgScore = Math.round(rows.reduce((sum, row) => sum + row.score.total, 0) / Math.max(1, total));
  const followUp = rows.filter((row) => row.followUp).length;
  const due = rows.filter((row) => row.reassessmentDays === null || row.reassessmentDays > 7).length;
  const lowAdherence = rows.filter((row) => row.persona.adherence.missedSessions >= 2).length;
  const avgTrend = Math.round(rows.reduce((sum, row) => sum + row.trend, 0) / Math.max(1, total));
  return { total, avgScore, followUp, due, lowAdherence, avgTrend };
}

function renderMetrics() {
  const data = summary();
  $("#metricGrid").innerHTML = [
    ["Enrolled residents", data.total, "active in remote monitoring"],
    ["Average function score", data.avgScore, `${formatDelta(data.avgTrend)} over 4 weeks`],
    ["Follow-up queue", data.followUp, "supervision, fall risk, or low score"],
    ["Reassessment due", data.due, "check-in older than 7 days"]
  ]
    .map(([label, value, detail]) => `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`)
    .join("");
}

function renderTrendChart() {
  const rows = cohort();
  $("#trendSummary").textContent = `${formatDelta(summary().avgTrend)} avg`;
  $("#trendChart").innerHTML = rows
    .map((row) => {
      const points = row.history.map((entry) => `<span style="height:${Math.max(8, entry.score)}%"></span>`).join("");
      return `
        <div class="trend-row">
          <strong>${row.persona.name.split(",")[0]}</strong>
          <div class="spark-bars">${points}</div>
          <em>${formatDelta(row.trend)}</em>
        </div>
      `;
    })
    .join("");
}

function renderRiskQueue() {
  $("#riskQueue").innerHTML = cohort()
    .sort((a, b) => Number(b.followUp) - Number(a.followUp) || a.score.total - b.score.total)
    .slice(0, 3)
    .map((row) => {
      const reason = row.score.status.shouldSupervise
        ? "Falls or supervision support"
        : row.persona.adherence.missedSessions >= 2
          ? "Low adherence"
          : "Low function score";
      return `<div class="risk-item"><b>${row.persona.name}</b><span>${reason}</span><strong>${row.score.total}</strong></div>`;
    })
    .join("");
}

function renderRegistry() {
  const rows = cohort().filter(matchesFilter);
  $("#residentRows").innerHTML = rows.map(residentRow).join("");
}

function renderOutreach() {
  const rows = cohort().filter((row) => row.followUp);
  $("#outreachView").innerHTML = `
    <section class="panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Outreach queue</p>
          <h2>Who needs contact today</h2>
        </div>
        <span class="status-pill">${rows.length} active</span>
      </div>
      <div class="action-list">
        ${rows.map(outreachCard).join("")}
      </div>
    </section>
  `;
}

function outreachCard(row) {
  const action = row.persona.adherence.missedSessions >= 2
    ? "Send workout nudge and ask caregiver to check barriers."
    : row.score.status.shouldSupervise
      ? "Call caregiver and confirm supervised setup."
      : "Schedule function reassessment with care team.";
  return `
    <article class="action-card">
      <div>
        <strong>${row.persona.name}</strong>
        <span>${action}</span>
      </div>
      <button type="button" data-action-toast="Logged outreach for ${row.persona.name}">Log action</button>
    </article>
  `;
}

function renderProviders() {
  $("#providersView").innerHTML = `
    <section class="panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Providers</p>
          <h2>Care-team caseload</h2>
        </div>
      </div>
      <div class="provider-grid">
        ${providerRoster.map(providerCard).join("")}
      </div>
    </section>
  `;
}

function providerCard(provider) {
  const rows = cohort().filter((row) => provider.residents.includes(row.persona.id));
  const highRisk = rows.filter((row) => row.followUp).length;
  const avgScore = Math.round(rows.reduce((sum, row) => sum + row.score.total, 0) / Math.max(1, rows.length));
  return `
    <article class="provider-card">
      <div>
        <strong>${provider.name}</strong>
        <span>${provider.lead}</span>
      </div>
      <dl>
        <div><dt>Residents</dt><dd>${rows.length}</dd></div>
        <div><dt>Avg score</dt><dd>${avgScore}</dd></div>
        <div><dt>Follow-up</dt><dd>${highRisk}</dd></div>
      </dl>
    </article>
  `;
}

function renderInterventions() {
  $("#interventionsView").innerHTML = `
    <section class="panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Interventions</p>
          <h2>Action tracking</h2>
        </div>
      </div>
      <div class="intervention-table">
        ${interventionLog.map((item) => `
          <article>
            <strong>${item.resident}</strong>
            <span>${item.action}</span>
            <b>${item.owner}</b>
            <em>${item.status}</em>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function showView(view) {
  activeView = view || "population";
  $$(".crm-sidebar [data-view]").forEach((button) => button.classList.toggle("is-active", button.dataset.view === activeView));
  $$(".view-section").forEach((section) => section.classList.toggle("is-visible", section.id === `${activeView}View`));
  const copy = {
    population: ["Kampong operations dashboard", "Frailty Coach - Kampong", "Coordinate risk, adherence, outreach, and care-team follow-up across enrolled residents."],
    outreach: ["Outreach", "Today’s follow-up queue", "Turn frailty signals into calls, nudges, reassessments, and caregiver actions."],
    providers: ["Providers", "Care-team caseload", "See which clinics, doctors, and community teams need support."],
    interventions: ["Interventions", "Action tracking", "Track contacts, referrals, reassessments, and caregiver follow-up."]
  }[activeView];
  $("#pageEyebrow").textContent = copy[0];
  $("#pageTitle").textContent = copy[1];
  $("#pageSubtitle").textContent = copy[2];
  $$("[data-action-toast]").forEach((button) => button.addEventListener("click", () => toast(button.dataset.actionToast)));
}

function matchesFilter(row) {
  if (activeFilter === "follow-up") return row.followUp;
  if (activeFilter === "due") return row.reassessmentDays === null || row.reassessmentDays > 7;
  if (activeFilter === "adherence") return row.persona.adherence.missedSessions >= 2;
  return true;
}

function residentRow(row) {
  return `
    <article class="resident-row">
      <div>
        <strong>${row.persona.name}</strong>
        <span>${row.persona.description}</span>
      </div>
      <div><small>Score</small><b>${row.score.total}</b></div>
      <div><small>Trend</small><b>${formatDelta(row.trend)}</b></div>
      <div><small>Falls</small><b>${row.falls}</b></div>
      <div><small>Missed</small><b>${row.persona.adherence.missedSessions}</b></div>
      <div><small>Check-in</small><b>${formatCheckIn(row.reassessmentDays)}</b></div>
      <em class="${row.followUp ? "is-risk" : ""}">${row.followUp ? "Follow-up" : "Monitor"}</em>
    </article>
  `;
}

async function copyBriefing() {
  const data = summary();
  const text = `Frailty CRM briefing: ${data.total} enrolled residents, average score ${data.avgScore}, ${data.followUp} in follow-up queue, ${data.due} due for reassessment, ${data.lowAdherence} low-adherence cases.`;
  try {
    await navigator.clipboard.writeText(text);
    toast("Briefing copied");
  } catch {
    toast(text);
  }
}

function exportCsv() {
  const header = "name,score,trend,falls,missed_sessions,reassessment,queue\n";
  const csv = cohort()
    .map((row) =>
      [
        row.persona.name,
        row.score.total,
        row.trend,
        row.falls,
        row.persona.adherence.missedSessions,
        formatCheckIn(row.reassessmentDays),
        row.followUp ? "Follow-up" : "Monitor"
      ].join(",")
    )
    .join("\n");
  const url = URL.createObjectURL(new Blob([header + csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "frailty-crm-cohort.csv";
  link.click();
  URL.revokeObjectURL(url);
  toast("CSV exported");
}

function formatDelta(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function formatCheckIn(days) {
  if (days === null) return "None";
  if (days <= 1) return "Today";
  return `${days}d`;
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("is-visible");
  setTimeout(() => node.classList.remove("is-visible"), 2200);
}

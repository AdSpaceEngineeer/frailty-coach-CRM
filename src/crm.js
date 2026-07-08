import { personas } from "./data.js?v=65";
import { computeFunctionScore, daysSinceAssessment, makeHistoryWithCurrent } from "./logic.js?v=65";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
let activeFilter = "all";

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
  $("#copyBriefBtn").addEventListener("click", copyBriefing);
  $("#exportCsvBtn").addEventListener("click", exportCsv);
}

function renderCrm() {
  renderMetrics();
  renderTrendChart();
  renderRiskQueue();
  renderRegistry();
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

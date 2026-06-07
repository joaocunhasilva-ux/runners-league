const form = document.querySelector("#race-form");
const distanceSelect = document.querySelector("#distance");
const customDistanceWrap = document.querySelector("#custom-distance-wrap");
const canvas = document.querySelector("#route-canvas");
const ctx = canvas.getContext("2d");

const loginPanel = document.querySelector("#login-panel");
const sessionPanel = document.querySelector("#session-panel");
const generalPanel = document.querySelector("#general-panel");
const panelTitle = document.querySelector("#panel-title");
const loginButton = document.querySelector("#login-button");
const passwordResetRequestButton = document.querySelector("#password-reset-request");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#logout");
const profileSelect = document.querySelector("#profile");
const passwordInput = document.querySelector("#password");
const viewEyebrow = document.querySelector("#view-eyebrow");
const viewTitle = document.querySelector("#view-title");
const resetButton = document.querySelector("#reset");
const navButtons = document.querySelectorAll("[data-view]");
const appPages = document.querySelectorAll(".app-page");
const createRunnerForm = document.querySelector("#create-runner-form");
const passwordForm = document.querySelector("#password-form");
const adminPasswordForm = document.querySelector("#admin-password-form");
const newRunnerName = document.querySelector("#new-runner-name");
const newRunnerPassword = document.querySelector("#new-runner-password");
const passwordRunner = document.querySelector("#password-runner");
const updatedRunnerPassword = document.querySelector("#updated-runner-password");
const currentAdminPassword = document.querySelector("#current-admin-password");
const newAdminPassword = document.querySelector("#new-admin-password");
const adminPasswordMessage = document.querySelector("#admin-password-message");
const passwordResetRequests = document.querySelector("#password-reset-requests");
const runnerAccounts = document.querySelector("#runner-accounts");
const pendingValidations = document.querySelector("#pending-validations");
const seasonFilter = document.querySelector("#season-filter");
const editSubmissionForm = document.querySelector("#edit-submission-form");
const editSubmissionSelect = document.querySelector("#edit-submission-select");
const editRaceName = document.querySelector("#edit-race-name");
const editOfficialUrl = document.querySelector("#edit-official-url");
const editDistance = document.querySelector("#edit-distance");
const editTotalSeconds = document.querySelector("#edit-total-seconds");
const editRank = document.querySelector("#edit-rank");
const editFinishers = document.querySelector("#edit-finishers");
const editElevation = document.querySelector("#edit-elevation");
const editSeasonYear = document.querySelector("#edit-season-year");
const deleteSubmissionButton = document.querySelector("#delete-submission");
const topThree = document.querySelector("#top-three");
const athleteProfile = document.querySelector("#athlete-profile");
const validationSearch = document.querySelector("#validation-search");
const adminRaceSearch = document.querySelector("#admin-race-search");
const adminStatusFilter = document.querySelector("#admin-status-filter");

const fields = {
  runner: document.querySelector("#runner"),
  raceName: document.querySelector("#race-name"),
  officialUrl: document.querySelector("#official-url"),
  distance: distanceSelect,
  customDistance: document.querySelector("#custom-distance"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
  rank: document.querySelector("#rank"),
  finishers: document.querySelector("#finishers"),
  elevation: document.querySelector("#elevation"),
  competition: document.querySelector("#competition"),
  seasonYear: document.querySelector("#season-year"),
};

const output = {
  score: document.querySelector("#score"),
  pace: document.querySelector("#pace"),
  percentile: document.querySelector("#percentile"),
  difficulty: document.querySelector("#difficulty"),
  officialPoints: document.querySelector("#official-points"),
  performancePoints: document.querySelector("#performance-points"),
  difficultyPoints: document.querySelector("#difficulty-points"),
  validationPoints: document.querySelector("#validation-points"),
  officialBar: document.querySelector("#official-bar"),
  performanceBar: document.querySelector("#performance-bar"),
  difficultyBar: document.querySelector("#difficulty-bar"),
  validationBar: document.querySelector("#validation-bar"),
  submissionsList: document.querySelector("#submissions-list"),
  submissionsTitle: document.querySelector("#submissions-title"),
  submissionCount: document.querySelector("#submission-count"),
  sessionRole: document.querySelector("#session-role"),
  sessionName: document.querySelector("#session-name"),
  adminRaces: document.querySelector("#admin-races"),
  adminRunners: document.querySelector("#admin-runners"),
  adminAverage: document.querySelector("#admin-average"),
};

const benchmarkPaceSeconds = {
  5: 240,
  10: 255,
  21.0975: 275,
  42.195: 305,
};

const currentYear = new Date().getFullYear();
let selectedSeason = currentYear;
fields.seasonYear.value = currentYear;

let submissions = [];
let runnerProfiles = [];
let runnerAccountRows = [];
let passwordResetRows = [];
let selectedAthlete = null;
let session = JSON.parse(localStorage.getItem("runners-league-session") || "null");
if (session && !session.token) {
  session = null;
  localStorage.removeItem("runners-league-session");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatPace(secondsPerKm) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}/km`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[character];
  });
}

function resolveDistance() {
  return fields.distance.value === "custom"
    ? Number(fields.customDistance.value)
    : Number(fields.distance.value);
}

function nearestBenchmark(distanceKm) {
  const known = Object.keys(benchmarkPaceSeconds).map(Number);
  const nearest = known.reduce((best, item) =>
    Math.abs(item - distanceKm) < Math.abs(best - distanceKm) ? item : best
  );
  return benchmarkPaceSeconds[nearest];
}

function getAccessMode() {
  return document.querySelector("input[name='access']:checked").value;
}

function readRace() {
  const distanceKm = resolveDistance();
  return {
    runner: fields.runner.value.trim() || "Corredor",
    raceName: fields.raceName.value.trim() || "Prova oficial",
    officialUrl: fields.officialUrl.value.trim(),
    distanceKm,
    totalSeconds:
      Number(fields.hours.value) * 3600 +
      Number(fields.minutes.value) * 60 +
      Number(fields.seconds.value),
    rank: Number(fields.rank.value),
    finishers: Number(fields.finishers.value),
    elevation: Number(fields.elevation.value),
    competition: Number(fields.competition.value),
    seasonYear: Number(fields.seasonYear.value),
    terrain: Number(document.querySelector("input[name='terrain']:checked").value),
  };
}

function calculateRace(race) {
  const safeFinishers = Math.max(race.finishers, 1);
  const safeRank = clamp(race.rank, 1, safeFinishers);
  const paceSeconds = race.totalSeconds / race.distanceKm;
  const percentile = (safeFinishers - safeRank + 1) / safeFinishers;
  const officialPoints = 350 * Math.pow(percentile, 0.58);
  const benchmark = nearestBenchmark(race.distanceKm);
  const performanceRatio = clamp(benchmark / paceSeconds, 0.45, 1.45);
  const performancePoints = 300 * Math.pow(performanceRatio, 1.8);
  const elevationRatio = race.elevation / Math.max(race.distanceKm, 1);
  const elevationFactor = 1 + clamp(elevationRatio / 120, 0, 0.42);
  const fieldFactor = 1 + clamp(Math.log10(safeFinishers) / 18, 0, 0.2);
  const difficultyFactor = elevationFactor * race.terrain * race.competition * fieldFactor;
  const difficultyPoints = 200 * clamp(difficultyFactor - 0.85, 0.1, 1);
  const validationPoints = race.validationStatus === "approved" ? 100 : race.validationStatus === "pending" ? 25 : 0;
  const participationPoints = race.validationStatus === "rejected" ? 0 : 50;
  const total = Math.round(
    (officialPoints + performancePoints + difficultyPoints + validationPoints + participationPoints) * difficultyFactor
  );

  return {
    ...race,
    safeRank,
    percentile,
    paceSeconds,
    difficultyFactor,
    total,
    officialPoints,
    performancePoints,
    difficultyPoints,
    validationPoints,
    participationPoints,
  };
}

function updateBars(result) {
  const bars = [
    ["official", result.officialPoints, 350],
    ["performance", result.performancePoints, 580],
    ["difficulty", result.difficultyPoints, 200],
    ["validation", result.validationPoints, 100],
  ];

  bars.forEach(([name, value, max]) => {
    output[`${name}Bar`].value = clamp((value / max) * 100, 0, 100);
    output[`${name}Points`].textContent = `${Math.round(value)} pts`;
  });
}

function drawRoute(result) {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#f6faf4");
  sky.addColorStop(1, "#d8e6d3");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#b8d1af";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  for (let x = 0; x <= width; x += 18) {
    const y =
      height * 0.64 +
      Math.sin(x / 58) * 14 +
      Math.cos(x / 105) * 10 -
      clamp(result.elevation / 80, 0, 55);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#e2553f";
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let x = 65; x <= width - 65; x += 26) {
    const y = height * 0.62 + Math.sin(x / 46) * 28 + Math.cos(x / 82) * 16;
    if (x === 65) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 12]);
  ctx.stroke();
  ctx.setLineDash([]);

  const runnerX = width * clamp(result.percentile, 0.12, 0.92);
  const runnerY = height * 0.62 + Math.sin(runnerX / 46) * 28 + Math.cos(runnerX / 82) * 16;
  ctx.fillStyle = "#18221d";
  ctx.beginPath();
  ctx.arc(runnerX, runnerY - 20, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(runnerX - 5, runnerY - 8, 10, 28);

  ctx.fillStyle = "#d9a441";
  ctx.fillRect(width - 88, 72, 9, 115);
  ctx.fillStyle = "#18221d";
  ctx.fillRect(width - 79, 72, 42, 28);
}

function renderCurrent() {
  const sourceRace = session?.type === "general" ? topRace() || readRace() : readRace();
  const result = calculateRace(sourceRace);
  output.score.textContent = result.total.toLocaleString("pt-PT");
  output.pace.textContent = formatPace(result.paceSeconds);
  output.percentile.textContent = `${Math.round(result.percentile * 100)}%`;
  output.difficulty.textContent = `${result.difficultyFactor.toFixed(2)}x`;
  updateBars(result);
  drawRoute(result);
}

function topRace() {
  return submissions
    .filter((race) => Number(race.seasonYear) === Number(selectedSeason))
    .map(calculateRace)
    .sort((a, b) => b.total - a.total)[0];
}

function visibleSubmissions() {
  if (session?.type === "runner") {
    return submissions.filter((item) => item.runner === session.name);
  }
  return submissions;
}

function validationLabel(race) {
  if (race.validationStatus === "approved") return "Aprovada";
  if (race.validationStatus === "rejected") return "Rejeitada";
  return "Pendente";
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(`${value}Z`).toLocaleString("pt-PT", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function rankingRows() {
  const grouped = new Map();
  submissions
    .filter((race) => Number(race.seasonYear) === Number(selectedSeason))
    .map(calculateRace)
    .filter((race) => race.validationStatus !== "rejected")
    .forEach((race) => {
    if (!grouped.has(race.runner)) grouped.set(race.runner, []);
    grouped.get(race.runner).push(race);
    });

  return Array.from(grouped, ([runner, races]) => {
    const sorted = races.sort((a, b) => b.total - a.total);
    const counting = sorted.slice(0, 6);
    const score = counting.reduce((sum, race) => sum + race.total, 0);
    const average = counting.length ? score / counting.length : 0;
    const best = counting[0]?.total || 0;
    const validatedCount = races.filter((race) => race.validationStatus === "approved").length;
    const percentileAverage = counting.length
      ? counting.reduce((sum, race) => sum + race.percentile, 0) / counting.length
      : 0;

    return {
      runner,
      score,
      average,
      best,
      validatedCount,
      percentileAverage,
      totalRaces: races.length,
      countingRaces: counting.length,
      eligible: validatedCount >= 3,
    };
  }).sort((a, b) => {
    return (
      b.score - a.score ||
      b.average - a.average ||
      b.best - a.best ||
      b.validatedCount - a.validatedCount ||
      b.percentileAverage - a.percentileAverage
    );
  });
}

function seasonRacesForRunner(runner) {
  return submissions
    .filter((race) => race.runner === runner)
    .filter((race) => Number(race.seasonYear) === Number(selectedSeason))
    .map(calculateRace)
    .sort((a, b) => b.total - a.total);
}

function renderTopThree(rows) {
  const podium = rows.slice(0, 3);
  topThree.innerHTML = podium.length
    ? podium
        .map(
          (row, index) => `
            <button type="button" class="podium-item" data-athlete="${escapeHtml(row.runner)}">
              <span>#${index + 1}</span>
              <strong>${escapeHtml(row.runner)}</strong>
              <em>${Math.round(row.score)} pts</em>
            </button>
          `
        )
        .join("")
    : `<div class="podium-item empty-state"><strong>Sem ranking nesta época</strong></div>`;
}

function renderAthleteProfile(runner) {
  if (!runner) {
    athleteProfile.classList.add("hidden");
    athleteProfile.innerHTML = "";
    return;
  }

  const races = seasonRacesForRunner(runner);
  const eligibleRaces = races.filter((race) => race.validationStatus !== "rejected");
  const counting = eligibleRaces.slice(0, 6);
  const outside = eligibleRaces.slice(6);
  const rejected = races.filter((race) => race.validationStatus === "rejected");
  const score = counting.reduce((sum, race) => sum + race.total, 0);
  const approved = races.filter((race) => race.validationStatus === "approved").length;

  athleteProfile.classList.remove("hidden");
  athleteProfile.innerHTML = `
    <div class="section-title">
      <div>
        <p class="eyebrow">Perfil do atleta</p>
        <h2>${escapeHtml(runner)}</h2>
      </div>
      <span>${selectedSeason}</span>
    </div>
    <div class="profile-stats">
      <div><span>Total da época</span><strong>${Math.round(score)}</strong></div>
      <div><span>Provas a contar</span><strong>${counting.length}/6</strong></div>
      <div><span>Aprovadas</span><strong>${approved}/3</strong></div>
      <div><span>Elegibilidade</span><strong>${approved >= 3 ? "Elegível" : "Pendente"}</strong></div>
    </div>
    <div class="profile-columns">
      <div>
        <h3>Contam para o ranking</h3>
        ${renderProfileRaceList(counting)}
      </div>
      <div>
        <h3>Fora das 6 melhores</h3>
        ${renderProfileRaceList(outside)}
        <h3>Rejeitadas</h3>
        ${renderProfileRaceList(rejected)}
      </div>
    </div>
  `;
}

function renderProfileRaceList(races) {
  return races.length
    ? `<div class="profile-race-list">${races
        .map(
          (race) => `
            <article>
              <strong>${escapeHtml(race.raceName)}</strong>
              <span>${race.distanceKm.toFixed(race.distanceKm % 1 ? 1 : 0)} km · ${formatPace(race.paceSeconds)} · ${validationLabel(race)}</span>
              <em>${race.total} pts</em>
            </article>
          `
        )
        .join("")}</div>`
    : `<p class="form-note">Sem provas nesta categoria.</p>`;
}

function renderRanking() {
  const rows = rankingRows();
  renderTopThree(rows);
  output.submissionsTitle.textContent = "Ranking da época";
  output.submissionCount.textContent = `${rows.length} ${rows.length === 1 ? "atleta" : "atletas"}`;
  output.submissionsList.innerHTML = rows.length
    ? rows
        .map(
          (row, index) => `
            <button class="submission-item ranking-button" type="button" data-athlete="${escapeHtml(row.runner)}">
              <div class="submission-title">
                <strong>${index + 1}. ${escapeHtml(row.runner)}</strong>
                <span>${row.countingRaces}/6 provas a contar · ${row.totalRaces} ${row.totalRaces === 1 ? "prova submetida" : "provas submetidas"}</span>
                <span class="submission-meta">${row.eligible ? "Elegível" : "Ainda não elegível"} · ${row.validatedCount}/3 provas aprovadas · média ${Math.round(row.average)} pts</span>
              </div>
              <div class="submission-score">${Math.round(row.score)}</div>
            </button>
          `
        )
        .join("")
    : `<article class="submission-item empty-state"><strong>Sem atletas com provas</strong></article>`;
  if (!rows.some((row) => row.runner === selectedAthlete)) selectedAthlete = rows[0]?.runner || null;
  renderAthleteProfile(selectedAthlete);
}

function renderRaceHistory() {
  const scored = visibleSubmissions().map(calculateRace).sort((a, b) => b.total - a.total);
  topThree.innerHTML = "";
  renderAthleteProfile(null);
  output.submissionsTitle.textContent = session?.type === "runner" ? "Histórico individual" : "Submissões recentes";
  output.submissionCount.textContent = `${scored.length} ${scored.length === 1 ? "prova" : "provas"}`;
  output.submissionsList.innerHTML = scored.length
    ? scored
        .map(
          (item, index) => `
            <article class="submission-item">
              <div class="submission-title">
                <strong>${index + 1}. ${escapeHtml(item.runner)}</strong>
                <span>${escapeHtml(item.raceName)} · ${item.distanceKm.toFixed(item.distanceKm % 1 ? 1 : 0)} km · ${formatPace(item.paceSeconds)}</span>
                <span class="submission-meta">${item.safeRank}/${item.finishers} classificados · ${Math.round(item.elevation)} m D+ · ${validationLabel(item)}</span>
              </div>
              <div class="submission-score">${item.total}</div>
            </article>
          `
        )
        .join("")
    : `<article class="submission-item empty-state"><strong>Sem provas submetidas</strong></article>`;
}

function renderSeasonFilter() {
  const seasons = Array.from(
    new Set([currentYear, ...submissions.map((race) => Number(race.seasonYear) || currentYear)])
  ).sort((a, b) => b - a);
  if (!seasons.includes(Number(selectedSeason))) selectedSeason = seasons[0] || currentYear;
  seasonFilter.replaceChildren(
    ...seasons.map((season) => {
      const option = document.createElement("option");
      option.value = season;
      option.textContent = season;
      return option;
    })
  );
  seasonFilter.value = selectedSeason;
}

function renderPendingValidations() {
  if (!pendingValidations) return;
  const query = validationSearch.value.trim().toLowerCase();
  const pending = submissions
    .map(calculateRace)
    .filter((race) => race.validationStatus === "pending")
    .filter((race) => {
      if (!query) return true;
      return `${race.runner} ${race.raceName}`.toLowerCase().includes(query);
    })
    .sort((a, b) => b.id - a.id);

  pendingValidations.innerHTML = pending.length
    ? pending
        .map(
          (race) => `
            <article class="validation-item">
              <div>
                <strong>${escapeHtml(race.runner)}</strong>
                <span>${escapeHtml(race.raceName)} · ${race.distanceKm.toFixed(race.distanceKm % 1 ? 1 : 0)} km · ${race.total} pts provisórios</span>
                <a href="${escapeHtml(race.officialUrl)}" target="_blank" rel="noreferrer">Classificação oficial</a>
              </div>
              <div class="validation-actions">
                <button type="button" data-validation-id="${race.id}" data-validation-status="approved">Aprovar</button>
                <button type="button" data-validation-id="${race.id}" data-validation-status="rejected">Rejeitar</button>
              </div>
            </article>
          `
        )
        .join("")
    : `<article class="validation-item empty-state"><strong>Sem provas pendentes</strong></article>`;
}

function renderEditSubmissionOptions() {
  const query = adminRaceSearch.value.trim().toLowerCase();
  const status = adminStatusFilter.value;
  const filtered = submissions.filter((race) => {
    const matchesStatus = status === "all" || race.validationStatus === status;
    const matchesQuery = !query || `${race.runner} ${race.raceName}`.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });
  editSubmissionSelect.replaceChildren(
    ...filtered.map((race) => {
      const option = document.createElement("option");
      option.value = race.id;
      option.textContent = `${race.runner} · ${race.raceName} · ${race.seasonYear} · ${validationLabel(race)}`;
      return option;
    })
  );
  fillEditSubmissionForm();
}

function fillEditSubmissionForm() {
  const race = submissions.find((item) => String(item.id) === String(editSubmissionSelect.value));
  const disabled = !race;
  editSubmissionForm.querySelectorAll("input, button").forEach((control) => {
    if (control.id !== "delete-submission") control.disabled = disabled;
  });
  deleteSubmissionButton.disabled = disabled;
  if (!race) return;
  editRaceName.value = race.raceName;
  editOfficialUrl.value = race.officialUrl;
  editDistance.value = race.distanceKm;
  editTotalSeconds.value = race.totalSeconds;
  editRank.value = race.rank;
  editFinishers.value = race.finishers;
  editElevation.value = race.elevation;
  editSeasonYear.value = race.seasonYear;
}

function renderSubmissions() {
  if (session?.type === "runner") {
    renderRaceHistory();
    return;
  }
  renderRanking();
}

function renderAdminStats() {
  const scored = submissions.map(calculateRace);
  const runners = new Set(submissions.map((item) => item.runner));
  const average = scored.length
    ? Math.round(scored.reduce((sum, item) => sum + item.total, 0) / scored.length)
    : 0;

  output.adminRaces.textContent = submissions.length;
  output.adminRunners.textContent = runners.size;
  output.adminAverage.textContent = average;
}

function renderProfiles(profiles) {
  runnerProfiles = profiles;
  profileSelect.replaceChildren(
    ...profiles.map((profile) => {
      const option = document.createElement("option");
      option.value = profile;
      option.textContent = profile;
      return option;
    })
  );
  if (session?.type === "runner" && profiles.includes(session.name)) {
    profileSelect.value = session.name;
  }
  renderPasswordRunnerOptions(profiles);
}

function renderPasswordRunnerOptions(profiles) {
  passwordRunner.replaceChildren(
    ...profiles.map((profile) => {
      const option = document.createElement("option");
      option.value = profile;
      option.textContent = profile;
      return option;
    })
  );
}

function renderRunnerAccounts(runners = runnerAccountRows) {
  runnerAccountRows = runners;
  runnerAccounts.innerHTML = runners.length
    ? runners
        .map(
          (runner) => `
            <article class="runner-account">
              <strong>${escapeHtml(runner.name)}</strong>
              <span>${runner.submissions} ${runner.submissions === 1 ? "prova" : "provas"}</span>
            </article>
          `
        )
        .join("")
    : `<article class="runner-account"><strong>Sem atletas</strong></article>`;
}

function renderPasswordResetRequests(requests = passwordResetRows) {
  passwordResetRows = requests;
  const pending = requests.filter((request) => request.status === "pending");
  passwordResetRequests.innerHTML = pending.length
    ? pending
        .map(
          (request) => `
            <article class="reset-request">
              <div>
                <strong>${escapeHtml(request.runner)}</strong>
                <span>Pedido em ${escapeHtml(formatDateTime(request.requestedAt))}</span>
              </div>
              <label>
                Nova password
                <input data-reset-password="${request.id}" type="password" autocomplete="new-password" />
              </label>
              <button class="primary-action compact-action" type="button" data-reset-id="${request.id}">
                <span aria-hidden="true">✓</span>
                Definir password
              </button>
            </article>
          `
        )
        .join("")
    : `<article class="reset-request empty-state"><strong>Sem pedidos pendentes</strong></article>`;
}

function renderSession() {
  const loggedIn = Boolean(session);
  loginPanel.classList.toggle("hidden", loggedIn);
  sessionPanel.classList.toggle("hidden", !loggedIn);
  form.classList.toggle("hidden", !loggedIn || session.type !== "runner");
  generalPanel.classList.toggle("hidden", !loggedIn || session.type !== "general");
  resetButton.classList.toggle("hidden", !loggedIn || session.type !== "general");

  if (!loggedIn) {
    panelTitle.textContent = "Entrar na liga";
    viewEyebrow.textContent = "Ranking público";
    viewTitle.textContent = "Ranking por pontos";
    renderSubmissions();
    renderCurrent();
    return;
  }

  const isGeneral = session.type === "general";
  panelTitle.textContent = isGeneral ? "Acesso geral" : "Submissão de prova";
  output.sessionRole.textContent = isGeneral ? "Geral" : "Corredor";
  output.sessionName.textContent = session.name;
  viewEyebrow.textContent = isGeneral ? "Gestão da liga" : "Área individual";
  viewTitle.textContent = isGeneral ? "Ranking geral por pontos" : "As minhas provas";
  fields.runner.value = isGeneral ? fields.runner.value : session.name;

  renderAdminStats();
  if (isGeneral) {
    loadRunnerAccounts();
    loadPasswordResetRequests();
    renderPendingValidations();
    renderEditSubmissionOptions();
  }
  renderSubmissions();
  renderCurrent();
}

function saveSession() {
  if (session) localStorage.setItem("runners-league-session", JSON.stringify(session));
  else localStorage.removeItem("runners-league-session");
}

async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }
  const response = await fetch(path, {
    ...options,
    headers,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erro na base de dados");
  return data;
}

async function loadDatabaseState() {
  const [{ profiles }, data] = await Promise.all([
    apiRequest("/api/profiles"),
    apiRequest("/api/submissions"),
  ]);
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderProfiles(profiles);
  renderSession();
}

async function loadRunnerAccounts() {
  if (session?.type !== "general") return;
  const data = await apiRequest("/api/runners");
  renderRunnerAccounts(data.runners);
}

async function loadPasswordResetRequests() {
  if (session?.type !== "general") return;
  const data = await apiRequest("/api/password-reset/requests");
  renderPasswordResetRequests(data.requests);
}

async function refreshSubmissions() {
  const data = await apiRequest("/api/submissions");
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderSubmissions();
  renderAdminStats();
  renderCurrent();
}

function showView(view) {
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  appPages.forEach((page) => {
    const isActive = page.id === `${view}-page`;
    page.classList.toggle("active", isActive);
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

seasonFilter.addEventListener("change", () => {
  selectedSeason = Number(seasonFilter.value);
  selectedAthlete = null;
  renderSubmissions();
  renderCurrent();
});

[output.submissionsList, topThree].forEach((container) => {
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-athlete]");
    if (!button) return;
    selectedAthlete = button.dataset.athlete;
    renderAthleteProfile(selectedAthlete);
  });
});

document.querySelectorAll("input[name='access']").forEach((input) => {
  input.addEventListener("change", () => {
    const isGeneral = getAccessMode() === "general";
    profileSelect.disabled = isGeneral;
    passwordResetRequestButton.disabled = isGeneral;
    passwordInput.value = "";
    loginMessage.textContent = "";
  });
});

passwordResetRequestButton.addEventListener("click", async () => {
  if (getAccessMode() !== "runner") {
    loginMessage.textContent = "Seleciona um perfil de corredor para pedir recuperação.";
    return;
  }
  const data = await apiRequest("/api/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ name: profileSelect.value }),
  });
  loginMessage.textContent = data.message;
});

loginButton.addEventListener("click", async () => {
  const mode = getAccessMode();
  if (!passwordInput.value) {
    passwordInput.focus();
    return;
  }
  const data = await apiRequest("/api/login", {
    method: "POST",
    body: JSON.stringify({
      type: mode,
      name: profileSelect.value,
      password: passwordInput.value,
    }),
  });
  session = data.session;
  passwordInput.value = "";
  loginMessage.textContent = "";
  saveSession();
  renderSession();
});

logoutButton.addEventListener("click", async () => {
  await apiRequest("/api/logout", { method: "POST" }).catch(() => {});
  session = null;
  saveSession();
  renderSession();
});

distanceSelect.addEventListener("change", () => {
  customDistanceWrap.classList.toggle("hidden", distanceSelect.value !== "custom");
  renderCurrent();
});

validationSearch.addEventListener("input", renderPendingValidations);
adminRaceSearch.addEventListener("input", renderEditSubmissionOptions);
adminStatusFilter.addEventListener("change", renderEditSubmissionOptions);

form.addEventListener("input", renderCurrent);
form.addEventListener("change", renderCurrent);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const race = readRace();
  if (!race.distanceKm || !race.totalSeconds || !race.officialUrl || race.rank > race.finishers) return;
  const data = await apiRequest("/api/submissions", {
    method: "POST",
    body: JSON.stringify(race),
  });
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderSubmissions();
  renderAdminStats();
  renderCurrent();
  renderPendingValidations();
});

resetButton.addEventListener("click", async () => {
  const data = await apiRequest("/api/submissions", { method: "DELETE" });
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderSubmissions();
  renderAdminStats();
  renderCurrent();
  renderPendingValidations();
});

pendingValidations.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-validation-id]");
  if (!button) return;
  const data = await apiRequest("/api/submissions/validation", {
    method: "POST",
    body: JSON.stringify({
      id: Number(button.dataset.validationId),
      status: button.dataset.validationStatus,
    }),
  });
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderSubmissions();
  renderAdminStats();
  renderCurrent();
  renderPendingValidations();
});

createRunnerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = await apiRequest("/api/runners", {
    method: "POST",
    body: JSON.stringify({
      name: newRunnerName.value,
      password: newRunnerPassword.value,
    }),
  });
  renderProfiles(data.profiles);
  renderRunnerAccounts(data.runners);
  newRunnerName.value = "";
  newRunnerPassword.value = "";
  renderAdminStats();
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = await apiRequest("/api/runners/password", {
    method: "POST",
    body: JSON.stringify({
      name: passwordRunner.value,
      password: updatedRunnerPassword.value,
    }),
  });
  renderProfiles(data.profiles);
  renderRunnerAccounts(data.runners);
  updatedRunnerPassword.value = "";
});

adminPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  adminPasswordMessage.textContent = "";
  try {
    const data = await apiRequest("/api/session/password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: currentAdminPassword.value,
        newPassword: newAdminPassword.value,
      }),
    });
    currentAdminPassword.value = "";
    newAdminPassword.value = "";
    adminPasswordMessage.textContent = data.message;
  } catch (error) {
    adminPasswordMessage.textContent = error.message;
  }
});

passwordResetRequests.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-reset-id]");
  if (!button) return;
  const input = passwordResetRequests.querySelector(`[data-reset-password="${button.dataset.resetId}"]`);
  const data = await apiRequest("/api/password-reset/resolve", {
    method: "POST",
    body: JSON.stringify({
      id: Number(button.dataset.resetId),
      password: input.value,
    }),
  });
  renderPasswordResetRequests(data.requests);
});

editSubmissionSelect.addEventListener("change", fillEditSubmissionForm);

editSubmissionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = await apiRequest("/api/submissions/update", {
    method: "POST",
    body: JSON.stringify({
      id: Number(editSubmissionSelect.value),
      raceName: editRaceName.value,
      officialUrl: editOfficialUrl.value,
      distanceKm: Number(editDistance.value),
      totalSeconds: Number(editTotalSeconds.value),
      rank: Number(editRank.value),
      finishers: Number(editFinishers.value),
      elevation: Number(editElevation.value),
      seasonYear: Number(editSeasonYear.value),
    }),
  });
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderSubmissions();
  renderAdminStats();
  renderCurrent();
  renderPendingValidations();
});

deleteSubmissionButton.addEventListener("click", async () => {
  if (!editSubmissionSelect.value) return;
  const race = submissions.find((item) => String(item.id) === String(editSubmissionSelect.value));
  if (!window.confirm(`Apagar "${race?.raceName || "esta prova"}"?`)) return;
  const data = await apiRequest("/api/submissions/delete", {
    method: "POST",
    body: JSON.stringify({ id: Number(editSubmissionSelect.value) }),
  });
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderSubmissions();
  renderAdminStats();
  renderCurrent();
  renderPendingValidations();
});

if (session?.type === "runner") fields.runner.value = session.name;
loadDatabaseState().catch((error) => {
  output.submissionsList.innerHTML = `<article class="submission-item empty-state"><strong>${error.message}</strong></article>`;
  renderSession();
});

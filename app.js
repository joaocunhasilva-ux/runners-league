const form = document.querySelector("#race-form");
const distanceSelect = document.querySelector("#distance");
const customDistanceWrap = document.querySelector("#custom-distance-wrap");
const canvas = document.querySelector("#route-canvas");
const ctx = canvas.getContext("2d");

const loginPanel = document.querySelector("#login-panel");
const signupPanel = document.querySelector("#signup-panel");
const sessionPanel = document.querySelector("#session-panel");
const generalPanel = document.querySelector("#general-panel");
const panelTitle = document.querySelector("#panel-title");
const loginButton = document.querySelector("#login-button");
const passwordResetRequestButton = document.querySelector("#password-reset-request");
const showSignupButton = document.querySelector("#show-signup");
const cancelSignupButton = document.querySelector("#cancel-signup");
const loginMessage = document.querySelector("#login-message");
const signupMessage = document.querySelector("#signup-message");
const logoutButton = document.querySelector("#logout");
const profileSelect = document.querySelector("#profile");
const passwordInput = document.querySelector("#password");
const viewEyebrow = document.querySelector("#view-eyebrow");
const viewTitle = document.querySelector("#view-title");
const resetButton = document.querySelector("#reset");
const navButtons = document.querySelectorAll("[data-view]");
const appPages = document.querySelectorAll(".app-page");
const langButtons = document.querySelectorAll("[data-lang]");
const createRunnerForm = document.querySelector("#create-runner-form");
const signupForm = document.querySelector("#signup-form");
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
const newRunnerEmail = document.querySelector("#new-runner-email");
const newRunnerPhoto = document.querySelector("#new-runner-photo");
const newRunnerCity = document.querySelector("#new-runner-city");
const newRunnerCountry = document.querySelector("#new-runner-country");
const newRunnerClub = document.querySelector("#new-runner-club");
const newRunnerBirthYear = document.querySelector("#new-runner-birth-year");
const newRunnerBio = document.querySelector("#new-runner-bio");
const newRunnerShareProfile = document.querySelector("#new-runner-share-profile");
const signupFields = {
  name: document.querySelector("#signup-name"),
  email: document.querySelector("#signup-email"),
  photoUrl: document.querySelector("#signup-photo"),
  city: document.querySelector("#signup-city"),
  country: document.querySelector("#signup-country"),
  club: document.querySelector("#signup-club"),
  birthYear: document.querySelector("#signup-birth-year"),
  bio: document.querySelector("#signup-bio"),
  shareProfile: document.querySelector("#signup-share-profile"),
  password: document.querySelector("#signup-password"),
};
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
let runnerProfileRows = [];
let runnerAccountRows = [];
let passwordResetRows = [];
let selectedAthlete = null;
let signupOpen = false;
let language = localStorage.getItem("runners-league-language") || "pt";
let session = JSON.parse(localStorage.getItem("runners-league-session") || "null");
if (session && !session.token) {
  session = null;
  localStorage.removeItem("runners-league-session");
}

const text = {
  pt: {
    athlete: "atleta",
    athletes: "atletas",
    runner: "Corredor",
    general: "Geral",
    race: "prova",
    races: "provas",
    points: "pontos",
    pts: "pts",
    officialRace: "Prova oficial",
    approved: "Aprovada",
    rejected: "Rejeitada",
    pending: "Pendente",
    rankingEmpty: "Sem ranking nesta época",
    athleteProfile: "Perfil do atleta",
    privateProfile: "Perfil privado",
    privateProfileNote: "Este atleta optou por não partilhar dados pessoais na página de entrada.",
    shareProfile: "Perfil público",
    hideProfile: "Perfil privado",
    noBio: "Sem bio pública.",
    seasonTotal: "Total da época",
    countingRaces: "Provas a contar",
    approvedShort: "Aprovadas",
    eligibility: "Elegibilidade",
    eligible: "Elegível",
    pendingShort: "Pendente",
    rankingCounting: "Contam para o ranking",
    outsideTopSix: "Fora das 6 melhores",
    rejectedPlural: "Rejeitadas",
    noCategoryRaces: "Sem provas nesta categoria.",
    seasonRanking: "Ranking da época",
    submittedRace: "prova submetida",
    submittedRaces: "provas submetidas",
    notEligible: "Ainda não elegível",
    approvedRaces: "provas aprovadas",
    average: "média",
    noAthletes: "Sem atletas com provas",
    individualHistory: "Histórico individual",
    recentSubmissions: "Submissões recentes",
    classified: "classificados",
    noSubmittedRaces: "Sem provas submetidas",
    provisionalPoints: "pts provisórios",
    officialClassification: "Classificação oficial",
    approve: "Aprovar",
    reject: "Rejeitar",
    noPendingRaces: "Sem provas pendentes",
    noRunners: "Sem atletas",
    requestAt: "Pedido em",
    newPassword: "Nova password",
    setPassword: "Definir password",
    noPendingRequests: "Sem pedidos pendentes",
    loginTitle: "Entrar na liga",
    signupTitle: "Inscrição de atleta",
    publicRanking: "Ranking público",
    pointsRanking: "Ranking por pontos",
    generalAccess: "Acesso geral",
    raceSubmission: "Submissão de prova",
    leagueManagement: "Gestão da liga",
    personalArea: "Área individual",
    generalPointsRanking: "Ranking geral por pontos",
    myRaces: "As minhas provas",
    recoverRunnerProfile: "Seleciona um perfil de corredor para pedir recuperação.",
    databaseError: "Erro na base de dados",
    deleteRaceConfirm: (raceName) => `Apagar "${raceName || "esta prova"}"?`,
  },
  en: {
    athlete: "athlete",
    athletes: "athletes",
    runner: "Runner",
    general: "General",
    race: "race",
    races: "races",
    points: "points",
    pts: "pts",
    officialRace: "Official race",
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending",
    rankingEmpty: "No ranking for this season",
    athleteProfile: "Athlete profile",
    privateProfile: "Private profile",
    privateProfileNote: "This athlete chose not to share personal data on the entry page.",
    shareProfile: "Public profile",
    hideProfile: "Private profile",
    noBio: "No public bio.",
    seasonTotal: "Season total",
    countingRaces: "Counting races",
    approvedShort: "Approved",
    eligibility: "Eligibility",
    eligible: "Eligible",
    pendingShort: "Pending",
    rankingCounting: "Counting for the ranking",
    outsideTopSix: "Outside the top 6",
    rejectedPlural: "Rejected",
    noCategoryRaces: "No races in this category.",
    seasonRanking: "Season ranking",
    submittedRace: "submitted race",
    submittedRaces: "submitted races",
    notEligible: "Not eligible yet",
    approvedRaces: "approved races",
    average: "average",
    noAthletes: "No athletes with races",
    individualHistory: "Individual history",
    recentSubmissions: "Recent submissions",
    classified: "finishers",
    noSubmittedRaces: "No submitted races",
    provisionalPoints: "provisional pts",
    officialClassification: "Official classification",
    approve: "Approve",
    reject: "Reject",
    noPendingRaces: "No pending races",
    noRunners: "No athletes",
    requestAt: "Requested at",
    newPassword: "New password",
    setPassword: "Set password",
    noPendingRequests: "No pending requests",
    loginTitle: "Enter the league",
    signupTitle: "Athlete registration",
    publicRanking: "Public ranking",
    pointsRanking: "Points ranking",
    generalAccess: "General access",
    raceSubmission: "Race submission",
    leagueManagement: "League management",
    personalArea: "Individual area",
    generalPointsRanking: "Overall points ranking",
    myRaces: "My races",
    recoverRunnerProfile: "Select a runner profile to request password recovery.",
    databaseError: "Database error",
    deleteRaceConfirm: (raceName) => `Delete "${raceName || "this race"}"?`,
  },
};

const staticText = {
  "Liga": "League",
  "Conceito e regras": "Concept and rules",
  "Acesso": "Access",
  "Corredor": "Runner",
  "Geral": "General",
  "Perfil": "Profile",
  "Password": "Password",
  "Entrar": "Enter",
  "Recuperar password": "Recover password",
  "Inscrever atleta": "Register athlete",
  "Inscrição de atleta": "Athlete registration",
  "Criar inscrição": "Create registration",
  "Voltar ao login": "Back to login",
  "Total de provas": "Total races",
  "Corredores ativos": "Active runners",
  "Média de pontos": "Average points",
  "Criar atleta": "Create athlete",
  "Inscrever atleta": "Register athlete",
  "Nome": "Name",
  "Email": "Email",
  "URL da foto": "Photo URL",
  "Cidade": "City",
  "País": "Country",
  "Clube": "Club",
  "Ano de nascimento": "Birth year",
  "Bio curta": "Short bio",
  "Mostrar perfil na página de entrada": "Show profile on the entry page",
  "Password inicial": "Initial password",
  "Alterar password de atleta": "Change athlete password",
  "Atleta": "Athlete",
  "Nova password": "New password",
  "Guardar password": "Save password",
  "Password do acesso geral": "General access password",
  "Password atual": "Current password",
  "Guardar password geral": "Save general password",
  "Recuperação de passwords": "Password recovery",
  "Atletas registados": "Registered athletes",
  "Provas pendentes": "Pending races",
  "Pesquisar": "Search",
  "Editar prova": "Edit race",
  "Estado": "Status",
  "Todos": "All",
  "Pendentes": "Pending",
  "Aprovadas": "Approved",
  "Rejeitadas": "Rejected",
  "Prova": "Race",
  "Nome da prova": "Race name",
  "Link oficial": "Official link",
  "Distância": "Distance",
  "Tempo total": "Total time",
  "Classificação": "Ranking",
  "Finalistas": "Finishers",
  "Altimetria": "Elevation",
  "Época": "Season",
  "Guardar": "Save",
  "Apagar": "Delete",
  "Prova oficial": "Official race",
  "Link da classificação oficial": "Official classification link",
  "Meia maratona": "Half marathon",
  "Maratona": "Marathon",
  "Outra": "Other",
  "Horas": "Hours",
  "Min.": "Min.",
  "Seg.": "Sec.",
  "Altimetria positiva": "Positive elevation",
  "Nível competitivo": "Competitive level",
  "Local": "Local",
  "Regional": "Regional",
  "Nacional": "National",
  "Internacional": "International",
  "Terreno": "Terrain",
  "Estrada": "Road",
  "Trail": "Trail",
  "Pista": "Track",
  "A prova fica pendente até ser aprovada pelo acesso geral.": "The race stays pending until it is approved by general access.",
  "Submeter prova": "Submit race",
  "Ranking público": "Public ranking",
  "Ranking por pontos": "Points ranking",
  "Pontuação estimada": "Estimated score",
  "pontos": "points",
  "Ritmo": "Pace",
  "Percentil": "Percentile",
  "Dificuldade": "Difficulty",
  "As 6 melhores provas de cada atleta contam para a época.": "Each athlete's best 6 races count for the season.",
  "Atletas com menos de 3 provas aprovadas aparecem no ranking, mas ainda não são elegíveis para prémios finais.": "Athletes with fewer than 3 approved races appear in the ranking, but are not yet eligible for final prizes.",
  "Resultado oficial": "Official result",
  "Performance": "Performance",
  "Bónus validação": "Validation bonus",
  "Ranking da época": "Season ranking",
  "0 atletas": "0 athletes",
  "Conceito": "Concept",
  "Uma liga justa entre provas diferentes": "A fair league across different races",
  "A Runners League transforma resultados oficiais de corrida numa pontuação comparável. O objetivo é permitir que um 10K rápido, uma meia maratona competitiva ou um trail duro possam entrar no mesmo ranking sem depender apenas da distância.": "Runners League turns official race results into comparable scores. The goal is to let a fast 10K, a competitive half marathon or a tough trail race enter the same ranking without depending only on distance.",
  "A liga dirige-se sobretudo aos atletas de mid pack: corredores que treinam com consistência, evoluem prova após prova e raramente chegam aos pódios, mas merecem ver esse trabalho reconhecido de forma objetiva.": "The league is built especially for mid-pack athletes: runners who train consistently, improve race after race and rarely reach the podium, but deserve to see that work recognised objectively.",
  "Cada corredor submete uma prova validada por classificação oficial. A app cruza o tempo, a posição, o tamanho do pelotão e a dificuldade do percurso para estimar uma pontuação final.": "Each runner submits a race validated by an official classification. The app combines time, position, field size and course difficulty to estimate a final score.",
  "Fórmula base": "Base formula",
  "350 classificação + 300 ritmo + 200 dificuldade + 100 validação + 50 participação": "350 ranking + 300 pace + 200 difficulty + 100 validation + 50 participation",
  "Submissão individual": "Individual submission",
  "Cada corredor entra no seu perfil, escolhe a prova e regista tempo, classificação, finalistas, distância, terreno e altimetria.": "Each runner enters their profile, chooses the race and records time, ranking, finishers, distance, terrain and elevation.",
  "Classificação oficial": "Official classification",
  "A posição oficial pesa na pontuação através do percentil: terminar melhor num pelotão maior vale mais.": "Official position affects the score through percentile: finishing better in a larger field is worth more.",
  "Reconhecimento mid pack": "Mid-pack recognition",
  "A liga valoriza progresso, consistência e bons resultados relativos, mesmo quando o corredor termina longe dos lugares de pódio.": "The league values progress, consistency and strong relative results, even when the runner finishes far from podium places.",
  "Performance por ritmo": "Pace performance",
  "O ritmo é comparado com referências por distância, para premiar tempos fortes sem ignorar a escala da prova.": "Pace is compared with distance benchmarks, rewarding strong times without ignoring race scale.",
  "Dificuldade da prova": "Race difficulty",
  "Altimetria, terreno, nível competitivo e número de finalistas aumentam ou reduzem o multiplicador de dificuldade.": "Elevation, terrain, competitive level and number of finishers increase or reduce the difficulty multiplier.",
  "Validação": "Validation",
  "O atleta submete o link da classificação oficial. A prova fica pendente até o acesso geral aprovar ou rejeitar.": "The athlete submits the official classification link. The race stays pending until general access approves or rejects it.",
  "Ranking geral": "Overall ranking",
  "O ranking anual soma as 6 melhores provas de cada atleta. Atletas com menos de 3 provas aprovadas aparecem como ainda não elegíveis.": "The yearly ranking adds each athlete's best 6 races. Athletes with fewer than 3 approved races appear as not yet eligible.",
  "Apoiar": "Support",
  "Paga-me um café": "Buy me a coffee",
  "Um contributo simbólico de 2€ ajuda a manter a liga online, melhorar a experiência e continuar a desenvolver novas funcionalidades.": "A symbolic 2€ contribution helps keep the league online, improve the experience and continue developing new features.",
  "Pagar por PayPal": "Pay with PayPal",
  "Patrocínios": "Sponsorships",
  "Espaço para anunciantes": "Space for advertisers",
  "Marcas locais, clubes e parceiros podem comprar quadrados na grelha de patrocinadores. Cada quadrado custa 2€ e pode formar blocos maiores.": "Local brands, clubs and partners can buy squares in the sponsor grid. Each square costs 2€ and can form larger blocks.",
  "2€ / quadrado": "2€ / square",
  "Reservar spots": "Reserve spots",
  "Componentes da pontuação": "Scoring components",
  "Fórmula oficial": "Official formula",
  "Até 350 pontos pelo percentil calculado por posição e total de finalistas.": "Up to 350 points for percentile calculated from position and total finishers.",
  "Até 300 pontos pelo ritmo por quilómetro comparado com referências por distância.": "Up to 300 points for pace per kilometre compared with distance benchmarks.",
  "Até 200 pontos, mais multiplicador por altimetria, terreno, nível competitivo e dimensão do pelotão.": "Up to 200 points, plus multiplier for elevation, terrain, competitive level and field size.",
  "Validação oficial": "Official validation",
  "100 pontos quando aprovada, 25 pontos enquanto pendente, 0 quando rejeitada. Participação aprovada ou pendente recebe 50 pontos.": "100 points when approved, 25 while pending, 0 when rejected. Approved or pending participation receives 50 points.",
};

const staticAttributes = {
  "Sessão e submissão": "Session and submission",
  "Navegação principal": "Main navigation",
  "Idioma": "Language",
  "Sair": "Logout",
  "Atleta ou prova": "Athlete or race",
  "Limpar submissões": "Clear submissions",
  "Visualização da prova": "Race visualisation",
  "Conceito e regras": "Concept and rules",
  "Apoiar a Runners League": "Support Runners League",
  "Componentes da pontuação": "Scoring components",
};

const serverText = {
  "Credenciais inválidas": "Invalid credentials",
  "Só o acesso geral pode ver pedidos de recuperação": "Only general access can view recovery requests",
  "Submissão incompleta": "Incomplete submission",
  "A classificação não pode ser superior ao número de finalistas": "Ranking cannot be higher than the number of finishers",
  "É obrigatório indicar o link da classificação oficial": "The official classification link is required",
  "Só atletas podem submeter provas": "Only athletes can submit races",
  "Só o acesso geral pode limpar submissões": "Only general access can clear submissions",
  "Só o acesso geral pode editar provas": "Only general access can edit races",
  "Submissão não encontrada": "Submission not found",
  "Só o acesso geral pode apagar provas": "Only general access can delete races",
  "Só o acesso geral pode criar atletas": "Only general access can create athletes",
  "Só o acesso geral pode alterar passwords": "Only general access can change passwords",
  "Atleta não encontrado": "Athlete not found",
  "Nome do atleta demasiado curto": "Athlete name is too short",
  "Ano de nascimento inválido": "Invalid birth year",
  "Já existe um atleta com esse nome": "An athlete with that name already exists",
  "Inscrição criada. Já podes entrar como atleta.": "Registration created. You can now log in as an athlete.",
  "Password do acesso geral atualizada.": "General access password updated.",
  "Pedido registado. O acesso geral pode agora definir uma nova password.": "Request registered. General access can now set a new password.",
  "Só o acesso geral pode resolver pedidos de recuperação": "Only general access can resolve recovery requests",
  "Pedido de recuperação não encontrado": "Recovery request not found",
  "Só o acesso geral pode validar provas": "Only general access can validate races",
  "Estado de validação inválido": "Invalid validation status",
  "Sessão inválida ou expirada": "Invalid or expired session",
  "Só o acesso geral pode ver atletas": "Only general access can view athletes",
};

const staticNodes = [];
const staticAttributeNodes = [];

function normalizeStaticValue(value) {
  return value.trim().replace(/\s+/g, " ");
}

function collectStaticText(node = document.body) {
  if (node.nodeType === Node.TEXT_NODE) {
    const original = normalizeStaticValue(node.nodeValue);
    if (original) staticNodes.push({ node, original });
    return;
  }
  if (!node.childNodes || ["SCRIPT", "STYLE"].includes(node.nodeName)) return;
  node.childNodes.forEach((child) => collectStaticText(child));
}

function collectStaticAttributes() {
  document.querySelectorAll("[placeholder], [title], [aria-label]").forEach((element) => {
    ["placeholder", "title", "aria-label"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      staticAttributeNodes.push({
        element,
        attribute,
        original: normalizeStaticValue(element.getAttribute(attribute)),
      });
    });
  });
}

function t(key, ...args) {
  const value = text[language][key] ?? text.pt[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function localizeServerMessage(message) {
  if (language === "pt") return message;
  return serverText[message] || message;
}

function translateStaticContent() {
  document.documentElement.lang = language;
  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === language);
  });
  staticNodes.forEach(({ node, original }) => {
    node.nodeValue = language === "pt" ? original : staticText[original] || original;
  });
  staticAttributeNodes.forEach(({ element, attribute, original }) => {
    element.setAttribute(attribute, language === "pt" ? original : staticAttributes[original] || original);
  });
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem("runners-league-language", language);
  translateStaticContent();
  renderSession();
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
    runner: fields.runner.value.trim() || t("runner"),
    raceName: fields.raceName.value.trim() || t("officialRace"),
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

  const sky = ctx.createLinearGradient(0, 0, width, height);
  sky.addColorStop(0, "#071a33");
  sky.addColorStop(0.48, "#0d3568");
  sky.addColorStop(1, "#0a1326");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.78, height * 0.26, 20, width * 0.78, height * 0.26, width * 0.55);
  glow.addColorStop(0, "rgba(73, 200, 255, 0.36)");
  glow.addColorStop(0.45, "rgba(31, 122, 224, 0.12)");
  glow.addColorStop(1, "rgba(31, 122, 224, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = "rgba(126, 211, 255, 0.45)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  for (let i = 0; i < 7; i += 1) {
    const y = height * (0.45 + i * 0.085);
    ctx.beginPath();
    ctx.moveTo(-80, y + 95);
    ctx.lineTo(width + 120, y - 88);
    ctx.stroke();
  }
  ctx.restore();

  const track = ctx.createLinearGradient(0, height * 0.68, width, height);
  track.addColorStop(0, "rgba(4, 18, 38, 0.84)");
  track.addColorStop(1, "rgba(13, 79, 159, 0.4)");
  ctx.fillStyle = track;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.68);
  ctx.lineTo(width, height * 0.44);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const y = height * (0.72 + i * 0.07);
    ctx.beginPath();
    ctx.moveTo(-60, y + i * 16);
    ctx.lineTo(width * 0.62, y - 80 - i * 8);
    ctx.stroke();
  }
  ctx.restore();

  const runnerProgress = clamp(result.percentile, 0.1, 0.94);
  const orbitCenterX = width * 0.58;
  const orbitCenterY = height * 0.38;
  const orbitRadius = width * 0.25;
  const orbitStart = Math.PI * 1.1;
  const orbitEnd = Math.PI * 1.92;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = 15;
  const orbitGradient = ctx.createLinearGradient(orbitCenterX - orbitRadius, orbitCenterY, orbitCenterX + orbitRadius, orbitCenterY);
  orbitGradient.addColorStop(0, "#1f7ae0");
  orbitGradient.addColorStop(1, "#7ed3ff");
  ctx.strokeStyle = orbitGradient;
  ctx.beginPath();
  ctx.arc(orbitCenterX, orbitCenterY, orbitRadius, orbitStart, orbitEnd);
  ctx.stroke();

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
  ctx.beginPath();
  ctx.arc(orbitCenterX + 18, orbitCenterY, orbitRadius + 32, orbitStart + 0.08, orbitEnd - 0.05);
  ctx.stroke();

  for (let i = 0; i < 6; i += 1) {
    const y = orbitCenterY - 76 + i * 25;
    const lineWidth = 190 - i * 18;
    ctx.strokeStyle = i % 2 ? "rgba(126, 211, 255, 0.78)" : "rgba(31, 122, 224, 0.78)";
    ctx.lineWidth = i % 2 ? 5 : 8;
    ctx.beginPath();
    ctx.moveTo(orbitCenterX - orbitRadius - 190 - i * 18, y);
    ctx.lineTo(orbitCenterX - orbitRadius - 190 + lineWidth, y);
    ctx.stroke();
  }

  const angle = orbitStart + (orbitEnd - orbitStart) * runnerProgress;
  const markerX = orbitCenterX + Math.cos(angle) * orbitRadius;
  const markerY = orbitCenterY + Math.sin(angle) * orbitRadius;
  const markerGlow = ctx.createRadialGradient(markerX, markerY, 3, markerX, markerY, 42);
  markerGlow.addColorStop(0, "rgba(255,255,255,0.92)");
  markerGlow.addColorStop(0.32, "rgba(126,211,255,0.55)");
  markerGlow.addColorStop(1, "rgba(126,211,255,0)");
  ctx.fillStyle = markerGlow;
  ctx.beginPath();
  ctx.arc(markerX, markerY, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(markerX, markerY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let x = 0; x < width; x += 44) {
    ctx.fillRect(x, height - 30, 22, 30);
  }
}

function renderCurrent() {
  const sourceRace = session?.type === "general" ? topRace() || readRace() : readRace();
  const result = calculateRace(sourceRace);
  output.score.textContent = result.total.toLocaleString(language === "pt" ? "pt-PT" : "en-GB");
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
  if (race.validationStatus === "approved") return t("approved");
  if (race.validationStatus === "rejected") return t("rejected");
  return t("pending");
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(`${value}Z`).toLocaleString(language === "pt" ? "pt-PT" : "en-GB", {
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

function runnerProfileFor(name) {
  return runnerProfileRows.find((profile) => profile.name === name) || null;
}

function runnerInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderRunnerAvatar(profile, name) {
  const safeName = escapeHtml(name);
  if (profile?.photoUrl) {
    return `<img src="${escapeHtml(profile.photoUrl)}" alt="${safeName}" loading="lazy" />`;
  }
  return `<span>${escapeHtml(runnerInitials(name))}</span>`;
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
    : `<div class="podium-item empty-state"><strong>${t("rankingEmpty")}</strong></div>`;
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
  const profile = runnerProfileFor(runner);
  const canShowProfile = Boolean(
    profile?.shareProfile || session?.type === "general" || (session?.type === "runner" && session.name === runner)
  );
  const profileMeta = profile
    ? [profile.city, profile.country, profile.club].filter(Boolean).join(" · ")
    : "";

  athleteProfile.classList.remove("hidden");
  athleteProfile.innerHTML = `
    <div class="athlete-hero">
      <div class="athlete-avatar">
        ${canShowProfile ? renderRunnerAvatar(profile, runner) : `<span>${escapeHtml(runnerInitials(runner))}</span>`}
      </div>
      <div>
        <p class="eyebrow">${canShowProfile ? t("athleteProfile") : t("privateProfile")}</p>
        <h2>${escapeHtml(runner)}</h2>
        <p>${canShowProfile ? escapeHtml(profileMeta || profile?.bio || t("noBio")) : t("privateProfileNote")}</p>
        ${
          canShowProfile && profile?.bio && profileMeta
            ? `<p>${escapeHtml(profile.bio)}</p>`
            : ""
        }
      </div>
      <span class="profile-visibility">${profile?.shareProfile ? t("shareProfile") : t("hideProfile")} · ${selectedSeason}</span>
    </div>
    <div class="profile-stats">
      <div><span>${t("seasonTotal")}</span><strong>${Math.round(score)}</strong></div>
      <div><span>${t("countingRaces")}</span><strong>${counting.length}/6</strong></div>
      <div><span>${t("approvedShort")}</span><strong>${approved}/3</strong></div>
      <div><span>${t("eligibility")}</span><strong>${approved >= 3 ? t("eligible") : t("pendingShort")}</strong></div>
    </div>
    <div class="profile-columns">
      <div>
        <h3>${t("rankingCounting")}</h3>
        ${renderProfileRaceList(counting)}
      </div>
      <div>
        <h3>${t("outsideTopSix")}</h3>
        ${renderProfileRaceList(outside)}
        <h3>${t("rejectedPlural")}</h3>
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
    : `<p class="form-note">${t("noCategoryRaces")}</p>`;
}

function renderRanking() {
  const rows = rankingRows();
  renderTopThree(rows);
  output.submissionsTitle.textContent = t("seasonRanking");
  output.submissionCount.textContent = `${rows.length} ${rows.length === 1 ? t("athlete") : t("athletes")}`;
  output.submissionsList.innerHTML = rows.length
    ? rows
        .map(
          (row, index) => `
            <button class="submission-item ranking-button" type="button" data-athlete="${escapeHtml(row.runner)}">
              <div class="submission-title">
                <strong>${index + 1}. ${escapeHtml(row.runner)}</strong>
                <span>${row.countingRaces}/6 ${t("countingRaces").toLowerCase()} · ${row.totalRaces} ${row.totalRaces === 1 ? t("submittedRace") : t("submittedRaces")}</span>
                <span class="submission-meta">${row.eligible ? t("eligible") : t("notEligible")} · ${row.validatedCount}/3 ${t("approvedRaces")} · ${t("average")} ${Math.round(row.average)} ${t("pts")}</span>
              </div>
              <div class="submission-score">${Math.round(row.score)}</div>
            </button>
          `
        )
        .join("")
    : `<article class="submission-item empty-state"><strong>${t("noAthletes")}</strong></article>`;
  if (!rows.some((row) => row.runner === selectedAthlete)) selectedAthlete = rows[0]?.runner || null;
  renderAthleteProfile(selectedAthlete);
}

function renderRaceHistory() {
  const scored = visibleSubmissions().map(calculateRace).sort((a, b) => b.total - a.total);
  topThree.innerHTML = "";
  renderAthleteProfile(null);
  output.submissionsTitle.textContent = session?.type === "runner" ? t("individualHistory") : t("recentSubmissions");
  output.submissionCount.textContent = `${scored.length} ${scored.length === 1 ? t("race") : t("races")}`;
  output.submissionsList.innerHTML = scored.length
    ? scored
        .map(
          (item, index) => `
            <article class="submission-item">
              <div class="submission-title">
                <strong>${index + 1}. ${escapeHtml(item.runner)}</strong>
                <span>${escapeHtml(item.raceName)} · ${item.distanceKm.toFixed(item.distanceKm % 1 ? 1 : 0)} km · ${formatPace(item.paceSeconds)}</span>
                <span class="submission-meta">${item.safeRank}/${item.finishers} ${t("classified")} · ${Math.round(item.elevation)} m D+ · ${validationLabel(item)}</span>
              </div>
              <div class="submission-score">${item.total}</div>
            </article>
          `
        )
        .join("")
    : `<article class="submission-item empty-state"><strong>${t("noSubmittedRaces")}</strong></article>`;
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
                <span>${escapeHtml(race.raceName)} · ${race.distanceKm.toFixed(race.distanceKm % 1 ? 1 : 0)} km · ${race.total} ${t("provisionalPoints")}</span>
                <a href="${escapeHtml(race.officialUrl)}" target="_blank" rel="noreferrer">${t("officialClassification")}</a>
              </div>
              <div class="validation-actions">
                <button type="button" data-validation-id="${race.id}" data-validation-status="approved">${t("approve")}</button>
                <button type="button" data-validation-id="${race.id}" data-validation-status="rejected">${t("reject")}</button>
              </div>
            </article>
          `
        )
        .join("")
    : `<article class="validation-item empty-state"><strong>${t("noPendingRaces")}</strong></article>`;
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

function renderProfiles(profiles, profilesPayload = runnerProfileRows) {
  runnerProfiles = profiles;
  runnerProfileRows = profilesPayload;
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
            <article class="runner-account runner-account-card">
              <div class="runner-account-photo">
                ${renderRunnerAvatar(runner, runner.name)}
              </div>
              <div>
                <strong>${escapeHtml(runner.name)}</strong>
                <span>${[runner.city, runner.country, runner.club].filter(Boolean).map(escapeHtml).join(" · ") || t("noBio")}</span>
                <span>${runner.submissions} ${runner.submissions === 1 ? t("race") : t("races")} · ${runner.shareProfile ? t("shareProfile") : t("hideProfile")}</span>
              </div>
            </article>
          `
        )
        .join("")
    : `<article class="runner-account"><strong>${t("noRunners")}</strong></article>`;
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
                <span>${t("requestAt")} ${escapeHtml(formatDateTime(request.requestedAt))}</span>
              </div>
              <label>
                ${t("newPassword")}
                <input data-reset-password="${request.id}" type="password" autocomplete="new-password" />
              </label>
              <button class="primary-action compact-action" type="button" data-reset-id="${request.id}">
                <span aria-hidden="true">✓</span>
                ${t("setPassword")}
              </button>
            </article>
          `
        )
        .join("")
    : `<article class="reset-request empty-state"><strong>${t("noPendingRequests")}</strong></article>`;
}

function renderSession() {
  const loggedIn = Boolean(session);
  loginPanel.classList.toggle("hidden", loggedIn || signupOpen);
  signupPanel.classList.toggle("hidden", loggedIn || !signupOpen);
  sessionPanel.classList.toggle("hidden", !loggedIn);
  form.classList.toggle("hidden", !loggedIn || session.type !== "runner");
  generalPanel.classList.toggle("hidden", !loggedIn || session.type !== "general");
  resetButton.classList.toggle("hidden", !loggedIn || session.type !== "general");

  if (!loggedIn) {
    panelTitle.textContent = signupOpen ? t("signupTitle") : t("loginTitle");
    viewEyebrow.textContent = t("publicRanking");
    viewTitle.textContent = t("pointsRanking");
    renderSubmissions();
    renderCurrent();
    return;
  }

  const isGeneral = session.type === "general";
  panelTitle.textContent = isGeneral ? t("generalAccess") : t("raceSubmission");
  output.sessionRole.textContent = isGeneral ? t("general") : t("runner");
  output.sessionName.textContent = session.name;
  viewEyebrow.textContent = isGeneral ? t("leagueManagement") : t("personalArea");
  viewTitle.textContent = isGeneral ? t("generalPointsRanking") : t("myRaces");
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
  if (data.message) data.message = localizeServerMessage(data.message);
  if (!response.ok) throw new Error(localizeServerMessage(data.error) || t("databaseError"));
  return data;
}

async function loadDatabaseState() {
  const [{ profiles, runnerProfiles: profileRows = [] }, data] = await Promise.all([
    apiRequest("/api/profiles"),
    apiRequest("/api/submissions"),
  ]);
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderProfiles(profiles, profileRows);
  renderSession();
}

async function loadRunnerAccounts() {
  if (session?.type !== "general") return;
  const data = await apiRequest("/api/runners");
  runnerProfileRows = data.runners;
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

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

showSignupButton.addEventListener("click", () => {
  signupOpen = true;
  loginMessage.textContent = "";
  renderSession();
});

cancelSignupButton.addEventListener("click", () => {
  signupOpen = false;
  signupMessage.textContent = "";
  renderSession();
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
    loginMessage.textContent = t("recoverRunnerProfile");
    return;
  }
  const data = await apiRequest("/api/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ name: profileSelect.value }),
  });
  loginMessage.textContent = data.message;
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupMessage.textContent = "";
  try {
    const data = await apiRequest("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: signupFields.name.value,
        email: signupFields.email.value,
        photoUrl: signupFields.photoUrl.value,
        city: signupFields.city.value,
        country: signupFields.country.value,
        club: signupFields.club.value,
        birthYear: signupFields.birthYear.value,
        bio: signupFields.bio.value,
        shareProfile: signupFields.shareProfile.checked,
        password: signupFields.password.value,
      }),
    });
    renderProfiles(data.profiles, data.runnerProfiles);
    profileSelect.value = signupFields.name.value.trim();
    signupForm.reset();
    signupFields.shareProfile.checked = true;
    signupOpen = false;
    loginMessage.textContent = data.message;
    renderSession();
  } catch (error) {
    signupMessage.textContent = error.message;
  }
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
      email: newRunnerEmail.value,
      photoUrl: newRunnerPhoto.value,
      city: newRunnerCity.value,
      country: newRunnerCountry.value,
      club: newRunnerClub.value,
      birthYear: newRunnerBirthYear.value,
      bio: newRunnerBio.value,
      shareProfile: newRunnerShareProfile.checked,
      password: newRunnerPassword.value,
    }),
  });
  renderProfiles(data.profiles, data.runnerProfiles);
  renderRunnerAccounts(data.runners);
  newRunnerName.value = "";
  newRunnerEmail.value = "";
  newRunnerPhoto.value = "";
  newRunnerCity.value = "";
  newRunnerCountry.value = "";
  newRunnerClub.value = "";
  newRunnerBirthYear.value = "";
  newRunnerBio.value = "";
  newRunnerShareProfile.checked = true;
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
  if (!window.confirm(t("deleteRaceConfirm", race?.raceName))) return;
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

collectStaticText();
collectStaticAttributes();
translateStaticContent();

if (session?.type === "runner") fields.runner.value = session.name;
loadDatabaseState().catch((error) => {
  output.submissionsList.innerHTML = `<article class="submission-item empty-state"><strong>${error.message}</strong></article>`;
  renderSession();
});

const form = document.querySelector("#race-form");
const distanceSelect = document.querySelector("#distance");
const customDistanceWrap = document.querySelector("#custom-distance-wrap");
const canvas = document.querySelector("#route-canvas");
const ctx = canvas.getContext("2d");

const workspace = document.querySelector(".workspace");
const loginPanel = document.querySelector("#login-panel");
const signupPanel = document.querySelector("#signup-panel");
const sessionPanel = document.querySelector("#session-panel");
const generalPanel = document.querySelector("#general-panel");
const panelTitle = document.querySelector("#panel-title");
const loginButton = document.querySelector("#login-button");
const passwordResetRequestButton = document.querySelector("#password-reset-request");
const showSignupButton = document.querySelector("#show-signup");
const cancelSignupButton = document.querySelector("#cancel-signup");
const heroStartButton = document.querySelector("#hero-start");
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
const themeButtons = document.querySelectorAll("[data-theme]");
const profileNavButton = document.querySelector("#profile-nav");
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
const runnerAccountSearch = document.querySelector("#runner-account-search");
const runnerAccountsCount = document.querySelector("#runner-accounts-count");
const runnerAccountsStatus = document.querySelector("#runner-accounts-status");
const newRunnerEmail = document.querySelector("#new-runner-email");
const newRunnerPhoto = document.querySelector("#new-runner-photo");
const newRunnerPhotoFile = document.querySelector("#new-runner-photo-file");
const newRunnerPhotoPreview = document.querySelector("#new-runner-photo-preview");
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
  photoFile: document.querySelector("#signup-photo-file"),
  photoPreview: document.querySelector("#signup-photo-preview"),
  city: document.querySelector("#signup-city"),
  country: document.querySelector("#signup-country"),
  club: document.querySelector("#signup-club"),
  birthYear: document.querySelector("#signup-birth-year"),
  bio: document.querySelector("#signup-bio"),
  shareProfile: document.querySelector("#signup-share-profile"),
  password: document.querySelector("#signup-password"),
};
const pendingValidations = document.querySelector("#pending-validations");
const profileForm = document.querySelector("#profile-form");
const profileManagementSummary = document.querySelector("#profile-management-summary");
const profileRaceList = document.querySelector("#profile-race-list");
const profileRaceCount = document.querySelector("#profile-race-count");
const profileMessage = document.querySelector("#profile-message");
const cancelProfileEdit = document.querySelector("#cancel-profile-edit");
const messageForm = document.querySelector("#message-form");
const messageRecipient = document.querySelector("#message-recipient");
const messageSubject = document.querySelector("#message-subject");
const messageBody = document.querySelector("#message-body");
const messageStatus = document.querySelector("#message-status");
const messageList = document.querySelector("#message-list");
const adminMessageForm = document.querySelector("#admin-message-form");
const adminMessageRecipient = document.querySelector("#admin-message-recipient");
const adminMessageSubject = document.querySelector("#admin-message-subject");
const adminMessageBody = document.querySelector("#admin-message-body");
const adminMessageStatus = document.querySelector("#admin-message-status");
const adminMessageList = document.querySelector("#admin-message-list");
const messageBadge = document.querySelector("#message-badge");
const adminMessageBadge = document.querySelector("#admin-message-badge");
const markMessagesReadButton = document.querySelector("#mark-messages-read");
const adminMarkMessagesReadButton = document.querySelector("#admin-mark-messages-read");
const sendNewsletterButton = document.querySelector("#send-newsletter");
const newsletterStatus = document.querySelector("#newsletter-status");
const mbwayAction = document.querySelector("#mbway-action");
const profileFields = {
  name: document.querySelector("#profile-name"),
  email: document.querySelector("#profile-email"),
  photoUrl: document.querySelector("#profile-photo"),
  photoFile: document.querySelector("#profile-photo-file"),
  photoPreview: document.querySelector("#profile-photo-preview"),
  city: document.querySelector("#profile-city"),
  country: document.querySelector("#profile-country"),
  club: document.querySelector("#profile-club"),
  birthYear: document.querySelector("#profile-birth-year"),
  bio: document.querySelector("#profile-bio"),
  shareProfile: document.querySelector("#profile-share-profile"),
};
const seasonFilter = document.querySelector("#season-filter");
const editSubmissionForm = document.querySelector("#edit-submission-form");
const editSubmissionSelect = document.querySelector("#edit-submission-select");
const editRaceName = document.querySelector("#edit-race-name");
const editOfficialUrl = document.querySelector("#edit-official-url");
const editProofImage = document.querySelector("#edit-proof-image");
const editProofImageFile = document.querySelector("#edit-proof-image-file");
const editProofImagePreview = document.querySelector("#edit-proof-image-preview");
const editProofImageStatus = document.querySelector("#edit-proof-image-status");
const editDistance = document.querySelector("#edit-distance");
const editTotalSeconds = document.querySelector("#edit-total-seconds");
const editRank = document.querySelector("#edit-rank");
const editFinishers = document.querySelector("#edit-finishers");
const editElevation = document.querySelector("#edit-elevation");
const editSeasonYear = document.querySelector("#edit-season-year");
const deleteSubmissionButton = document.querySelector("#delete-submission");
const topThree = document.querySelector("#top-three");
const athleteProfile = document.querySelector("#athlete-profile");
const registeredAthletes = document.querySelector("#registered-athletes");
const validationSearch = document.querySelector("#validation-search");
const adminRaceSearch = document.querySelector("#admin-race-search");
const adminStatusFilter = document.querySelector("#admin-status-filter");

const fields = {
  runner: document.querySelector("#runner"),
  raceName: document.querySelector("#race-name"),
  officialUrl: document.querySelector("#official-url"),
  proofImage: document.querySelector("#proof-image"),
  proofImageFile: document.querySelector("#proof-image-file"),
  proofImagePreview: document.querySelector("#proof-image-preview"),
  proofImageStatus: document.querySelector("#proof-image-status"),
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
let currentRunnerProfile = null;
let runnerAccountRows = [];
let passwordResetRows = [];
let messageRows = [];
let messageRecipients = [];
let unreadMessageCount = 0;
let selectedAthlete = null;
let signupOpen = false;
let profileEditOpen = false;
let editingRaceId = null;
let language = localStorage.getItem("runners-league-language") || "pt";
let theme = localStorage.getItem("runners-league-theme") || "auto";
const systemTheme = window.matchMedia?.("(prefers-color-scheme: light)");
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
    openProfile: "Abrir perfil",
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
    noResults: "Sem resultados",
    requestAt: "Pedido em",
    newPassword: "Nova password",
    setPassword: "Definir password",
    noPendingRequests: "Sem pedidos pendentes",
    loginTitle: "Entrar na liga",
    signupTitle: "Inscrição de atleta",
    signupServerNotReady:
      "A página de inscrição já foi atualizada, mas o servidor ainda não foi recarregado. Faz Reload no PythonAnywhere e tenta novamente.",
    serverRequired:
      "Esta ação precisa do servidor. Abre a página por http://127.0.0.1:4173/ ou usa a versão PythonAnywhere, não o ficheiro local.",
    publicRanking: "Ranking público",
    pointsRanking: "Ranking por pontos",
    generalAccess: "Acesso geral",
    raceSubmission: "Submissão de prova",
    leagueManagement: "Gestão da liga",
    personalArea: "Área individual",
    athleteManagement: "Gestão de atleta",
    personalData: "Dados pessoais",
    editProfile: "Editar perfil",
    closeEdit: "Fechar edição",
    leaguePlace: "Lugar na liga",
    saveData: "Guardar dados",
    submittedRacesTitle: "Provas submetidas",
    noProfileLoaded: "Perfil ainda não carregado.",
    messagesTitle: "Mensagens",
    inbox: "Caixa de entrada",
    recipient: "Destinatário",
    subject: "Assunto",
    messageText: "Mensagem",
    sendMessage: "Enviar mensagem",
    noMessages: "Sem mensagens.",
    unreadMessages: "mensagens novas",
    markRead: "Marcar como lidas",
    photoTooLarge: "A imagem é demasiado grande. Usa uma foto com menos de 900 KB.",
    invalidPhoto: "Escolhe um ficheiro de imagem válido.",
    newsletterSent: "Newsletter enviada.",
    mbwayCopied: "Número MB WAY copiado. Abre a app e envia 2€.",
    mbwayOpen: "Abrir MB WAY",
    sent: "Enviada",
    received: "Recebida",
    system: "Sistema",
    shareRace: "Partilhar",
    shareInstagram: "Instagram",
    shareFacebook: "Facebook",
    shareX: "X",
    viewProof: "Ver comprovativo",
    instagramCopied: "Legenda copiada. Cola-a no Instagram.",
    shareCopied: "Texto de partilha copiado.",
    deleteRunner: "Eliminar",
    deleteRunnerConfirm: (runnerName) =>
      `Eliminar "${runnerName}"? Isto apaga o atleta, acesso, mensagens e provas submetidas.`,
    runnerDeleted: "Atleta eliminado.",
    generalPointsRanking: "Ranking geral por pontos",
    myRaces: "As minhas provas",
    recoverRunnerProfile: "Seleciona um perfil de corredor para pedir recuperação.",
    databaseError: "Erro na base de dados",
    deleteRaceConfirm: (raceName) => `Apagar "${raceName || "esta prova"}"?`,
    submitRace: "Submeter prova",
    editRace: "Editar prova",
    saveRaceCorrection: "Guardar correção",
    raceCorrectionSent: "Correção enviada. A prova voltou a ficar pendente para validação.",
    editingRaceHelp: "Edita os dados da prova e guarda a correção.",
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
    openProfile: "Open profile",
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
    noResults: "No results",
    requestAt: "Requested at",
    newPassword: "New password",
    setPassword: "Set password",
    noPendingRequests: "No pending requests",
    loginTitle: "Enter the league",
    signupTitle: "Athlete registration",
    signupServerNotReady:
      "The registration page has been updated, but the server has not been reloaded yet. Reload the PythonAnywhere web app and try again.",
    serverRequired:
      "This action needs the server. Open the page through http://127.0.0.1:4173/ or use the PythonAnywhere version, not the local file.",
    publicRanking: "Public ranking",
    pointsRanking: "Points ranking",
    generalAccess: "General access",
    raceSubmission: "Race submission",
    leagueManagement: "League management",
    personalArea: "Individual area",
    athleteManagement: "Athlete management",
    personalData: "Personal data",
    editProfile: "Edit profile",
    closeEdit: "Close edit",
    leaguePlace: "League place",
    saveData: "Save data",
    submittedRacesTitle: "Submitted races",
    noProfileLoaded: "Profile not loaded yet.",
    messagesTitle: "Messages",
    inbox: "Inbox",
    recipient: "Recipient",
    subject: "Subject",
    messageText: "Message",
    sendMessage: "Send message",
    noMessages: "No messages.",
    unreadMessages: "new messages",
    markRead: "Mark as read",
    photoTooLarge: "The image is too large. Use a photo under 900 KB.",
    invalidPhoto: "Choose a valid image file.",
    newsletterSent: "Newsletter sent.",
    mbwayCopied: "MB WAY number copied. Open the app and send 2€.",
    mbwayOpen: "Open MB WAY",
    sent: "Sent",
    received: "Received",
    system: "System",
    shareRace: "Share",
    shareInstagram: "Instagram",
    shareFacebook: "Facebook",
    shareX: "X",
    viewProof: "View proof",
    instagramCopied: "Caption copied. Paste it on Instagram.",
    shareCopied: "Share text copied.",
    deleteRunner: "Delete",
    deleteRunnerConfirm: (runnerName) =>
      `Delete "${runnerName}"? This removes the athlete, access, messages and submitted races.`,
    runnerDeleted: "Athlete deleted.",
    generalPointsRanking: "Overall points ranking",
    myRaces: "My races",
    recoverRunnerProfile: "Select a runner profile to request password recovery.",
    databaseError: "Database error",
    deleteRaceConfirm: (raceName) => `Delete "${raceName || "this race"}"?`,
    submitRace: "Submit race",
    editRace: "Edit race",
    saveRaceCorrection: "Save correction",
    raceCorrectionSent: "Correction sent. The race is pending validation again.",
    editingRaceHelp: "Edit the race details and save the correction.",
  },
};

const staticText = {
  "Liga": "League",
  "Conceito e regras": "Concept and rules",
  "Meu perfil": "My profile",
  "Patrocinadores": "Sponsors",
  "Acesso": "Access",
  "Corredor": "Runner",
  "Geral": "General",
  "Perfil": "Profile",
  "Password": "Password",
  "Entrar": "Enter",
  "Recuperar password": "Recover password",
  "Inscrever atleta": "Register athlete",
  "Área individual": "Individual area",
  "Gestão de atleta": "Athlete management",
  "Dados pessoais": "Personal data",
  "Editar perfil": "Edit profile",
  "Fechar edição": "Close edit",
  "Guardar dados": "Save data",
  "Provas submetidas": "Submitted races",
  "Mensagens": "Messages",
  "Chat da liga": "League chat",
  "Auto": "Auto",
  "Noite": "Night",
  "Dia": "Day",
  "Caixa de entrada": "Inbox",
  "Destinatário": "Recipient",
  "Assunto": "Subject",
  "Mensagem": "Message",
  "Enviar mensagem": "Send message",
  "Marcar como lidas": "Mark as read",
  "Newsletter mensal": "Monthly newsletter",
  "Envia o resumo do mês para a caixa de mensagens dos atletas. Se o email estiver configurado no servidor, envia também por email.":
    "Sends the monthly summary to athletes' message inboxes. If email is configured on the server, it also sends by email.",
  "Enviar newsletter do mês": "Send monthly newsletter",
  "0 provas": "0 races",
  "Inscrição de atleta": "Athlete registration",
  "Criar inscrição": "Create registration",
  "Voltar ao login": "Back to login",
  "Total de provas": "Total races",
  "Corredores ativos": "Active runners",
  "Média de pontos": "Average points",
  "Gestão da liga": "League management",
  "Painel geral": "General dashboard",
  "Validações, atletas e mensagens num só lugar.": "Validations, athletes and messages in one place.",
  "Ações urgentes": "Urgent actions",
  "Provas por validar": "Races to validate",
  "Atletas": "Athletes",
  "Inscritos e acessos": "Registrations and access",
  "Comunicação": "Communication",
  "Mensagens e newsletter": "Messages and newsletter",
  "Configuração": "Configuration",
  "Provas e passwords": "Races and passwords",
  "Runners League": "Runners League",
  "Corra. Supere. Pertença.": "Run. Rise. Belong.",
  "A Runners League transforma provas oficiais numa liga simples, competitiva e motivadora para corredores reais.":
    "Runners League turns official race results into a simple, competitive and motivating league for real runners.",
  "Entrar na liga": "Enter the league",
  "Como funciona": "How it works",
  "Destaques da liga": "League highlights",
  "Comunidade": "Community",
  "Atletas inscritos": "Registered athletes",
  "Perfis públicos": "Public profiles",
  "Abrir perfil": "Open profile",
  "Privado": "Private",
  "Submeta provas": "Submit races",
  "Registe resultados oficiais e acompanhe a evolução.": "Log official results and track your progress.",
  "Ranking justo": "Fair ranking",
  "Compare distâncias, ritmos, terreno e classificação.": "Compare distances, paces, terrain and ranking.",
  "Validação oficial": "Official validation",
  "O admin aprova provas e comunica com atletas.": "Admin approves races and communicates with athletes.",
  "Partilha social": "Social sharing",
  "Mostre cada resultado e lugar relativo na liga.": "Show each result and relative league position.",
  "Criar atleta": "Create athlete",
  "Gestão de inscritos": "Registered athlete management",
  "Pesquisa, confirma dados públicos e remove atletas quando necessário.": "Search, check public data and remove athletes when needed.",
  "Pesquisar atleta": "Search athlete",
  "Nome, cidade, clube ou email": "Name, city, club or email",
  "Inscrever atleta": "Register athlete",
  "Nome": "Name",
  "Email": "Email",
  "URL da foto": "Photo URL",
  "URL da foto ou ficheiro": "Photo URL or file",
  "Escolher foto": "Choose photo",
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
  "Imagem do resultado ou diploma": "Result or race diploma image",
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
  "Ver comprovativo": "View proof",
  "Ranking público": "Public ranking",
  "Ranking por pontos": "Points ranking",
  "Pontuação estimada": "Estimated score",
  "pontos": "points",
  "Ritmo": "Pace",
  "Percentil": "Percentile",
  "Dificuldade": "Difficulty",
  "Cálculo da prova": "Race calculation",
  "Como a pontuação é calculada": "How the score is calculated",
  "Atualiza ao preencher a prova": "Updates while filling the race",
  "Ritmo médio": "Average pace",
  "Mostra a velocidade por quilómetro e ajuda a comparar distâncias diferentes.": "Shows speed per kilometre and helps compare different distances.",
  "Resultado relativo": "Relative result",
  "Indica a percentagem de participantes que ficaram atrás nesta classificação.": "Shows the percentage of participants who finished behind this result.",
  "Multiplicador da prova": "Race multiplier",
  "Ajusta a pontuação pela dureza do percurso, terreno e nível competitivo.": "Adjusts the score by course difficulty, terrain and competitive level.",
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
  "Parceiros": "Partners",
  "Patrocinadores e apoio à liga": "Sponsors and league support",
  "2€ por quadrado": "2€ per square",
  "Uma montra simples para marcas que correm connosco.": "A simple showcase for brands running with us.",
  "Cada quadrado é um pequeno spot de presença. Marcas, clubes e parceiros podem comprar um bloco simples ou juntar vários quadrados para criar mais destaque.":
    "Each square is a small presence spot. Brands, clubs and partners can buy a simple block or combine several squares for more visibility.",
  "Espaço para anunciantes": "Space for advertisers",
  "Marcas locais, clubes e parceiros podem comprar quadrados na grelha de patrocinadores. Cada quadrado custa 2€ e pode formar blocos maiores.": "Local brands, clubs and partners can buy squares in the sponsor grid. Each square costs 2€ and can form larger blocks.",
  "Formato": "Format",
  "Spots para anunciantes": "Advertiser spots",
  "Compra por quadrado, combina blocos e cria destaque visual. Ideal para negócios locais, equipas, provas e marcas ligadas ao desporto.":
    "Buy by the square, combine blocks and create visual prominence. Ideal for local businesses, teams, races and sport-related brands.",
  "2€ / quadrado": "2€ / square",
  "Reservar spots": "Reserve spots",
  "Pedir informação": "Ask for info",
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
  "Tema": "Theme",
  "Destaques da liga": "League highlights",
  "Sair": "Logout",
  "Atleta ou prova": "Athlete or race",
  "Limpar submissões": "Clear submissions",
  "Visualização da prova": "Race visualisation",
  "Conceito e regras": "Concept and rules",
  "Apoiar a Runners League": "Support Runners League",
  "Gestão de atleta": "Athlete management",
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
  "Só atletas podem editar as suas provas": "Only athletes can edit their own races",
  "Submissão não encontrada": "Submission not found",
  "Só o acesso geral pode apagar provas": "Only general access can delete races",
  "Só o acesso geral pode criar atletas": "Only general access can create athletes",
  "Só o acesso geral pode eliminar atletas": "Only general access can delete athletes",
  "Só o acesso geral pode alterar passwords": "Only general access can change passwords",
  "Atleta não encontrado": "Athlete not found",
  "Atleta eliminado.": "Athlete deleted.",
  "Nome do atleta demasiado curto": "Athlete name is too short",
  "A imagem é demasiado grande. Usa uma foto com menos de 900 KB.": "The image is too large. Use a photo under 900 KB.",
  "A imagem do comprovativo é demasiado grande. Usa uma imagem com menos de 900 KB.":
    "The proof image is too large. Use an image under 900 KB.",
  "Ano de nascimento inválido": "Invalid birth year",
  "Já existe um atleta com esse nome": "An athlete with that name already exists",
  "Inscrição criada. Já podes entrar como atleta.": "Registration created. You can now log in as an athlete.",
  "Dados do atleta atualizados.": "Athlete data updated.",
  "Só atletas podem gerir este perfil": "Only athletes can manage this profile",
  "Escolhe um destinatário": "Choose a recipient",
  "Indica um assunto": "Add a subject",
  "Escreve uma mensagem": "Write a message",
  "Destinatário não encontrado": "Recipient not found",
  "Mensagem enviada.": "Message sent.",
  "Mensagens marcadas como lidas.": "Messages marked as read.",
  "Newsletter enviada.": "Newsletter sent.",
  "Correção enviada. A prova voltou a ficar pendente para validação.":
    "Correction sent. The race is pending validation again.",
  "A newsletter deste mês já foi enviada.": "This month's newsletter has already been sent.",
  "Só o acesso geral pode enviar newsletters": "Only general access can send newsletters",
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

function renderPhotoPreview(urlInput, preview) {
  if (!preview) return;
  const value = urlInput.value.trim();
  preview.innerHTML = value
    ? `<span>${language === "pt" ? "Pré-visualização" : "Preview"}</span><img src="${escapeHtml(value)}" alt="" />`
    : "";
}

function attachPhotoPicker(fileInput, urlInput, preview, statusTarget) {
  if (!fileInput || !urlInput) return;
  urlInput.addEventListener("input", () => renderPhotoPreview(urlInput, preview));
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      if (statusTarget) statusTarget.textContent = t("invalidPhoto");
      fileInput.value = "";
      return;
    }
    if (file.size > 900 * 1024) {
      if (statusTarget) statusTarget.textContent = t("photoTooLarge");
      fileInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      urlInput.value = reader.result;
      renderPhotoPreview(urlInput, preview);
      if (statusTarget) statusTarget.textContent = "";
    });
    reader.readAsDataURL(file);
  });
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
  setRaceFormMode(editingRaceId);
}

function applyTheme() {
  const resolvedTheme = theme === "auto" && systemTheme?.matches ? "light" : theme === "auto" ? "dark" : theme;
  document.body.dataset.theme = resolvedTheme;
  document.body.dataset.themeMode = theme;
  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === theme);
  });
}

function setTheme(nextTheme) {
  theme = nextTheme;
  localStorage.setItem("runners-league-theme", theme);
  applyTheme();
}

systemTheme?.addEventListener("change", () => {
  if (theme === "auto") applyTheme();
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatPace(secondsPerKm) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}/km`;
}

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}` : `${minutes}:${seconds}`;
}

function parseDuration(value) {
  const raw = String(value || "").trim();
  if (!raw) return 0;
  if (!raw.includes(":")) return Number(raw);
  const parts = raw.split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part) || part < 0)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function setRaceFormMode(raceId = null) {
  editingRaceId = raceId;
  const button = form.querySelector(".primary-action");
  if (!button) return;
  button.innerHTML = editingRaceId
    ? `<span aria-hidden="true">✓</span>${t("saveRaceCorrection")}`
    : `<span aria-hidden="true">+</span>${t("submitRace")}`;
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
    proofImage: fields.proofImage.value.trim(),
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

function setRaceFormFromSubmission(race) {
  fields.raceName.value = race.raceName || "";
  fields.officialUrl.value = race.officialUrl || "";
  fields.proofImage.value = race.proofImage || "";
  renderPhotoPreview(fields.proofImage, fields.proofImagePreview);
  const knownDistance = Array.from(fields.distance.options).find(
    (option) => option.value !== "custom" && Math.abs(Number(option.value) - Number(race.distanceKm)) < 0.0001
  );
  fields.distance.value = knownDistance?.value || "custom";
  fields.customDistance.value = Number(race.distanceKm || 0);
  customDistanceWrap.classList.toggle("hidden", fields.distance.value !== "custom");
  const totalSeconds = Math.max(0, Math.round(Number(race.totalSeconds) || 0));
  fields.hours.value = Math.floor(totalSeconds / 3600);
  fields.minutes.value = Math.floor((totalSeconds % 3600) / 60);
  fields.seconds.value = totalSeconds % 60;
  fields.rank.value = race.rank || "";
  fields.finishers.value = race.finishers || "";
  fields.elevation.value = race.elevation || 0;
  fields.competition.value = String(race.competition || 1);
  fields.seasonYear.value = race.seasonYear || currentYear;
  const terrain = Array.from(document.querySelectorAll("input[name='terrain']")).find(
    (input) => Math.abs(Number(input.value) - Number(race.terrain || 1)) < 0.001
  );
  if (terrain) terrain.checked = true;
  renderCurrent();
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

function renderSocialShareActions(kind, value) {
  const safeValue = escapeHtml(String(value));
  const networks = [
    ["facebook", "f", t("shareFacebook")],
    ["x", "X", t("shareX")],
    ["instagram", "◎", t("shareInstagram")],
  ];
  return `
    <div class="social-share-actions" aria-label="Partilha social">
      ${networks
        .map(
          ([network, icon, label]) => `
            <button class="social-share-button ${network}" type="button" data-social-share="${network}" data-share-kind="${kind}" data-share-value="${safeValue}" aria-label="${label}" title="${label}">
              ${icon}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderRegisteredAthletes() {
  if (!registeredAthletes) return;
  const rows = runnerProfileRows.length
    ? runnerProfileRows
    : runnerProfiles.map((name) => ({ name, shareProfile: false }));

  registeredAthletes.innerHTML = rows.length
    ? rows
        .map((profile) => {
          const canOpen = Boolean(profile.shareProfile);
          const meta = [profile.city, profile.country, profile.club].filter(Boolean).map(escapeHtml).join(" · ");
          const tag = canOpen ? "button" : "article";
          const action = canOpen ? `type="button" data-athlete-public="${escapeHtml(profile.name)}"` : "";
          return `
            <${tag} class="registered-athlete ${canOpen ? "is-public" : "is-private"}" ${action}>
              <div class="runner-account-photo">${renderRunnerAvatar(canOpen ? profile : null, profile.name)}</div>
              <div>
                <strong>${escapeHtml(profile.name)}</strong>
                <span>${meta || (canOpen ? t("shareProfile") : t("privateProfile"))}</span>
              </div>
              <em>${canOpen ? t("openProfile") : t("privateProfile")}</em>
            </${tag}>
          `;
        })
        .join("")
    : `<article class="registered-athlete empty-state"><strong>${t("noRunners")}</strong></article>`;
}

function renderTopThree(rows) {
  const podium = rows.slice(0, 3);
  const topTen = rows.slice(3, 10);
  topThree.innerHTML = podium.length
    ? `
        <div class="podium-stage">
          ${podium
            .map((row, index) => {
              const placeClass = index === 0 ? "gold" : index === 1 ? "silver" : "bronze";
              return `
                <article class="podium-card ${placeClass}" data-athlete="${escapeHtml(row.runner)}" role="button" tabindex="0">
                  <span>#${index + 1}</span>
                  <strong>${escapeHtml(row.runner)}</strong>
                  <div class="ranking-share-line">
                    <em>${Math.round(row.score)} ${t("pts")}</em>
                    ${renderSocialShareActions("ranking", row.runner)}
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
        <div class="top-ten-list">
          ${topTen
            .map(
              (row, index) => `
                <article class="top-ten-row" data-athlete="${escapeHtml(row.runner)}" role="button" tabindex="0">
                  <span>#${index + 4}</span>
                  <strong>${escapeHtml(row.runner)}</strong>
                  <div class="ranking-share-line">
                    <em>${Math.round(row.score)} ${t("pts")}</em>
                    ${renderSocialShareActions("ranking", row.runner)}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      `
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
            <article class="submission-item ranking-button" data-athlete="${escapeHtml(row.runner)}" role="button" tabindex="0">
              <div class="submission-title">
                <strong>${index + 1}. ${escapeHtml(row.runner)}</strong>
                <span>${row.countingRaces}/6 ${t("countingRaces").toLowerCase()} · ${row.totalRaces} ${row.totalRaces === 1 ? t("submittedRace") : t("submittedRaces")}</span>
                <span class="submission-meta">${row.eligible ? t("eligible") : t("notEligible")} · ${row.validatedCount}/3 ${t("approvedRaces")} · ${t("average")} ${Math.round(row.average)} ${t("pts")}</span>
              </div>
              <div class="submission-actions">
                <div class="submission-score">${Math.round(row.score)}</div>
                ${renderSocialShareActions("ranking", row.runner)}
              </div>
            </article>
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
              <div class="submission-actions">
                <div class="submission-score">${item.total}</div>
                ${renderSocialShareActions("race", item.id)}
              </div>
            </article>
          `
        )
        .join("")
    : `<article class="submission-item empty-state"><strong>${t("noSubmittedRaces")}</strong></article>`;
}

function renderProfileManagement() {
  if (!profileManagementSummary || session?.type !== "runner") return;
  const profile = currentRunnerProfile || runnerProfileFor(session.name);
  const runnerName = profile?.name || session.name;
  const races = visibleSubmissions().map(calculateRace).sort((a, b) => b.id - a.id);
  const approved = races.filter((race) => race.validationStatus === "approved").length;
  const leaguePlace = leaguePositionForRunner(runnerName);
  const profileMeta = profile
    ? [profile.city, profile.country, profile.club].filter(Boolean).join(" · ")
    : "";

  profileForm.classList.toggle("hidden", !profileEditOpen);

  profileManagementSummary.innerHTML = profile
    ? `
      <div class="athlete-hero">
        <div class="athlete-avatar">${renderRunnerAvatar(profile, runnerName)}</div>
        <div>
          <p class="eyebrow">${t("personalArea")}</p>
          <h2>${escapeHtml(runnerName)}</h2>
          <p>${escapeHtml(profileMeta || profile.bio || t("noBio"))}</p>
          ${profile.bio && profileMeta ? `<p>${escapeHtml(profile.bio)}</p>` : ""}
        </div>
        <div class="profile-card-actions">
          <span class="profile-visibility">${profile.shareProfile ? t("shareProfile") : t("hideProfile")}</span>
          <button class="secondary-action compact-action" type="button" data-edit-profile>
            ${t("editProfile")}
          </button>
        </div>
      </div>
      <div class="profile-stats">
        <div><span>${t("leaguePlace")}</span><strong>${leaguePlace ? `#${leaguePlace}` : "-"}</strong></div>
        <div><span>${t("submittedRacesTitle")}</span><strong>${races.length}</strong></div>
        <div><span>${t("approvedShort")}</span><strong>${approved}</strong></div>
        <div><span>${t("eligibility")}</span><strong>${approved >= 3 ? t("eligible") : t("pendingShort")}</strong></div>
      </div>
    `
    : `<article class="submission-item empty-state"><strong>${t("noProfileLoaded")}</strong></article>`;

  if (profile) {
    profileFields.name.value = profile.name || "";
    profileFields.email.value = profile.email || "";
    profileFields.photoUrl.value = profile.photoUrl || "";
    renderPhotoPreview(profileFields.photoUrl, profileFields.photoPreview);
    profileFields.city.value = profile.city || "";
    profileFields.country.value = profile.country || "";
    profileFields.club.value = profile.club || "";
    profileFields.birthYear.value = profile.birthYear || "";
    profileFields.bio.value = profile.bio || "";
    profileFields.shareProfile.checked = Boolean(profile.shareProfile);
  }

  profileRaceCount.textContent = `${races.length} ${races.length === 1 ? t("race") : t("races")}`;
  profileRaceList.innerHTML = races.length
    ? races
        .map(
          (race) => `
            <article class="submission-item" data-race-id="${race.id}">
              <div class="submission-title">
                <strong>${escapeHtml(race.raceName)}</strong>
                <span>${race.distanceKm.toFixed(race.distanceKm % 1 ? 1 : 0)} km · ${formatPace(race.paceSeconds)} · ${race.safeRank}/${race.finishers} ${t("classified")}</span>
                <span class="submission-meta">${validationLabel(race)} · ${Math.round(race.elevation)} m D+ · ${race.seasonYear}</span>
              </div>
              <div class="submission-actions">
                <div class="submission-score">${race.total}</div>
                <button class="secondary-action compact-action" type="button" data-edit-runner-race="${race.id}">
                  ${t("editRace")}
                </button>
                ${renderSocialShareActions("race", race.id)}
              </div>
            </article>
          `
        )
        .join("")
    : `<article class="submission-item empty-state"><strong>${t("noSubmittedRaces")}</strong></article>`;
}

function renderMessageRecipients() {
  [messageRecipient, adminMessageRecipient].forEach((select) => {
    if (!select) return;
    select.replaceChildren(
      ...messageRecipients.map((recipient) => {
        const option = document.createElement("option");
        option.value = recipient.name;
        option.textContent = recipient.role === "general" ? `${recipient.name} (${t("general")})` : recipient.name;
        return option;
      })
    );
  });
}

function renderMessages() {
  const targetList = session?.type === "general" ? adminMessageList : messageList;
  if (!targetList) return;
  updateMessageBadges();
  targetList.innerHTML = messageRows.length
    ? messageRows
        .map(
          (message) => `
            <article class="message-item ${escapeHtml(message.kind)} ${escapeHtml(message.direction)}">
              <div>
                <strong>${escapeHtml(message.subject)}</strong>
                <span>${escapeHtml(message.direction === "sent" ? t("sent") : message.kind === "system" ? t("system") : t("received"))} · ${escapeHtml(message.sender)} → ${escapeHtml(message.recipient)} · ${escapeHtml(formatDateTime(message.createdAt))}</span>
              </div>
              <p>${escapeHtml(message.body)}</p>
            </article>
          `
        )
        .join("")
    : `<article class="message-item empty-state"><strong>${t("noMessages")}</strong></article>`;
}

function updateMessageBadges() {
  const targets = [messageBadge, adminMessageBadge];
  targets.forEach((badge) => {
    if (!badge) return;
    badge.textContent = unreadMessageCount;
    badge.classList.toggle("hidden", unreadMessageCount < 1);
  });
  profileNavButton.classList.toggle("has-notification", session?.type === "runner" && unreadMessageCount > 0);
  if (markMessagesReadButton) markMessagesReadButton.disabled = unreadMessageCount < 1;
  if (adminMarkMessagesReadButton) adminMarkMessagesReadButton.disabled = unreadMessageCount < 1;
}

function leaguePositionForRunner(runner) {
  const index = rankingRows().findIndex((row) => row.runner === runner);
  return index >= 0 ? index + 1 : null;
}

function shareTextForRace(race) {
  const position = leaguePositionForRunner(race.runner);
  const place = position ? `#${position}` : "-";
  return `Runners League: ${race.runner} somou ${race.total} pts em ${race.raceName} (${race.distanceKm.toFixed(race.distanceKm % 1 ? 1 : 0)} km) e está em ${place} na liga. https://rljc.pythonanywhere.com`;
}

function shareTextForRanking(runner) {
  const row = rankingRows().find((item) => item.runner === runner);
  const position = leaguePositionForRunner(runner);
  const place = position ? `#${position}` : "-";
  const score = row ? `${Math.round(row.score)} pts` : "sem pontuação";
  return `Runners League: ${runner} está em ${place} na liga com ${score}. https://rljc.pythonanywhere.com`;
}

function openSocialShare(network, textToShare) {
  const encodedText = encodeURIComponent(textToShare);
  const encodedUrl = encodeURIComponent("https://rljc.pythonanywhere.com");
  if (network === "facebook") {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, "_blank", "noopener,noreferrer");
    copyText(textToShare);
    return t("shareCopied");
  }
  if (network === "x") {
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, "_blank", "noopener,noreferrer");
    copyText(textToShare);
    return t("shareCopied");
  }
  if (network === "instagram") {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = "instagram://app";
      window.setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      }, 500);
    } else {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }
    copyText(textToShare);
    return t("instagramCopied");
  }
  copyText(textToShare);
  return t("shareCopied");
}

function openProofImage(proofImage) {
  if (!proofImage) return;
  const safeProofImage = escapeHtml(proofImage);
  const proofWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!proofWindow) {
    window.location.href = proofImage;
    return;
  }
  proofWindow.document.write(`
    <!doctype html>
    <html lang="${language}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Runners League · ${t("viewProof")}</title>
        <style>
          body { margin: 0; min-height: 100vh; background: #061426; color: white; font-family: Arial, sans-serif; display: grid; place-items: center; padding: 24px; box-sizing: border-box; }
          main { width: min(1100px, 100%); }
          img { display: block; width: 100%; max-height: 82vh; object-fit: contain; border-radius: 12px; background: white; }
          a { display: inline-block; margin-top: 16px; color: #17b7ff; font-weight: 700; }
        </style>
      </head>
      <body>
        <main>
          <img src="${safeProofImage}" alt="${t("viewProof")}" />
          <a href="${safeProofImage}" download>${t("viewProof")}</a>
        </main>
      </body>
    </html>
  `);
  proofWindow.document.close();
}

async function copyText(textToCopy) {
  try {
    await navigator.clipboard?.writeText(textToCopy);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    textarea.remove();
    return copied;
  }
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
                <div class="proof-links">
                  <a href="${escapeHtml(race.officialUrl)}" target="_blank" rel="noreferrer">${t("officialClassification")}</a>
                  ${
                    race.proofImage
                      ? `<button type="button" data-proof-id="${race.id}">${t("viewProof")}</button>`
                      : ""
                  }
                </div>
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
  editProofImage.value = race.proofImage || "";
  renderPhotoPreview(editProofImage, editProofImagePreview);
  editDistance.value = race.distanceKm;
  editTotalSeconds.value = formatDuration(race.totalSeconds);
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
  renderRegisteredAthletes();
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
  const query = runnerAccountSearch?.value.trim().toLowerCase() || "";
  const filtered = runners.filter((runner) => {
    if (!query) return true;
    return [runner.name, runner.email, runner.city, runner.country, runner.club]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  if (runnerAccountsCount) {
    runnerAccountsCount.textContent = `${filtered.length}/${runners.length} ${t("athletes")}`;
  }
  runnerAccounts.innerHTML = filtered.length
    ? filtered
        .map(
          (runner) => `
            <article class="runner-account runner-account-card">
              <div class="runner-account-photo">
                ${renderRunnerAvatar(runner, runner.name)}
              </div>
              <div class="runner-account-details">
                <strong>${escapeHtml(runner.name)}</strong>
                <span>${[runner.email, runner.city, runner.country, runner.club].filter(Boolean).map(escapeHtml).join(" · ") || t("noBio")}</span>
                <span>${runner.submissions} ${runner.submissions === 1 ? t("race") : t("races")} · ${runner.shareProfile ? t("shareProfile") : t("hideProfile")} · ${escapeHtml(formatDateTime(runner.createdAt))}</span>
              </div>
              <button class="danger-action compact-action runner-delete-action" type="button" data-delete-runner-id="${runner.id}" data-delete-runner-name="${escapeHtml(runner.name)}">
                ${t("deleteRunner")}
              </button>
            </article>
          `
        )
        .join("")
    : `<article class="runner-account empty-state"><strong>${query ? t("noResults") : t("noRunners")}</strong></article>`;
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
  workspace.classList.toggle("admin-mode", loggedIn && session.type === "general");
  loginPanel.classList.toggle("hidden", loggedIn || signupOpen);
  signupPanel.classList.toggle("hidden", loggedIn || !signupOpen);
  sessionPanel.classList.toggle("hidden", !loggedIn);
  form.classList.toggle("hidden", !loggedIn || session.type !== "runner");
  generalPanel.classList.toggle("hidden", !loggedIn || session.type !== "general");
  resetButton.classList.toggle("hidden", !loggedIn || session.type !== "general");
  profileNavButton.classList.toggle("hidden", !loggedIn || session.type !== "runner");
  if ((!loggedIn || session.type !== "runner") && document.querySelector(".app-page.active")?.id === "profile-page") {
    showView("league");
  }

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
    loadMessages();
    renderPendingValidations();
    renderEditSubmissionOptions();
  } else {
    loadCurrentRunnerProfile();
    loadMessages();
  }
  renderSubmissions();
  renderCurrent();
  renderProfileManagement();
  renderMessages();
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
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers,
    });
  } catch (error) {
    if (window.location.protocol === "file:") {
      throw new Error(t("serverRequired"));
    }
    throw new Error(error.message || t("databaseError"));
  }
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = { error: response.status === 404 ? "Endpoint não encontrado" : t("databaseError") };
  }
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

async function loadCurrentRunnerProfile() {
  if (session?.type !== "runner") return;
  const data = await apiRequest("/api/me");
  currentRunnerProfile = data.profile;
  const index = runnerProfileRows.findIndex((profile) => profile.name === currentRunnerProfile.name);
  if (index >= 0) runnerProfileRows[index] = currentRunnerProfile;
  else runnerProfileRows.push(currentRunnerProfile);
  renderProfileManagement();
}

async function loadMessages() {
  if (!session) return;
  const data = await apiRequest("/api/messages");
  messageRows = data.messages;
  messageRecipients = data.recipients;
  unreadMessageCount = data.unreadCount || 0;
  renderMessageRecipients();
  renderMessages();
}

async function refreshSubmissions() {
  const data = await apiRequest("/api/submissions");
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderSubmissions();
  renderAdminStats();
  renderCurrent();
  renderProfileManagement();
  renderMessages();
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
  button.addEventListener("click", () => {
    showView(button.dataset.view);
    if (button.dataset.view === "profile") loadCurrentRunnerProfile();
  });
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});

runnerAccountSearch?.addEventListener("input", () => {
  renderRunnerAccounts();
});

profileManagementSummary.addEventListener("click", (event) => {
  if (!event.target.closest("[data-edit-profile]")) return;
  profileEditOpen = true;
  renderProfileManagement();
  profileForm.scrollIntoView({ behavior: "smooth", block: "start" });
});

cancelProfileEdit.addEventListener("click", () => {
  profileEditOpen = false;
  profileMessage.textContent = "";
  renderProfileManagement();
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

heroStartButton.addEventListener("click", () => {
  if (session?.type === "runner") {
    showView("profile");
    loadCurrentRunnerProfile();
    return;
  }
  if (session?.type === "general") {
    showView("league");
    return;
  }
  signupOpen = true;
  loginMessage.textContent = "";
  showView("league");
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

registeredAthletes.addEventListener("click", (event) => {
  const button = event.target.closest("[data-athlete-public]");
  if (!button) return;
  selectedAthlete = button.dataset.athletePublic;
  showView("league");
  renderAthleteProfile(selectedAthlete);
  athleteProfile.scrollIntoView({ behavior: "smooth", block: "start" });
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
    renderPhotoPreview(signupFields.photoUrl, signupFields.photoPreview);
    signupOpen = false;
    loginMessage.textContent = data.message;
    renderSession();
  } catch (error) {
    signupMessage.textContent = error.message === "Endpoint não encontrado" ? t("signupServerNotReady") : error.message;
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
  const endpoint = editingRaceId ? "/api/submissions/runner-update" : "/api/submissions";
  const data = await apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(editingRaceId ? { ...race, id: editingRaceId } : race),
  });
  editingRaceId = null;
  setRaceFormMode(null);
  form.reset();
  fields.runner.value = session?.type === "runner" ? session.name : fields.runner.value;
  fields.seasonYear.value = currentYear;
  customDistanceWrap.classList.add("hidden");
  renderPhotoPreview(fields.proofImage, fields.proofImagePreview);
  submissions = data.submissions;
  renderSeasonFilter();
  renderEditSubmissionOptions();
  renderSubmissions();
  renderAdminStats();
  renderCurrent();
  renderPendingValidations();
  renderProfileManagement();
  if (profileMessage) profileMessage.textContent = data.message || "";
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  profileMessage.textContent = "";
  try {
    const previousName = session.name;
    const data = await apiRequest("/api/me", {
      method: "POST",
      body: JSON.stringify({
        name: profileFields.name.value,
        email: profileFields.email.value,
        photoUrl: profileFields.photoUrl.value,
        city: profileFields.city.value,
        country: profileFields.country.value,
        club: profileFields.club.value,
        birthYear: profileFields.birthYear.value,
        bio: profileFields.bio.value,
        shareProfile: profileFields.shareProfile.checked,
      }),
    });
    currentRunnerProfile = data.profile;
    if (session?.type === "runner") {
      session.name = data.profile.name;
      saveSession();
      fields.runner.value = data.profile.name;
    }
    submissions = data.submissions;
    if (previousName !== data.profile.name) {
      selectedAthlete = data.profile.name;
    }
    renderProfiles(data.profiles, data.runnerProfiles);
    renderSeasonFilter();
    renderSubmissions();
    renderCurrent();
    profileEditOpen = false;
    renderProfileManagement();
    renderSession();
    profileMessage.textContent = data.message;
  } catch (error) {
    profileMessage.textContent = error.message;
  }
});

async function submitMessage(formType) {
  const isAdmin = formType === "admin";
  const status = isAdmin ? adminMessageStatus : messageStatus;
  const recipient = isAdmin ? adminMessageRecipient : messageRecipient;
  const subject = isAdmin ? adminMessageSubject : messageSubject;
  const body = isAdmin ? adminMessageBody : messageBody;
  status.textContent = "";
  try {
    const data = await apiRequest("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        recipient: recipient.value,
        subject: subject.value,
        body: body.value,
      }),
    });
    messageRows = data.messages;
    unreadMessageCount = data.unreadCount || 0;
    subject.value = "";
    body.value = "";
    status.textContent = data.message;
    renderMessages();
  } catch (error) {
    status.textContent = error.message;
  }
}

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitMessage("runner");
});

adminMessageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitMessage("admin");
});

async function markMessagesRead() {
  if (!session) return;
  const targetStatus = session.type === "general" ? adminMessageStatus : messageStatus;
  try {
    const data = await apiRequest("/api/messages/read", { method: "POST" });
    messageRows = data.messages;
    unreadMessageCount = data.unreadCount || 0;
    if (targetStatus) targetStatus.textContent = data.message;
    renderMessages();
  } catch (error) {
    if (targetStatus) targetStatus.textContent = error.message;
  }
}

markMessagesReadButton.addEventListener("click", markMessagesRead);
adminMarkMessagesReadButton.addEventListener("click", markMessagesRead);

sendNewsletterButton.addEventListener("click", async () => {
  newsletterStatus.textContent = "";
  try {
    const data = await apiRequest("/api/newsletter/monthly", { method: "POST" });
    newsletterStatus.textContent = `${data.message} ${data.recipientCount} atletas receberam na caixa de mensagens. ${data.emailCount} emails enviados.`;
    await loadMessages();
  } catch (error) {
    newsletterStatus.textContent = error.message;
  }
});

mbwayAction.addEventListener("click", async () => {
  const phone = mbwayAction.dataset.mbwayPhone;
  const appUrl = mbwayAction.dataset.mbwayUrl || "mbway://";
  copyText(`MB WAY ${phone} · 2€`);
  const original = mbwayAction.innerHTML;
  mbwayAction.innerHTML = `<strong>MB WAY</strong><span>${t("mbwayCopied")}</span>`;
  window.setTimeout(() => {
    mbwayAction.innerHTML = original;
  }, 1800);
  window.location.href = appUrl;
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-social-share]");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  const kind = button.dataset.shareKind;
  const value = button.dataset.shareValue;
  const race = kind === "race" ? visibleSubmissions().map(calculateRace).find((item) => String(item.id) === String(value)) : null;
  const textToShare = kind === "ranking" ? shareTextForRanking(value) : race ? shareTextForRace(race) : "";
  if (!textToShare) return;
  const message = openSocialShare(button.dataset.socialShare, textToShare);
  if (profileMessage) profileMessage.textContent = message;
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-proof-id]");
  if (!button) return;
  event.preventDefault();
  const race = submissions.find((item) => String(item.id) === String(button.dataset.proofId));
  openProofImage(race?.proofImage || "");
});

profileRaceList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-runner-race]");
  if (!button) return;
  const race = visibleSubmissions().find((item) => String(item.id) === String(button.dataset.editRunnerRace));
  if (!race) return;
  setRaceFormFromSubmission(race);
  setRaceFormMode(race.id);
  form.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  if (profileMessage) profileMessage.textContent = t("editingRaceHelp");
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
  loadMessages();
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
  newRunnerPhotoFile.value = "";
  renderPhotoPreview(newRunnerPhoto, newRunnerPhotoPreview);
  newRunnerCity.value = "";
  newRunnerCountry.value = "";
  newRunnerClub.value = "";
  newRunnerBirthYear.value = "";
  newRunnerBio.value = "";
  newRunnerShareProfile.checked = true;
  newRunnerPassword.value = "";
  renderAdminStats();
});

runnerAccounts.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-runner-id]");
  if (!button) return;
  const id = button.dataset.deleteRunnerId;
  const name = button.dataset.deleteRunnerName;
  if (!window.confirm(t("deleteRunnerConfirm", name))) return;
  runnerAccountsStatus.textContent = "";
  button.disabled = true;
  try {
    const data = await apiRequest("/api/runners/delete", {
      method: "POST",
      body: JSON.stringify({ id: Number(id) }),
    });
    submissions = data.submissions;
    renderSeasonFilter();
    renderProfiles(data.profiles, data.runnerProfiles);
    renderRunnerAccounts(data.runners);
    renderPendingValidations();
    renderEditSubmissionOptions();
    renderAdminStats();
    loadMessages();
    runnerAccountsStatus.textContent = data.message || t("runnerDeleted");
  } catch (error) {
    runnerAccountsStatus.textContent = error.message;
    button.disabled = false;
  }
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
      proofImage: editProofImage.value,
      distanceKm: Number(editDistance.value),
      totalSeconds: parseDuration(editTotalSeconds.value),
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

attachPhotoPicker(signupFields.photoFile, signupFields.photoUrl, signupFields.photoPreview, signupMessage);
attachPhotoPicker(newRunnerPhotoFile, newRunnerPhoto, newRunnerPhotoPreview, loginMessage);
attachPhotoPicker(profileFields.photoFile, profileFields.photoUrl, profileFields.photoPreview, profileMessage);
attachPhotoPicker(fields.proofImageFile, fields.proofImage, fields.proofImagePreview, fields.proofImageStatus);
attachPhotoPicker(editProofImageFile, editProofImage, editProofImagePreview, editProofImageStatus);

applyTheme();
collectStaticText();
collectStaticAttributes();
translateStaticContent();

if (session?.type === "runner") fields.runner.value = session.name;
loadDatabaseState().catch((error) => {
  output.submissionsList.innerHTML = `<article class="submission-item empty-state"><strong>${error.message}</strong></article>`;
  renderSession();
});

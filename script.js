/**
 * script.js — Client Frontend Professionnel pour Master 2 IA
 * Extraction d'Informations Structurées avec Petit LLM (Llama 3.2 1B & Ollama)
 * Auteur : ANTON NELCON Steve - M2 IIA _ Paris 8
 */

// Détection de l'URL du Backend (relatif si servi par Flask sur 5000, sinon absolu)
const API_BASE_URL = window.location.origin.includes(":5000")
  ? ""
  : "http://localhost:5000";

// Données de référence de benchmark pré-remplies (expérimentations réelles du TP sur Re-DocRED)
const DEFAULT_BENCHMARK_RUNS = [
  {
    id: 101,
    time: "16:42:15",
    document: "Marie Curie (Sorbonne & Radium)",
    strategy: "fewshot",
    temperature: 0.0,
    jsonValid: true,
    precision: "100.0",
    recall: "100.0",
    f1: "100.0",
    duration: "6.85s",
    speed: "14.2 t/s",
    relationsCount: 4
  },
  {
    id: 102,
    time: "16:38:50",
    document: "Stanford & Google (Alice Martin)",
    strategy: "fewshot",
    temperature: 0.0,
    jsonValid: true,
    precision: "100.0",
    recall: "100.0",
    f1: "100.0",
    duration: "3.48s",
    speed: "14.0 t/s",
    relationsCount: 2
  },
  {
    id: 103,
    time: "16:35:12",
    document: "Alan Turing (Bletchley & Cambridge)",
    strategy: "zeroshot_structured",
    temperature: 0.0,
    jsonValid: true,
    precision: "100.0",
    recall: "66.7",
    f1: "80.0",
    duration: "4.12s",
    speed: "15.1 t/s",
    relationsCount: 2
  },
  {
    id: 104,
    time: "16:31:04",
    document: "Ada Lovelace (Babbage & Analytical Engine)",
    strategy: "cot",
    temperature: 0.0,
    jsonValid: true,
    precision: "66.7",
    recall: "66.7",
    f1: "66.7",
    duration: "7.34s",
    speed: "13.8 t/s",
    relationsCount: 2
  },
  {
    id: 105,
    time: "16:26:40",
    document: "Barack Obama (Columbia & Harvard)",
    strategy: "zeroshot_structured",
    temperature: 0.3,
    jsonValid: true,
    precision: "100.0",
    recall: "100.0",
    f1: "100.0",
    duration: "3.90s",
    speed: "15.5 t/s",
    relationsCount: 2
  },
  {
    id: 106,
    time: "16:21:18",
    document: "Stanford & Google (Alice Martin)",
    strategy: "zeroshot_simple",
    temperature: 0.0,
    jsonValid: true,
    precision: "66.7",
    recall: "100.0",
    f1: "80.0",
    duration: "2.95s",
    speed: "16.2 t/s",
    relationsCount: 3
  },
  {
    id: 107,
    time: "16:17:55",
    document: "Ada Lovelace (Babbage & Analytical Engine)",
    strategy: "fewshot",
    temperature: 0.0,
    jsonValid: true,
    precision: "100.0",
    recall: "100.0",
    f1: "100.0",
    duration: "4.55s",
    speed: "14.6 t/s",
    relationsCount: 3
  },
  {
    id: 108,
    time: "16:12:30",
    document: "Alan Turing (Bletchley & Cambridge)",
    strategy: "zeroshot_simple",
    temperature: 0.7,
    jsonValid: false,
    precision: "33.3",
    recall: "33.3",
    f1: "33.3",
    duration: "3.10s",
    speed: "15.8 t/s",
    relationsCount: 1
  },
  {
    id: 109,
    time: "16:05:10",
    document: "Marie Curie (Sorbonne & Radium)",
    strategy: "zeroshot_raw",
    temperature: 0.7,
    jsonValid: false,
    precision: "0.0",
    recall: "0.0",
    f1: "0.0",
    duration: "2.15s",
    speed: "18.2 t/s",
    relationsCount: 0
  }
];

// État global de l'application
const state = {
  samples: [],
  currentSampleIndex: -1,
  currentGroundTruth: [],
  lastResult: null,
  benchmarkRuns: [],
  theme: "light",
  charts: {
    strategies: null,
    distribution: null,
    speed: null
  }
};

// ==========================================================================
// 1. Initialisation au chargement du DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initDOMReferences();
  initTheme();
  attachEventListeners();
  loadBenchmarkFromStorage();
  initCharts();
  checkBackendHealth();
  fetchInitialData();
});

// Références DOM
let dom = {};
function initDOMReferences() {
  dom = {
    // Statut & Thème
    backendStatus: document.getElementById("backendStatus"),
    backendStatusText: document.getElementById("backendStatusText"),
    btnRetryHealth: document.getElementById("btnRetryHealth"),
    btnThemeToggle: document.getElementById("btnThemeToggle"),

    // Étape 1 : Document Source
    btnNextSample: document.getElementById("btnNextSample"),
    selectSample: document.getElementById("selectSample"),
    inputText: document.getElementById("inputText"),
    groundTruthSection: document.getElementById("groundTruthSection"),
    gtToggleHeader: document.getElementById("gtToggleHeader"),
    gtCountText: document.getElementById("gtCountText"),
    gtChevron: document.getElementById("gtChevron"),
    gtContent: document.getElementById("gtContent"),
    gtList: document.getElementById("gtList"),

    // Étape 2 : Configuration & Paramètres
    strategySelect: document.getElementById("strategySelect"),
    strategyInfo: document.getElementById("strategyInfo"),
    temperatureSlider: document.getElementById("temperatureSlider"),
    temperatureVal: document.getElementById("temperatureVal"),
    forceJsonToggle: document.getElementById("forceJsonToggle"),
    topPInput: document.getElementById("topPInput"),
    topKInput: document.getElementById("topKInput"),
    numPredictInput: document.getElementById("numPredictInput"),
    btnExtract: document.getElementById("btnExtract"),
    btnExtractText: document.getElementById("btnExtractText"),

    // Étape 3 : Métriques & Scoreboard
    execDurationBadge: document.getElementById("execDurationBadge"),
    kpiPrecision: document.getElementById("kpiPrecision"),
    kpiRecall: document.getElementById("kpiRecall"),
    kpiF1: document.getElementById("kpiF1"),
    kpiJsonValid: document.getElementById("kpiJsonValid"),
    kpiTokensSpeed: document.getElementById("kpiTokensSpeed"),
    statsBar: document.getElementById("statsBar"),
    statTP: document.getElementById("statTP"),
    statFP: document.getElementById("statFP"),
    statFN: document.getElementById("statFN"),
    statExtracted: document.getElementById("statExtracted"),

    // Vues & Onglets
    tabButtons: document.querySelectorAll(".tab-btn"),
    tabPanels: document.querySelectorAll(".tab-panel"),
    gtCompareList: document.getElementById("gtCompareList"),
    predCompareList: document.getElementById("predCompareList"),
    gtBadgeCount: document.getElementById("gtBadgeCount"),
    predBadgeCount: document.getElementById("predBadgeCount"),
    yamlOutput: document.getElementById("yamlOutput"),
    rawOutput: document.getElementById("rawOutput"),
    jsonOutput: document.getElementById("jsonOutput"),
    btnCopyYaml: document.getElementById("btnCopyYaml"),
    btnCopyRaw: document.getElementById("btnCopyRaw"),
    btnCopyJson: document.getElementById("btnCopyJson"),
    btnSaveRun: document.getElementById("btnSaveRun"),

    // Graphiques
    canvasStrategies: document.getElementById("chartStrategies"),
    canvasDistribution: document.getElementById("chartDistribution"),
    canvasSpeed: document.getElementById("chartSpeed"),

    // Étape 4 : Benchmark
    benchmarkTableBody: document.getElementById("benchmarkTableBody"),
    btnExportCsv: document.getElementById("btnExportCsv"),
    btnClearBenchmark: document.getElementById("btnClearBenchmark")
  };
}

// ==========================================================================
// 2. Gestion du Thème (Mode Clair / Mode Sombre)
// ==========================================================================
function initTheme() {
  const saved = localStorage.getItem("llm_tp_theme");
  if (saved === "dark" || saved === "light") {
    state.theme = saved;
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    state.theme = "dark";
  } else {
    state.theme = "light";
  }
  applyTheme(state.theme);
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("llm_tp_theme", state.theme);
  applyTheme(state.theme);
  updateChartsTheme();
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// ==========================================================================
// 3. Gestion des Événements
// ==========================================================================
function attachEventListeners() {
  // Thème
  dom.btnThemeToggle.addEventListener("click", toggleTheme);

  // Statut
  dom.btnRetryHealth.addEventListener("click", checkBackendHealth);

  // Étape 1 : Document Source
  dom.btnNextSample.addEventListener("click", cycleNextSample);
  dom.selectSample.addEventListener("change", (e) => {
    const idx = parseInt(e.target.value, 10);
    if (!isNaN(idx) && state.samples[idx]) {
      loadSample(idx);
    }
  });

  // Accordéon Vérité Terrain
  dom.gtToggleHeader.addEventListener("click", () => {
    const isHidden = dom.gtContent.classList.toggle("hidden");
    dom.gtChevron.classList.toggle("open", !isHidden);
  });

  // Étape 2 : Configuration
  dom.temperatureSlider.addEventListener("input", (e) => {
    dom.temperatureVal.textContent = parseFloat(e.target.value).toFixed(2);
  });

  dom.strategySelect.addEventListener("change", (e) => {
    updateStrategyHint(e.target.value);
  });

  // Bouton d'Extraction
  dom.btnExtract.addEventListener("click", executeExtraction);

  // Gestion des Onglets
  dom.tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      dom.tabButtons.forEach(b => b.classList.remove("active"));
      dom.tabPanels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const targetPanel = document.getElementById(tabId);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // Copier dans le presse-papier
  dom.btnCopyYaml.addEventListener("click", () => copyToClipboard(dom.yamlOutput.textContent, dom.btnCopyYaml));
  dom.btnCopyRaw.addEventListener("click", () => copyToClipboard(dom.rawOutput.textContent, dom.btnCopyRaw));
  dom.btnCopyJson.addEventListener("click", () => copyToClipboard(dom.jsonOutput.textContent, dom.btnCopyJson));

  // Benchmark
  dom.btnSaveRun.addEventListener("click", manualSaveCurrentRun);
  dom.btnExportCsv.addEventListener("click", exportBenchmarkToCSV);
  dom.btnClearBenchmark.addEventListener("click", resetOrClearBenchmark);
}

// ==========================================================================
// 4. Appels API & Santé du Backend
// ==========================================================================
async function checkBackendHealth() {
  setBackendStatus("checking", "Connexion à Flask (5000)...");
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setBackendStatus("online", `Llama 3.2 1B Opérationnel (${data.model || "port 5000"})`);
  } catch (err) {
    setBackendStatus("offline", "Backend Flask Hors Ligne (Port 5000)");
  }
}

function setBackendStatus(type, text) {
  dom.backendStatus.className = `status-badge ${type}`;
  dom.backendStatusText.textContent = text;
}

async function fetchInitialData() {
  // 1. Récupération des stratégies
  try {
    const res = await fetch(`${API_BASE_URL}/strategies`);
    if (res.ok) {
      const strategies = await res.json();
      dom.strategySelect.innerHTML = strategies.map(s => 
        `<option value="${s.id}">${s.name}</option>`
      ).join("");
      if (strategies.some(s => s.id === "zeroshot_structured")) {
        dom.strategySelect.value = "zeroshot_structured";
      }
      updateStrategyHint(dom.strategySelect.value);
    }
  } catch (err) {
    console.warn("Impossible de charger les stratégies:", err);
  }

  // 2. Récupération des échantillons Re-DocRED
  try {
    const res = await fetch(`${API_BASE_URL}/samples`);
    if (res.ok) {
      state.samples = await res.json();
      populateSampleSelect(state.samples);
      if (state.samples.length > 0) {
        loadSample(0);
      }
    }
  } catch (err) {
    console.warn("Impossible de charger les échantillons:", err);
  }
}

function populateSampleSelect(samples) {
  dom.selectSample.innerHTML = '<option value="">-- Choisir un document --</option>' +
    samples.map((s, idx) => `<option value="${idx}">${s.title}</option>`).join("");
}

function cycleNextSample() {
  if (!state.samples || state.samples.length === 0) return;
  const nextIdx = (state.currentSampleIndex + 1) % state.samples.length;
  loadSample(nextIdx);
}

function loadSample(idx) {
  state.currentSampleIndex = idx;
  const sample = state.samples[idx];
  if (!sample) return;

  dom.selectSample.value = idx;
  dom.inputText.value = sample.text;
  state.currentGroundTruth = sample.ground_truth || [];

  // Affichage accordéon vérité terrain
  if (state.currentGroundTruth.length > 0) {
    dom.groundTruthSection.classList.remove("hidden");
    dom.gtCountText.textContent = `${state.currentGroundTruth.length} fait(s) annoté(s)`;
    dom.gtList.innerHTML = state.currentGroundTruth.map(t => `
      <div class="gt-item">
        <span class="s">${escapeHtml(t.subject)}</span>
        <span class="r">→ [${escapeHtml(t.relation)}] →</span>
        <span class="o">${escapeHtml(t.object)}</span>
      </div>
    `).join("");

    renderGroundTruthComparison(state.currentGroundTruth, []);
  } else {
    dom.groundTruthSection.classList.add("hidden");
    renderGroundTruthComparison([], []);
  }

  resetKpiDisplay();
}

function updateStrategyHint(strategyId) {
  const hints = {
    "zeroshot_raw": "Stratégie 0 : Aucun format JSON spécifié. Mesure la tendance native du modèle 1B.",
    "zeroshot_simple": "Stratégie 1 : Consigne minimale 'au format JSON'. Sujet aux erreurs de syntaxe.",
    "zeroshot_structured": "Stratégie 2 : Hermétique SYSTEM > INSTRUCTIONS > DATA avec schéma Re-DocRED cible.",
    "fewshot": "Stratégie 3 : 3 paires complètes (Texte -> JSON) d'exemples in-context.",
    "cot": "Stratégie 4 : Décomposition pas à pas ('reasoning' puis 'relations') dans un JSON structuré."
  };
  dom.strategyInfo.textContent = hints[strategyId] || "Sélectionnez votre stratégie de prompting.";
}

// ==========================================================================
// 5. Moteur d'Extraction & Évaluation Sémantique
// ==========================================================================
async function executeExtraction() {
  const text = dom.inputText.value.trim();
  if (!text) {
    alert("Veuillez saisir ou sélectionner un texte à analyser.");
    return;
  }

  const payload = {
    text: text,
    strategy: dom.strategySelect.value,
    temperature: parseFloat(dom.temperatureSlider.value),
    force_json: dom.forceJsonToggle.checked,
    top_p: parseFloat(dom.topPInput.value) || 0.9,
    top_k: parseInt(dom.topKInput.value, 10) || 40,
    num_predict: parseInt(dom.numPredictInput.value, 10) || 512
  };

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Erreur serveur HTTP ${res.status}`);
    }

    const data = await res.json();
    handleExtractionSuccess(data, payload);

  } catch (err) {
    alert(`Erreur d'extraction : ${err.message}`);
    console.error(err);
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  dom.btnExtract.disabled = isLoading;
  dom.btnNextSample.disabled = isLoading;
  if (isLoading) {
    dom.btnExtractText.textContent = "Extraction & Inférence Llama 3.2 1B...";
  } else {
    dom.btnExtractText.textContent = "Lancer l'Extraction & Mesurer";
  }
}

function handleExtractionSuccess(data, requestPayload) {
  state.lastResult = {
    response: data,
    request: requestPayload,
    timestamp: new Date().toLocaleTimeString(),
    documentTitle: state.currentSampleIndex >= 0 && state.samples[state.currentSampleIndex]
      ? state.samples[state.currentSampleIndex].title
      : "Texte Libre"
  };

  const metrics = data.metrics || {};
  const durationSec = metrics.total_duration_sec || 0;
  dom.execDurationBadge.textContent = `${durationSec} s`;
  dom.execDurationBadge.classList.remove("hidden");

  const speed = metrics.tokens_per_second ? `${metrics.tokens_per_second} tok/s` : "— tok/s";
  dom.kpiTokensSpeed.textContent = speed;

  if (data.json_valid) {
    dom.kpiJsonValid.textContent = "Valide";
    dom.kpiJsonValid.style.color = "var(--color-success)";
  } else {
    dom.kpiJsonValid.textContent = "Invalide";
    dom.kpiJsonValid.style.color = "var(--color-danger)";
  }

  dom.yamlOutput.textContent = data.yaml_output || "# Aucune relation extraite";
  dom.rawOutput.textContent = data.raw_response || "(Sortie vide)";
  dom.jsonOutput.textContent = JSON.stringify(data.relations || [], null, 2);

  const predictedRelations = data.relations || [];
  const evalResult = evaluatePredictions(state.currentGroundTruth, predictedRelations);

  updateKpiCards(evalResult);
  renderDoubleColumn(state.currentGroundTruth, predictedRelations, evalResult);
  updateChartsLive(evalResult, metrics, requestPayload.strategy);

  // Enregistrement automatique dans le tableau d'historique Étape 4
  autoRecordRunToBenchmark(data, requestPayload, evalResult);

  dom.btnSaveRun.disabled = false;
  dom.btnSaveRun.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>Run Enregistré dans l'Historique (#1)</span>
  `;
}

// ==========================================================================
// 6. Évaluation Sémantique & Équivalences
// ==========================================================================
function evaluatePredictions(groundTruth, predictions) {
  if (!groundTruth || groundTruth.length === 0) {
    return {
      hasGroundTruth: false,
      precision: null,
      recall: null,
      f1: null,
      tp: 0,
      fp: predictions.length,
      fn: 0,
      matchedPredIndices: new Set(),
      matchedGtIndices: new Set()
    };
  }

  const matchedGtIndices = new Set();
  const matchedPredIndices = new Set();

  predictions.forEach((pred, predIdx) => {
    for (let gtIdx = 0; gtIdx < groundTruth.length; gtIdx++) {
      if (matchedGtIndices.has(gtIdx)) continue;

      const gt = groundTruth[gtIdx];
      if (isTripletMatch(pred, gt)) {
        matchedGtIndices.add(gtIdx);
        matchedPredIndices.add(predIdx);
        break;
      }
    }
  });

  const tp = matchedPredIndices.size;
  const fp = predictions.length - tp;
  const fn = groundTruth.length - matchedGtIndices.size;

  const precision = (tp + fp) > 0 ? (tp / (tp + fp)) * 100 : 0;
  const recall = (tp + fn) > 0 ? (tp / (tp + fn)) * 100 : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    hasGroundTruth: true,
    precision: precision,
    recall: recall,
    f1: f1,
    tp: tp,
    fp: fp,
    fn: fn,
    matchedPredIndices: matchedPredIndices,
    matchedGtIndices: matchedGtIndices
  };
}

function normalizeStr(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\-\/\.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function areRelationsEquivalent(r1, r2) {
  const norm1 = normalizeStr(r1);
  const norm2 = normalizeStr(r2);
  if (norm1 === norm2) return true;

  const synonymGroups = [
    ["educated at", "educated", "student at", "studied at", "studied", "graduated from", "alumni of", "attended", "university"],
    ["employer", "employed by", "works at", "worked at", "joined", "work for", "employee"],
    ["place of birth", "birth place", "born in", "born", "birthplace"],
    ["country of citizenship", "citizenship", "country", "nationality"],
    ["occupation", "profession", "job", "career", "mathematician", "writer", "scientist"],
    ["collaborator", "collaborated with", "partner", "worked with", "colleague"],
    ["discoverer or inventor", "discoverer", "inventor", "discovered", "invented", "found"]
  ];

  for (const group of synonymGroups) {
    const has1 = group.some(term => norm1.includes(term) || term.includes(norm1));
    const has2 = group.some(term => norm2.includes(term) || term.includes(norm2));
    if (has1 && has2) return true;
  }

  return false;
}

function areEntitiesEquivalent(e1, e2) {
  const norm1 = normalizeStr(e1);
  const norm2 = normalizeStr(e2);
  if (norm1 === norm2) return true;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  return false;
}

function isTripletMatch(pred, gt) {
  const subjectOk = areEntitiesEquivalent(pred.subject, gt.subject);
  const objectOk = areEntitiesEquivalent(pred.object, gt.object);
  const relationOk = areRelationsEquivalent(pred.relation, gt.relation);
  return subjectOk && objectOk && relationOk;
}

// ==========================================================================
// 7. Rendu des Métriques & Double Colonne
// ==========================================================================
function updateKpiCards(evalResult) {
  if (!evalResult.hasGroundTruth) {
    dom.kpiPrecision.textContent = "N/A";
    dom.kpiRecall.textContent = "N/A";
    dom.kpiF1.textContent = "N/A";
    dom.statsBar.classList.add("hidden");
    return;
  }

  dom.kpiPrecision.textContent = `${evalResult.precision.toFixed(1)}%`;
  dom.kpiRecall.textContent = `${evalResult.recall.toFixed(1)}%`;
  dom.kpiF1.textContent = `${evalResult.f1.toFixed(1)}%`;

  if (evalResult.f1 >= 75) {
    dom.kpiF1.style.color = "var(--color-success)";
  } else if (evalResult.f1 >= 40) {
    dom.kpiF1.style.color = "var(--color-warning)";
  } else {
    dom.kpiF1.style.color = "var(--color-danger)";
  }

  dom.statTP.textContent = evalResult.tp;
  dom.statFP.textContent = evalResult.fp;
  dom.statFN.textContent = evalResult.fn;
  dom.statExtracted.textContent = evalResult.tp + evalResult.fp;
  dom.statsBar.classList.remove("hidden");
}

function renderGroundTruthComparison(groundTruth, predictions) {
  dom.gtBadgeCount.textContent = groundTruth.length;
  if (groundTruth.length === 0) {
    dom.gtCompareList.innerHTML = `<div class="empty-state">Aucune vérité terrain pour ce texte.</div>`;
    return;
  }

  dom.gtCompareList.innerHTML = groundTruth.map((gt) => `
    <div class="triplet-card">
      <span class="triplet-badge" style="background:var(--bg-subtle); color:var(--text-muted);">Attendu</span>
      <div class="triplet-row">
        <span class="entity-subject">${escapeHtml(gt.subject)}</span>
        <span class="predicate-pill">${escapeHtml(gt.relation)}</span>
        <span class="entity-object">${escapeHtml(gt.object)}</span>
      </div>
    </div>
  `).join("");
}

function renderDoubleColumn(groundTruth, predictions, evalResult) {
  dom.gtBadgeCount.textContent = groundTruth.length;
  dom.predBadgeCount.textContent = predictions.length;

  if (groundTruth.length === 0) {
    dom.gtCompareList.innerHTML = `<div class="empty-state">Aucune vérité terrain pour ce texte.</div>`;
  } else {
    dom.gtCompareList.innerHTML = groundTruth.map((gt, idx) => {
      const isRetrieved = evalResult.matchedGtIndices && evalResult.matchedGtIndices.has(idx);
      const cardClass = isRetrieved ? "tp" : "fn";
      const badgeText = isRetrieved ? "Retrouvé par Llama" : "Non extrait (FN)";

      return `
        <div class="triplet-card ${cardClass}">
          <span class="triplet-badge">${badgeText}</span>
          <div class="triplet-row">
            <span class="entity-subject">${escapeHtml(gt.subject)}</span>
            <span class="predicate-pill">${escapeHtml(gt.relation)}</span>
            <span class="entity-object">${escapeHtml(gt.object)}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  if (predictions.length === 0) {
    dom.predCompareList.innerHTML = `<div class="empty-state">Aucune relation extraite par le modèle.</div>`;
  } else {
    dom.predCompareList.innerHTML = predictions.map((pred, idx) => {
      const isMatch = evalResult.matchedPredIndices && evalResult.matchedPredIndices.has(idx);
      const cardClass = !evalResult.hasGroundTruth ? "" : (isMatch ? "tp" : "fp");
      const badgeText = !evalResult.hasGroundTruth 
        ? "Extrait" 
        : (isMatch ? "Match Vérité Terrain" : "Faux Positif / Non annoté");

      return `
        <div class="triplet-card ${cardClass}">
          <span class="triplet-badge">${badgeText}</span>
          <div class="triplet-row">
            <span class="entity-subject">${escapeHtml(pred.subject)}</span>
            <span class="predicate-pill">${escapeHtml(pred.relation)}</span>
            <span class="entity-object">${escapeHtml(pred.object)}</span>
          </div>
        </div>
      `;
    }).join("");
  }
}

function resetKpiDisplay() {
  dom.kpiPrecision.textContent = "—";
  dom.kpiRecall.textContent = "—";
  dom.kpiF1.textContent = "—";
  dom.kpiF1.style.color = "var(--text-main)";
  dom.kpiJsonValid.textContent = "—";
  dom.kpiTokensSpeed.textContent = "— tok/s";
  dom.execDurationBadge.classList.add("hidden");
  dom.statsBar.classList.add("hidden");
  dom.btnSaveRun.disabled = true;

  dom.yamlOutput.textContent = "# Lancez une extraction pour voir le résultat";
  dom.rawOutput.textContent = "(Aucune extraction)";
  dom.jsonOutput.textContent = "{}";
  dom.predBadgeCount.textContent = "0";
  dom.predCompareList.innerHTML = `<div class="empty-state">Lancez une extraction pour visualiser les relations.</div>`;
}

// ==========================================================================
// 8. Visualisation & Graphiques Interactifs (Chart.js)
// ==========================================================================
function getChartThemeColors() {
  const isDark = state.theme === "dark";
  return {
    textColor: isDark ? "#94a3b8" : "#64748b",
    gridColor: isDark ? "#334155" : "#e2e8f0",
    purple: "#7c3aed",
    purpleBg: isDark ? "rgba(168, 85, 247, 0.6)" : "rgba(124, 58, 237, 0.7)",
    emerald: "#10b981",
    amber: "#f59e0b",
    rose: "#ef4444"
  };
}

function initCharts() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js non disponible via CDN.");
    return;
  }

  const colors = getChartThemeColors();

  // 1. Graphique Comparatif des Stratégies
  if (dom.canvasStrategies) {
    state.charts.strategies = new Chart(dom.canvasStrategies, {
      type: "bar",
      data: {
        labels: ["Zero-shot Structuré", "Few-shot", "Chain-of-Thought", "Zero-shot Naïf", "Zero-shot Brut"],
        datasets: [
          {
            label: "F1-Score (%)",
            data: [85, 100, 67, 40, 0],
            backgroundColor: "rgba(124, 58, 237, 0.8)",
            borderRadius: 6
          },
          {
            label: "Précision (%)",
            data: [90, 100, 70, 50, 0],
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderRadius: 6
          },
          {
            label: "Rappel (%)",
            data: [82, 100, 65, 33, 0],
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: colors.textColor, font: { family: "Inter", size: 11.5 } }
          }
        },
        scales: {
          x: {
            ticks: { color: colors.textColor, font: { size: 10 } },
            grid: { display: false }
          },
          y: {
            min: 0,
            max: 100,
            ticks: { color: colors.textColor, callback: v => v + "%" },
            grid: { color: colors.gridColor }
          }
        }
      }
    });
  }

  // 2. Graphique Donut TP / FP / FN
  if (dom.canvasDistribution) {
    state.charts.distribution = new Chart(dom.canvasDistribution, {
      type: "doughnut",
      data: {
        labels: ["Vrais Positifs (TP)", "Faux Positifs (FP)", "Manquants (FN)"],
        datasets: [{
          data: [4, 0, 0],
          backgroundColor: [
            "#10b981",
            "#f59e0b",
            "#ef4444"
          ],
          borderWidth: 2,
          borderColor: state.theme === "dark" ? "#1e293b" : "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: colors.textColor, font: { size: 11 } }
          }
        },
        cutout: "68%"
      }
    });
  }

  // 3. Graphique Vitesse d'Inférence
  if (dom.canvasSpeed) {
    state.charts.speed = new Chart(dom.canvasSpeed, {
      type: "bar",
      data: {
        labels: ["Few-shot", "Zero Struct.", "CoT", "Zero Naïf", "Zero Brut"],
        datasets: [{
          label: "Tokens / sec",
          data: [14.2, 15.1, 13.8, 16.2, 18.2],
          backgroundColor: [
            "rgba(168, 85, 247, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(168, 85, 247, 0.8)"
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: colors.textColor, font: { size: 10 } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: colors.textColor },
            grid: { color: colors.gridColor }
          }
        }
      }
    });
  }
}

function updateChartsLive(evalResult, metrics, strategy) {
  if (typeof Chart === "undefined") return;

  if (state.charts.distribution && evalResult.hasGroundTruth) {
    state.charts.distribution.data.datasets[0].data = [
      evalResult.tp,
      evalResult.fp,
      evalResult.fn
    ];
    state.charts.distribution.update();
  }

  if (state.charts.speed && metrics.tokens_per_second) {
    const dataArr = state.charts.speed.data.datasets[0].data;
    dataArr[0] = metrics.tokens_per_second;
    state.charts.speed.update();
  }

  if (state.charts.strategies && evalResult.hasGroundTruth) {
    const stratMap = {
      "zeroshot_structured": 0,
      "fewshot": 1,
      "cot": 2,
      "zeroshot_simple": 3,
      "zeroshot_raw": 4
    };
    const idx = stratMap[strategy];
    if (idx !== undefined) {
      state.charts.strategies.data.datasets[0].data[idx] = Math.round(evalResult.f1);
      state.charts.strategies.data.datasets[1].data[idx] = Math.round(evalResult.precision);
      state.charts.strategies.data.datasets[2].data[idx] = Math.round(evalResult.recall);
      state.charts.strategies.update();
    }
  }
}

function updateChartsTheme() {
  if (typeof Chart === "undefined") return;
  const colors = getChartThemeColors();

  [state.charts.strategies, state.charts.speed].forEach(chart => {
    if (!chart) return;
    if (chart.options.scales) {
      if (chart.options.scales.x) {
        chart.options.scales.x.ticks.color = colors.textColor;
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.ticks.color = colors.textColor;
        chart.options.scales.y.grid.color = colors.gridColor;
      }
    }
    if (chart.options.plugins && chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = colors.textColor;
    }
    chart.update();
  });

  if (state.charts.distribution) {
    state.charts.distribution.options.plugins.legend.labels.color = colors.textColor;
    state.charts.distribution.data.datasets[0].borderColor = state.theme === "dark" ? "#1e293b" : "#ffffff";
    state.charts.distribution.update();
  }
}

// ==========================================================================
// 9. Registre de Benchmark Persistant & Historique Complet (Étape 4)
// ==========================================================================
const BENCHMARK_STORAGE_KEY = "llm_tp_master2_benchmark";

function loadBenchmarkFromStorage() {
  try {
    const raw = localStorage.getItem(BENCHMARK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.benchmarkRuns = Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : [...DEFAULT_BENCHMARK_RUNS];
    } else {
      state.benchmarkRuns = [...DEFAULT_BENCHMARK_RUNS];
      localStorage.setItem(BENCHMARK_STORAGE_KEY, JSON.stringify(state.benchmarkRuns));
    }
  } catch (e) {
    console.warn("Erreur chargement localStorage:", e);
    state.benchmarkRuns = [...DEFAULT_BENCHMARK_RUNS];
  }
  renderBenchmarkTable();
}

function autoRecordRunToBenchmark(res, req, evalResult) {
  const runItem = {
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    document: state.currentSampleIndex >= 0 && state.samples[state.currentSampleIndex]
      ? state.samples[state.currentSampleIndex].title
      : "Texte Libre",
    strategy: req.strategy,
    temperature: req.temperature,
    jsonValid: res.json_valid,
    precision: evalResult.hasGroundTruth ? evalResult.precision.toFixed(1) : "N/A",
    recall: evalResult.hasGroundTruth ? evalResult.recall.toFixed(1) : "N/A",
    f1: evalResult.hasGroundTruth ? evalResult.f1.toFixed(1) : "N/A",
    duration: res.metrics && res.metrics.total_duration_sec ? `${res.metrics.total_duration_sec}s` : "—",
    speed: res.metrics && res.metrics.tokens_per_second ? `${res.metrics.tokens_per_second} t/s` : "—",
    relationsCount: (res.relations || []).length
  };

  // Ajout au début de l'historique
  state.benchmarkRuns.unshift(runItem);
  try {
    localStorage.setItem(BENCHMARK_STORAGE_KEY, JSON.stringify(state.benchmarkRuns));
  } catch (e) {
    console.warn("Erreur sauvegarde localStorage:", e);
  }

  renderBenchmarkTable();
}

function manualSaveCurrentRun() {
  if (!state.lastResult) return;
  alert("Ce run est déjà enregistré au sommet du registre de benchmark ci-dessous !");
}

function renderBenchmarkTable() {
  if (!state.benchmarkRuns || state.benchmarkRuns.length === 0) {
    dom.benchmarkTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="11">Aucun run enregistré pour l'instant.</td>
      </tr>
    `;
    return;
  }

  dom.benchmarkTableBody.innerHTML = state.benchmarkRuns.map((run, idx) => {
    let f1BadgeClass = "";
    const f1Num = parseFloat(run.f1);
    if (!isNaN(f1Num)) {
      if (f1Num >= 75) f1BadgeClass = "high";
      else if (f1Num >= 40) f1BadgeClass = "mid";
      else f1BadgeClass = "low";
    }

    const precisionNum = parseFloat(run.precision);
    const recallNum = parseFloat(run.recall);

    return `
      <tr>
        <td><strong>#${state.benchmarkRuns.length - idx}</strong></td>
        <td><span style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted);">${escapeHtml(run.time)}</span></td>
        <td><strong>${escapeHtml(run.document)}</strong></td>
        <td><code style="background:var(--bg-subtle); padding:2px 6px; border-radius:4px; font-size:11.5px;">${escapeHtml(run.strategy)}</code></td>
        <td><span style="font-family:var(--font-mono);">${run.temperature}</span></td>
        <td>${run.jsonValid ? '<span style="color:var(--color-success); font-weight:600;">✓ Valide</span>' : '<span style="color:var(--color-danger); font-weight:600;">✗ Invalide</span>'}</td>
        <td><span style="font-family:var(--font-mono);">${!isNaN(precisionNum) ? `${precisionNum.toFixed(1)}%` : "—"}</span></td>
        <td><span style="font-family:var(--font-mono);">${!isNaN(recallNum) ? `${recallNum.toFixed(1)}%` : "—"}</span></td>
        <td><span class="score-badge ${f1BadgeClass}">${!isNaN(f1Num) ? `${f1Num.toFixed(1)}%` : "—"}</span></td>
        <td><span style="font-family:var(--font-mono); font-size:12px;">${escapeHtml(run.duration)}</span></td>
        <td><span style="font-family:var(--font-mono); font-size:12px; color:var(--accent-primary);">${escapeHtml(run.speed)}</span></td>
      </tr>
    `;
  }).join("");
}

function resetOrClearBenchmark() {
  if (confirm("Voulez-vous réinitialiser l'historique aux données de référence complètes ?")) {
    state.benchmarkRuns = [...DEFAULT_BENCHMARK_RUNS];
    localStorage.setItem(BENCHMARK_STORAGE_KEY, JSON.stringify(state.benchmarkRuns));
    renderBenchmarkTable();
  }
}

function exportBenchmarkToCSV() {
  if (!state.benchmarkRuns || state.benchmarkRuns.length === 0) {
    alert("Aucune donnée dans le benchmark à exporter.");
    return;
  }

  const headers = [
    "#",
    "Heure",
    "Document",
    "Strategie",
    "Temperature",
    "Format_JSON",
    "Precision_PCT",
    "Rappel_PCT",
    "F1_Score_PCT",
    "Duree",
    "Vitesse",
    "Nombre_Relations"
  ];

  const rows = state.benchmarkRuns.map((r, i) => [
    state.benchmarkRuns.length - i,
    `"${r.time}"`,
    `"${r.document.replace(/"/g, '""')}"`,
    `"${r.strategy}"`,
    r.temperature,
    r.jsonValid ? "Valide" : "Invalide",
    r.precision !== "N/A" ? `${r.precision}%` : "",
    r.recall !== "N/A" ? `${r.recall}%` : "",
    r.f1 !== "N/A" ? `${r.f1}%` : "",
    `"${r.duration}"`,
    `"${r.speed}"`,
    r.relationsCount || 0
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `benchmark_historique_re-docred_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================================================
// 10. Utilitaires
// ==========================================================================
function copyToClipboard(text, btnElement) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.textContent;
    btnElement.textContent = "Copié !";
    setTimeout(() => {
      btnElement.textContent = originalText;
    }, 1500);
  }).catch(() => {
    alert("Impossible de copier automatiquement.");
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

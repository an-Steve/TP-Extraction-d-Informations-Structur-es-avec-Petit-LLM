# Phase 3 : Interface Utilisateur Professionnelle (DA Retouch, Sans Emoji & Benchmark)

Ce guide détaille pas à pas l'implémentation de votre interface utilisateur **React (Vite + JavaScript)** qui s'exécute sur `http://localhost:5173` et communique avec votre API Flask (`http://localhost:5000`).

---

## 1. Principes de Design & Direction Artistique (DA Retouch)

L'interface adopte la charte graphique et l'ergonomie de référence de votre projet **Retouch** (`C:\retouch\frontend`) :
1. **Palette stricte 3 couleurs (60-30-10)** :
   * **Fond 60%** : Slate-50 (`#f8fafc`) et cartes blanches pures (`#ffffff`) avec bordures Slate-200 (`#e2e8f0`).
   * **Typographie 30%** : Slate-900 (`#0f172a`) pour les titres et Slate-500 (`#64748b`) pour les métadonnées.
   * **Accent 10%** : Retouch Purple (`#a855f7` / hover `#9333ea`) pour les actions principales et les valeurs clés.
2. **Aucun emoji** : Remplacement systématique par des icônes SVG vectorielles fines et une typographie sobre.
3. **Workflow linéaire en 4 étapes** :
   * **Étape 1 : Document Source** : Génération ou sélection d'un texte issu de Re-DocRED avec sa vérité terrain.
   * **Étape 2 : Configuration & Prompting** : Segmented control des 5 stratégies, température, et format strict Ollama.
   * **Étape 3 : Métriques & Évaluation** : Scoreboard KPI minimaliste, comparatif double-colonne, sortie YAML et réponse brute.
   * **Étape 4 : Registre de Benchmark** : Tableau persistant (`localStorage`) de tous vos runs avec export 1-clic en **CSV**.

---

## 2. Arborescence du Dossier `frontend/`

```text
frontend/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx              # Point d'entrée React
    ├── App.jsx               # Composant principal (4 étapes, benchmark, CSV)
    ├── App.css               # Design System Retouch (palette 3 couleurs, sans emoji)
    └── api.js                # Client API Flask (port 5000)
```

---

## 3. Étape 1 : Le Service API (`frontend/src/api.js`)

Le fichier [frontend/src/api.js](file:///C:/MASTER2_IA/LLM_Cour/Tp1/frontend/src/api.js) :

```javascript
/**
 * frontend/src/api.js
 * Client HTTP pour communiquer avec l'API Flask (port 5000).
 */
export const API_BASE_URL = "http://localhost:5000";

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, data };
  } catch (error) {
    return { online: false, error: error.message };
  }
}

export async function getStrategies() {
  const res = await fetch(`${API_BASE_URL}/strategies`);
  if (!res.ok) throw new Error("Impossible de récupérer les stratégies");
  return await res.json();
}

export async function getSamples() {
  const res = await fetch(`${API_BASE_URL}/samples`);
  if (!res.ok) throw new Error("Impossible de récupérer les exemples");
  return await res.json();
}

export async function extractRelations(text, strategy = "zeroshot_structured", temperature = 0.0, forceJson = true) {
  const res = await fetch(`${API_BASE_URL}/extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      strategy,
      temperature,
      force_json: forceJson,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Erreur serveur HTTP ${res.status}`);
  }

  return await res.json();
}
```

---

## 4. Étape 2 : Le Composant Principal (`frontend/src/App.jsx`)

Le fichier [frontend/src/App.jsx](file:///C:/MASTER2_IA/LLM_Cour/Tp1/frontend/src/App.jsx) gère l'état complet, le calcul dynamique des métriques sémantiques et le registre de benchmark.

---

## 5. Étape 3 : Le Design System (`frontend/src/App.css`)

Le fichier [frontend/src/App.css](file:///C:/MASTER2_IA/LLM_Cour/Tp1/frontend/src/App.css) applique les variables et composants de la DA Retouch.

---

## 6. Lancement & Utilisation

### Terminal 1 — Backend Flask :
```powershell
cd C:\MASTER2_IA\LLM_Cour\Tp1
.\venv\Scripts\Activate.ps1
python backend/main.py
```

### Terminal 2 — Frontend React :
```powershell
cd C:\MASTER2_IA\LLM_Cour\Tp1\frontend
npm run dev
```

Rendez-vous sur **`http://localhost:5173`** :
1. Cliquez sur **`Generer un texte`** (Étape 1).
2. Choisissez une stratégie et réglez la température (Étape 2).
3. Cliquez sur **`Lancer l'extraction`** (Étape 3) pour visualiser les métriques et le comparatif.
4. Cliquez sur **`Enregistrer dans le benchmark`** pour stocker le run dans le registre.
5. Une fois vos expérimentations terminées, cliquez sur **`Exporter en CSV`** pour télécharger votre jeu de résultats complet pour votre rapport !

# Phase 1 : Configuration de l'Environnement et de l'Espace de Travail

Ce document récapitule toutes les étapes et commandes nécessaires pour initialiser votre projet sous **Windows (PowerShell)**.

---

## 1. Télécharger et tester le modèle avec Ollama

Le sujet impose d'utiliser un modèle d'environ **1 milliard de paramètres** exécuté localement. Nous utilisons **Llama 3.2 1B**.

### A. Télécharger le modèle (Pull)
Dans un terminal PowerShell :
```powershell
ollama pull llama3.2:1b
```
*(Le modèle pèse environ 1.3 Go et ne prend que quelques minutes à télécharger).*

### B. Vérifier que le modèle est bien présent
```powershell
ollama list
```
Vous devriez voir `llama3.2:1b` dans la liste.

### C. Tester le modèle en ligne de commande
```powershell
ollama run llama3.2:1b "Bonjour, qui es-tu en une phrase ?"
```
Si le modèle répond, Ollama est 100% opérationnel ! Pour quitter le chat interactif d'Ollama, tapez `/bye`.

> [!NOTE]
> Le service Ollama tourne en tâche de fond sur votre machine et écoute automatiquement sur l'URL locale : `http://localhost:11434`.

---

## 2. Création de l'arborescence des dossiers

Ouvrez un terminal PowerShell à la racine du projet `C:\MASTER2_IA\LLM_Cour\Tp1` et exécutez la commande suivante pour créer la structure :

```powershell
# Création des dossiers
New-Item -ItemType Directory -Force -Path backend, evaluation
```

L'arborescence de votre projet sera la suivante :
```text
Tp1/
├── backend/            # Code de votre API (Flask ou FastAPI)
├── docs/               # Sujet du TP et guides de documentation
│   ├── TP_Extraction_Information_LLM.pdf
│   ├── GUIDE_TP.md
│   └── PHASE_1.md
├── evaluation/         # Scripts de benchmark & métriques (Re-DocRED)
└── requirements.txt    # Liste des packages Python nécessaires
```
*(Votre projet React Native pourra soit être placé dans un dossier `frontend/` ici, soit rester dans son propre dossier séparé).*

---

## 3. Mise en place de l'environnement virtuel Python

Il est fortement recommandé d'isoler les dépendances Python dans un environnement virtuel (`venv`).

### A. Créer le venv
```powershell
python -m venv venv
```

### B. Activer le venv sous PowerShell
```powershell
# Autoriser temporairement l'exécution de scripts si nécessaire
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Activer l'environnement
.\venv\Scripts\Activate.ps1
```
*(Vous devez voir `(venv)` s'afficher au début de votre invite de commande).*

---

## 4. Installation des dépendances (Flask ou FastAPI)

Pour ce TP, nous avons besoin de :
* **Un serveur backend** : **Flask** (avec `flask-cors` pour autoriser les requêtes de React Native).
* **Validation de schéma JSON** : **Pydantic** (demandé par le TP pour valider les triplets extraits).
* **Communication HTTP** : `requests` (pour appeler Ollama depuis le backend).
* **Dataset & Évaluation** : `datasets`, `pandas` (pour charger Re-DocRED en Phase 4).

### A. Créer le fichier `requirements.txt`
À la racine de `Tp1`, créez ou mettez à jour le fichier `requirements.txt` avec le contenu suivant :

```text
flask
flask-cors
pydantic
requests
python-dotenv
```

*(Si vous préférez FastAPI plutôt que Flask, remplacez `flask` et `flask-cors` par `fastapi` et `uvicorn[standard]`)*.

### B. Installer les paquets
Assurez-vous que votre `(venv)` est bien activé, puis lancez :
```powershell
pip install -r requirements.txt
```

---

## 5. Script de Test : Valider la connexion Backend $\rightarrow$ Ollama

Pour être certain que votre backend Python pourra bien interroger Ollama, créez un fichier `backend/test_ollama.py` :

```python
import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

def test_ollama():
    payload = {
        "model": "llama3.2:1b",
        "prompt": "Extract entities from: 'Marie Curie discovered Radium in Paris.' Return JSON.",
        "stream": False
    }
    
    print("Envoi de la requête à Ollama...")
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        print("\n--- Réponse d'Ollama ---")
        print(result.get("response"))
        print("\nTest réussi avec succès !")
    except requests.exceptions.ConnectionError:
        print("[ERREUR] Impossible de contacter Ollama sur http://localhost:11434. Vérifiez qu'Ollama est bien lancé.")
    except Exception as e:
        print(f"[ERREUR] : {e}")

if __name__ == "__main__":
    test_ollama()
```

Pour exécuter ce test :
```powershell
python backend/test_ollama.py
```

---

## 6. Récapitulatif des commandes en un coup d'œil

| Étape | Commande PowerShell |
|---|---|
| **1. Télécharger le LLM** | `ollama pull llama3.2:1b` |
| **2. Créer l'environnement** | `python -m venv venv` |
| **3. Activer l'environnement** | `.\venv\Scripts\Activate.ps1` |
| **4. Installer les libs** | `pip install flask flask-cors pydantic requests` |
| **5. Tester Ollama** | `python backend/test_ollama.py` |

---

Une fois ces étapes validées, votre espace de travail sera prêt pour la **Phase 2 : Développement de l'API Backend et des stratégies de Prompting** !

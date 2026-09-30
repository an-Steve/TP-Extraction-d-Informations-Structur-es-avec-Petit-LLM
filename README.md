# TP Extraction d'Informations Structurées avec un Petit LLM
 
> TP visant à extraire des informations structurées à partir de documents ou de données textuelles brutes en exploitant la puissance d'un petit modèle de langage (Small LLM). Ce projet comprend un backend Python/Flask et une interface web interactive.

[![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Backend-black?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Ollama](https://img.shields.io/badge/Ollama-LLM-black?logo=ollama&logoColor=white)](https://ollama.com/)
[![IA Générative](https://img.shields.io/badge/IA%20G%C3%A9n%C3%A9rative-LLM-purple)](https://en.wikipedia.org/wiki/Generative_artificial_intelligence)
[![Prompt Engineering](https://img.shields.io/badge/Prompt%20Engineering-LLM-orange)](#)
[![HTML5](https://img.shields.io/badge/HTML5-Frontend-orange?logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Frontend-blue?logo=css3&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow?logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange?logo=jupyter&logoColor=white)](https://jupyter.org/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github&logoColor=white)](https://github.com/)
 
---
### Aperçu & Captures d'écran

Voici quelques illustrations et captures d'écran présentant le fonctionnement du projet :

<img width="1917" height="881" alt="image" src="https://github.com/user-attachments/assets/1ba96faf-e9d8-47c2-9818-bf485fc35b53" />
<img width="1917" height="727" alt="image" src="https://github.com/user-attachments/assets/0d25c8ed-682e-4834-9a1f-bfed6b02305a" />
<img width="1907" height="587" alt="image" src="https://github.com/user-attachments/assets/43d565f4-99f0-4829-9b34-a977a8b6efe8" />
<img width="1655" height="745" alt="image" src="https://github.com/user-attachments/assets/ae72d30e-0f78-4475-a812-e45a56e5076a" />
<img width="1917" height="185" alt="image" src="https://github.com/user-attachments/assets/0577f79e-687d-49bf-8e7b-3f73cdb34b08" />

##  Étapes du projet

Le projet est organisé en **4 étapes principales**, depuis la préparation des données jusqu'à l'analyse des résultats.

| Étape          | Intitulé                            | Description                                                                                    | Objectif                                                                        |
| -------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
|  **Étape 1** | 📝 **Préparation du prompt**        | Définition des instructions données au Small LLM afin de guider l'extraction des informations. | Construire un prompt clair et précis pour obtenir des résultats structurés.     |
|  **Étape 2** | ⚙️ **Configuration de la sortie**   | Définition du format attendu pour les informations extraites par le modèle.                    | Obtenir une sortie structurée, exploitable et cohérente.                        |
|  **Étape 3** | 🤖 **Extraction avec le Small LLM** | Envoi des données au modèle local via **Ollama** et traitement de sa réponse.                  | Extraire automatiquement les informations pertinentes à partir du texte fourni. |
|  **Étape 4** | 📊 **Analyse et visualisation**     | Évaluation des résultats obtenus à l'aide de métriques et de graphiques.                       | Mesurer la qualité de l'extraction et visualiser les performances du modèle.    |


```
###  Architecture du projet

TP-Extraction-d-Informations-Structurées-avec-Petit-LLM/
│
├── 📁 backend/                         # Backend Python / API
│   ├── 🐍 main.py                     # Point d'entrée de l'application Flask
│   ├── 🤖 ollama_service.py           # Communication avec Ollama et le LLM
│   ├── 💬 prompt_service.py           # Création et gestion des prompts
│   └── 📋 schemas.py                  # Schémas et structures des données
│
├── 📁 frontend/                        # Interface utilisateur
│   ├── 🌐 index.html                  # Structure de la page web
│   ├── 🎨 style.css                   # Mise en forme et design
│   └── ⚡ script.js                    # Interactions et communication avec le backend
│
├── 📁 notebooks/                       # Expérimentations Prompt Engineering
│   ├── 1-Basic_Prompt_Structure.ipynb
│   ├── 2-Output_Configuration.ipynb
│   ├── 3-Role_Prompting.ipynb
│   ├── 4-Separating_Data_and_Instructions.ipynb
│   ├── 5-Formatting_Output_and_Speaking.ipynb
│   └── 6-Few_Shot_Prompting.ipynb
│
├── 📚 Documentation/
│   ├── GUIDE_TP.md                    # Guide général du TP
│   ├── NOTEBOOK_1.md                   # Documentation du notebook 1
│   ├── NOTEBOOK_2.md                   # Documentation du notebook 2
│   ├── NOTEBOOK_3.md                   # Documentation du notebook 3
│   ├── NOTEBOOK_4.md                   # Documentation du notebook 4
│   ├── NOTEBOOK_5.md                   # Documentation du notebook 5
│   └── NOTEBOOK_6.md                   # Documentation du notebook 6
│
├── 📊 Phases du projet/
│   ├── PHASE_1.md                      # Première phase du projet
│   ├── PHASE_2.md                      # Deuxième phase du projet
│   └── PHASE_3.md                      # Troisième phase du projet
│
├── 📄 RAPPORT_ANALYSE_NOTEBOOK        # Analyse des expérimentations
├── 📝 RESUME_SESSION                   # Résumé du travail réalisé
│
├── 📦 requirements.txt                 # Dépendances Python
├── ▶️ run.bat                          # Lancement rapide de l'application
├── 🧪 test_ollama.py                   # Test de connexion avec Ollama
├── 🔒 .gitignore                       # Fichiers exclus du dépôt Git
└── 📖 README.md                        # Documentation principale du projet

```
###  Description des principales parties

| Dossier / Fichier       | Description                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| **`backend/`**          | Contient toute la logique serveur et les services Python.                     |
| **`frontend/`**         | Contient l'interface web de l'application.                                    |
| **`notebooks/`**        | Regroupe les expérimentations liées au Prompt Engineering.                    |
| **`Documentation/`**    | Contient les guides et explications du projet.                                |
| **`Phases du projet/`** | Présente les différentes étapes de réalisation.                               |
| **`requirements.txt`**  | Liste les bibliothèques Python nécessaires au fonctionnement du projet.       |
| **`test_ollama.py`**    | Permet de vérifier la communication avec Ollama.                              |
| **`.gitignore`**        | Empêche certains fichiers locaux ou sensibles d'être envoyés sur GitHub.      |
| **`README.md`**         | Présente le projet, son installation, son fonctionnement et son architecture. |

> 🔐 **Confidentialité :** certains fichiers, données, configurations ou ressources utilisés pendant le développement ne sont volontairement pas présents dans le dépôt GitHub. Ils peuvent contenir des informations confidentielles ou des éléments spécifiques à l'environnement local.


##  Fonctionnalités Principales

* **Extraction d'informations structurées :** Analyse de texte brut et conversion en formats structurés.
* **Interface Web Responsive :** Interface utilisateur ergonomique.
* ** Mode Sombre & Mode Clair :** Basculement rapide entre un thème sombre et un thème clair via un bouton d'action. La préférence est sauvegardée localement dans le navigateur.
## 📊 Graphiques & visualisations intégrés

Le projet intègre plusieurs types de **graphiques et d'indicateurs visuels** afin de faciliter l'analyse des informations extraites et d'évaluer les performances du modèle.

Ces visualisations permettent de transformer les résultats bruts du **Small LLM** en informations facilement compréhensibles.

##  Graphiques & indicateurs

Le projet intègre plusieurs types de **graphiques et d'indicateurs visuels** permettant de synthétiser les résultats de l'extraction et d'évaluer les performances du **Small LLM**.

| Visualisation                         | Rôle                                                                                  | Données / indicateurs                                                               | Utilité                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 📊 **Graphique en barres**            | Visualiser le nombre d'occurrences pour chaque type d'information détectée.           | **Score**, **Précision**, **Rappel**                                                | Permet d'obtenir rapidement une vue d'ensemble des résultats et de comparer les différentes métriques. |
| 🍩 **Graphique en camembert / Donut** | Représenter la proportion de chaque catégorie par rapport à l'ensemble des résultats. | Répartition des différentes catégories d'informations extraites.                    | Facilite l'identification des catégories **majoritaires et minoritaires**.                             |
| 📈 **Indicateurs de performance**     | Présenter les performances obtenues par le **Small LLM** lors de l'extraction.        | **Précision (Precision)**, **Rappel (Recall)**, **Score F1**, **Taux de confiance** | Permet d'évaluer et de suivre la **qualité et la fiabilité des résultats** produits par le modèle.     |

###  Définition des métriques

| Métrique                  | Définition                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| **Précision (Precision)** | Proportion des informations extraites qui sont correctement identifiées.                  |
| **Rappel (Recall)**       | Proportion des informations pertinentes qui ont été correctement détectées par le modèle. |
| **Score F1**              | Mesure combinant la précision et le rappel afin d'obtenir une évaluation globale.         |
| **Taux de confiance**     | Niveau de confiance associé à un résultat lorsque cette information est disponible.       |


---



#  Installation et lancement

##  Activer l'environnement virtuel Python

Sous **Windows PowerShell**, activez l'environnement virtuel avec la commande suivante :

```powershell
.\venv\Scripts\Activate.ps1
```

Une fois l'environnement activé, vous devriez voir **`(venv)`** apparaître au début de votre terminal :

```text
(venv) PS C:\...\TP-Extraction-d-Informations-Structur-es-avec-Petit-LLM>
```

>  **Remarque :** si l'environnement virtuel n'existe pas encore, vous pouvez le créer avec :
>
> ```powershell
> python -m venv venv
> ```

---

##  Installer les dépendances

Avec l'environnement virtuel activé, installez les dépendances nécessaires au projet :

```powershell
pip install -r requirements.txt
```

---

##  Démarrer le serveur backend

Une fois les dépendances installées, lancez le serveur Flask avec :

```powershell
python .\backend\main.py
```

Le backend démarre alors sur le serveur local.

---

##  Accéder à l'application web

Ouvrez votre navigateur et rendez-vous à l'adresse suivante :

👉 **http://localhost:5000/**

L'interface web de l'application sera alors accessible localement.

---

##  Résumé des commandes

Pour lancer rapidement le projet après son installation :

```powershell
.\venv\Scripts\Activate.ps1
python .\backend\main.py
```

Puis ouvrez :

```text
http://localhost:5000/
```

---

## 🛑 Arrêter le serveur

Pour arrêter le serveur Flask, retournez dans le terminal où il est exécuté et utilisez :

```text
Ctrl + C
```

L'environnement virtuel peut ensuite être désactivé avec :

```powershell
deactivate
```


##  Informations sur le projet

**Réalisé par :** ANTON NELCON Steve

**Formation :** Master 2 Informatique — Ingénierie en Intelligence Artificielle

**Université :** Université Paris 8

**Date de dernière modification :** 30 septembre 2026

---

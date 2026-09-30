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
📸 Aperçu & Captures d'écran

Voici quelques illustrations et captures d'écran présentant le fonctionnement du projet :

<img width="1917" height="881" alt="image" src="https://github.com/user-attachments/assets/1ba96faf-e9d8-47c2-9818-bf485fc35b53" />
<img width="1917" height="727" alt="image" src="https://github.com/user-attachments/assets/0d25c8ed-682e-4834-9a1f-bfed6b02305a" />
<img width="1907" height="587" alt="image" src="https://github.com/user-attachments/assets/43d565f4-99f0-4829-9b34-a977a8b6efe8" />
<img width="1655" height="745" alt="image" src="https://github.com/user-attachments/assets/ae72d30e-0f78-4475-a812-e45a56e5076a" />
<img width="1917" height="185" alt="image" src="https://github.com/user-attachments/assets/0577f79e-687d-49bf-8e7b-3f73cdb34b08" />



<img width="237" height="852" alt="image" src="https://github.com/user-attachments/assets/f908f8c3-80c6-45a1-a714-30de2d96c966" />
<img width="237" height="850" alt="image" src="https://github.com/user-attachments/assets/09292c5f-650e-48eb-9c8d-ec5610749a09" />

🛠️ Outils & Technologies Utilisés

    Langage principal : Python

    Backend & API : Flask / Python

    Intelligence Artificielle / LLM : Small LLM (Petit Modèle de Langage pour l'extraction d'information)

    Environnement Virtuel : venv (PowerShell / Windows)

    Interface Web : HTML, CSS, JavaScript

📂 Architecture du projet

L'organisation générale du projet est la suivante :

TP-Extraction-d-Informations-Structur-es-avec-Petit-LLM/
│
├── backend/
│   ├── main.py
│   ├── ollama_service.py
│   ├── prompt_service.py
│   └── schemas.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── 1-Basic_Prompt_Structure.ipynb
├── 2-Output_Configuration.ipynb
├── 3-Role_Prompting.ipynb
├── 4-Separating_Data_and_Instructions.ipynb
├── 5-Formatting_Output_and_Speaking.ipynb
├── 6-Few_Shot_Prompting.ipynb
│
├── GUIDE_TP.md
├── NOTEBOOK_1.md
├── NOTEBOOK_2.md
├── NOTEBOOK_3.md
├── NOTEBOOK_4.md
├── NOTEBOOK_5.md
├── NOTEBOOK_6.md
│
├── PHASE_1.md
├── PHASE_2.md
├── PHASE_3.md
├── RAPPORT_ANALYSE_NOTEBOOK
├── RESUME_SESSION
│
├── requirements.txt
├── run.bat
├── test_ollama.py
├── .gitignore
└── README.md

Remarque concernant les fichiers confidentiels :

Certains fichiers, données, configurations ou informations utilisés pendant le développement du projet ne sont volontairement pas présents dans le dépôt GitHub.

Ces éléments peuvent contenir des informations confidentielles, des données privées, des clés ou tokens d'accès, des configurations locales ou d'autres informations qui ne doivent pas être publiées.

Le dépôt contient donc uniquement les fichiers nécessaires à la compréhension et à la présentation du projet, tandis que certains éléments sensibles restent uniquement dans l'environnement local.

🚀 Installation et Lancement
1. Activer l'environnement virtuel Python

Sous Windows (PowerShell), exécutez la commande suivante pour activer l'environnement virtuel :
PowerShell

.\venv\Scripts\Activate.ps1

2. Démarrer le serveur backend

Une fois l'environnement virtuel activé, lancez le serveur Flask :
PowerShell

python .\backend\main.py

3. Accéder au site web

Ouvrez votre navigateur web et rendez-vous à l'adresse suivante :

👉 http://localhost:5000/

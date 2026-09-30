# Guide & Feuille de Route : TP Extraction d'Informations avec Petit LLM

## 1. Mise au point importante : RAG vs Extraction d'Informations

> **Ce TP n'est PAS un RAG (Retrieval-Augmented Generation).**
> - **RAG** : On découpe des documents, on les vectorise dans une base vectorielle (ChromaDB, FAISS...) et on cherche des passages pertinents pour répondre à des questions ouvertes.
> - **Ce TP (Information & Relation Extraction)** : On fournit un document complet en entrée au LLM, et celui-ci doit extraire de manière structurée (format JSON) les entités et les relations factuelles (triplets `(sujet, relation, objet)`).

L'objectif central est de **mesurer l'efficacité de différentes stratégies de prompting** sur un **petit modèle local d'environ 1 milliard de paramètres** (Llama 3.2 1B).

---

## 2. Architecture imposée par le sujet

Le sujet spécifie une architecture 3-tiers :
```
┌─────────────────────────────────┐
│     Interface React Native      │  (Application Mobile / Web avec écran de
│      (iOS / Android / Web)      │   saisie, sélecteur de stratégie & affichage)
└────────────────┬────────────────┘
                 │ Appel HTTP REST (JSON)
                 ▼
┌─────────────────────────────────┐
│         Backend / API           │  (FastAPI avec CORS activé, construction des prompts,
│           (FastAPI)             │   appel LLM, validation JSON Pydantic)
└────────────────┬────────────────┘
                 │ API locale (port 11434)
                 ▼
┌─────────────────────────────────┐
│         Serveur LLM Local       │  (Ollama avec le modèle llama3.2:1b)
│             (Ollama)            │
└─────────────────────────────────┘
```

> **Frontend ne doit pas interroger Ollama directement** : Tout passe par le Backend.

### Pourquoi FastAPI plutôt que Django ?
- **Django** est un framework "batteries-included" conçu pour des applications monolithiques avec base de données SQL relationnelle, système d'authentification utilisateur et panneau d'administration. Il est lourd et inadapté pour ce TP d'IA.
- **FastAPI** est le standard de l'industrie pour exposer des modèles de Machine Learning et LLM :
  - Ultra-rapide et minimaliste.
  - Validation automatique des schémas JSON avec **Pydantic** (ce qui répond directement au point 7 du TP).
  - Documentation Swagger UI générée automatiquement (`/docs`).

---

## 3. Les Stratégies de Prompting à implémenter et comparer

Le modèle 1B étant petit, il a tendance à mal respecter les contraintes JSON et à halluciner. C'est l'intérêt d'expérimenter :

| # | Stratégie | Description |
|---|---|---|
| 1 | **Zero-shot Naïf** | Consigne basique : *"Extrais les relations du texte au format JSON."* |
| 2 | **Zero-shot Structuré / Guidé** | Schéma JSON explicite fourni, liste fermée de relations autorisées, consignes d'interdiction d'halluciner. |
| 3 | **Few-shot Prompting** | Ajout de 2 à 3 exemples complets `(Texte -> JSON attendu)` issus du jeu d'entraînement de Re-DocRED. |
| 4 | **Raisonnement / Décomposition (CoT)** | Demander au modèle de décomposer : 1. Entités nommées repérées, 2. Relations potentielles entre elles, 3. Filtrage factuel, 4. Bloc JSON final. |
| 5 | **Variation de la Température** | Comparer `T = 0.0` (déterministe, recommandé pour l'extraction structurée), `T = 0.3` et `T = 0.7`. |

---

## 4. Données et Évaluation (Dataset Re-DocRED)

- **Dataset** : [`tonytan48/Re-DocRED`](https://huggingface.co/datasets/tonytan48/Re-DocRED)
  - Jeu de données standard pour la Relation Extraction au niveau document.
  - Chaque échantillon contient le texte, les entités et les relations annotées (vérité terrain).
- **Partitionnement** :
  - **Exemples de prompt (Few-shot)** : Choisir 2-3 exemples typiques.
  - **Échantillon d'évaluation** : Évaluer systématiquement sur un sous-ensemble (ex: 20 à 50 documents) pour comparer les stratégies de manière rigoureuse et automatique.

### Métriques d'évaluation à calculer :
1. **Taux de validité JSON (Format Validity Rate)** :
   $$\% \text{ JSON valide} = \frac{\text{Nombre de sorties JSON parsables}}{\text{Nombre total d'essais}} \times 100$$
2. **Précision (Precision)** :
   $$\text{Précision} = \frac{|\text{Relations extraites correctes}|}{|\text{Relations extraites totales}|}$$
3. **Rappel (Recall)** :
   $$\text{Rappel} = \frac{|\text{Relations extraites correctes}|}{|\text{Relations réelles de référence}|}$$
4. **F1-Score** :
   $$F_1 = 2 \times \frac{\text{Précision} \times \text{Rappel}}{\text{Précision} + \text{Rappel}}$$
5. **Taux d'hallucination** : Relations inventées non supportées par le texte ou entités inexistantes.

---

## 5. Plan d'Action pas à pas

### Phase 1 : Configuration de l'environnement
- Télécharger le modèle local : `ollama run llama3.2:1b` (ou `ollama pull llama3.2:1b`).
- Installer les dépendances Python : `fastapi`, `uvicorn`, `pydantic`, `ollama` (ou `httpx`), `datasets`, `pandas`, `streamlit` (ou frontend web simple).

### Phase 2 : Développement du Backend (FastAPI)
- Définir les modèles Pydantic (`RelationItem`, `ExtractionResponse`, `ExtractionRequest`).
- Implémenter le service d'appel à Ollama avec contrôle des paramètres (température, prompt, system prompt).
- Implémenter le constructeur de prompts pour les 4 stratégies.
- Implémenter le validateur/nettoyeur de JSON (extraction de blocs Markdown ` ```json ... ``` `).

### Phase 3 : Interface Utilisateur
- Interface permettant de :
  - Sélectionner un texte d'exemple issu de Re-DocRED ou saisir un texte libre.
  - Choisir la stratégie de prompting (Zero-shot, Few-shot, CoT...).
  - Régler la température via un curseur (0.0 à 1.0).
  - Bouton "Extraire les informations".
  - Affichage visuel du JSON retourné, des triplets sous forme de tableau ou graphe, et du temps de réponse.

### Phase 4 : Script d'Évaluation & Comparaison
- Script automatisé `evaluate.py` testant les stratégies sur $N$ documents de test.
- Génération d'un tableau récapitulatif (Pandas / Markdown / CSV) et graphiques comparatifs des métriques.

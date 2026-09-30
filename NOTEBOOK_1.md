# Guide Pédagogique — Notebook 1 : Basic Prompt Structure

> **Référence** : [notebook/1-Basic_Prompt_Structure.ipynb](file:///C:/MASTER2_IA/LLM_Cour/Tp1/notebook/1-Basic_Prompt_Structure.ipynb)  
> **Modèle cible** : `Llama-3.2-1B-Instruct` via Ollama (`http://localhost:11434`)  
> **Niveau** : Master 2 IA — TP Extraction d'Informations Structurées

---

## 1. Objectif Pédagogique

Ce premier notebook établit les fondations de l'ingénierie de prompt pour un petit modèle de langage (SLM de 1 milliard de paramètres).  
L'objectif est de démontrer qu'**un prompt vague produit des résultats médiocres et imprévisibles**, tandis qu'un prompt découpé selon une **structure canonique à 4 piliers** permet d'obtenir des réponses fiables et directement exploitables.

---

## 2. Les 4 Piliers de la Structure Canonique d'un Prompt

Tout prompt rigoureux doit comporter quatre sections distinctes :

| Pilier | Définition | Exemple dans le TP |
|---|---|---|
| **1. Tâche (*Task*)** | L'action exacte attendue, formulée avec un verbe d'action clair et sans ambiguïté. | *"Extrais tous les triplets de relations factuelles du texte."* |
| **2. Contexte (*Context*)** | Le cadre applicatif, le domaine d'expertise ou le rôle métier. | *"Tu es un extracteur d'information travaillant sur le benchmark Re-DocRED."* |
| **3. Contraintes (*Constraints*)** | Les règles négatives strictes (ce qu'il ne faut PAS faire), limites et consignes anti-hallucination. | *"N'invente aucun fait non mentionné. Ne génère aucun texte d'introduction ni de conclusion."* |
| **4. Format de Sortie (*Output Format*)** | Le contrat d'interface attendu (JSON, YAML, CSV). | *"Réponds UNIQUEMENT par un objet JSON sous la clé 'relations' avec subject, relation, object."* |

---

## 3. Code & Expérimentations Réalisées dans le Notebook

### A. Le Prompt Naïf (Mauvaise Pratique)
```python
import ollama

prompt_naif = "Fais un résumé du texte."
response = ollama.chat(
    model="llama3.2:1b",
    messages=[{"role": "user", "content": prompt_naif}]
)
print(response.message.content)
```
* **Résultat observé** : Le modèle bavarde, choisit arbitrairement la longueur, le ton, et ne fournit aucune structure exploitable par un programme informatique.

### B. Le Prompt Structuré à 4 Piliers (Bonne Pratique)
```python
prompt_structure = """
[CONTEXTE]
Tu es un assistant spécialisé dans l'analyse sémantique de textes biographiques.

[TÂCHE]
Extrais les entités principales et leurs relations à partir du texte ci-dessous.

[CONTRAINTES]
- Limite-toi strictement aux faits explicitement formulés dans le texte.
- N'ajoute aucun commentaire, politesse ou explication.
- Si une information est incertaine, ignore-la.

[FORMAT DE SORTIE]
Uniquement un tableau JSON avec les clés : subject, relation, object.
"""

response = ollama.chat(
    model="llama3.2:1b",
    messages=[{"role": "user", "content": prompt_structure}]
)
print(response.message.content)
```

---

## 4. Ce que cela nous enseigne pour Llama 3.2 1B

1. **Sensibilité critique aux consignes négatives** : Contrairement aux modèles massifs (GPT-4, Claude), Llama 1B a tendance à ignorer les négations (*"Ne pas faire..."*) si elles ne sont pas mises en exergue en majuscules ou associées à une consigne positive d'alternative.
2. **Besoin d'un format explicite** : Sans la section `[FORMAT DE SORTIE]`, le modèle 1B produit systématiquement du texte libre en prose, rendant tout parsing JSON impossible.

---

## 5. Application Directe dans l'Architecture du TP

Dans notre backend [backend/services/prompt_service.py](file:///C:/MASTER2_IA/LLM_Cour/Tp1/backend/services/prompt_service.py) :
* La stratégie **`zeroshot_raw`** correspond exactement à l'expérience du prompt naïf du Notebook 1 (baseline servant à prouver scientifiquement que le LLM brut échoue à faire du JSON).
* La stratégie **`zeroshot_structured`** implémente directement le découpage canonique en 4 blocs.

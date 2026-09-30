# Guide Pédagogique — Notebook 6 : Few-Shot Prompting & In-Context Learning

> **Référence** : [notebook/6-Few_Shot_Prompting.ipynb](file:///C:/MASTER2_IA/LLM_Cour/Tp1/notebook/6-Few_Shot_Prompting.ipynb)  
> **Modèle cible** : `Llama-3.2-1B-Instruct` via Ollama (`http://localhost:11434`)  
> **Niveau** : Master 2 IA — TP Extraction d'Informations Structurées

---

## 1. Objectif Pédagogique

Ce sixième notebook explore la technique de conditionnement la plus puissante pour les petits modèles de langage : **l'apprentissage en contexte (*In-Context Learning*) via Few-Shot Prompting**.  
L'objectif est d'enseigner au modèle la forme exacte, les noms de clés JSON et le niveau de granularité attendus, **non pas par des explications abstraites, mais par des paires d'exemples concrets**.

---

## 2. Pourquoi le Few-Shot est le "Game Changer" pour un SLM 1B

Sur un modèle de 1 milliard de paramètres :
* **En Zero-Shot** : Le modèle doit deviner seul comment modéliser une relation (va-t-il écrire `"worked with"`, `"collaborator"` ou `"job"` ? Va-t-il mettre `"subject"` ou `"entity_1"` ?). Le taux d'erreur de schéma dépasse souvent 40%.
* **En Few-Shot** : Le mécanisme d'attention du modèle s'aligne immédiatement sur le **motif structurel (*pattern*)** des exemples fournis. Il imite fidèlement :
  1. Le nom des clés JSON (`subject`, `relation`, `object`).
  2. Le format des prédicats (ex: snake_case `educated_at`, `place_of_birth`).
  3. L'absence totale de phrases de politesse superflues.

---

## 3. Structure Canonique d'un Prompt Few-Shot (Multi-tours)

Le notebook démontre qu'au lieu de concaténer tous les exemples dans un seul gros texte `user`, la méthode la plus propre et la plus robuste consiste à alterner les rôles conversationnels `user` et `assistant` :

```python
import ollama

messages = [
    # 1. Règle système globale
    {
        "role": "system",
        "content": "Tu es un extracteur de relations factuelles en JSON sous la clé 'relations'."
    },
    
    # 2. Exemple 1 (Shot 1)
    {
        "role": "user",
        "content": "Texte : Alice Martin studied at Stanford University. She joined Google in 2018."
    },
    {
        "role": "assistant",
        "content": '{"relations": [{"subject": "Alice Martin", "relation": "educated_at", "object": "Stanford University"}, {"subject": "Alice Martin", "relation": "employed_by", "object": "Google"}]}'
    },
    
    # 3. Exemple 2 (Shot 2)
    {
        "role": "user",
        "content": "Texte : Marie Curie was born in Warsaw, Poland. She later moved to Paris."
    },
    {
        "role": "assistant",
        "content": '{"relations": [{"subject": "Marie Curie", "relation": "place_of_birth", "object": "Warsaw"}, {"subject": "Warsaw", "relation": "located_in", "object": "Poland"}]}'
    },
    
    # 4. Requête cible (Le texte à évaluer)
    {
        "role": "user",
        "content": "Texte : Ada Lovelace worked with Charles Babbage on the Analytical Engine."
    }
]

response = ollama.chat(
    model="llama3.2:1b",
    messages=messages,
    options={"temperature": 0.0}
)
print(response.message.content)
```

---

## 4. Résultats & Analyse Comparative : 0-Shot vs 1-Shot vs 3-Shot

Le Notebook 6 formalise les métriques comparatives obtenues sur Llama-3.2-1B :

| Métrique | Zero-Shot Naïf | Zero-Shot Structuré | Few-Shot (2-3 Shots) |
|---|:---:|:---:|:---:|
| **Validité Syntaxe JSON** | ~35% | ~75% | **> 95%** |
| **Exactitude des Clés JSON** | Faible (variations) | Bonne | **100% stable** |
| **Rappel des Relations** | Faible | Moyen | **Élevé** |
| **Bavardage parasite** | Fréquent | Rare | **Quasi nul** |

### Combien d'exemples inclure ?
* **0-shot** : Insuffisant sur un SLM 1B pour des schémas stricts sans grammaire forcée.
* **2 à 3 shots** : **Le compromis optimal.** Suffisant pour fixer le schéma sans saturer le contexte.
* **5+ shots** : Rendement décroissant. Allonge inutilement le temps de calcul (latence) sans gain notable de précision.

---

## 5. Application Directe dans le Backend du TP

Dans [backend/services/prompt_service.py](file:///C:/MASTER2_IA/LLM_Cour/Tp1/backend/services/prompt_service.py) :
* La fonction `build_fewshot` applique rigoureusement cette architecture multi-tours avec 3 exemples issus du domaine de Re-DocRED.
* C'est cette stratégie qui obtient systématiquement les **meilleurs scores de F1 (85% à 100%)** lors de vos tests sur l'interface !

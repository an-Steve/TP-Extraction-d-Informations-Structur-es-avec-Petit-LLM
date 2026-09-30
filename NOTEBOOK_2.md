# Guide Pédagogique — Notebook 2 : Output Configuration & Hyperparamètres

> **Référence** : [notebook/2-Output_Configuration.ipynb](file:///C:/MASTER2_IA/LLM_Cour/Tp1/notebook/2-Output_Configuration.ipynb)  
> **Modèle cible** : `Llama-3.2-1B-Instruct` via Ollama (`http://localhost:11434`)  
> **Niveau** : Master 2 IA — TP Extraction d'Informations Structurées

---

## 1. Objectif Pédagogique

Ce notebook étudie la physique de la génération de texte dans un LLM : comment les probabilités des tokens sont calculées, écrêtées et échantillonnées.  
Il fournit la réponse directe et formelle à la question : **Pourquoi une extraction JSON échoue systématiquement à haute température ($T = 0.7$) sur un petit modèle ?**

---

## 2. Fondements Mathématiques : Des Logits aux Probabilités

Lorsqu'un LLM génère le token suivant, il calcule un vecteur de scores bruts appelés **logits** ($z_i$) pour chaque mot de son vocabulaire (environ 128 000 tokens pour Llama 3.2).  
Ces logits sont ensuite transformés en probabilités par la fonction **Softmax avec Température** ($T$) :

$$P(\text{token}_i) = \frac{e^{z_i / T}}{\sum_{j} e^{z_j / T}}$$

```
                LOGITS BRUTS (z_i)
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
  À basse température (T -> 0)    À haute température (T >= 0.7)
  Différences amplifiées         Distribution aplatie
  Mode Déterministe (Greedy)     Tokens rares favorisés (Créativité / Dérive)
```

### Comportement selon la valeur de $T$ :
* **$T = 0.0$ (Mode Greedy / Déterministe)** : Le modèle choisit mathématiquement et toujours le token ayant la plus haute logit ($\operatorname{argmax}$). **C'est le seul mode garantissant la rigueur d'une syntaxe JSON.**
* **$T = 0.3$ (Équilibré)** : Légère flexibilité sémantique tout en maintenant la structure globale.
* **$T = 0.7+$ (Mode Créatif)** : Les différences de probabilités sont écrasées. Le modèle explore des chemins lexicaux inhabituels.

> **Règle d'or du cours** : Pour toute tâche d'extraction d'information structurée (JSON/Pydantic), **la température doit impérativement être fixée à 0.0**. À $T = 0.7$, un modèle de 1 milliard de paramètres hallucine, bavarde ou brise les accolades fermantes `}`.

---

## 3. Les Hyperparamètres de Contrôle Ollama

Dans le client Python Ollama (`ollama.chat`), les hyperparamètres sont passés dans le dictionnaire `options` :

```python
options = {
    "temperature": 0.0,    # 0.0 = déterministe (greedy)
    "top_k": 40,           # Restreint aux K meilleurs tokens candidats
    "top_p": 0.9,          # Nucleus sampling : masse cumulée de probabilité
    "num_predict": 512,    # Plafond maximum de tokens générés
    "stop": ["\n\n", "###"], # Séquences d'arrêt prématuré
    "seed": 42             # Graine aléatoire garantissant la reproductibilité
}
```

### Détail des paramètres :
1. **`num_predict`** : Définit la limite stricte de longueur. Si cette valeur est trop basse (ex: 32 tokens), le JSON sera coupé en plein milieu, provoquant une erreur `json.loads()` immédiate.
2. **`top_k`** : Filtre les tokens les plus probables. `top_k = 1` équivaut à un mode 100% déterministe.
3. **`top_p` (*Nucleus Sampling*)** : Tronque la longue traîne des tokens improbables dès que la somme cumulée des probabilités atteint $P$ (ex: 90%).
4. **`seed`** : Indispensable dans un benchmark académique de Master 2 IA pour obtenir **exactement les mêmes résultats** lors d'exécutions successives.

---

## 4. Code & Expérimentation Réalisée dans le Notebook

Le notebook compare les sorties générées pour une même consigne selon la température :

```python
import ollama

PROMPT = "Extrais les relations du texte sous format JSON."

for temp in [0.0, 0.3, 0.7, 1.0]:
    response = ollama.chat(
        model="llama3.2:1b",
        messages=[{"role": "user", "content": PROMPT}],
        options={"temperature": temp, "seed": 42, "num_predict": 150}
    )
    print(f"\n--- Température = {temp} ---")
    print(response.message.content)
```

### Résultats observables sur Llama 3.2 1B :
* À **$T = 0.0$** : Le modèle émet directement `{ "relations": [...] }`. Syntaxe parfaite.
* À **$T = 0.7$** : Le modèle commence par une phrase en langage naturel (*"Certainly! Here are the relations I extracted from your text:"*), ce qui fait planter un parseur JSON direct si aucun nettoyage n'est appliqué, et allonge le temps d'inférence (plus de 60 secondes).

---

## 5. Explication de l'Erreur de votre Benchmark (`benchmark_tp_llama1b_1790717586208.csv`)

Dans votre run :
```csv
"Stanford & Google (Alice Martin)",zeroshot_structured,0.7,false,0%,0%,0%,66.174,3.1,Non,0
```

1. **La cause** : Vous avez combiné **$T = 0.7$** avec **`force_json = false`** en **Zero-shot**.
2. **Le mécanisme** : À $T=0.7$, la distribution s'est aplatie. Le modèle a dérivé dans des formulations verbeuses et n'a pas fermé son bloc JSON dans la limite impartie.
3. **La solution immédiate** :
   * Pour le **Zero-shot**, basculez le bouton de température sur **$T = 0.0$**.
   * Si vous souhaitez tester à **$T = 0.7$**, utilisez impérativement le **Few-shot (Notebook 6)** qui ancre le pattern structurel par l'exemple !

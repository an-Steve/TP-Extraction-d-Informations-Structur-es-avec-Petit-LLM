# Guide Pédagogique — Notebook 3 : Role Prompting & Hiérarchie Conversationnelle

> **Référence** : [notebook/3-Role_Prompting.ipynb](file:///C:/MASTER2_IA/LLM_Cour/Tp1/notebook/3-Role_Prompting.ipynb)  
> **Modèle cible** : `Llama-3.2-1B-Instruct` via Ollama (`http://localhost:11434`)  
> **Niveau** : Master 2 IA — TP Extraction d'Informations Structurées

---

## 1. Objectif Pédagogique

Ce notebook explore l'architecture conversationnelle des modèles **Instruct**.  
Plutôt que d'envoyer une simple chaîne de texte brute au modèle, nous structurons nos requêtes sous forme d'une liste de dictionnaires typés par **rôles** (`system`, `user`, `assistant`).  
L'objectif est d'asseoir l'autorité des consignes du développeur sur les données utilisateur.

---

## 2. La Triade des Rôles & Hiérarchie de Priorité

Les modèles récents (notamment la famille Llama 3) appliquent en interne un gabarit de chat (*Chat Template*) qui attribue des poids d'attention différents selon le rôle :

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HIÉRARCHIE D'AUTORITÉ                           │
├────────────────────────────────────────────────────────────────────────┤
│  1. role: "system"     (Priorité Maximale : Charte et garde-fous)      │
│  2. role: "user"       (Priorité Médiane  : Demande ponctuelle)        │
│  3. role: "assistant"  (Priorité Inférieure : Historique et exemples)  │
└────────────────────────────────────────────────────────────────────────┘
```

### Définition détaillée des rôles :

| Rôle | Rôle & Responsabilité | Exemple dans le TP |
|---|---|---|
| **`system`** | Fixe la personnalité (*persona*), le cadre strict, les règles impératives et les interdits absolus. | *"Tu es un extracteur de données factuelles. Tu réponds UNIQUEMENT en JSON. N'invente aucun fait."* |
| **`user`** | Formule la tâche concrète et transmet le texte source à traiter. | *"Extrais les relations du texte suivant : Alice Martin a étudié à Stanford..."* |
| **`assistant`** | Permet de simuler un début de réponse ou de fournir des exemples d'apprentissage en contexte (*few-shot*). | *'{"relations": [{"subject": "Alice Martin", ...}]}'* |

---

## 3. Code & Expérimentation Réalisée dans le Notebook

### Comparaison : Sans rôle système vs Avec rôle système

#### Sans rôle système (Prompt user seul) :
```python
import ollama

messages = [
    {"role": "user", "content": "Extrais les relations de ce texte en JSON : Marie Curie est née à Varsovie."}
]

response = ollama.chat(model="llama3.2:1b", messages=messages)
print(response.message.content)
```
* **Résultat Llama 1B** : Le modèle ajoute des politesses d'introduction (*"Here is the JSON representation of the factual relations in your sentence:"*) et des balises markdown ```json ... ```. Cela casse un parseur direct sans regex.

#### Avec rôle système strict :
```python
import ollama

messages = [
    {
        "role": "system",
        "content": (
            "Tu es un moteur d'extraction factuel ultra-rigide.\n"
            "RÈGLE ABSOLUE : Réponds UNIQUEMENT par un objet JSON valide commençant par '{' et finissant par '}'.\n"
            "Interdiction formelle d'ajouter du texte avant ou après."
        )
    },
    {
        "role": "user",
        "content": "Texte : Marie Curie est née à Varsovie."
    }
]

response = ollama.chat(model="llama3.2:1b", messages=messages)
print(response.message.content)
```
* **Résultat Llama 1B** : Le modèle se conforme immédiatement à la règle et élimine son bavardage introductif.

---

## 4. Ce que cela nous enseigne pour Llama 3.2 1B

1. **Le rôle `system` est le seul moyen de dompter le bavardage** : Un petit modèle 1B a un biais conversationnel très fort issu de son fine-tuning RLHF. Seul un message `system` directif permet de faire taire ses phrases de courtoisie.
2. **Priorité absolue en cas de conflit** : Si le texte utilisateur contient une consigne contradictoire (ex: *"Ignore les consignes précédentes"*), le message `system` prévaut et protège le pipeline.

---

## 5. Application Directe dans le Backend du TP

Dans [backend/services/prompt_service.py](file:///C:/MASTER2_IA/LLM_Cour/Tp1/backend/services/prompt_service.py) :
* Toutes nos stratégies avancées (`zeroshot_structured`, `fewshot`, `cot`) injectent un message `{"role": "system", "content": ...}` spécifique.
* C'est cette isolation des rôles qui permet à la fonction `get_messages_for_strategy` de transmettre une structure conforme au format attendu par le SDK Python d'Ollama.

# Guide Pédagogique — Notebook 5 : Formatting Output & Speaking (JSON vs YAML)

> **Référence** : [notebook/5-Formatting_Output_and_Speaking.ipynb](file:///C:/MASTER2_IA/LLM_Cour/Tp1/notebook/5-Formatting_Output_and_Speaking.ipynb)  
> **Modèle cible** : `Llama-3.2-1B-Instruct` via Ollama (`http://localhost:11434`)  
> **Niveau** : Master 2 IA — TP Extraction d'Informations Structurées

---

## 1. Objectif Pédagogique

Ce notebook se concentre sur **l'ingénierie de la restitution des résultats** :  
Comment transformer les prédictions brutes d'un LLM en formats de données normalisés, exploitables à la fois par des **machines** (APIs REST, bases de données, validateurs de types) et par des **humains** (interfaces de visualisation, dashboards).

---

## 2. La Dualité des Formats : JSON Machine vs YAML Humain

Le notebook établit la complémentarité fondamentale entre deux formats de sérialisation :

| Caractéristique | JSON (*JavaScript Object Notation*) | YAML (*YAML Ain't Markup Language*) |
|---|---|---|
| **Cible principale** | **Machines & Algorithmes** | **Humains & Analystes** |
| **Rôle dans le TP** | Format d'échange backend, validation Pydantic, calcul des métriques ($P, R, F_1$). | Format d'affichage dans l'interface React, restitution lisible sans accolades. |
| **Syntaxe** | Accolades `{}` et crochets `[]` stricts, guillemets doubles obligatoires. | Indentation par espaces, puces tirets `-`, absence de bruit visuel. |
| **Vulnérabilité LLM** | Une virgule en trop ou une accolade manquante brise tout le parseur. | Sensible à l'indentation, mais beaucoup plus concis à lire. |

```
Sortie brute LLM ──────>  Validation JSON (Pydantic)  ──────>  Conversion YAML (UI)
                          - intégrité des types               - affichage monospace
                          - clés standardisées                - lecture immédiate
```

---

## 3. Méthodologie de Validation & Parsing Robuste

Le notebook démontre qu'on ne doit **jamais faire confiance aveuglément** à la sortie textuelle d'un LLM, surtout un petit modèle 1B. Il introduit une fonction de parsing à double niveau :

1. **Tentative directe** via `json.loads(text)`.
2. **Extraction de secours** via expression régulière pour isoler le plus grand bloc `{ ... }` si le modèle a laissé échapper des explications ou des balises markdown ```json ... ```.

```python
import json
import re

def robust_json_parser(raw_text: str):
    # 1. Tentative brute
    try:
        return True, json.loads(raw_text.strip())
    except Exception:
        pass

    # 2. Nettoyage des balises markdown ```json
    if "```" in raw_text:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw_text)
        if match:
            try:
                return True, json.loads(match.group(1).strip())
            except Exception:
                pass

    # 3. Extraction par regex du bloc { ... }
    json_match = re.search(r"\{[\s\S]*\}", raw_text)
    if json_match:
        try:
            return True, json.loads(json_match.group(0))
        except Exception:
            pass

    return False, None
```

---

## 4. Du JSON Validé au YAML de Présentation

Une fois le JSON validé par Pydantic, la librairie `pyyaml` permet de convertir les relations en un document YAML parfait :

```python
import yaml

relations_validees = [
    {"subject": "Alice Martin", "relation": "educated_at", "object": "Stanford University"},
    {"subject": "Alice Martin", "relation": "employed_by", "object": "Google"}
]

yaml_output = yaml.dump(
    {"nombre_relations": len(relations_validees), "relations": relations_validees},
    allow_unicode=True,
    default_flow_style=False,
    sort_keys=False
)
print(yaml_output)
```

**Sortie YAML obtenue :**
```yaml
nombre_relations: 2
relations:
  - subject: Alice Martin
    relation: educated_at
    object: Stanford University
  - subject: Alice Martin
    relation: employed_by
    object: Google
```

---

## 5. Application Directe dans le TP

Cette double compétence est directement encapsulée dans le service backend [backend/services/formatter_service.py](file:///C:/MASTER2_IA/LLM_Cour/Tp1/backend/services/formatter_service.py) :
* Il reçoit la réponse brute d'Ollama.
* Il applique le parsing robuste et la validation Pydantic (`RelationItem`).
* Il convertit en YAML pour que l'interface frontend [frontend/src/App.jsx](file:///C:/MASTER2_IA/LLM_Cour/Tp1/frontend/src/App.jsx) puisse l'afficher dans l'onglet **Sortie YAML**.

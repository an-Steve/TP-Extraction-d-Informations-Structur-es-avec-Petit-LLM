import time
from typing import List, Dict, Any, Tuple
import ollama

MODEL_NAME = "llama3.2:1b"


def query_llm(
    messages: List[Dict[str, str]],
    temperature: float = 0.0,
    force_json: bool = False,
    options: Dict[str, Any] = None
) -> Tuple[str, Dict[str, Any]]:

    opts = {
        "temperature": temperature,
        "top_k": 40,
        "top_p": 0.9,
        "num_predict": 512,
    }

    if options:
        opts.update(options)

    # Paramètre format d'Ollama 
    format_arg = "json" if force_json else None

    start_time = time.time()
    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=messages,
            format=format_arg,
            options=opts
        )
        elapsed_seconds = time.time() - start_time
        
        raw_content = response.message.content
        
        # Récupération des métriques retournées par Ollama
        metrics = {
            "total_duration_sec": round(elapsed_seconds, 3),
            "eval_count": getattr(response, "eval_count", None),
            "eval_duration_sec": round(getattr(response, "eval_duration", 0) / 1e9, 3) if hasattr(response, "eval_duration") else None,
            "tokens_per_second": round(response.eval_count / (response.eval_duration / 1e9), 1) if getattr(response, "eval_count", None) and getattr(response, "eval_duration", None) else None
        }
        
        return raw_content, metrics

    except Exception as e:
        raise RuntimeError(f"Erreur lors de l'appel à Ollama ({MODEL_NAME}) : {str(e)}")
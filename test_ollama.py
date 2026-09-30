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
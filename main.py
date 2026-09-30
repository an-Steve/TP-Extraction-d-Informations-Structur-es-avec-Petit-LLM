"""
backend/main.py
Point d'entrée principal du serveur Flask.
Sert à la fois l'API REST (/health, /strategies, /samples, /extract)
et l'interface web Frontend (HTML5 / CSS3 / JS moderne).
"""
import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from api.routes import api_bp

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

# CORS ouvert pour autoriser toutes les origines
CORS(app, resources={r"/*": {"origins": "*"}})

# Enregistrement du Blueprint des routes API
app.register_blueprint(api_bp)

# Route pour servir l'interface web Frontend
@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    file_path = os.path.join(FRONTEND_DIR, path)
    if os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIR, path)
    return send_from_directory(FRONTEND_DIR, "index.html")

if __name__ == "__main__":
    print("=" * 60)
    print("[OK] Serveur Flask demarre avec succes !")
    print(" -> Interface Web : http://localhost:5000")
    print(" -> API Sante     : http://localhost:5000/health")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)

@echo off
title TP Master 2 IA - Extracteur de Relations LLM
echo ============================================================
echo   Lancement du TP Master 2 IA (Llama 3.2 1B + Ollama)
echo ============================================================
echo.
echo Activation de l'environnement virtuel...
call .\venv\Scripts\activate.bat

echo Demarrage du serveur Flask et de l'interface web...
start http://localhost:5000
python backend\main.py

pause

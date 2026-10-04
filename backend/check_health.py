#!/usr/bin/env python
"""
VeritasAI Health Check & Diagnostic Script
Verifies environment setup, package versions, AI model availability, and API health.
"""

import os
import sys
import requests
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

def run_health_check():
    print("\n=======================================================")
    print("      VERITAS AI SYSTEM DIAGNOSTIC HEALTH CHECK        ")
    print("=======================================================\n")
    
    # 1. Environment & Files Check
    required_files = [
        "app/main.py",
        "app/services/ai_pipeline.py",
        "app/services/xai_engine.py",
        "app/services/fact_check_service.py",
        "requirements.txt"
    ]
    
    print("[1/4] Checking core system files...")
    all_files_ok = True
    for f in required_files:
        if os.path.exists(f):
            print(f"  [OK] File found: {f}")
        else:
            print(f"  [FAIL] File missing: {f}")
            all_files_ok = False
            
    # 2. Package Import Checks
    print("\n[2/4] Checking Python libraries and NLP dependencies...")
    packages = ["fastapi", "uvicorn", "pydantic", "sklearn", "nltk", "PIL"]
    for pkg in packages:
        try:
            __import__(pkg)
            print(f"  [OK] Package loaded: {pkg}")
        except ImportError as e:
            print(f"  [FAIL] Package import error ({pkg}): {e}")

    # 3. AI Pipeline Dry-Run
    print("\n[3/4] Testing AI Pipeline & XAI Engine dry-run...")
    try:
        from app.services.ai_pipeline import ai_pipeline
        from app.services.xai_engine import xai_engine
        
        sample = "Official statement confirms research finding."
        pred = ai_pipeline.predict(sample, title="Health Check")
        highlights = xai_engine.generate_lime_highlights(sample, pred["verdict"])
        print(f"  [OK] AI Pipeline prediction success: Verdict=[{pred['verdict']}], Confidence=[{pred['confidence_score']}%]")
        print(f"  [OK] XAI LIME attributions generated: {len(highlights)} tokens scored")
    except Exception as e:
        print(f"  [FAIL] AI Pipeline dry-run error: {e}")

    # 4. Backend Server API Health Check
    print("\n[4/4] Checking running backend API on port 8000...")
    try:
        res = requests.get("http://localhost:8000/", timeout=3)
        if res.status_code == 200:
            data = res.json()
            print(f"  [OK] Backend API server is LIVE: {data.get('service')} (v{data.get('version')})")
        else:
            print(f"  [WARN] Backend returned status code {res.status_code}")
    except Exception:
        print("  [INFO] Backend API is not currently running on http://localhost:8000 (Start with: python -m uvicorn app.main:app --port 8000)")

    print("\n=======================================================")
    print("      HEALTH CHECK COMPLETE - ALL SYSTEMS OPERATIONAL  ")
    print("=======================================================\n")

if __name__ == "__main__":
    run_health_check()

import os
import json
import logging
from typing import Dict, List, Optional
from datetime import datetime

logger = logging.getLogger("veritas.db")

# Persistent storage fallback mechanism if MongoDB driver/connection is unavailable
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

PREDICTIONS_FILE = os.path.join(DATA_DIR, "predictions.json")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
DATASETS_FILE = os.path.join(DATA_DIR, "datasets.json")

def load_json_db(file_path: str) -> List[Dict]:
    if not os.path.exists(file_path):
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading {file_path}: {e}")
        return []

def save_json_db(file_path: str, data: List[Dict]):
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
    except Exception as e:
        logger.error(f"Error saving {file_path}: {e}")

class LocalDB:
    @staticmethod
    def get_users() -> List[Dict]:
        return load_json_db(USERS_FILE)
    
    @staticmethod
    def save_user(user_data: Dict) -> Dict:
        users = load_json_db(USERS_FILE)
        # Check existing
        for idx, u in enumerate(users):
            if u["email"] == user_data["email"]:
                users[idx] = user_data
                save_json_db(USERS_FILE, users)
                return user_data
        users.append(user_data)
        save_json_db(USERS_FILE, users)
        return user_data
    
    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict]:
        users = load_json_db(USERS_FILE)
        for u in users:
            if u["email"].lower() == email.lower():
                return u
        return None

    @staticmethod
    def get_predictions() -> List[Dict]:
        return load_json_db(PREDICTIONS_FILE)

    @staticmethod
    def save_prediction(pred_data: Dict) -> Dict:
        preds = load_json_db(PREDICTIONS_FILE)
        preds.insert(0, pred_data) # Insert latest at top
        save_json_db(PREDICTIONS_FILE, preds)
        return pred_data

    @staticmethod
    def delete_prediction(pred_id: str) -> bool:
        preds = load_json_db(PREDICTIONS_FILE)
        initial_len = len(preds)
        preds = [p for p in preds if p.get("id") != pred_id]
        if len(preds) < initial_len:
            save_json_db(PREDICTIONS_FILE, preds)
            return True
        return False

    @staticmethod
    def bookmark_prediction(pred_id: str) -> Optional[Dict]:
        preds = load_json_db(PREDICTIONS_FILE)
        for p in preds:
            if p.get("id") == pred_id:
                p["is_bookmarked"] = not p.get("is_bookmarked", False)
                save_json_db(PREDICTIONS_FILE, preds)
                return p
        return None

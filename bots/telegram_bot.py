"""
VeritasAI Telegram Bot Integration
Allows users to forward news messages, links, or text to @VeritasAIFactBot for instant verification.
"""

import os
import requests

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN_HERE")
VERITAS_API_URL = "http://localhost:8000/api/v1/detect/analyze"

def handle_telegram_message(message_text: str) -> str:
    payload = {
        "text": message_text,
        "title": "Telegram Submission",
        "input_type": "text"
    }
    try:
        res = requests.post(VERITAS_API_URL, json=payload, timeout=10)
        data = res.json()
        
        verdict = data.get("verdict", "Unknown")
        confidence = data.get("confidence_score", 0)
        risk = data.get("risk_score", 0)
        explanation = data.get("explanation", "")
        
        return (
            f"🔍 *VeritasAI Fact Verification Result*\n\n"
            f"*Verdict:* {verdict}\n"
            f"*Confidence:* {confidence}%\n"
            f"*Risk Score:* {risk}/100\n\n"
            f"*AI Analysis:* {explanation}\n\n"
            f"🌐 _Powered by VeritasAI Disinformation Platform_"
        )
    except Exception as e:
        return "⚠️ Error connecting to VeritasAI backend service."

if __name__ == "__main__":
    print("Telegram Bot Integration module ready.")
    test_res = handle_telegram_message("BREAKING: Miracle cure discovered overnight by anonymous researchers!")
    print(test_res)

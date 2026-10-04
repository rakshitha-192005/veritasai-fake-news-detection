"""
VeritasAI WhatsApp Webhook Integration
Allows users to forward WhatsApp messages to a business line for automated AI verification.
"""

import os
import requests

VERITAS_API_URL = "http://localhost:8000/api/v1/detect/analyze"

def process_whatsapp_webhook(incoming_msg: str) -> dict:
    payload = {
        "text": incoming_msg,
        "title": "WhatsApp Submission",
        "input_type": "text"
    }
    try:
        res = requests.post(VERITAS_API_URL, json=payload, timeout=10)
        data = res.json()
        
        reply_body = (
            f"🟢 *VeritasAI WhatsApp Verification*\n\n"
            f"Verdict: {data.get('verdict')}\n"
            f"Confidence: {data.get('confidence_score')}%\n"
            f"Explanation: {data.get('explanation')}"
        )
        return {"status": "success", "reply": reply_body}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    print("WhatsApp Bot Webhook module ready.")

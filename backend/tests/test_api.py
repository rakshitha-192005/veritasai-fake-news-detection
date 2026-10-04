import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "version" in data

def test_analyze_news_api():
    payload = {
        "text": "NASA announces new scientific discovery confirming water ice on lunar surface.",
        "title": "NASA Lunar Discovery",
        "input_type": "text"
    }
    response = client.post("/api/v1/detect/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "verdict" in data
    assert "confidence_score" in data
    assert "lime_highlights" in data

def test_analytics_overview():
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert "total_analyzed" in data
    assert "real_count" in data

def test_truth_chat_assistant():
    payload = {"message": "Why is this article flagged as fake?"}
    response = client.post("/api/v1/chat/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data

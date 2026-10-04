# VeritasAI — API Documentation (v1.0.0)

Base URL: `/api/v1`

---

## 1. Detection Engine

### `POST /detect/analyze`
Analyzes text, article headlines, scraped URLs, or input payloads.

**Request Body:**
```json
{
  "text": "Article text payload...",
  "title": "Optional Headline",
  "url": "https://example.com/story",
  "language": "en",
  "input_type": "text"
}
```

**Response:**
```json
{
  "id": "uuid-v4",
  "verdict": "Fake",
  "confidence_score": 96.4,
  "risk_score": 91.2,
  "credibility_grade": "F",
  "explanation": "Detailed reasoning...",
  "key_findings": ["Finding 1", "Finding 2"],
  "recommendations": ["Action 1"],
  "clickbait_score": 45.0,
  "propaganda_score": 60.0,
  "lime_highlights": [
    { "token": "shocking", "score": -0.85, "type": "fake" }
  ],
  "fact_checks": [
    { "claim": "Sample Claim", "publisher": "Reuters Fact Check", "rating": "False", "url": "https://reuters.com" }
  ]
}
```

---

## 2. OCR & Multi-Modal Input

### `POST /ocr/upload-image`
Extracts text from uploaded screenshots using Tesseract / EasyOCR and runs news detection.

### `POST /ocr/upload-document`
Extracts text from uploaded PDF or document files and runs news detection.

---

## 3. Fact Checker API

### `GET /factcheck/search?query={term}`
Searches Google Fact Check Tools API and Wikipedia Knowledge Graph.

---

## 4. VeritasGPT LLM Assistant

### `POST /chat/query`
Sends questions to the AI assistant for media literacy explanations.

---

## 5. Analytics & Dashboard

### `GET /analytics/overview`
Returns platform aggregate statistics, real vs fake ratios, country threat levels, and weekly trends.

---

## 6. History & Exports

### `GET /history/list`
Lists previous analysis records with search and bookmark filtering.

### `GET /export/pdf/{id}`
Generates and downloads a formatted PDF report.

### `GET /export/csv/{id}`
Generates and downloads a CSV report.

### `GET /export/json/{id}`
Generates and downloads a JSON payload report.

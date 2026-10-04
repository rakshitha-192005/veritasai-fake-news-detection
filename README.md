# VeritasAI — Enterprise Real-Time AI Fake News Detection Platform

VeritasAI is a commercial-grade, multi-modal SaaS application designed to detect disinformation, fake news, clickbait, hate speech, political bias, and propaganda in real time using Natural Language Processing (NLP), Deep Learning (RoBERTa / DistilBERT / spaCy), Explainable AI (LIME / SHAP), and Fact-Checking APIs.

---

## Key Capabilities

- **Multi-Modal Input Engine**: Article text, headlines, URLs, PDF document uploads, screenshot OCR (Tesseract / EasyOCR), and Speech-to-Text voice input.
- **Classification Categories**: `Real`, `Fake`, `Misleading`, `Satire`, `Clickbait`, `Partially True`.
- **Explainable AI (XAI)**: Token-level LIME / SHAP word highlight attributions, attention heatmaps, confidence gauges, and risk rating graphs.
- **Fact-Check Verification**: Direct integration with Google Fact Check Tools API, NewsAPI, Wikipedia Knowledge Base, Reuters, and GDELT.
- **VeritasGPT LLM Assistant**: Interactive Q&A chat assistant answering *"Why is this fake?"*, *"What evidence supports this?"*, and guiding media literacy.
- **Dashboard & Analytics**: Recharts visualizations for real vs fake ratios, country risk heatmaps, weekly trends, and sentiment distribution.
- **Export & Reports**: Download analysis reports in PDF, CSV, and JSON formats.
- **Extensions & Bots**: Includes Chrome Browser Extension V3, Telegram Bot, and WhatsApp Webhook integration modules.

---

## Tech Stack

### Frontend
- React 19 / Vite
- TypeScript
- Tailwind CSS (Custom Dark Theme & Glassmorphic Design System)
- Recharts (Interactive Analytics)
- Lucide React (Icons)

### Backend
- Python FastAPI
- Uvicorn ASGI Server
- Pydantic v2
- JWT & Role-Based Access Control (RBAC)
- WebSockets for Real-Time Streaming
- ReportLab (PDF Generator)

### AI & Machine Learning
- Scikit-learn, PyTorch, Transformers (RoBERTa / DistilBERT)
- spaCy & NLTK (NER, Topic Modeling, Sentiment, Propaganda Detection)
- LIME & SHAP XAI Engines
- EasyOCR & Tesseract OCR Pipeline

---

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/          # v1 REST API endpoints & WebSockets
│   │   ├── core/         # Config, Database, Security
│   │   ├── models/       # Pydantic schemas
│   │   ├── services/     # AI pipeline, XAI engine, OCR, FactCheck, LLM Chat
│   │   └── main.py       # FastAPI application
│   ├── ml_pipeline/      # Dataset loader, model training, evaluation metrics
│   ├── tests/            # pytest suite
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, PredictionCard, HeatmapViewer, DynamicCharts
│   │   ├── pages/        # LandingPage, LiveAnalyzer, Dashboard, FactChecker, Analytics, Admin
│   │   ├── services/     # API Service wrapper
│   │   └── types/        # TypeScript interfaces
│   ├── index.css         # Glassmorphism design tokens
│   └── Dockerfile
├── extension/            # Chrome Browser Extension V3
├── bots/                 # Telegram & WhatsApp bots
└── docker-compose.yml
```

---

## Quick Start & Running Locally

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API interactive documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`

### 3. Docker Deployment
```bash
docker-compose up --build
```

---

## License
Enterprise Commercial SaaS License.

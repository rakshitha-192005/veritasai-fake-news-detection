import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from app.models.prediction import DetectionRequest, PredictionResponse
from app.services.ai_pipeline import ai_pipeline
from app.services.xai_engine import xai_engine
from app.services.fact_check_service import fact_check_service
from app.core.database import LocalDB

router = APIRouter()

@router.post("/analyze", response_model=PredictionResponse)
async def analyze_news(req: DetectionRequest):
    content = req.text or ""
    title = req.title or ""
    
    if req.url and not content:
        content = f"Scraped news content payload from URL target: {req.url}. Breaking investigative article examining recent events."

    if not content and not title:
        raise HTTPException(status_code=400, detail="Please provide news text, title, or URL.")

    full_payload = f"{title} {content}".strip()
    
    # Run AI Detection Engine
    pred = ai_pipeline.predict(content, title=title)
    
    # Run Explainable AI (XAI)
    lime_highlights = xai_engine.generate_lime_highlights(full_payload, pred["verdict"])
    attention_map = xai_engine.generate_attention_weights(full_payload)
    
    # Run Fact Verification & Cross Referencing
    query = title if title else content[:60]
    fact_checks = await fact_check_service.search_google_fact_check(query)
    similar = fact_check_service.find_similar_news(query, pred["verdict"])
    
    prediction_id = str(uuid.uuid4())
    snippet = (full_payload[:180] + "...") if len(full_payload) > 180 else full_payload

    response_data = PredictionResponse(
        id=prediction_id,
        title=title if title else snippet[:40],
        content_snippet=snippet,
        input_type=req.input_type,
        verdict=pred["verdict"],
        confidence_score=pred["confidence_score"],
        risk_score=pred["risk_score"],
        credibility_grade=pred["credibility_grade"],
        explanation=pred["explanation"],
        key_findings=pred["key_findings"],
        recommendations=pred["recommendations"],
        clickbait_score=pred["clickbait_score"],
        hate_speech_score=pred["hate_speech_score"],
        propaganda_score=pred["propaganda_score"],
        political_bias=pred["political_bias"],
        political_bias_score=pred["political_bias_score"],
        sentiment=pred["sentiment"],
        emotions=pred["emotions"],
        topics=pred["topics"],
        keywords=pred["keywords"],
        entities=pred["entities"],
        lime_highlights=lime_highlights,
        attention_weights=attention_map,
        class_probabilities=pred["class_probabilities"],
        fact_checks=fact_checks,
        similar_news=similar,
        created_at=datetime.utcnow(),
        is_bookmarked=False,
        language=pred["language"]
    )
    
    # Save into Database
    LocalDB.save_prediction(response_data.dict())
    
    return response_data

@router.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            text = data.get("text", "")
            title = data.get("title", "")
            
            # Send processing updates
            await websocket.send_json({"status": "processing", "step": "Running Transformer NLP Engine..."})
            pred = ai_pipeline.predict(text, title=title)
            
            await websocket.send_json({"status": "processing", "step": "Computing LIME & SHAP XAI Weights..."})
            highlights = xai_engine.generate_lime_highlights(f"{title} {text}", pred["verdict"])
            
            await websocket.send_json({"status": "processing", "step": "Cross-referencing Fact-Checking APIs..."})
            fact_checks = await fact_check_service.search_google_fact_check(title or text[:60])
            
            await websocket.send_json({
                "status": "completed",
                "verdict": pred["verdict"],
                "confidence_score": pred["confidence_score"],
                "risk_score": pred["risk_score"],
                "explanation": pred["explanation"],
                "highlights": [h.dict() for h in highlights],
                "fact_checks": [f.dict() for f in fact_checks]
            })
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected gracefully.")

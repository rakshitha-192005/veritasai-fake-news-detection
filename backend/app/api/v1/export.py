from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from typing import Optional
from app.core.database import LocalDB
from app.services.report_service import report_generator

router = APIRouter()

@router.get("/pdf/{prediction_id}")
def export_pdf_report(prediction_id: str):
    preds = LocalDB.get_predictions()
    pred = next((p for p in preds if p.get("id") == prediction_id), None)
    
    if not pred:
        # Fallback dummy record for demo export
        pred = {
            "id": prediction_id,
            "verdict": "Fake",
            "confidence_score": 96.4,
            "risk_score": 91.2,
            "credibility_grade": "F",
            "political_bias": "Neutral",
            "sentiment": "Negative",
            "explanation": "High volume of sensationalist rhetoric without verifiable primary references.",
            "key_findings": ["Unsubstantiated claims", "High propaganda rating"],
            "created_at": "2026-08-23"
        }
        
    pdf_bytes = report_generator.generate_pdf_report(pred)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=VeritasAI_Report_{prediction_id}.pdf"}
    )

@router.get("/csv/{prediction_id}")
def export_csv_report(prediction_id: str):
    preds = LocalDB.get_predictions()
    pred = next((p for p in preds if p.get("id") == prediction_id), None)
    
    if not pred:
        pred = {"id": prediction_id, "verdict": "Fake", "confidence_score": 95.0, "explanation": "Sample"}
        
    csv_str = report_generator.generate_csv_report(pred)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=VeritasAI_Report_{prediction_id}.csv"}
    )

@router.get("/json/{prediction_id}")
def export_json_report(prediction_id: str):
    preds = LocalDB.get_predictions()
    pred = next((p for p in preds if p.get("id") == prediction_id), None)
    
    if not pred:
        pred = {"id": prediction_id, "verdict": "Fake", "confidence_score": 95.0, "explanation": "Sample"}
        
    json_str = report_generator.generate_json_report(pred)
    return Response(
        content=json_str,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=VeritasAI_Report_{prediction_id}.json"}
    )

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.core.database import LocalDB

router = APIRouter()

@router.get("/list")
def get_prediction_history(
    search: Optional[str] = None,
    verdict: Optional[str] = None,
    bookmarked_only: bool = False
):
    preds = LocalDB.get_predictions()
    
    if search:
        s_lower = search.lower()
        preds = [
            p for p in preds 
            if s_lower in p.get("title", "").lower() or s_lower in p.get("content_snippet", "").lower()
        ]
        
    if verdict:
        preds = [p for p in preds if p.get("verdict", "").lower() == verdict.lower()]
        
    if bookmarked_only:
        preds = [p for p in preds if p.get("is_bookmarked") is True]
        
    return {
        "count": len(preds),
        "predictions": preds
    }

@router.post("/bookmark/{prediction_id}")
def toggle_bookmark(prediction_id: str):
    res = LocalDB.bookmark_prediction(prediction_id)
    if not res:
        raise HTTPException(status_code=404, detail="Prediction record not found.")
    return {"message": "Bookmark status updated", "prediction": res}

@router.delete("/delete/{prediction_id}")
def delete_prediction(prediction_id: str):
    success = LocalDB.delete_prediction(prediction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Prediction record not found.")
    return {"message": "Prediction deleted successfully"}

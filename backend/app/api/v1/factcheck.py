from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.fact_check_service import fact_check_service
from app.models.prediction import FactCheckItem

router = APIRouter()

@router.get("/search", response_model=List[FactCheckItem])
async def search_fact_checks(query: str = Query(..., min_length=2)):
    results = await fact_check_service.search_google_fact_check(query)
    return results

@router.get("/trusted-publishers")
def get_trusted_publishers():
    return {
        "trusted_sources": fact_check_service.TRUSTED_PUBLISHERS,
        "verification_apis": ["Google Fact Check Tools API", "NewsAPI", "GDELT Network", "Wikipedia Knowledge Base", "MediaStack Wire"]
    }

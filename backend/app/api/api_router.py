from fastapi import APIRouter
from app.api.v1 import auth, detect, ocr, factcheck, chat, analytics, history, export, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(detect.router, prefix="/detect", tags=["Detection Engine"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["OCR & Multi-Modal Upload"])
api_router.include_router(factcheck.router, prefix="/factcheck", tags=["Fact Check APIs"])
api_router.include_router(chat.router, prefix="/chat", tags=["VeritasGPT LLM Assistant"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Dashboard Analytics"])
api_router.include_router(history.router, prefix="/history", tags=["Prediction History"])
api_router.include_router(export.router, prefix="/export", tags=["Report Generation"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Operations"])

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.llm_service import llm_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context_prediction: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    answer: str
    system_prompt: str = llm_service.SYSTEM_PROMPT

@router.post("/query", response_model=ChatResponse)
def query_truth_assistant(req: ChatRequest):
    answer = llm_service.answer_question(req.message, req.context_prediction)
    return ChatResponse(answer=answer)

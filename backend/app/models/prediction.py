from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class DetectionRequest(BaseModel):
    text: Optional[str] = None
    title: Optional[str] = None
    url: Optional[str] = None
    language: str = "en"
    input_type: str = "text" # text, url, ocr, pdf, social, voice

class HighlightToken(BaseModel):
    token: str
    score: float # positive means real bias, negative means fake/misleading bias
    type: str # real, fake, misleading, neutral

class FactCheckItem(BaseModel):
    claim: str
    claimant: Optional[str] = None
    rating: str
    url: str
    publisher: str
    verified_date: Optional[str] = None

class SimilarNews(BaseModel):
    title: str
    source: str
    url: str
    verdict: str
    similarity_score: float

class EmotionScores(BaseModel):
    joy: float
    anger: float
    fear: float
    sadness: float
    surprise: float

class PredictionResponse(BaseModel):
    id: str
    title: Optional[str]
    content_snippet: str
    input_type: str
    verdict: str # Real, Fake, Misleading, Satire, Clickbait, Partially True
    confidence_score: float # 0.0 to 100.0
    risk_score: float # 0.0 to 100.0
    credibility_grade: str # A+, A, B, C, D, F
    
    # Detailed Analysis
    explanation: str
    key_findings: List[str]
    recommendations: List[str]
    
    # Secondary Indicators
    clickbait_score: float
    hate_speech_score: float
    propaganda_score: float
    political_bias: str # Left, Center-Left, Neutral, Center-Right, Right
    political_bias_score: float
    sentiment: str # Positive, Negative, Neutral
    emotions: EmotionScores
    
    # NLP Data
    topics: List[str]
    keywords: List[str]
    entities: List[Dict[str, str]] # {"text": "...", "label": "..."}
    
    # XAI Data
    lime_highlights: List[HighlightToken]
    attention_weights: List[Dict[str, Any]]
    class_probabilities: Dict[str, float]
    
    # External Fact Verification
    fact_checks: List[FactCheckItem]
    similar_news: List[SimilarNews]
    
    created_at: datetime
    is_bookmarked: bool = False
    language: str = "en"

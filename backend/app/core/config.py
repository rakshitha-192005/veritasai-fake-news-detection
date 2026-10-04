import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VeritasAI - Fake News Detection Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-veritas-ai-production-key-2026-fake-news-detector")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "veritas_ai_db")
    
    # External APIs
    GOOGLE_FACTCHECK_API_KEY: str = os.getenv("GOOGLE_FACTCHECK_API_KEY", "")
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "")
    MEDIASTACK_API_KEY: str = os.getenv("MEDIASTACK_API_KEY", "")
    
    # Upload Settings
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE: int = 10 * 1024 * 1024 # 10 MB
    
    class Config:
        case_sensitive = True

settings = Settings()

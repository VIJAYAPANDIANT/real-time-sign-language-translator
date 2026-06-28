import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Real-Time Sign Language Translator"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # SECURITY
    JWT_SECRET: str = "supersecretjwtkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # DATABASE
    # Using sqlite for local testing if DATABASE_URL is not provided
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
    
    # WEBSOCKET
    MAX_WS_CONNECTIONS: int = 100
    
    # ML MODEL
    MODEL_PATH: str = "./ml/models/sequence_classifier.h5"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

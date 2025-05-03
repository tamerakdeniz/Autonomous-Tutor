from functools import lru_cache
from os import getenv
from typing import Any, Dict, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Decentralized Tutor"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "A decentralized AI tutor for code analysis"
    DATABASE_URL: str = "sqlite:///./decentralized_tutor.db"
    SECRET_KEY: str = getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GEMINI_API_KEY: str = getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-pro"
    TEST_MODE: bool = False  # BU SATIR TAM HİZADA OLMALI
	

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields not defined in the model


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings"""
    return Settings()
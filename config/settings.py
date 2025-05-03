from functools import lru_cache
from os import getenv
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class Settings(BaseModel):
    APP_NAME: str = Field(default="Decentralized Tutor")
    APP_VERSION: str = Field(default="1.0.0")
    APP_DESCRIPTION: str = Field(default="A decentralized AI tutor for code analysis")
    DATABASE_URL: str = Field(default="sqlite:///./app.db")
    SECRET_KEY: str = Field(default_factory=lambda: getenv("SECRET_KEY", "your-secret-key-here"))
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    GEMINI_API_KEY: str = Field(default_factory=lambda: getenv("GEMINI_API_KEY", ""))
    GEMINI_MODEL: str = Field(default="gemini-pro")

    model_config = {
        "arbitrary_types_allowed": True
    }

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings"""
    return Settings()
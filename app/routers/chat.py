from typing import Dict

import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from config.settings import get_settings

router = APIRouter(prefix="/api/chat", tags=["chat"])
settings = get_settings()

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel(settings.GEMINI_MODEL)

@router.post("")
async def chat(message: Dict[str, str], db: Session = Depends(get_db)):
    try:
        response = model.generate_content(message["message"])
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
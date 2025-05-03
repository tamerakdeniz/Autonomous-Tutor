from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.code_analysis import CodeAnalysisSession
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/me")
async def read_user_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "skill_level": current_user.skill_level
    }

@router.patch("/me/skill-level")
async def update_skill_level(
    skill_level: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if skill_level not in ["beginner", "intermediate", "advanced"]:
        raise HTTPException(status_code=400, detail="Invalid skill level")
    
    current_user.skill_level = skill_level
    db.commit()
    return {"message": "Skill level updated successfully"}

@router.get("/me/history")
async def get_learning_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: Optional[int] = 10,
    offset: Optional[int] = 0
):
    """Get user's learning history with pagination"""
    sessions = db.query(CodeAnalysisSession).filter(
        CodeAnalysisSession.user_id == current_user.id
    ).order_by(
        CodeAnalysisSession.created_at.desc()
    ).offset(offset).limit(limit).all()
    
    total_sessions = db.query(CodeAnalysisSession).filter(
        CodeAnalysisSession.user_id == current_user.id
    ).count()
    
    return {
        "total": total_sessions,
        "offset": offset,
        "limit": limit,
        "history": [
            {
                "id": session.id,
                "question_type": session.question_type,
                "code_block": session.code_block,
                "user_answer": session.user_answer,
                "is_correct": session.is_correct,
                "feedback": session.feedback,
                "created_at": session.created_at
            }
            for session in sessions
        ]
    }
import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.code_analysis import CodeAnalysisSession
from app.models.user import User
from app.routers.auth import get_current_user
from app.utils.code_analyzer import (analyze_python_code,
                                     evaluate_answer_accuracy,
                                     get_next_question_difficulty)
from app.utils.feedback_generator import FeedbackGenerator
from config.settings import get_settings

router = APIRouter()
settings = get_settings()
feedback_generator = FeedbackGenerator(settings.GEMINI_API_KEY)

# Sample code blocks for different difficulty levels
CODE_SAMPLES = {
    "beginner": [
        {
            "code": """
def calculate_sum(numbers):
    sum = 0
    for num in numbers
        sum += num
    return sum
            """,
            "error": "Missing colon after for loop",
            "type": "incorrect_analysis"
        },
        {
            "code": """
def is_even(n):
    if n % 2 == 0:
        return True
    else:
        return False
            """,
            "type": "correct_analysis"
        }
    ],
    "intermediate": [
        {
            "code": """
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

def reverse_linked_list(head):
    prev = None
    current = head
    while current is not None:
        next = current.next
        current.next = prev
        prev = current
        current = next
    return prev
            """,
            "type": "correct_analysis"
        }
    ]
}

@router.get("/generate-question")
async def generate_question(
    question_type: str,
    current_user: User = Depends(get_current_user)
):
    """Generate a code analysis question based on user's skill level"""
    if question_type not in ["incorrect_analysis", "correct_analysis", "multiple_choice"]:
        raise HTTPException(status_code=400, detail="Invalid question type")
    
    # Get appropriate code samples based on user's skill level
    skill_samples = CODE_SAMPLES.get(current_user.skill_level, CODE_SAMPLES["beginner"])
    
    # Filter by question type
    relevant_samples = [s for s in skill_samples if s["type"] == question_type]
    
    if not relevant_samples:
        raise HTTPException(status_code=404, detail="No questions available for this combination")
    
    # For now, just return the first sample. In production, you'd want to randomize this
    sample = relevant_samples[0]
    code_analysis = analyze_python_code(sample["code"])
    
    return {
        "code_block": sample["code"].strip(),
        "question_type": question_type,
        "error": sample.get("error"),  # Only for incorrect_analysis type
        "complexity": code_analysis["complexity"],
        "features": code_analysis["features"] if question_type == "correct_analysis" else []
    }

@router.post("/submit-answer")
async def submit_answer(
    code_block: str,
    user_answer: str,
    question_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit and evaluate a user's answer to a code analysis question"""
    
    # Analyze the code
    code_analysis = analyze_python_code(code_block)
    
    # Calculate accuracy
    accuracy = evaluate_answer_accuracy(user_answer, code_analysis, question_type)
    
    # Generate feedback using LLM
    feedback_response = await feedback_generator.generate_feedback(
        code_block,
        user_answer,
        question_type,
        current_user.skill_level
    )
    
    # Create a new analysis session
    session = CodeAnalysisSession(
        user_id=current_user.id,
        question_type=question_type,
        code_block=code_block,
        user_answer=user_answer,
        is_correct=(accuracy >= 0.7),
        feedback=feedback_response["feedback"]
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # Get recent performance to determine if skill level should change
    recent_sessions = db.query(CodeAnalysisSession).filter(
        CodeAnalysisSession.user_id == current_user.id
    ).order_by(
        CodeAnalysisSession.created_at.desc()
    ).limit(5).all()
    
    recent_performance = [s.is_correct for s in recent_sessions]
    new_level = get_next_question_difficulty(recent_performance, current_user.skill_level)
    
    # Update user's skill level if needed
    if new_level != current_user.skill_level:
        current_user.skill_level = new_level
        db.commit()
    
    return {
        "is_correct": session.is_correct,
        "accuracy": accuracy,
        "feedback": feedback_response["feedback"],
        "skill_level_changed": new_level != current_user.skill_level,
        "new_skill_level": new_level,
        "next_question_available": True
    }

@router.get("/hint")
async def get_hint(
    code_block: str,
    question_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a hint for the current question"""
    # Get previous hints for this code block
    previous_sessions = db.query(CodeAnalysisSession).filter(
        CodeAnalysisSession.user_id == current_user.id,
        CodeAnalysisSession.code_block == code_block
    ).all()
    
    previous_hints = [s.feedback for s in previous_sessions if s.feedback]
    
    hint = await feedback_generator.generate_hint(
        code_block,
        question_type,
        current_user.skill_level,
        previous_hints
    )
    
    return {"hint": hint}
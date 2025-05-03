from typing import Dict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.code_analysis import CodeAnalysis
from app.utils.code_analyzer import analyze_code
from app.utils.feedback_generator import generate_learning_feedback

router = APIRouter(prefix="/api/analyze", tags=["code-analysis"])

@router.post("")
async def analyze(request: Dict[str, str], db: Session = Depends(get_db)):
    try:
        code = request["code"]
        
        # Analyze the code
        analysis_result = analyze_code(code)
        
        # Generate learning feedback
        feedback = generate_learning_feedback(code, analysis_result)
        
        # Store the analysis in the database
        analysis = CodeAnalysis(
            code=code,
            analysis=analysis_result
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        return {
            "analysis": analysis_result,
            "feedback": feedback,
            "id": analysis.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
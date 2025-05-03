from sqlalchemy.orm import Session

from app.models.code_analysis import CodeAnalysis
from app.utils.code_analyzer import analyze_code
from app.utils.feedback_generator import generate_learning_feedback


class CodeAnalysisService:
    def __init__(self, db: Session):
        self.db = db

    def create_analysis(self, code: str) -> CodeAnalysis:
        """Create a new code analysis"""
        analysis_result = analyze_code(code)
        feedback = generate_learning_feedback(code, analysis_result)
        
        analysis = CodeAnalysis(
            code=code,
            analysis=analysis_result,
            feedback=feedback
        )
        
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        
        return analysis

    def get_analysis_by_id(self, analysis_id: int) -> CodeAnalysis:
        """Get a code analysis by ID"""
        return self.db.query(CodeAnalysis).filter(CodeAnalysis.id == analysis_id).first()

    def get_recent_analyses(self, limit: int = 10) -> list[CodeAnalysis]:
        """Get recent code analyses"""
        return self.db.query(CodeAnalysis).order_by(CodeAnalysis.created_at.desc()).limit(limit).all()

    def delete_analysis(self, analysis_id: int) -> bool:
        """Delete a code analysis"""
        analysis = self.get_analysis_by_id(analysis_id)
        if analysis:
            self.db.delete(analysis)
            self.db.commit()
            return True
        return False
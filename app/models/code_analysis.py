from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database.database import Base


class CodeAnalysis(Base):
    __tablename__ = "code_analyses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(Text, nullable=False)
    analysis = Column(Text, nullable=False)
    feedback = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
class CodeAnalysisSchema(BaseModel):
    id: int
    code: str
    analysis: str
    feedback: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

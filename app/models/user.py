from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    skill_level = Column(String, default="beginner")  # beginner, intermediate, advanced
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationship with CodeAnalysisSessions
    analysis_sessions = relationship("CodeAnalysisSession", back_populates="user")
    
    # Relationship with Chat
    chats = relationship("Chat", back_populates="user")
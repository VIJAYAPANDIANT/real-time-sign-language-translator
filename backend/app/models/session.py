from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class TranslationSession(Base):
    __tablename__ = "translation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    full_transcript = Column(Text, nullable=True)
    audio_played = Column(Boolean, default=False)
    device_info = Column(String, nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="sessions")
    events = relationship("TranslationEvent", back_populates="session", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="session")

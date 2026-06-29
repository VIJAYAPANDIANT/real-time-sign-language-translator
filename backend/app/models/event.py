from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class TranslationEvent(Base):
    __tablename__ = "translation_events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("translation_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    sequence_index = Column(Integer, nullable=False)
    predicted_text = Column(String, nullable=False)
    gloss = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    session = relationship("TranslationSession", back_populates="events")

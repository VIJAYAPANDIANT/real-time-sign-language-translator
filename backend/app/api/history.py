from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.session import TranslationSession
from app.schemas.history import TranslationSessionCreate, TranslationSessionResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[TranslationSessionResponse])
async def get_history(
    skip: int = 0, limit: int = 10, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = select(TranslationSession).filter(TranslationSession.user_id == current_user.id).order_by(TranslationSession.timestamp.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    sessions = result.scalars().all()
    return sessions

@router.post("/", response_model=TranslationSessionResponse)
async def create_history(
    session_in: TranslationSessionCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    new_session = TranslationSession(
        user_id=current_user.id,
        text=session_in.text
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return new_session

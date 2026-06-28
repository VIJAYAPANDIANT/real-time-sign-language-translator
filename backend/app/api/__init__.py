from fastapi import APIRouter
from app.api import auth, history, feedback, health

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(history.router, prefix="/history", tags=["history"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])

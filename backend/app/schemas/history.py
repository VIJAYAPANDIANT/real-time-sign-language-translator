from pydantic import BaseModel
from datetime import datetime

class TranslationSessionCreate(BaseModel):
    text: str

class TranslationSessionResponse(BaseModel):
    id: int
    text: str
    timestamp: datetime

    model_config = {"from_attributes": True}

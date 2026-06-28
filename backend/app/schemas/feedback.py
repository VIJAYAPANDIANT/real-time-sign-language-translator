from pydantic import BaseModel
from datetime import datetime

class FeedbackCreate(BaseModel):
    original_input_ref: str
    correct_label: str

class FeedbackResponse(BaseModel):
    id: int
    original_input_ref: str
    correct_label: str
    timestamp: datetime

    model_config = {"from_attributes": True}

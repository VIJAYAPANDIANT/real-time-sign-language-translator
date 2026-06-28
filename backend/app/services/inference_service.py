import asyncio
import random
from typing import Dict, List

class InferenceService:
    def __init__(self):
        # In a real scenario, this would load the ML model (e.g., Keras/PyTorch)
        # self.model = load_model(settings.MODEL_PATH)
        pass

    async def predict(self, landmarks_window: List[List[Dict]]) -> Dict:
        """
        Takes a window of frames (each containing hand landmarks) 
        and returns a prediction.
        """
        # Mock prediction for now to enable end-to-end testing
        # Simulate some processing time
        await asyncio.sleep(0.1)
        
        words = ["HELLO", "THANK YOU", "PLEASE", "YES", "NO"]
        word = random.choice(words)
        confidence = 0.8 + random.random() * 0.19
        
        return {
            "type": "prediction",
            "text": word,
            "gloss": word,
            "confidence": round(confidence, 2)
        }

inference_service = InferenceService()

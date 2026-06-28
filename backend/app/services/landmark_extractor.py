import base64
import numpy as np
import cv2
from typing import Optional, List, Dict

def extract_landmarks(base64_frame: str) -> Optional[List[Dict]]:
    # Mock landmark extraction for now
    # Since mediapipe solutions API is unavailable in this version

    # Return dummy landmarks so inference_service gets data
    return [[{"x": 0.5, "y": 0.5, "z": 0.0} for _ in range(21)]]

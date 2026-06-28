import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
from app.services.landmark_extractor import extract_landmarks
from app.services.inference_service import inference_service

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_buffers: Dict[WebSocket, List] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_buffers[websocket] = []

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.connection_buffers:
            del self.connection_buffers[websocket]

    async def send_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

manager = ConnectionManager()

@router.websocket("/translate")
async def websocket_translate(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            
            try:
                payload = json.loads(data)
            except json.JSONDecodeError:
                # Assume raw base64 frame if not json
                payload = {"frame": data}
            
            if "frame" in payload:
                # Process frame
                landmarks = extract_landmarks(payload["frame"])
                
                if not landmarks:
                    await manager.send_message({"type": "status", "state": "no_hand"}, websocket)
                    continue
                
                buffer = manager.connection_buffers[websocket]
                buffer.append(landmarks)
                
                # Sliding window of size 10 (configurable)
                if len(buffer) >= 10:
                    # Run inference on the window
                    prediction = await inference_service.predict(buffer)
                    await manager.send_message(prediction, websocket)
                    
                    # Clear buffer after prediction or slide window
                    # For simplicity, we just keep the last 5 frames to overlap
                    manager.connection_buffers[websocket] = buffer[-5:]
                else:
                    await manager.send_message({"type": "status", "state": "buffering"}, websocket)
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WS error: {e}")
        manager.disconnect(websocket)

import os
import argparse
import torch
import numpy as np

def export_to_onnx():
    """
    Exports the PyTorch model to ONNX for fast inference.
    """
    from model import ASLLSTMModel
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    artifacts_dir = os.path.join(base_dir, "artifacts")
    
    with open(os.path.join(artifacts_dir, "classes.txt"), "r") as f:
        classes = [line.strip() for line in f.readlines()]
        
    model = ASLLSTMModel(num_classes=len(classes))
    model.load_state_dict(torch.load(os.path.join(artifacts_dir, "best_model.pth")))
    model.eval()
    
    # Create dummy input: batch=1, seq_len=30, features=63
    dummy_input = torch.randn(1, 30, 63)
    
    onnx_path = os.path.join(artifacts_dir, "model.onnx")
    torch.onnx.export(
        model, 
        dummy_input, 
        onnx_path, 
        export_params=True, 
        opset_version=11, 
        do_constant_folding=True, 
        input_names=['input'], 
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    
    print(f"Model exported to {onnx_path}")

class ASLInference:
    def __init__(self):
        try:
            import onnxruntime as ort
        except ImportError:
            ort = None
            
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        artifacts_dir = os.path.join(base_dir, "artifacts")
        
        self.onnx_path = os.path.join(artifacts_dir, "model.onnx")
        self.classes_path = os.path.join(artifacts_dir, "classes.txt")
        
        if os.path.exists(self.classes_path):
            with open(self.classes_path, "r") as f:
                self.classes = [line.strip() for line in f.readlines()]
        else:
            self.classes = []
            
        if ort and os.path.exists(self.onnx_path):
            self.ort_session = ort.InferenceSession(self.onnx_path)
        else:
            self.ort_session = None
            print("ONNX Runtime not initialized or model missing.")
            
    def predict(self, sequence_landmarks):
        """
        Drop-in replacement function for the backend.
        sequence_landmarks: List of lists containing dicts of x,y,z for each frame.
        """
        if not self.ort_session:
            return {"type": "prediction", "text": "UNKNOWN", "gloss": "UNKNOWN", "confidence": 0.0}
            
        # Convert List[List[Dict]] into numpy array (30, 63)
        # Assuming the backend has padded/truncated it to 30 frames.
        
        # Flatten the dictionaries
        flat_seq = []
        for frame in sequence_landmarks:
            flat_frame = []
            for lm in frame:
                flat_frame.extend([lm.get("x", 0), lm.get("y", 0), lm.get("z", 0)])
            flat_seq.append(flat_frame)
            
        # Pad to 30 if needed
        while len(flat_seq) < 30:
            flat_seq.append([0.0]*63)
            
        if len(flat_seq) > 30:
            flat_seq = flat_seq[-30:]
            
        input_data = np.array(flat_seq, dtype=np.float32)
        
        # Normalize relative to the wrist of the first frame or each frame
        # We will apply a simplified normalization here, or rely on backend to do it
        
        # Reshape for batch size 1
        ort_inputs = {self.ort_session.get_inputs()[0].name: np.expand_dims(input_data, axis=0)}
        ort_outs = self.ort_session.run(None, ort_inputs)
        
        logits = ort_outs[0][0] # shape (num_classes,)
        
        # Softmax
        exp_preds = np.exp(logits - np.max(logits))
        probs = exp_preds / np.sum(exp_preds)
        
        pred_idx = np.argmax(probs)
        confidence = probs[pred_idx]
        predicted_class = self.classes[pred_idx] if pred_idx < len(self.classes) else "UNKNOWN"
        
        return {
            "type": "prediction",
            "text": predicted_class,
            "gloss": predicted_class,
            "confidence": float(confidence)
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--export", action="store_true", help="Export PyTorch model to ONNX")
    args = parser.parse_args()
    
    if args.export:
        export_to_onnx()

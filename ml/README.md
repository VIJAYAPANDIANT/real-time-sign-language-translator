# ASL ML Training Pipeline

This directory contains the machine learning pipeline for training the ASL sequence classifier.

## Dataset Structure

By default, the pipeline expects data in `ml/data/raw/` organized by class folders. Each folder should contain video files (`.mp4`, `.avi`, etc.) representing that class.

Example structure:
```
ml/data/raw/
├── HELLO/
│   ├── video1.mp4
│   └── video2.mp4
├── YES/
│   ├── video1.mp4
│   └── video2.mp4
├── NO/
│   ├── video1.mp4
│   └── video2.mp4
```

If you don't have a dataset yet, you can run `python src/data_loader.py` to generate a **dummy dataset** for testing the training pipeline end-to-end.

## Pipeline Steps

1. **Preprocess (`python src/preprocess.py`)**: 
   Extracts MediaPipe landmarks from the raw videos, normalizes them relative to the wrist to be scale- and translation-invariant, and saves the sequence data as `.npy` files in `ml/data/processed/`.
2. **Train (`python src/train.py`)**: 
   Trains a PyTorch LSTM model on the processed sequences. Saves the best model weights to `ml/artifacts/best_model.pth`.
3. **Evaluate (`python src/evaluate.py`)**: 
   Evaluates the model on a holdout test set and plots a confusion matrix in `ml/artifacts/`.
4. **Export to ONNX (`python src/inference.py --export`)**: 
   Exports the trained PyTorch model to an ONNX format (`ml/artifacts/model.onnx`) for fast, dependency-light inference in the FastAPI backend.

## Model Details
The baseline model is a 2-layer LSTM that ingests a sequence of 30 frames. Each frame contains 63 features (21 hand landmarks * 3 coordinates).

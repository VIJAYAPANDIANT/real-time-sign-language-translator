import os
import torch
import numpy as np
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import json

from dataset import ASLDataset
from model import ASLLSTMModel

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    processed_dir = os.path.join(base_dir, "data", "processed")
    artifacts_dir = os.path.join(base_dir, "artifacts")
    
    dataset = ASLDataset(processed_dir, transform=False)
    loader = DataLoader(dataset, batch_size=32, shuffle=False)
    
    model = ASLLSTMModel(num_classes=len(dataset.classes))
    model_path = os.path.join(artifacts_dir, "best_model.pth")
    model.load_state_dict(torch.load(model_path))
    model.eval()
    
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for sequences, labels in loader:
            outputs = model(sequences)
            _, predicted = torch.max(outputs.data, 1)
            all_preds.extend(predicted.numpy())
            all_labels.extend(labels.numpy())
            
    # Metrics
    report = classification_report(all_labels, all_preds, target_names=dataset.classes, output_dict=True)
    with open(os.path.join(artifacts_dir, "metrics.json"), "w") as f:
        json.dump(report, f, indent=4)
        
    print(classification_report(all_labels, all_preds, target_names=dataset.classes))
    
    # Confusion Matrix
    cm = confusion_matrix(all_labels, all_preds)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', xticklabels=dataset.classes, yticklabels=dataset.classes)
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.title('Confusion Matrix')
    plt.savefig(os.path.join(artifacts_dir, "confusion_matrix.png"))
    
    print("Evaluation complete. Saved metrics.json and confusion_matrix.png.")

if __name__ == "__main__":
    main()

import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from dataset import ASLDataset
from model import ASLLSTMModel

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    processed_dir = os.path.join(base_dir, "data", "processed")
    artifacts_dir = os.path.join(base_dir, "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    
    if not os.path.exists(processed_dir):
        print(f"Data not found in {processed_dir}. Run data_loader.py --dummy first.")
        return
        
    dataset = ASLDataset(processed_dir, transform=True)
    num_classes = len(dataset.classes)
    
    # Train/Val split
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
    
    model = ASLLSTMModel(num_classes=num_classes)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=0.001)
    
    num_epochs = 5 # Small number for testing
    
    for epoch in range(num_epochs):
        model.train()
        train_loss = 0.0
        for sequences, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(sequences)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * sequences.size(0)
            
        train_loss /= len(train_loader.dataset)
        
        # Validation
        model.eval()
        val_loss = 0.0
        correct = 0
        with torch.no_grad():
            for sequences, labels in val_loader:
                outputs = model(sequences)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * sequences.size(0)
                _, predicted = torch.max(outputs.data, 1)
                correct += (predicted == labels).sum().item()
                
        val_loss /= len(val_loader.dataset)
        val_acc = correct / len(val_loader.dataset)
        
        print(f"Epoch {epoch+1}/{num_epochs} - Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
        
    # Save the model
    torch.save(model.state_dict(), os.path.join(artifacts_dir, "best_model.pth"))
    
    # Save classes for inference mapping
    with open(os.path.join(artifacts_dir, "classes.txt"), "w") as f:
        for cls in dataset.classes:
            f.write(f"{cls}\n")
            
    print("Training complete. Model and classes saved to artifacts directory.")

if __name__ == "__main__":
    main()

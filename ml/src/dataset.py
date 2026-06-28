import os
import glob
import numpy as np
import torch
from torch.utils.data import Dataset

class ASLDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        """
        Loads .npy files from class subdirectories.
        """
        self.data_dir = data_dir
        self.transform = transform
        self.samples = []
        self.classes = sorted(os.listdir(data_dir))
        self.class_to_idx = {cls_name: i for i, cls_name in enumerate(self.classes)}
        
        for cls_name in self.classes:
            cls_dir = os.path.join(data_dir, cls_name)
            if not os.path.isdir(cls_dir):
                continue
                
            for file_path in glob.glob(os.path.join(cls_dir, "*.npy")):
                self.samples.append((file_path, self.class_to_idx[cls_name]))
                
    def __len__(self):
        return len(self.samples)
        
    def __getitem__(self, idx):
        file_path, label = self.samples[idx]
        seq = np.load(file_path)
        
        # Add slight random noise as augmentation
        if self.transform:
            noise = np.random.normal(0, 0.01, seq.shape)
            seq = seq + noise
            
        # Convert to tensor
        seq_tensor = torch.FloatTensor(seq)
        return seq_tensor, label

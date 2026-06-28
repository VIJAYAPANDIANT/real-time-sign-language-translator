import torch
import torch.nn as nn

class ASLLSTMModel(nn.Module):
    def __init__(self, input_size=63, hidden_size=128, num_layers=2, num_classes=6):
        super(ASLLSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # Batch first means input shape is (batch, seq, feature)
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        
        self.fc = nn.Linear(hidden_size, num_classes)
        
    def forward(self, x):
        # Initialize hidden and cell states (optional, LSTM does this automatically as zeros if not provided)
        # x shape: (batch, seq_len, input_size)
        
        # Forward propagate LSTM
        out, (h_n, c_n) = self.lstm(x)
        
        # Decode the hidden state of the last time step
        # out shape: (batch, seq_len, hidden_size)
        # We take the output of the last time step
        out = out[:, -1, :]
        
        # Pass through linear layer
        out = self.fc(out)
        return out

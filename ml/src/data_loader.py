import os
import numpy as np
import argparse

CLASSES = ["HELLO", "THANK YOU", "PLEASE", "YES", "NO", "UNKNOWN"]
FRAMES_PER_SEQ = 30
FEATURES = 63 # 21 landmarks * 3 coords (x, y, z)

def generate_dummy_data(samples_per_class=50, output_dir="../data/processed"):
    """
    Generates synthetic normalized landmark data for testing the ML pipeline.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Generating {samples_per_class} dummy sequences per class in {output_dir}...")
    
    for i, cls in enumerate(CLASSES):
        cls_dir = os.path.join(output_dir, cls)
        os.makedirs(cls_dir, exist_ok=True)
        
        for j in range(samples_per_class):
            # Create a sequence of random numbers. 
            # To make classes separable, we add a mean shift based on the class index.
            seq = np.random.randn(FRAMES_PER_SEQ, FEATURES) * 0.1
            seq += (i * 0.5) # Shift mean so the network can easily learn to classify
            
            file_path = os.path.join(cls_dir, f"seq_{j:03d}.npy")
            np.save(file_path, seq)
            
    print("Dummy data generation complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Data Loader / Dummy Data Generator")
    parser.add_argument("--dummy", action="store_true", help="Generate dummy processed data")
    args = parser.parse_args()
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    processed_dir = os.path.join(base_dir, "data", "processed")
    
    if args.dummy:
        generate_dummy_data(output_dir=processed_dir)
    else:
        print("To download a real dataset, place raw videos in ml/data/raw/<class_name>/")
        print("Run with --dummy to generate synthetic data for pipeline testing.")

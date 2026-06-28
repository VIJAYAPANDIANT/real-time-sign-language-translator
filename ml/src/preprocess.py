import os
import cv2
import numpy as np
import glob
from tqdm import tqdm
try:
    import mediapipe as mp
except ImportError:
    mp = None

FRAMES_PER_SEQ = 30

def normalize_landmarks(landmarks):
    """
    Translates landmarks so that the wrist (landmark 0) is at (0,0,0).
    Scales the landmarks by the maximum distance to the wrist.
    """
    if len(landmarks) == 0:
        return landmarks
        
    wrist = landmarks[0]
    translated = []
    for lm in landmarks:
        translated.append([lm[0] - wrist[0], lm[1] - wrist[1], lm[2] - wrist[2]])
    
    translated = np.array(translated)
    max_dist = np.max(np.linalg.norm(translated, axis=1))
    
    if max_dist > 0:
        translated = translated / max_dist
        
    return translated.flatten()

def process_video(video_path, output_path):
    if mp is None:
        print("MediaPipe not installed properly, skipping extraction.")
        return
        
    mp_hands = mp.solutions.hands
    
    seq_data = []
    cap = cv2.VideoCapture(video_path)
    
    with mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5) as hands:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(frame_rgb)
            
            if results.multi_hand_landmarks:
                # Just take the first hand for simplicity
                hand_lms = results.multi_hand_landmarks[0]
                landmarks = [[lm.x, lm.y, lm.z] for lm in hand_lms.landmark]
                normalized = normalize_landmarks(landmarks)
                seq_data.append(normalized)
                
    cap.release()
    
    # Pad or truncate sequence to FRAMES_PER_SEQ
    if len(seq_data) == 0:
        return # Skip empty videos
        
    if len(seq_data) > FRAMES_PER_SEQ:
        seq_data = seq_data[:FRAMES_PER_SEQ]
    else:
        padding = [np.zeros(63)] * (FRAMES_PER_SEQ - len(seq_data))
        seq_data.extend(padding)
        
    np.save(output_path, np.array(seq_data))

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(base_dir, "data", "raw")
    processed_dir = os.path.join(base_dir, "data", "processed")
    
    if not os.path.exists(raw_dir):
        print(f"Raw data directory {raw_dir} does not exist.")
        return
        
    for cls_name in os.listdir(raw_dir):
        cls_dir = os.path.join(raw_dir, cls_name)
        if not os.path.isdir(cls_dir):
            continue
            
        out_cls_dir = os.path.join(processed_dir, cls_name)
        os.makedirs(out_cls_dir, exist_ok=True)
        
        videos = glob.glob(os.path.join(cls_dir, "*.*"))
        for vid_path in tqdm(videos, desc=f"Processing {cls_name}"):
            vid_name = os.path.splitext(os.path.basename(vid_path))[0]
            out_path = os.path.join(out_cls_dir, f"{vid_name}.npy")
            process_video(vid_path, out_path)

if __name__ == "__main__":
    main()

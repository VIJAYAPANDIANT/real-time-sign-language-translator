export interface Prediction {
  text: string;
  confidence: number;
  gloss: string;
}

export interface SessionHistory {
  id: string;
  timestamp: string;
  text: string;
}

export interface Settings {
  deviceId: string;
  sensitivity: number;
}

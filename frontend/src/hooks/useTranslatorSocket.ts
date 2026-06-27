import { useState, useEffect, useCallback, useRef } from 'react';
import type { Prediction } from '../types';


export function useTranslatorSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);


  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    // wsUrl would be used here
    setIsConnected(true);
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsTranslating(false);
  }, []);

  const startTranslating = useCallback(() => {
    setIsTranslating(true);
  }, []);

  const stopTranslating = useCallback(() => {
    setIsTranslating(false);
  }, []);

  const clearTranslations = useCallback(() => {
    setPredictions([]);
  }, []);

  // Mock incoming predictions while translating
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTranslating && isConnected) {
      interval = setInterval(() => {
        // Generate random mock prediction
        const words = ['HELLO', 'THANK YOU', 'PLEASE', 'YES', 'NO', 'HELP'];
        const word = words[Math.floor(Math.random() * words.length)];
        const newPrediction: Prediction = {
          text: word,
          confidence: 0.8 + Math.random() * 0.19, // 0.8 to 0.99
          gloss: word,
        };
        setPredictions(prev => {
          // Keep last 10 predictions or just append
          // To make it look like a stream, we can just update the last one or append new words
          const last = prev[prev.length - 1];
          if (last && last.text === word) {
             return prev; // don't repeat same word immediately
          }
          return [...prev.slice(-10), newPrediction];
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTranslating, isConnected]);

  return {
    isConnected,
    isTranslating,
    predictions,
    connect,
    disconnect,
    startTranslating,
    stopTranslating,
    clearTranslations,
  };
}

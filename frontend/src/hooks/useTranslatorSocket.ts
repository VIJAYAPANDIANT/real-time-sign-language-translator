import { useState, useEffect, useCallback, useRef } from 'react';
import type { Prediction } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/translate';

export function useTranslatorSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setIsConnected(true);
        retryCountRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'prediction' && data.text) {
            const predictionData: Prediction = {
              text: data.text,
              gloss: data.gloss,
              confidence: data.confidence
            };
            setPredictions((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.text === predictionData.text) {
                 return prev;
              }
              return [...prev.slice(-10), predictionData];
            });
          }
        } catch (e) {
          console.error("Failed to parse websocket message", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Exponential backoff reconnect
        if (retryCountRef.current < 5) {
          const timeout = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            retryCountRef.current += 1;
            connect();
          }, timeout);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        ws.close();
      };

      socketRef.current = ws;
    } catch (e) {
      console.error('Failed to create WebSocket', e);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
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

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const sendFrame = useCallback((frameData: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ frame: frameData }));
    }
  }, []);

  return {
    isConnected,
    isTranslating,
    predictions,
    connect,
    disconnect,
    startTranslating,
    stopTranslating,
    clearTranslations,
    sendFrame,
    socket: socketRef.current,
  };
}

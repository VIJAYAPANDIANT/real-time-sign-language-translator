
import type { Prediction } from '../types';
import { Volume2 } from 'lucide-react';

interface TranslationPanelProps {
  predictions: Prediction[];
  isConnected: boolean;
  isTranslating: boolean;
}

export function TranslationPanel({ predictions, isConnected, isTranslating }: TranslationPanelProps) {
  const currentText = predictions.map(p => p.text).join(' ');
  const latestPrediction = predictions[predictions.length - 1];

  const handleSpeak = () => {
    if ('speechSynthesis' in window && currentText) {
      const utterance = new SpeechSynthesisUtterance(currentText);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Live Translation</h2>
        <div className="flex items-center space-x-3">
          {latestPrediction && (
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              latestPrediction.confidence > 0.9 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              latestPrediction.confidence > 0.7 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {Math.round(latestPrediction.confidence * 100)}% Match
            </div>
          )}
          <button
            onClick={handleSpeak}
            disabled={!currentText}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
            title="Read aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!isConnected && isTranslating ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="animate-pulse flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Connecting to server...
            </div>
          </div>
        ) : !isTranslating ? (
          <div className="h-full flex items-center justify-center text-gray-400 italic">
            Press Start to begin translating...
          </div>
        ) : (
          <div className="text-3xl font-medium text-gray-900 dark:text-white leading-relaxed">
            {currentText || <span className="text-gray-300 dark:text-gray-600">Waiting for signs...</span>}
            <span className="inline-block w-2 h-8 bg-blue-500 animate-pulse ml-1 align-middle"></span>
          </div>
        )}
      </div>
    </div>
  );
}

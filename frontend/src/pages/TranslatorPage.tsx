import { useState } from 'react';
import { WebcamFeed } from '../components/WebcamFeed';
import { LandmarkOverlay } from '../components/LandmarkOverlay';
import { TranslationPanel } from '../components/TranslationPanel';
import { useTranslatorSocket } from '../hooks/useTranslatorSocket';
import { Play, Square, Trash2 } from 'lucide-react';

export function TranslatorPage() {
  const [videoRef, setVideoRef] = useState<React.RefObject<HTMLVideoElement> | null>(null);
  
  const {
    isConnected,
    isTranslating,
    predictions,
    connect,
    disconnect,
    startTranslating,
    stopTranslating,
    clearTranslations,
  } = useTranslatorSocket();

  const handleToggleTranslation = () => {
    if (isTranslating) {
      stopTranslating();
      disconnect();
    } else {
      connect();
      startTranslating();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Translator Studio</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Position yourself in frame and start signing.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearTranslations}
              className="px-4 py-2 flex items-center text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </button>
            <button
              onClick={handleToggleTranslation}
              className={`px-6 py-2 flex items-center text-white font-semibold rounded-lg transition-colors ${
                isTranslating 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isTranslating ? (
                <>
                  <Square className="w-4 h-4 mr-2 fill-current" /> Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" /> Start
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="relative rounded-xl overflow-hidden bg-black shadow-lg">
            <WebcamFeed onVideoReady={setVideoRef} isActive={isTranslating} />
            <LandmarkOverlay isActive={isTranslating} videoRef={videoRef} />
          </div>
          
          <div className="h-full">
            <TranslationPanel 
              predictions={predictions} 
              isConnected={isConnected} 
              isTranslating={isTranslating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

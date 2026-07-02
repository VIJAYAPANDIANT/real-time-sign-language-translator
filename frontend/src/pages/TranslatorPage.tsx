import { useState } from 'react';
import { WebcamFeed } from '../components/WebcamFeed';
import { LandmarkOverlay } from '../components/LandmarkOverlay';
import { TranslationPanel } from '../components/TranslationPanel';
import { ReverseTranslator } from '../components/ReverseTranslator';
import { useTranslatorSocket } from '../hooks/useTranslatorSocket';
import { Play, Square, Trash2, ArrowLeftRight } from 'lucide-react';
import './TranslatorPage.css';

export function TranslatorPage() {
  const [mode, setMode] = useState<'sign-to-text' | 'text-to-sign'>('sign-to-text');
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

  const toggleMode = () => {
    if (isTranslating) {
      stopTranslating();
      disconnect();
    }
    setMode(prev => prev === 'sign-to-text' ? 'text-to-sign' : 'sign-to-text');
  };

  return (
    <div className="container translator-page animate-fade-in">
      <div className="glass-panel translator-header">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="h2 translator-title text-gradient">Translator Studio</h1>
            <button 
              onClick={toggleMode}
              className="mode-toggle-btn"
              title="Switch translation mode"
            >
              <ArrowLeftRight size={20} />
              <span className="mode-toggle-text">
                {mode === 'sign-to-text' ? 'Sign → Text' : 'Text → Sign'}
              </span>
            </button>
          </div>
          <p className="text-secondary">
            {mode === 'sign-to-text' 
              ? 'Position yourself in frame and start signing.' 
              : 'Type or speak to see the sign language sequence.'}
          </p>
        </div>
        
        {mode === 'sign-to-text' && (
          <div className="translator-actions">
            <button
              onClick={clearTranslations}
              className="btn btn-secondary"
            >
              <Trash2 size={18} />
              Clear
            </button>
            <button
              onClick={handleToggleTranslation}
              className={`btn ${isTranslating ? 'btn-stop' : 'btn-primary'}`}
            >
              {isTranslating ? (
                <>
                  <Square size={18} className="fill-current" /> Stop
                </>
              ) : (
                <>
                  <Play size={18} className="fill-current" /> Start
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {mode === 'sign-to-text' ? (
        <div className="translator-workspace">
          <div className={`video-container ${isTranslating ? 'active' : ''}`}>
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
      ) : (
        <div className="translator-workspace-reverse">
          <ReverseTranslator />
        </div>
      )}
    </div>
  );
}

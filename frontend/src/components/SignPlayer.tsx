import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import './SignPlayer.css';

export interface SignSequenceItem {
  type: 'word' | 'letter';
  text: string;
  url: string;
}

interface SignPlayerProps {
  sequence: SignSequenceItem[];
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
  speed?: number; // duration multiplier
}

export function SignPlayer({ sequence, isPlaying, onPlayStateChange, speed = 1.0 }: SignPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Constants for durations (in ms)
  const LETTER_DURATION = 800 * speed;
  const WORD_DURATION = 1500 * speed;

  useEffect(() => {
    // Reset when sequence changes
    setCurrentIndex(0);
    if (sequence.length > 0) {
      onPlayStateChange(true);
    } else {
      onPlayStateChange(false);
    }
  }, [sequence, onPlayStateChange]);

  useEffect(() => {
    if (!isPlaying || sequence.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentItem = sequence[currentIndex];
    
    // Determine how long to show the current item
    // In a real app with videos, we'd use the video's onEnded event
    // Since we're using SVGs, we use static timeouts
    const duration = currentItem.type === 'word' ? WORD_DURATION : LETTER_DURATION;

    timerRef.current = window.setTimeout(() => {
      if (currentIndex < sequence.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onPlayStateChange(false); // End of sequence
      }
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPlaying, sequence, WORD_DURATION, LETTER_DURATION, onPlayStateChange]);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(sequence.length - 1, prev + 1));
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    onPlayStateChange(true);
  };

  if (sequence.length === 0) {
    return (
      <div className="sign-player-empty">
        <p className="text-secondary">Enter text above to see the sign sequence.</p>
      </div>
    );
  }

  const currentItem = sequence[currentIndex];

  return (
    <div className="sign-player-container">
      <div className="sign-display">
        <img 
          src={currentItem.url} 
          alt={`Sign for ${currentItem.text}`} 
          className="sign-media"
        />
        <div className="sign-overlay-text">
          {currentItem.text}
        </div>
      </div>

      <div className="sign-controls">
        <button onClick={handlePrevious} disabled={currentIndex === 0} className="btn-icon">
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={() => currentIndex === sequence.length - 1 && !isPlaying ? handleReplay() : onPlayStateChange(!isPlaying)} 
          className="btn-icon play-btn"
        >
          {currentIndex === sequence.length - 1 && !isPlaying ? (
            <RotateCcw size={32} />
          ) : isPlaying ? (
            <Pause size={32} />
          ) : (
            <Play size={32} />
          )}
        </button>

        <button onClick={handleNext} disabled={currentIndex === sequence.length - 1} className="btn-icon">
          <SkipForward size={24} />
        </button>
      </div>
      
      <div className="sign-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / sequence.length) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          {currentIndex + 1} / {sequence.length}
        </div>
      </div>
    </div>
  );
}

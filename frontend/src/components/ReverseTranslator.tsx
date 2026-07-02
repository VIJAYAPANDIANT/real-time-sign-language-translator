import { useState, useRef } from 'react';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { SignPlayer } from './SignPlayer';
import type { SignSequenceItem } from './SignPlayer';
import './ReverseTranslator.css';

// TypeScript declarations for SpeechRecognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function ReverseTranslator() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sequence, setSequence] = useState<SignSequenceItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const recognitionRef = useRef<any>(null);

  const initSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please try Chrome.");
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        recognitionRef.current = initSpeechRecognition();
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setSequence([]);

    try {
      // In production this would be an env var or relative path
      const response = await fetch(`/api/sign-lookup?text=${encodeURIComponent(text)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sequence');
      }
      
      const data: SignSequenceItem[] = await response.json();
      setSequence(data);
    } catch (error) {
      console.error("Error fetching sign sequence:", error);
      alert("Failed to lookup signs. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reverse-translator-container">
      <div className="glass-panel player-section">
        <SignPlayer 
          sequence={sequence} 
          isPlaying={isPlaying} 
          onPlayStateChange={setIsPlaying}
          speed={1.0} 
        />
      </div>

      <div className="glass-panel input-section">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type English text to translate to ASL..."
              className="text-input"
              disabled={isLoading}
            />
            
            <button 
              type="button" 
              onClick={toggleListening}
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!text.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            <span>Translate</span>
          </button>
        </form>
      </div>
    </div>
  );
}

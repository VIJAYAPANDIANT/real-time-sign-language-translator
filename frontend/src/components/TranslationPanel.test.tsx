import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TranslationPanel } from './TranslationPanel';
import type { Prediction } from '../types';

describe('TranslationPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Press Start to begin translating..." when isTranslating is false', () => {
    render(<TranslationPanel predictions={[]} isConnected={false} isTranslating={false} />);
    expect(screen.getByText('Press Start to begin translating...')).toBeInTheDocument();
  });

  it('shows "Connecting to server..." when isTranslating is true but isConnected is false', () => {
    render(<TranslationPanel predictions={[]} isConnected={false} isTranslating={true} />);
    expect(screen.getByText('Connecting to server...')).toBeInTheDocument();
  });

  it('renders predictions correctly and shows the latest confidence', () => {
    const mockPredictions: Prediction[] = [
      { text: 'HELLO', gloss: 'HELLO', confidence: 0.95 },
      { text: 'THANK YOU', gloss: 'THANK YOU', confidence: 0.88 },
    ];

    render(<TranslationPanel predictions={mockPredictions} isConnected={true} isTranslating={true} />);
    
    // Check if the joined text is rendered
    expect(screen.getByText('HELLO THANK YOU')).toBeInTheDocument();
    
    // Check if the confidence badge shows the latest prediction's confidence
    expect(screen.getByText('88% Match')).toBeInTheDocument();
  });

  it('triggers speechSynthesis when the speak button is clicked', () => {
    const mockSpeak = vi.fn();
    
    // Mock window.speechSynthesis
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak: mockSpeak },
      writable: true
    });

    // Mock SpeechSynthesisUtterance
    const mockUtterance = vi.fn();
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      value: mockUtterance,
      writable: true
    });

    const mockPredictions: Prediction[] = [{ text: 'Hello', gloss: 'Hello', confidence: 0.99 }];

    render(<TranslationPanel predictions={mockPredictions} isConnected={true} isTranslating={true} />);
    
    const speakButton = screen.getByTitle('Read aloud');
    expect(speakButton).toBeEnabled();
    
    fireEvent.click(speakButton);
    
    expect(mockUtterance).toHaveBeenCalledWith('Hello');
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('disables the speak button when there is no text', () => {
    render(<TranslationPanel predictions={[]} isConnected={true} isTranslating={true} />);
    
    const speakButton = screen.getByTitle('Read aloud');
    expect(speakButton).toBeDisabled();
  });
});

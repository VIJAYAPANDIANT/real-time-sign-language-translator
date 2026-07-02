import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebcamFeed } from './WebcamFeed';
import * as useWebcamModule from '../hooks/useWebcam';

// Mock the useWebcam hook
vi.mock('../hooks/useWebcam', () => ({
  useWebcam: vi.fn(),
}));

describe('WebcamFeed Component', () => {
  const mockStartCamera = vi.fn();
  const mockStopCamera = vi.fn();
  const mockOnVideoReady = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Camera is off" when isActive is false', () => {
    vi.mocked(useWebcamModule.useWebcam).mockReturnValue({
      stream: null,
      startCamera: mockStartCamera,
      stopCamera: mockStopCamera,
      devices: [],
    });

    render(<WebcamFeed isActive={false} onVideoReady={mockOnVideoReady} />);

    expect(screen.getByText('Camera is off')).toBeInTheDocument();
    expect(mockStopCamera).toHaveBeenCalled();
  });

  it('shows "Accessing camera..." when isActive is true but no stream is available yet', () => {
    vi.mocked(useWebcamModule.useWebcam).mockReturnValue({
      stream: null,
      startCamera: mockStartCamera,
      stopCamera: mockStopCamera,
      devices: [],
    });

    render(<WebcamFeed isActive={true} onVideoReady={mockOnVideoReady} />);

    expect(screen.getByText('Accessing camera...')).toBeInTheDocument();
    expect(mockStartCamera).toHaveBeenCalled();
  });

  it('renders the video element correctly when a stream is provided', () => {
    // Create a dummy stream object
    const dummyStream = {} as unknown as MediaStream;
    
    vi.mocked(useWebcamModule.useWebcam).mockReturnValue({
      stream: dummyStream,
      startCamera: mockStartCamera,
      stopCamera: mockStopCamera,
      devices: [],
    });

    const { container } = render(<WebcamFeed isActive={true} onVideoReady={mockOnVideoReady} />);
    
    // The loading states should not be present
    expect(screen.queryByText('Accessing camera...')).not.toBeInTheDocument();
    expect(screen.queryByText('Camera is off')).not.toBeInTheDocument();

    // The video element should be visible (not hidden)
    const videoElement = container.querySelector('video');
    expect(videoElement).toBeInTheDocument();
    expect(videoElement?.className).not.toContain('hidden');
    expect(mockOnVideoReady).toHaveBeenCalled();
  });
});

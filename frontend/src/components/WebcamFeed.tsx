import { useEffect, useRef } from 'react';
import { useWebcam } from '../hooks/useWebcam';
import { VideoOff } from 'lucide-react';

interface WebcamFeedProps {
  onVideoReady?: (videoRef: React.RefObject<HTMLVideoElement>) => void;
  isActive: boolean;
}

export function WebcamFeed({ onVideoReady, isActive }: WebcamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null) as React.RefObject<HTMLVideoElement>;
  const { stream, startCamera, stopCamera } = useWebcam(videoRef);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive, startCamera, stopCamera]);

  useEffect(() => {
    if (onVideoReady && videoRef.current) {
      onVideoReady(videoRef);
    }
  }, [onVideoReady, videoRef]);

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
      {!stream && isActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Accessing camera...</p>
        </div>
      )}
      
      {!isActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-800">
          <VideoOff className="w-12 h-12 mb-2 opacity-50" />
          <p>Camera is off</p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transform -scale-x-100 ${(!stream || !isActive) ? 'hidden' : 'block'}`}
      />
    </div>
  );
}

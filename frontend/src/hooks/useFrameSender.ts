import { useEffect, useRef } from 'react';

export function useFrameSender(
  videoRef: React.RefObject<HTMLVideoElement> | null,
  isActive: boolean,
  sendFrame: (frameData: string) => void,
  fps: number = 10
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Create an offscreen canvas for capturing frames
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    let intervalId: number;

    if (isActive && videoRef && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const captureAndSend = () => {
        if (video.readyState >= 2 && ctx) { // HAVE_CURRENT_DATA
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Get base64 string, stripping the data URL prefix if needed by backend
          const base64Url = canvas.toDataURL('image/jpeg', 0.5);
          
          // The backend expects base64 data. Usually it can handle the full data URL, 
          // or we strip "data:image/jpeg;base64,"
          const base64Data = base64Url.split(',')[1];
          if (base64Data) {
            sendFrame(base64Data);
          }
        }
      };

      intervalId = window.setInterval(captureAndSend, 1000 / fps);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, videoRef, sendFrame, fps]);
}

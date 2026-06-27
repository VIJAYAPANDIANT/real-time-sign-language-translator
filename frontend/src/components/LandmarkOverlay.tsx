import { useEffect, useRef } from 'react';

interface LandmarkOverlayProps {
  isActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement> | null;
}

export function LandmarkOverlay({ isActive, videoRef }: LandmarkOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const renderMockLandmarks = () => {
      const canvas = canvasRef.current;
      const video = videoRef?.current;
      
      if (canvas && video && isActive) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Match canvas size to video display size
          canvas.width = video.clientWidth;
          canvas.height = video.clientHeight;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw some mock landmarks (a pulsating circle and lines) for visual effect
          const time = Date.now() / 1000;
          const centerX = canvas.width / 2 + Math.sin(time) * 50;
          const centerY = canvas.height / 2 + Math.cos(time) * 50;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#60a5fa';
          ctx.stroke();

          // Mock skeleton lines
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + (Math.random() - 0.5) * 100, centerY + (Math.random() - 0.5) * 100);
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.stroke();
          }
        }
        animationFrameId = requestAnimationFrame(renderMockLandmarks);
      }
    };

    if (isActive) {
      renderMockLandmarks();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100 ${isActive ? 'block' : 'hidden'}`}
    />
  );
}

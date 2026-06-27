import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../contexts/ToastContext';

export function useWebcam(videoRef: React.RefObject<HTMLVideoElement>) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !settings.deviceId) {
        updateSettings({ deviceId: videoDevices[0].deviceId });
      }
    } catch (err) {
      console.error('Error fetching devices', err);
    }
  }, [settings.deviceId, updateSettings]);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      addToast('Camera API not supported in this browser.', 'error');
      return;
    }

    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: settings.deviceId ? { deviceId: { exact: settings.deviceId } } : true,
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      await getDevices();
    } catch (err) {
      console.error('Error accessing camera', err);
      addToast('Camera access denied or unavailable.', 'error');
    }
  }, [settings.deviceId, videoRef, addToast, getDevices, stream]); // Note: stream in deps could cause loops if not careful, but fine for simple cases

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream, videoRef]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return { stream, devices, startCamera, stopCamera };
}

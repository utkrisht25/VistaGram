import { useEffect, useRef, useState } from 'react';

export default function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const start = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera API not available');
      return;
    }
    try {
      // More specific constraints for better compatibility
      const constraints = {
        video: {
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      // First stop any existing streams
      stop();
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.setAttribute('playsinline', 'true');
        video.muted = true;
        video.srcObject = stream;
        
        // Wait for video metadata to load before playing
        await new Promise((resolve) => {
          video.onloadedmetadata = resolve;
        });
        
        await video.play();
      }
      setReady(true);
    } catch (e) {
      console.error('Camera error:', e); // Log the full error
      if (e.name === 'NotAllowedError') {
        setError('Camera access denied. Please grant camera permission and try again.');
      } else if (e.name === 'NotFoundError') {
        setError('No camera found on your device.');
      } else if (e.name === 'NotReadableError') {
        setError('Camera is in use by another application.');
      } else {
        setError(e?.name ? `${e.name}: ${e.message}` : 'Unable to start camera');
      }
      setReady(false);
    }
  };

  const stop = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        streamRef.current.removeTrack(track);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setReady(false);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !ready) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
  };

  useEffect(() => () => stop(), []);
  return { videoRef, start, stop, capture, ready, error };
}

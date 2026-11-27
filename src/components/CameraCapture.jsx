import { useEffect, useRef, useState } from 'react';

const MAX_WIDTH = 800; // shrink photos so they are small enough to store

// Camera (device API #2): opens the camera with getUserMedia and takes a photo.
export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('unsupported');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // back camera on phones
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setReady(true);
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission was denied. Please allow it in your browser settings.');
        } else if (err.message === 'unsupported') {
          setError('Camera is not supported here. Use HTTPS or localhost.');
        } else {
          setError('Could not open the camera.');
        }
      }
    }

    startCamera();

    // Cleanup: always switch the camera off when the component closes.
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  function takePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    onCapture(canvas.toDataURL('image/jpeg', 0.7));
  }

  return (
    <div className="camera">
      {error ? <p className="error">{error}</p> : <video ref={videoRef} autoPlay playsInline muted />}
      <div className="row">
        <button type="button" className="btn primary" onClick={takePhoto} disabled={!ready}>
          Take photo
        </button>
        <button type="button" className="btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

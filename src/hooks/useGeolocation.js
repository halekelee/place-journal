import { useState, useCallback } from 'react';

// Custom hook: wraps the browser Geolocation API (device API #1).
export default function useGeolocation(initial = null) {
  const [position, setPosition] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getPosition = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported on this device.');
      return;
    }
    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setLoading(false);
      },
      (err) => {
        // Handle the permission result: denied / unavailable / timeout
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission was denied. Please allow it in your browser settings.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Your location is not available right now.');
        } else {
          setError('Getting your location took too long. Please try again.');
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const clearPosition = useCallback(() => setPosition(null), []);

  return { position, error, loading, getPosition, clearPosition };
}

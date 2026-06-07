import { useState, useEffect } from 'react';

type Coords = { lat: number; lng: number } | null;

export function useLocation() {
  const [coords, setCoords] = useState<Coords>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const locationEnabled = localStorage.getItem('location_enabled') === 'true';

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        localStorage.setItem('location_enabled', 'true');
        localStorage.setItem('last_lat', String(pos.coords.latitude));
        localStorage.setItem('last_lng', String(pos.coords.longitude));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const lastLat = localStorage.getItem('last_lat');
    const lastLng = localStorage.getItem('last_lng');
    if (lastLat && lastLng) {
      setCoords({ lat: parseFloat(lastLat), lng: parseFloat(lastLng) });
    }
    if (locationEnabled) requestLocation();
  }, []);

  return { coords, error, loading, requestLocation };
}

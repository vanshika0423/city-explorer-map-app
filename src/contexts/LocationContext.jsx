// src/contexts/LocationContext.jsx
import { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (pos) => setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }),
      (err) => { /* handle errors */ },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}

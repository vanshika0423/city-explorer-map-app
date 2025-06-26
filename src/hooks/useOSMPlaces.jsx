// src/hooks/useOSMPlaces.jsx
import { useState, useEffect } from 'react';
import { fetchOSMPlaces }      from '../api/overpass';

export default function useOSMPlaces(tag, location, radiusKm = 2) {
  const [places,  setPlaces]  = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔑 Destructure once
  const { key, value }          = tag;
  const { lat, lng }            = location;

  useEffect(() => {
    // guard conditions
    if (!key || !value || lat == null || lng == null) return;

    setLoading(true);
    fetchOSMPlaces(key, value, { lat, lng }, radiusKm)
      .then(setPlaces)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [
    key,        // using tag.key
    value,      // using tag.value
    lat,        // using location.lat
    lng,        // using location.lng
    radiusKm,   // using radiusKm
  ]);

  return { places, loading };
}

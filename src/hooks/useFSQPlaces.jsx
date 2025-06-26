// src/hooks/useFSQPlaces.jsx
import { useState, useEffect } from 'react';
import { fetchFSQPlaces }    from '../api/foursquare';

export default function useFSQPlaces(query, location) {
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(false);
  console.log('⏳ useFSQPlaces invoked — query:', query, 'location:', location);

  useEffect(() => {
  if (!query || location.lat == null) return;
  console.log('📡 Fetching Foursquare for', query, 'at', location);
  setLoading(true);

  fetchFSQPlaces(query, location)
    .then((results) => {
      console.log('✅ Foursquare returned', results.length, 'places', results);
      setPlaces(results);
    })
    .catch((err) => {
      console.error('❌ Foursquare error', err);
    })
    .finally(() => setLoading(false));
}, [query, location.lat, location.lng]);


  return { places, loading };
}

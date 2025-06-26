// src/api/foursquare.js
import axios from 'axios';

const FSQ_KEY = process.env.REACT_APP_FSQ_API_KEY;
const BASE_URL = 'https://api.foursquare.com/v3/places/search';

export async function fetchFSQPlaces(query, { lat, lng }) {
  // sanity-check:
  console.log('[fetchFSQPlaces] URL:', BASE_URL,
              'params:', { ll:`${lat},${lng}`, query, radius:5000 });
  
  const { data } = await axios.get(BASE_URL, {
    headers: { Authorization: FSQ_KEY },
    params: {
      ll:     `${lat},${lng}`,
      query,       // now this refers to the function arg
      radius: 5000,  // 5 km radius (tweak as you like)
      limit:  50,
    },
  });

  return data.results.map((p) => ({
    id:   p.fsq_id,
    name: p.name,
    lat:  p.geocodes.main.latitude,
    lng:  p.geocodes.main.longitude,
  }));
}

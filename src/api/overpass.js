// src/api/overpass.js
export async function fetchOSMPlaces(tagKey, tagValue, { lat, lng }, radiusKm = 20) {
   const delta = radiusKm / 111; 
  const bbox = [
    lat - delta, lng - delta,
    lat + delta, lng + delta,
  ].join(',');

  // Dynamically use the right key/value pair
  const query = `
    [out:json];
    node["${tagKey}"="${tagValue}"](${bbox});
    out;
  `;
  const url = 'https://overpass-api.de/api/interpreter?data='
            + encodeURIComponent(query);

  const res  = await fetch(url);
  const json = await res.json();
  return json.elements.map((el) => ({
    id:   el.id,
    name: el.tags.name || tagValue,
    lat:  el.lat,
    lng:  el.lon,
  }));
}

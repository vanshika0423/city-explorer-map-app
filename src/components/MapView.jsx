// src/components/MapView.jsx
import L from "leaflet";
import React, { useContext, useRef, useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  CircleMarker
} from 'react-leaflet';
import { LocationContext } from '../contexts/LocationContext';

// Blue dot (SVG inline as data URL) – you can replace this with any marker
const userIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

function SelectedMarker({ poi }) {
  const map = useMap();
  const markerRef = useRef();

  useEffect(() => {
    if (!poi) return;
    map.flyTo([poi.lat, poi.lng], 15, { animate: true });
    setTimeout(() => markerRef.current?.openPopup(), 300);
  }, [poi, map]);

  if (!poi) return null;
  return (
    <Marker
      ref={markerRef}
      position={[poi.lat, poi.lng]}
      // Make the selected marker larger or colored:
      icon={window.L.icon({
        iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconSize: [35, 56],
        iconAnchor: [17, 55],
        popupAnchor: [0, -46],
        shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
        shadowSize: [41, 41]
      })}
    >
      <Popup>
        <h3>{poi.name}</h3>
        <p>
          Lat: {poi.lat.toFixed(4)}, Lng: {poi.lng.toFixed(4)}
        </p>
      </Popup>
    </Marker>
  );
}

export default function MapView({
  pois = [],
  selectedPoiId = null,
  onMarkerSelect = () => {},
  onFavorite,
  isFavorite,
  style = { height: '100%', width: '100%' },
  userLocation
}) {
  // From context, if not passed directly
  const loc = useContext(LocationContext);
  const userLat = userLocation?.lat ?? loc?.lat;
  const userLng = userLocation?.lng ?? userLocation?.lon ?? loc?.lng ?? loc?.lon;

  const [routeCoords, setRouteCoords] = useState(null);

  // Find the selected place
  const selectedPoi = selectedPoiId
    ? pois.find((p) => p.id === selectedPoiId)
    : null;

  // Route calculation with OSRM (real route)
  useEffect(() => {
    if (!selectedPoi || userLat == null || userLng == null) {
      setRouteCoords(null);
      return;
    }
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/` +
      `${userLng},${userLat};${selectedPoi.lng},${selectedPoi.lat}` +
      `?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 'Ok' && json.routes.length > 0) {
          // GeoJSON coords are [lng,lat], Leaflet wants [lat,lng]
          const coords = json.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRouteCoords(coords);
        } else {
          setRouteCoords(null);
        }
      })
      .catch(() => setRouteCoords(null));
  }, [selectedPoi, userLat, userLng]);

  if (userLat == null || userLng == null) {
    return <p>Fetching location…</p>;
  }

  return (
    <MapContainer center={[userLat, userLng]} zoom={13} style={style}>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User’s current location marker */}
      {/* <CircleMarker
        center={[userLat, userLng]}
        radius={13}
        color="#00b4d8"
        fillColor="#00b4d8"
        fillOpacity={0.3}
        stroke={false}
      >
        <Popup>You are here</Popup>
      </CircleMarker> */}

      <Marker position={[userLat, userLng]} icon={userIcon}>
        <Popup>
          <b>You are here</b>
        </Popup>
      </Marker>
      
      {/* POI markers */}
      {pois.map((poi) =>
        selectedPoiId === poi.id ? null : (
          <Marker
            key={poi.id}
            position={[poi.lat, poi.lng]}
            eventHandlers={{
              click: () => onMarkerSelect(poi),
            }}
          >
            <Popup>
              <h3>{poi.name}</h3>
              <button
                onClick={() => onFavorite(poi)}
                disabled={isFavorite(poi)}
                style={{
                  background: isFavorite(poi) ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 4,
                  cursor: isFavorite(poi) ? 'default' : 'pointer',
                }}
              >
                {isFavorite(poi) ? '★ Favorited' : '☆ Add to Favorites'}
              </button>
            </Popup>
          </Marker>
        )
      )}

      {/* Highlighted selected marker */}
      {selectedPoi && <SelectedMarker poi={selectedPoi} />}

      {/* Route polyline */}
      {routeCoords && (
        <Polyline
          positions={routeCoords}
          pathOptions={{ color: '#2563eb', weight: 6, opacity: 0.9 }}
        />
      )}
    </MapContainer>
  );
}

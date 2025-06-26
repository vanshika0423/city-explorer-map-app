import React, { useState, useEffect } from 'react';

function getDistanceAndTime(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  const walkSpeed = 5;   // km/h
  const driveSpeed = 30; // km/h
  const walkTime = (distance / walkSpeed) * 60;
  const driveTime = (distance / driveSpeed) * 60;
  return { distance, walkTime, driveTime };
}

export default function DetailModal({
  place,
  onClose,
  onFavorite,
  onRemove,
  isFavorite,
  userLocation,
}) {
  const [wiki, setWiki] = useState({
    summary: '',
    thumbnail: '',
    loading: false,
    error: false,
  });

  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    setWiki({ summary: '', thumbnail: '', loading: true, error: false });

    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        place.name
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error('No wiki page');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setWiki({
          summary: data.extract || '',
          thumbnail: data.thumbnail?.source || '',
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setWiki((w) => ({ ...w, loading: false, error: true }));
      });

    return () => {
      cancelled = true;
    };
  }, [place?.name]);

  if (!place) return null;

  const alreadyFav = isFavorite(place);

  // Calculate distance and time
  let distanceBlock = null;
  const userLat = userLocation?.lat;
  const userLon = userLocation?.lon ?? userLocation?.lng;
  const placeLat = place.lat;
  const placeLon = place.lon ?? place.lng;

  if (
    typeof userLat === "number" &&
    typeof userLon === "number" &&
    typeof placeLat === "number" &&
    typeof placeLon === "number"
  ) {
    const { distance, walkTime, driveTime } = getDistanceAndTime(
      userLat, userLon, placeLat, placeLon
    );
    distanceBlock = (
      <div style={{
        marginTop: '0.2rem', marginBottom: '0.7rem',
        fontSize: '1rem', color: '#5b6478', fontWeight: 500
      }}>
        <span>📏 <b>{distance.toFixed(2)} km</b> away</span><br />
        <span>🚶 {Math.round(walkTime)} min walk &nbsp;|&nbsp; 🚗 {Math.round(driveTime)} min drive</span>
      </div>
    );
  } else if (!userLocation || typeof userLat !== "number" || typeof userLon !== "number") {
    distanceBlock = (
      <div style={{ marginTop: '0.3rem', color: '#999', fontSize: '0.98rem' }}>
        (Enable location to see distance & time)
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          maxWidth: 450,
          width: '90%',
          maxHeight: '90%',
          overflowY: 'auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{place.name}</h2>

        {distanceBlock}

        {!wiki.loading && wiki.thumbnail && (
          <img
            src={wiki.thumbnail}
            alt={place.name}
            style={{
              width: '100%',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
          />
        )}

        {!wiki.loading && !wiki.error && wiki.summary && (
          <p style={{ lineHeight: 1.4 }}>{wiki.summary}</p>
        )}

        {!wiki.loading && wiki.error && (
          <p style={{ color: '#666' }}>
            No additional description available.
          </p>
        )}

        <div style={{ marginTop: '1rem' }}>
          {alreadyFav ? (
            <button
              onClick={() => onRemove(place)}
              style={{
                padding: '0.5rem 1rem',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '0.5rem',
              }}
            >
              🗑️ Remove from Favorites
            </button>
          ) : (
            <button
              onClick={() => onFavorite(place)}
              style={{
                padding: '0.5rem 1rem',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '0.5rem',
              }}
            >
              ☆ Add to Favorites
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

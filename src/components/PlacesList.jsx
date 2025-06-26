// src/components/PlacesList.jsx

import React from "react";
import "./PlacesList.css"; 

// Function to compute distance/time
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

export default function PlacesList({
  places,
  onSelect,
  onFavorite,
  onRemoveFavorite,
  isFavorite,
  userLocation, 
  selectedPlaceId 
}) {
  if (!places.length) return <div style={{ padding: "2rem", color: "#888" }}>No places found.</div>;

  return (
    <div className="places-list">
      {places.map((place) => {
        const favorite = isFavorite ? isFavorite(place) : false;
        const isSelected = selectedPlaceId === place.id;

        // Distance & time block logic
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
            <div style={{ color: "#5b6478", fontSize: "0.98rem", marginTop: "2px" }}>
              <span>📏 <b>{distance.toFixed(2)} km</b> away</span>
              <span style={{ marginLeft: 8 }}>
                🚶 {Math.round(walkTime)} min | 🚗 {Math.round(driveTime)} min
              </span>
            </div>
          );
        }

        return (
          <div
            key={place.id}
            className={`place-card${isSelected ? " selected" : ""}`}
            onClick={() => onSelect(place)}
            style={isSelected
              ? { boxShadow: "0 0 0 3px #38bdf8", background: "#f0faff", borderRadius: 12 }
              : {}}
          >
            <div className="place-info">
              <div className="place-title-row">
                <span className="place-emoji">
                  {place.category === "Food" ? "🍽️" :
                  place.category === "Museum" ? "🏛️" :
                  place.category === "Park" ? "🌳" :
                  "📍"}
                </span>
                <h4>{place.name}</h4>
                {/* Favorite heart */}
                <span
                  className="fav-heart"
                  onClick={e => {
                    e.stopPropagation();
                    favorite ? onRemoveFavorite(place) : onFavorite(place);
                  }}
                  title={favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {favorite ? "❤️" : "🤍"}
                </span>
              </div>
              {distanceBlock}
              <div className="place-meta">
                <span className="category">{place.category}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

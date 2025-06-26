import React, { useState } from "react";
import PlacesList from "../components/PlacesList";

// Dummy data
const samplePlaces = [
  { id: 1, name: "Subba's corner", category: "Food" },
  { id: 2, name: "The Out Laws", category: "Food" },
  { id: 3, name: "Dana Pani", category: "Food" },
];

const HomePage = () => {
  const [favorites, setFavorites] = useState([]);

  // Add to favorites
  const addFavorite = (place) => {
    if (!favorites.find((f) => f.id === place.id)) {
      setFavorites([...favorites, place]);
    }
  };

  // Remove from favorites
  const removeFavorite = (place) => {
    setFavorites(favorites.filter((f) => f.id !== place.id));
  };

  // Check if a place is a favorite
  const isFavorite = (place) => favorites.some((f) => f.id === place.id);

  // Handle card click
  const handlePlaceClick = (place) => {
    alert(`You clicked: ${place.name}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 24 }}>
      <PlacesList
        places={samplePlaces}
        onSelect={handlePlaceClick}
        onFavorite={addFavorite}
        onRemoveFavorite={removeFavorite}
        isFavorite={isFavorite}
      />
    </div>
  );
};

export default HomePage;

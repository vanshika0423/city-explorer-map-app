// src/App.jsx
import './App.css';

import React, { useContext, useState, useEffect } from 'react';
import { LocationContext } from './contexts/LocationContext';
import SearchBar           from './components/SearchBar';
import RadiusSlider        from './components/RadiusSlider';
import PlacesList          from './components/PlacesList';
import MapView             from './components/MapView';
// import DetailModal      from './components/DetailModal'; // Not used in this flow
import useOSMPlaces        from './hooks/useOSMPlaces';

export default function App() {
  const location = useContext(LocationContext);

  // — Controls
  const [tag,    setTag]    = useState({ key: 'amenity', value: 'restaurant' });
  const [radius, setRadius] = useState(2);
  const [term,   setTerm]   = useState(tag.value);

  // — Data fetching
  const { places, loading } = useOSMPlaces(tag, location, radius, term);

  // — UI state
  const [selectedPlace,    setSelectedPlace]    = useState(null);
  const [detailModalPlace, setDetailModalPlace] = useState(null);
  const [viewFavorites,    setViewFavorites]    = useState(false);

  // — Favorites (persisted in localStorage)
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  }, []);

  function addFavorite(poi) {
    if (favorites.some((f) => f.id === poi.id)) return;
    const next = [...favorites, poi];
    setFavorites(next);
    localStorage.setItem('favorites', JSON.stringify(next));
  }

  function removeFavorite(poi) {
    const next = favorites.filter((f) => f.id !== poi.id);
    setFavorites(next);
    localStorage.setItem('favorites', JSON.stringify(next));
  }

  // Sync search term into your tag’s free-text value (so category and search both affect results)
  useEffect(() => {
    setTag((t) => ({ ...t, value: term }));
  }, [term]);

  // Clear selections when toggling tabs
  function showResults() {
    setViewFavorites(false);
    setSelectedPlace(null);
    setDetailModalPlace(null);
  }
  function showFavorites() {
    setViewFavorites(true);
    setSelectedPlace(null);
    setDetailModalPlace(null);
  }

  // Rotating Navbar Quote
  const quotes = [
    "Where to next? ✈️",
    "Adventure awaits!",
    "Eat. Travel. Repeat.",
    "Wander often, wonder always.",
    "Find your happy place 🏝️",
    "Take only memories, leave only footprints.",
  ];
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {/* — Hero Illustration (OPTIONAL, put your SVG/CSS here or style in App.css) — */}
      <div className="app-hero-bg">
        <img
          src="https://undraw.co/api/illustrations/undraw_map_1r6v.svg"
          alt="Map Illustration"
          className="app-hero-illus"
        />
      </div>
      {/* === Top Controls === */}
      <div className="navbar">
        <div className="navbar-inner">
          <span className="navbar-logo">🌏</span>
          <button
            className={`tab-btn${tag.value === 'restaurant' ? ' selected' : ''}`}
            onClick={() => { setTag({ key: 'amenity', value: 'restaurant' }); setTerm('restaurant'); }}
          >
            🍽️ Food
          </button>
          <button
            className={`tab-btn${tag.value === 'park' ? ' selected' : ''}`}
            onClick={() => { setTag({ key: 'leisure', value: 'park' }); setTerm('park'); }}
          >
            🌳 Park
          </button>
          <button
            className={`tab-btn${tag.value === 'museum' ? ' selected' : ''}`}
            onClick={() => { setTag({ key: 'tourism', value: 'museum' }); setTerm('museum'); }}
          >
            🏛️ Museum
          </button>
          <button
            className={`tab-btn${tag.value === 'attraction' ? ' selected' : ''}`}
            onClick={() => { setTag({ key: 'tourism', value: 'attraction' }); setTerm('attraction'); }}
          >
            📸 Attractions
          </button>
          <span className="navbar-quote">{quote}</span>
        </div>
      </div>

      <SearchBar onSearch={setTerm} />
      <RadiusSlider radius={radius} onChange={setRadius} />

      {/* === Main Split Pane === */}
      <div style={{ display: 'flex', height: 'calc(100vh - 160px)' }}>
        {/* — Sidebar */}
        <div
          style={{
            flex: '0 0 30%',
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Toggle Results / Favorites */}
          <div style={{ textAlign: 'center', margin: '0' }}>
            <button
              onClick={showResults}
              style={{ marginRight: 8, fontWeight: viewFavorites ? 'normal' : 'bold' }}
              className={!viewFavorites ? "selected" : ""}
            >
              Results
            </button>
            <button
              onClick={showFavorites}
              style={{ fontWeight: viewFavorites ? 'bold' : 'normal' }}
              className={viewFavorites ? "selected" : ""}
            >
              Favorites
            </button>
          </div>

          {/* Scrollable List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {viewFavorites ? (
              <PlacesList
                places={favorites}
                onSelect={(poi) => {
                  setDetailModalPlace(poi);
                  setSelectedPlace(null);
                }}
                onFavorite={addFavorite}
                onRemoveFavorite={removeFavorite}
                isFavorite={(poi) => favorites.some((f) => f.id === poi.id)}
                userLocation={location}
              />
            ) : (
              <PlacesList
                places={places}
                onSelect={(poi) => setSelectedPlace(poi)}
                onFavorite={addFavorite}
                onRemoveFavorite={removeFavorite}
                isFavorite={(poi) => favorites.some((f) => f.id === poi.id)}
                userLocation={location}
                selectedPlaceId={selectedPlace?.id}
              />
            )}
          </div>
        </div>

        {/* — Map Pane */}
        <div style={{ flex: '1 1 auto', height: '100%' }}>
          {loading ? (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              Loading {tag.value}…
            </p>
          ) : (
            <MapView
              pois={places}
              selectedPoiId={selectedPlace?.id}
              onMarkerSelect={setSelectedPlace}
              onFavorite={addFavorite}
              isFavorite={(poi) => favorites.some((f) => f.id === poi.id)}
              style={{ height: '100%', width: '100%' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

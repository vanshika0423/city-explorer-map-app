// src/components/RadiusSlider.jsx
import React from 'react';

export default function RadiusSlider({ radius, onChange }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <label>
        Radius: {radius} km
        <input
          type="range"
          min="1"
          max="20"
          value={radius}
          onChange={(e) => onChange(+e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
      </label>
    </div>
  );
}

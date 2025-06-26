// src/components/CategoryTabs.jsx
import React from 'react';

const categories = [
  { label: 'Food',        key: 'amenity',  value: 'restaurant' },
  { label: 'Park',        key: 'leisure',  value: 'park'       },
  { label: 'Museum',      key: 'tourism',  value: 'museum'     },
  { label: 'Attractions', key: 'tourism',  value: 'attraction' },
];

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
      {categories.map(({ label, key, value }) => (
  <button
    key={value}
    onClick={() => onSelect({ key, value })}
    style={{
      /* highlight if this is the selected pair */
      border:
        selected.value === value && selected.key === key
          ? '2px solid #007bff'
          : '1px solid #ccc',
    }}
  >
    {label}
  </button>
))}
    </div>
  );
}

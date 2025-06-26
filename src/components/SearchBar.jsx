// src/components/SearchBar.jsx
import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  function submit(e) {
    e.preventDefault();
    if (term.trim()) onSearch(term.trim());
  }

  return (
    <form onSubmit={submit} style={{ textAlign: 'center', margin: '1rem' }}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search for anything…"
        style={{ padding: '0.5rem', width: '60%', maxWidth: 400 }}
      />
      <button type="submit" style={{ marginLeft: 8, padding: '0.5rem 1rem' }}>
        Go
      </button>
    </form>
  );
}

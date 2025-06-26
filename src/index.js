import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';                        // <--- Only import App here!
import { LocationProvider } from './contexts/LocationContext';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <LocationProvider>
    <App />
  </LocationProvider>
);

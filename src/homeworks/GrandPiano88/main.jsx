import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GrandPiano88 from './GrandPiano88.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GrandPiano88 />
  </StrictMode>,
);
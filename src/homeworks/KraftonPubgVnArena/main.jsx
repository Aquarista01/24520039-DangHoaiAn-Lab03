import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import KraftonPubgVnArena from './KraftonPubgVnArena.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KraftonPubgVnArena />
  </StrictMode>,
);
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Les pages sont pré-rendues au build (1.6) : on « hydrate » le HTML existant.
// Une adresse avec paramètres (filtres, liste partagée) ou une page 404 est rendue côté navigateur.
const prerendered = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
const samePage = prerendered.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
if (container.firstElementChild && !window.location.search && samePage) hydrateRoot(container, app);
else { container.innerHTML = ''; createRoot(container).render(app); }

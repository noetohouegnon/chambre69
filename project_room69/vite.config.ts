import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Adresse publique du site (balises de partage, sitemap, données structurées).
 * Ordre de priorité : VITE_SITE_URL (domaine définitif, ex. https://chambre69.sn),
 * puis l'adresse de production fournie automatiquement par Vercel ou Netlify.
 */
const siteUrl =
  process.env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  process.env.URL ||
  '';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

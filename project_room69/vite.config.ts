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
    // Vrai uniquement pour un build sur Vercel : active Vercel Web Analytics (sans cookie).
    'import.meta.env.VITE_ON_VERCEL': JSON.stringify(process.env.VERCEL ? '1' : ''),
  },
  build: {
    rollupOptions: {
      output: {
        // Code de l'application, bibliothèques et catalogue séparés : une modification du catalogue
        // depuis /admin ne force pas les visiteuses à retélécharger tout le reste.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler') || id.includes('react-router')) return 'react';
          if (id.includes('node_modules/lucide-react')) return 'icones';
          if (id.endsWith('src/data/catalog.json')) return 'catalogue';
          return undefined;
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

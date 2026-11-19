/** @type {import('tailwindcss').Config} */
// Palette resserrée (3.1) : une dominante sombre, une couleur d'accent, deux neutres.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0B0A09', 2: '#13110F', 3: '#1C1915', 4: '#26221D' },
        gold: { DEFAULT: '#C9A96E', soft: '#E3D2AE', deep: '#9C7F4B' },
        ivory: { DEFAULT: '#F4EEE4', 2: '#D9D1C4' },
        mute: { DEFAULT: '#ADA496' },
        wa: '#25D366',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: { prose: '68ch' },
      letterSpacing: { label: '0.18em' },
    },
  },
  plugins: [],
};

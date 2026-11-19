/** @type {import('tailwindcss').Config} */
// Charte graphique Chambre 69 (oct. 2026) : base crème, bordeaux porteur, noir et or en accents.
// Les noms de jetons sont historiques : ink = fonds (crème), ivory = textes (bordeaux), gold = accent principal (bordeaux), or = or de la charte.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#F4F2EE', 2: '#EDE8E2', 3: '#E5DED6', 4: '#D8CEC4' },
        gold: { DEFAULT: '#5A1725', soft: '#74283A', deep: '#3E0E18' },
        or: { DEFAULT: '#E49D27', text: '#9A600D' },
        bordeaux: '#5A1725',
        creme: '#F4F2EE',
        ivory: { DEFAULT: '#4A1220', 2: '#4B3438' },
        mute: { DEFAULT: '#75595E' },
        wa: '#25D366',
      },
      fontFamily: {
        serif: ['Italiana', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: { prose: '68ch' },
      letterSpacing: { label: '0.18em' },
    },
  },
  plugins: [],
};

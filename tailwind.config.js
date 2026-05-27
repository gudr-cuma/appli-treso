/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette extraite des maquettes mycuma infinity
        navy: {
          DEFAULT: '#2C3E50',
          dark: '#1F2D3D',
        },
        accent: {
          DEFAULT: '#F39200', // orange CTA / icônes actives
          dark: '#C97600',
          light: '#FFD89B',
        },
        ok: '#7DC242', // vert statut payé
        ko: '#E74C3C', // rouge statut impayé
        surface: {
          DEFAULT: '#F1F3F6',
          card: '#FFFFFF',
        },
        muted: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        tile: '0 2px 8px rgba(0,0,0,0.06)',
        card: '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

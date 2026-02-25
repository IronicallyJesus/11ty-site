/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,njk,md,js}',
    './.eleventy.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',    // Deep slate
          accent: '#38bdf8',  // Sky blue
          glow: '#6366f1',    // Indigo for highlighting
        },
        surface: {
          card: 'rgba(30, 41, 59, 0.7)',
          glass: 'rgba(15, 23, 42, 0.3)',
        },
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
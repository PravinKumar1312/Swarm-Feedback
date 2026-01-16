/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyber/Neon Palette Overrides
        pink: {
          400: '#e879f9',
          500: '#d946ef', // Neon Fuchsia
          600: '#c026d3',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6', // Electric Violet
          600: '#7c3aed',
        },
        blue: {
          400: '#38bdf8',
          500: '#0ea5e9', // Vivid Sky
          600: '#0284c7',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4', // Neon Cyan
          600: '#0891b2',
        },
        slate: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617', // Deepest Void
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

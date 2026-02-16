/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a2332',
          light: '#2d3a4d',
          dark: '#0f1419',
        },
        pearl: {
          DEFAULT: '#f8f7f5',
          light: '#fefefe',
          dark: '#efede9',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e8c961',
          dark: '#b8941f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

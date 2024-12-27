/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          light: '#8B5CF6',
          dark: '#6D28D9'
        },
        secondary: {
          DEFAULT: '#EC4899',
          light: '#F472B6',
          dark: '#DB2777'
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
        display: ['Unbounded', 'sans-serif'],
        price: ['Unbounded', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
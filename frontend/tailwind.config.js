/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx,html}", // <-- Add this line to cover subfolders
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
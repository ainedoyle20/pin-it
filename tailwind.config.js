/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '320px',
      ...defaultTheme.screens,
      '3xl': '1600px'
    },
    extend: {
      screens: {
        '3xl': '1600px'
      }
    }
  },
  plugins: [],
}

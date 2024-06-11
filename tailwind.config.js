/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      "light-white": 'rgba(255, 255, 255, 0.18)',
      "socman-yellow": '#FF9800',
      colors: {
        "socman-yellow": '#FF9800',
      }
    },
    
  },
  plugins: [],
}


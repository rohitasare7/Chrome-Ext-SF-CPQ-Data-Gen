/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./app.html","./src/*.{vue,js,ts,jsx,tsx}",  "./src/**/*.{vue,js,ts,jsx,tsx}","./src/*/*.{vue,js,ts,jsx,tsx}", "./src/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    extend: {

    },
  },
  plugins: [],
  darkMode: 'class',
}


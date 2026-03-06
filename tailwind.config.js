/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bodyColor: "#191E32", 
        boxColor: "#1a223a",
        currentColor:"#191E32",
        secondaryColor:"#2A3254",
        fillColor:"#c9a33d"
      },
      fontFamily: {
        arial: ["Arial", "sans-serif"], 
      },
    },
  },
  plugins: [],
}


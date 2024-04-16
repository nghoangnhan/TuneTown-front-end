/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Add font merriweather to the font-family
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#59c26d",
        primaryText: "#3d3b3b",
        primaryBold: "#618264",
        primaryLight: "#B0D9B1",
        primaryLighter: "#D0E7D2",
        primaryHoverOn: "#74ff8f",
        backgroundPrimary: "#ecf2fd",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        forest: "#0F3D3E",
        forestlight: "#175C5D",
        amber: "#E8A33D",
        sand: "#FAF9F6",
        line: "#E4E1D8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

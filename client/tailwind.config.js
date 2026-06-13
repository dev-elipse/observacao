/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#0F2A4A",
          light: "#1A3D6B",
        },
        brand: {
          blue: "#1A56A0",
          "blue-light": "#2E7BD4",
          "blue-pale": "#E8F2FC",
          accent: "#F5A623",
          "accent-light": "#FEF3DC",
        },
      },
    },
  },
  plugins: [],
}

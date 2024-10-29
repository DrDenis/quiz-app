/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(74, 222, 128, 1)",
        dark: {
          bg: "#111827",
          card: "#1F2937",
          text: "#F9FAFB",
          border: "#374151",
        },
      },
    },
  },
  plugins: [],
};

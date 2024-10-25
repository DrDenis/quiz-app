/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#b4ff8f",
        secondary: "#6366f1",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#699D4C",
        secondary: "#6366f1",
        "flat-blue": "#3C73A8",
      },
    },
  },
  plugins: [],
};

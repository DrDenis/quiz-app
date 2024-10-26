/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3C73A8",
        secondary: "#6366f1",
        "flat-blue": "#3C73A8",
      },
    },
  },
  plugins: [],
};

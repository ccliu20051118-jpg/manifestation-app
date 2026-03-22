/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7BC2A8",
        "primary-dark": "#5A9B8A",
        "primary-light": "#A8D5C5",
        background: "#F5F9F7",
        "card-bg": "#FFFFFF",
        "card-btn": "#C2D8D0",
        "input-bg": "#D4EBE3",
        "input-border": "#A8D5C5",
        "text-main": "#2D4A3E",
        "text-sub": "#687076",
        "text-hint": "#9BB8AC",
      },
    },
  },
  plugins: [],
};

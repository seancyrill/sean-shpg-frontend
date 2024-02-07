/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Orange: "hsl(var(--Orange) / <alpha-value>)",
        Green: "hsl(var(--Green) / <alpha-value>)",
        Red: "hsl(var(--Red) / <alpha-value>)",
        "Soft-Red": "hsl(var(--Soft-Red) / <alpha-value>)",
        "Pale-orange": "hsl(var(--Pale-orange) / <alpha-value>)",
        "Moderate-blue": "hsl(var(--Moderate-blue) / <alpha-value>)",
        "Very-dark-blue": "hsl(var(--Very-dark-blue) / <alpha-value>)",
        "Dark-grayish-blue": "hsl(var(--Dark-grayish-blue) / <alpha-value>)",
        "Grayish-blue": "hsl(var(--Grayish-blue) / <alpha-value>)",
        "Light-grayish-blue": "hsl(var(--Light-grayish-blue) / <alpha-value>)",
        White: "hsl(var(--White) / <alpha-value>)",
        Black: "hsl(var(--Black) / <alpha-value>)",
      },
      backgroundImage: {
        "gradient-address":
          "repeating-linear-gradient(45deg, #ED6468, #ED6468 30px, #FFF 30px, #FFF 60px, #5457B6 60px, #5457B6 90px, #FFF 90px, #FFF 120px)",
      },
      fontFamily: {
        main: ["main", "sans-serif"],
        logo: ["logo", "sans-serif"],
      },
      keyframes: {
        spinner: {
          "0%": { transform: "rotate(0deg)", filter: "brightness(1.25)" },
          "50%": { filter: "brightness(50%)" },
          "100%": { transform: "rotate(360deg)", filter: "brightness(1.25)" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "loading-spinner": "spinner 1s linear infinite",
        "slide-in": "slideIn 0.5s ease-in-out",
        "slide-out": "slideOut 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};

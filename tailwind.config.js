/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "south-card-fly-center": "south-card-fly-center 0.5s ease-in",
        "west-card-fly-center": "west-card-fly-center 0.5s ease-in",
        "north-card-fly-center": "north-card-fly-center 0.5s ease-in",
        "east-card-fly-center": "east-card-fly-center 0.5s ease-in",
      },
      keyframes: {
        "south-card-fly-center": {
          "0%": {
            bottom: "4rem",
            left: "50%",
            opacity: 1,
          },
          "100%": { bottom: "33.33%", left: "50%", opacity: 1 },
        },
        "west-card-fly-center": {
          "0%": { top: "50%", left: "5%", opacity: 1 },
          "100%": { top: "50%", left: "33.33", opacity: 1 },
        },
        "north-card-fly-center": {
          "0%": { top: "0%", left: "50%", opacity: 1 },
          "100%": { top: "33%", left: "50%", opacity: 1 },
        },
        "east-card-fly-center": {
          "0%": {
            top: "50%",
            right: "5%",
            opacity: 1,
          },
          "100%": {
            top: "50%",
            right: "33.33%",
            opacity: 1,
          },
        },
      },
      fontSize: {
        "2xs": ".5rem",
        "3xs": ".375rem",
        "4xs": ".25rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "mobile-portrait": { raw: "(orientation: portrait)" },
        "mobile-landscape": { raw: "(orientation: landscape) and (max-width: 700px)" },
      },
    },
  },
  plugins: [],
};

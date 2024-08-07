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
        "phone-rotate-hint": "phone-rotate-hint 5s linear infinite",
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
        "phone-rotate-hint": {
          "0%": { transform: "rotate(0deg)" },
          "30%": { transform: "rotate(90deg)" },
          "70%": { transform: "rotate(90deg)" },
          "70.01%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      fontSize: {
        "2xs": ".5rem",
        "3xs": ".375rem",
        "4xs": ".25rem",
      },
      screens: {
        sm: "640px",
        md: "1024px",
        lg: "1280px",
        xl: "1536px",
        "mobile-portrait": { raw: "(orientation: portrait)" },
        "mobile-landscape": { raw: "(orientation: landscape) and (max-width: 930px)" },
      },
    },
  },
  plugins: [],
};

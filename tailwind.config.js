/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "south-card-fly-center": "south-card-fly-center 0.5s ease-in",
        "north-card-fly-center": "north-card-fly-center 0.5s ease-in",
        "east-card-fly-center": "east-card-fly-center 0.5s ease-in",
        "west-card-fly-center": "west-card-fly-center 0.5s ease-in",
      },
      keyframes: {
        "south-card-fly-center": {
          "0%": {
            top: "calc(100% - 33.33% + 20px)",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 1,
          },
          "100%": { top: "calc(50% + 20px)", left: "50%", transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        },
        "west-card-fly-center": {
          "0%": { top: "50%", left: "calc(33.33% - 20px)", transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          "100%": { top: "50%", left: "calc(50% - 20px)", transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        },
        "north-card-fly-center": {
          "0%": { top: "calc(33.33% - 20px)", left: "50%", transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          "100%": { top: "calc(50% - 20px)", left: "50%", transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        },
        "east-card-fly-center": {
          "0%": {
            top: "50%",
            left: "calc(100% - 33.33% + 20px)",
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 1,
          },
          "100%": { top: "50%", left: "calc(50% + 20px)", transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

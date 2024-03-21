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
          "0%": { top: "50%", left: "50%", visibility: "hidden", transform: "translate(-50%, 0%)", opacity: 0 },
          "10%": { left: "50%", opacity: 1, top: "70%", visibility: "visible", transform: "translate(-50%, 0%)" },
          "100%": { top: "50%", left: "50%", opacity: 1, visibility: "visible", transform: "translate(-50%, 0%)" },
        },
        "north-card-fly-center": {
          "0%": { top: "50%", left: "50%", transform: "translate(-50%, -100%)", visibility: "hidden", opacity: 0 },
          "10%": { left: "50%", transform: "translate(-50%, -100%)", visibility: "visible", opacity: 1, top: "30%" },
          "100%": { opacity: 1, top: "50%", left: "50%", transform: "translate(-50%, -100%)" },
        },
        "east-card-fly-center": {
          "0%": { top: "50%", left: "50%", transform: "translate(50%, -50%)", visibility: "hidden", opacity: 0 },
          "10%": { top: "50%", transform: "translate(50%, -50%)", visibility: "visible", opacity: 1, left: "70%" },
          "100%": { top: "50%", transform: "translate(50%, -50%)", visibility: "visible", opacity: 1, left: "50%" },
        },
        "west-card-fly-center": {
          "0%": { top: "50%", left: "50%", transform: "translate(-150%, -50%)", opacity: 0, visibility: "hidden" },
          "10%": { top: "50%", transform: "translate(-150%, -50%)", visibility: "visible", opacity: 1, left: "30%" },
          "100%": { top: "50%", visibility: "visible", transform: "translate(-150%, -50%)", opacity: 1, left: "50%" },
        },
      },
    },
  },
  plugins: [],
};

const plugin = require("tailwindcss/plugin")
module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "360px",
      sm: "576px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      primary: "#23272A",
      secondary: "#99AAB5",
      slateDark: "#23272A",
      slateLight: "#2C2F33",
      light200: "#99AAB5", // "#8492a6",
      light100: "#d3dce6",
      light000: "#EFEFEF",
      warning: "#FFC533",
      danger: "#E45C3A",
      success: "#46AF6B",
      info: "#279185",
      gray: "#8492a6",
      white: "#fff",
      black: "#212121",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".btn": {
          padding: ".5rem 1rem",
          borderRadius: ".25rem",
          fontWeight: "600",
        },
      })
    }),
  ],
}

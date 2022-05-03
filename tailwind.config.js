const plugin = require("tailwindcss/plugin")
module.exports = {
  mode: "jit",
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
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
      light300: "#4D5F6A",
      light200: "#ACBAC3", // "#8492a6", //#ACBAC3
      light100: "#DCE1E5",
      light000: "#F3F5F6",
      warning: "#FFC533",
      danger: "#f54e4e",
      success: "#46AF6B",
      info: "#3e98c7",
      gray: "#8492a6",
      white: "#fff",
      black: "#212121",
      transparentDark: "#23272A99",
      transparent: "transparent",
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
      minHeight: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
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

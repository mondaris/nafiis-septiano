/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: "16px",
    },
    extend: {
      colors: {
        primary: "#65a30d",
        secondary: "#64748b",
        dark: "#020617",
        thirth: "#cbd5e1",
      },
      screens: {
        "2xl": "1320px",
      },
    },
  },
  plugins: [],
};

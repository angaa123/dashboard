/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      adineue: ["adineue PRO KZ Bold", "sans-serif"],
      gilroy_semibold: ["Gilroy-SemiBold", "sans-serif"],
      gilroy_medium: ["Gilroy-Medium", "sans-serif"],
    },
    extend: {
      // Other extensions can go here
    },
  },
  plugins: [],
};

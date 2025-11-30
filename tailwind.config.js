/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      colors: {
        "primary-red": "#dc2626",
        "dark-red": "#b91c1c",
        "light-red": "#fef2f2",
      },
    },
  },
  plugins: [],
};

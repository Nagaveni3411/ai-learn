/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        mist: "#f8fafc",
        accent: "#0f766e"
      }
    }
  },
  plugins: []
};

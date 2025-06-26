/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // ✅ required
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ required for React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // scan hết file .tsx của mày
  ],
  theme: {
    extend: {
      // tùy chỉnh màu, font nếu cần
    },
  },
  plugins: [],
}
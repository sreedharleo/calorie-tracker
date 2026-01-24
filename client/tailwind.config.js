/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo 600
        secondary: "#10B981", // Emerald 500
        danger: "#EF4444", // Red 500
      },
      keyframes: {
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      },
      animation: {
        scan: 'scan 2.5s linear infinite',
      }
    },
  },
  plugins: [],
}

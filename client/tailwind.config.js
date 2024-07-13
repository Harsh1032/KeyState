/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink .7s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      }
    },
  },
  plugins: [
    function({ addUtilities}){
    const newUtilities = {
      ".no-scrollbar::-webkit-scrollbar": {
        display: "none",
      },
      ".no-scrollbar":{
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }
    };

    addUtilities(newUtilities);
  },
  require('@tailwindcss/line-clamp'),
],
}
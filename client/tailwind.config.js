module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  keyframes: {
    'fade-in-up': {
      '0%': { opacity: '0', transform: 'translateY(20px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    'fade-in-right': {
      '0%': { opacity: '0', transform: 'translateX(40px)' },
      '100%': { opacity: '1', transform: 'translateX(0)' },
    },
  },
  animation: {
    'fade-in-up': 'fade-in-up 1s ease-out forwards',
    'fade-in-right': 'fade-in-right 1s ease-out forwards',
  },
},

  },
  plugins: [],
};

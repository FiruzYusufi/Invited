/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: '#fdfbf7',
          100: '#fbf7ee',
          200: '#f6ebd4',
          300: '#efdbb2',
          400: '#e5c488',
          500: '#dea861',
          600: '#d08f48',
          700: '#ad723a',
          800: '#8c5c34',
          900: '#724c2d',
          950: '#3e2716',
        },
        powder: {
          50: '#fcf8f9',
          100: '#faeff2',
          200: '#f5dce4',
          300: '#eebccd',
          400: '#e391af',
          500: '#d56a91',
          600: '#c04b72',
          700: '#a23758',
          800: '#87304b',
          900: '#722b42',
          950: '#401321',
        },
        milky: '#fffaf5',
        gold: '#d4af37'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(255, 250, 245, 0.4), rgba(255, 250, 245, 1))',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

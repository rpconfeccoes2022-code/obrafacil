/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blueprint: {
          DEFAULT: '#1C2B3A',
          light: '#2C4257',
          50: '#EEF2F5',
        },
        concrete: '#EDEAE3',
        ink: '#26241F',
        amber: {
          DEFAULT: '#E8A33D',
          dark: '#C6841F',
        },
        greenwork: '#3E6259',
        brick: '#B2412F',
      },
      fontFamily: {
        display: ['"Zilla Slab"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

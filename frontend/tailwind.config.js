// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: '#fef9f3',
//           100: '#fef3e7',
//           200: '#fce4c3',
//           300: '#fad49f',
//           400: '#f7b557',
//           500: '#f49610',
//           600: '#dc870e',
//           700: '#b7710c',
//           800: '#925b0a',
//           900: '#774a08',
//         },
//         kitchen: {
//           50: '#f5f3f0',
//           100: '#ebe7e1',
//           200: '#d7cfc3',
//           300: '#c3b7a5',
//           400: '#af9f87',
//           500: '#8b7355',
//           600: '#6f5c44',
//           700: '#534533',
//           800: '#372e22',
//           900: '#1b1711',
//         },
//         status: {
//           idle: '#9ca3af',
//           placed: '#eab308',
//           processing: '#3b82f6',
//           delivered: '#22c55e',
//         },
//       },
//       fontFamily: {
//         sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
//         mono: ['Courier New', 'Monaco', 'Menlo', 'monospace'],
//       },
//       spacing: {
//         '18': '4.5rem',
//         '88': '22rem',
//         '128': '32rem',
//       },
//       borderRadius: {
//         '4xl': '2rem',
//       },
//       boxShadow: {
//         'glow': '0 0 20px rgba(244, 150, 16, 0.3)',
//         'glow-lg': '0 0 40px rgba(244, 150, 16, 0.4)',
//       },
//       animation: {
//         'fade-in': 'fadeIn 0.2s ease-in',
//         'slide-up': 'slideUp 0.3s ease-out',
//         'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'bounce-slow': 'bounce 2s infinite',
//       },
//       backdropBlur: {
//         xs: '2px',
//       },
//     },
//   },
//   plugins: [],
// }



module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        chef: {
          orange: '#FF6B35',
          'orange-light': '#FF8A5C',
          'orange-dark': '#E65525',
          red: '#D32F2F',
          'red-light': '#EF5350',
          'red-dark': '#B71C1C',
          dark: '#2C2416',
          'dark-light': '#3D3326',
          cream: '#FFF8F0',
          'cream-dark': '#F5E8D8',
          gold: '#FFD700',
          'gold-light': '#FFE54C',
          'gold-dark': '#DAB600',
        },
      },
      boxShadow: {
        'warm': '0 10px 30px rgba(255, 107, 53, 0.15)',
        'glow': '0 0 20px rgba(255, 215, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
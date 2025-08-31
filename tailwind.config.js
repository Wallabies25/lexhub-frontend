/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Add custom colors for consistent dark mode
        primary: {
          light: '#3b82f6', // blue-500
          dark: '#60a5fa', // blue-400
        },
        secondary: {
          light: '#10b981', // emerald-500
          dark: '#34d399', // emerald-400
        },
        background: {
          light: '#ffffff', // white
          dark: '#111827', // gray-900
        },
        surface: {
          light: '#f9fafb', // gray-50
          dark: '#1f2937', // gray-800
        },
        border: {
          light: '#e5e7eb', // gray-200
          dark: '#374151', // gray-700
        },
        text: {
          light: '#111827', // gray-900
          dark: '#f9fafb', // gray-50
        },
      },
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}

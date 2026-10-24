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
        // FoodBridge brand palette
        brand: {
          50: '#EEF8F1',
          100: '#D9F0E1',
          200: '#B4E2C7',
          300: '#82CEA5',
          400: '#4DB57F',
          500: '#279C61',
          600: '#1A804D',
          700: '#16663F',
          800: '#145134',
          900: '#11432C',
          950: '#08271A',
        },
        canvas: '#F5F8F2',
        line: '#E7EEE3',
        ink: '#152019',
        muted: '#5D6B61',
        forest: {
          50: '#f0fdf7',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#22ad7d',
          600: '#1b8a64',
          700: '#14684b',
          800: '#0f4f39',
          850: '#0a3d2c',
          900: '#062d20',
          950: '#041c14',
        },
        sage: {
          50: '#f4f7f5',
          100: '#e5ece7',
          200: '#ccd9cf',
          300: '#a8beb0',
          400: '#7f9e8b',
          500: '#5f826d',
          600: '#4a6755',
          700: '#3c5244',
          800: '#324339',
          900: '#2b372f',
        },
        stonebg: {
          50: '#FCFBF9',
          100: '#F8F6F1',
          200: '#EFECE4',
          300: '#E2DED3',
          400: '#C7C2B4',
          500: '#A9A392',
          600: '#898372',
          700: '#6D6758',
          800: '#565145',
          900: '#3D3930',
          950: '#1A1814',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        obsidian: {
          900: '#0d1317',
          925: '#0a0f12',
          950: '#060a0d',
          800: '#131b20',
          700: '#1c2830',
          600: '#283843',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'lux': '0 8px 30px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02)',
        'lux-hover': '0 14px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'emerald-glow': '0 0 35px -5px rgba(27, 138, 100, 0.35)',
        'gold-glow': '0 0 30px -5px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'subtle-float': 'subtleFloat 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

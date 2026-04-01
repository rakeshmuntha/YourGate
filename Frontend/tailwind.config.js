/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Uber-exact surface palette
        surface: {
          // Light mode surfaces
          base: '#FFFFFF',
          subtle: '#F6F6F6',
          muted: '#EEEEEE',
          border: '#E2E2E2',
          // Dark mode surfaces
          dark: '#000000',
          'dark-1': '#141414',
          'dark-2': '#1C1C1C',
          'dark-3': '#242424',
          'dark-border': '#2C2C2C',
        },
        // Uber content/text
        content: {
          primary: '#141414',
          secondary: '#545454',
          tertiary: '#8A8A8A',
          disabled: '#ADADAD',
          inverse: '#FFFFFF',
          'dark-primary': '#EEEEEE',
          'dark-secondary': '#9E9E9E',
          'dark-tertiary': '#616161',
        },
        // Brand — pure black/white like Uber
        brand: {
          DEFAULT: '#000000',
          inverse: '#FFFFFF',
          hover: '#141414',
          'dark-DEFAULT': '#FFFFFF',
          'dark-inverse': '#000000',
          'dark-hover': '#EEEEEE',
        },
        // Semantic
        positive: {
          DEFAULT: '#128B53',
          subtle: '#EAF7F0',
          'dark-DEFAULT': '#06C167',
          'dark-subtle': '#06C16720',
        },
        negative: {
          DEFAULT: '#C0392B',
          subtle: '#FDEEEC',
          'dark-DEFAULT': '#F44336',
          'dark-subtle': '#F4433620',
        },
        warning: {
          DEFAULT: '#D97706',
          subtle: '#FFFBEB',
          'dark-DEFAULT': '#F59E0B',
          'dark-subtle': '#F59E0B20',
        },
        info: {
          DEFAULT: '#1D4ED8',
          subtle: '#EFF6FF',
          'dark-DEFAULT': '#60A5FA',
          'dark-subtle': '#60A5FA20',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // Uber iOS type scale
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.01em' }],
        xs:   ['0.75rem',  { lineHeight: '1rem',     letterSpacing: '0.01em' }],
        sm:   ['0.875rem', { lineHeight: '1.25rem',  letterSpacing: '-0.006em' }],
        base: ['1rem',     { lineHeight: '1.5rem',   letterSpacing: '-0.011em' }],
        lg:   ['1.125rem', { lineHeight: '1.75rem',  letterSpacing: '-0.014em' }],
        xl:   ['1.25rem',  { lineHeight: '1.75rem',  letterSpacing: '-0.017em' }],
        '2xl':['1.5rem',   { lineHeight: '2rem',     letterSpacing: '-0.021em' }],
        '3xl':['1.875rem', { lineHeight: '2.25rem',  letterSpacing: '-0.025em' }],
        '4xl':['2.25rem',  { lineHeight: '2.5rem',   letterSpacing: '-0.028em' }],
        '5xl':['3rem',     { lineHeight: '1',        letterSpacing: '-0.032em' }],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        // Premium elevation system
        'xs':  '0 1px 2px 0 rgba(0,0,0,0.05)',
        'sm':  '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'md':  '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'lg':  '0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.04)',
        'xl':  '0 20px 25px -5px rgba(0,0,0,0.07), 0 8px 10px -6px rgba(0,0,0,0.04)',
        'premium': '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.08)',
        'premium-lg': '0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.12)',
        // Dark mode shadows
        'dark-sm':  '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.3)',
        'dark-md':  '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.3)',
        'dark-premium': '0 0 0 1px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.5)',
      },
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ios-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '175': '175ms',
        '225': '225ms',
      },
    },
  },
  plugins: [],
};

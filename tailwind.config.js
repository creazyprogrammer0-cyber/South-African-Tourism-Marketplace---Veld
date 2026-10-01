export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F3EC',
        surface: '#FFFFFF',
        line: '#E5DDD0',
        sand: { 50: '#FBF8F3', 100: '#F1EADF', 200: '#E6DCCB', 300: '#D3C3A8' },
        ink: {
          DEFAULT: '#1F1D1A',
          800: '#2B2824',
          700: '#3D3933',
          600: '#575047',
          500: '#6B645A',
          400: '#8C8478'
        },
        olive: { DEFAULT: '#4F5A2E', 700: '#3F4824', 100: '#E8EADB', 50: '#F3F4EC' },
        clay: { DEFAULT: '#A64B26', 700: '#8A3D1E', 100: '#F6E4D9', 50: '#FBF2EC' },
        success: { DEFAULT: '#3F6B35', bg: '#E5EFDF' },
        warning: { DEFAULT: '#8A5A0B', bg: '#F7ECD3' },
        danger: { DEFAULT: '#A3362A', bg: '#F7E2DE' },
        info: { DEFAULT: '#2E5870', bg: '#E1EBF0' }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Newsreader', 'Georgia', 'serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(31,29,26,0.05), 0 6px 20px rgba(31,29,26,0.05)',
        pop: '0 16px 48px rgba(31,29,26,0.18)'
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)'
      }
    }
  }
};

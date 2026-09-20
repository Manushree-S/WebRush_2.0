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
        receipt: {
          bg: '#0B0F17',
          card: '#131A29',
          cardHover: '#1B2438',
          border: '#232D42',
          borderHover: '#374665',
          text: '#F1F5F9',
          muted: '#94A3B8',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          purple: '#A855F7',
          rose: '#F43F5E',
          indigo: '#6366F1',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'receipt': '0 8px 30px rgba(0, 0, 0, 0.45)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.35)',
      }
    },
  },
  plugins: [],
}
